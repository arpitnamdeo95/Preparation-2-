"""
Vector Store Module
Handles embeddings generation and FAISS vector storage
"""
import os
import pickle
from pathlib import Path
from typing import List, Dict, Optional, Tuple
import numpy as np
import faiss
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config import settings

class VectorStore:
    """Manages vector embeddings and similarity search using FAISS"""
    
    def __init__(self):
        """Initialize embeddings model"""
        self.embeddings_model = GoogleGenerativeAIEmbeddings(
            model=settings.EMBEDDING_MODEL,
            google_api_key=settings.GOOGLE_API_KEY
        )
        self.dimension = 768  # Gemini embedding dimension
    
    def _get_user_index_path(self, user_id: str) -> Path:
        """Get path to user's FAISS index"""
        user_dir = settings.VECTOR_STORE_DIR / user_id
        user_dir.mkdir(parents=True, exist_ok=True)
        return user_dir / "faiss_index.bin"
    
    def _get_user_metadata_path(self, user_id: str) -> Path:
        """Get path to user's metadata file"""
        user_dir = settings.VECTOR_STORE_DIR / user_id
        return user_dir / "metadata.pkl"
    
    def create_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings for a list of texts
        Returns: numpy array of shape (n_texts, dimension)
        """
        try:
            embeddings = self.embeddings_model.embed_documents(texts)
            return np.array(embeddings, dtype=np.float32)
        except Exception as e:
            raise Exception(f"Failed to generate embeddings: {str(e)}")
    
    def create_query_embedding(self, query: str) -> np.ndarray:
        """Generate embedding for a single query"""
        try:
            embedding = self.embeddings_model.embed_query(query)
            return np.array([embedding], dtype=np.float32)
        except Exception as e:
            raise Exception(f"Failed to generate query embedding: {str(e)}")
    
    def load_or_create_index(self, user_id: str) -> Tuple[faiss.Index, List[Dict]]:
        """
        Load existing FAISS index or create new one
        Returns: (index, metadata_list)
        """
        index_path = self._get_user_index_path(user_id)
        metadata_path = self._get_user_metadata_path(user_id)
        
        if index_path.exists() and metadata_path.exists():
            # Load existing index
            index = faiss.read_index(str(index_path))
            with open(metadata_path, 'rb') as f:
                metadata = pickle.load(f)
            return index, metadata
        else:
            # Create new index
            index = faiss.IndexFlatL2(self.dimension)
            metadata = []
            return index, metadata
    
    def save_index(self, user_id: str, index: faiss.Index, metadata: List[Dict]):
        """Save FAISS index and metadata to disk"""
        index_path = self._get_user_index_path(user_id)
        metadata_path = self._get_user_metadata_path(user_id)
        
        # Save index
        faiss.write_index(index, str(index_path))
        
        # Save metadata
        with open(metadata_path, 'wb') as f:
            pickle.dump(metadata, f)
    
    def add_documents(
        self,
        user_id: str,
        chunks: List[Dict]
    ) -> int:
        """
        Add document chunks to user's vector store
        Returns: number of chunks added
        """
        if not chunks:
            return 0
        
        # Load or create index
        index, existing_metadata = self.load_or_create_index(user_id)
        
        # Extract texts for embedding
        texts = [chunk["text"] for chunk in chunks]
        
        # Generate embeddings
        embeddings = self.create_embeddings(texts)
        
        # Add to index
        index.add(embeddings)
        
        # Update metadata
        existing_metadata.extend(chunks)
        
        # Save updated index
        self.save_index(user_id, index, existing_metadata)
        
        return len(chunks)
    
    def search(
        self,
        user_id: str,
        query: str,
        top_k: int = 5,
        document_ids: Optional[List[str]] = None
    ) -> List[Dict]:
        """
        Search for similar chunks
        Returns: List of matching chunks with scores
        """
        # Load index
        index, metadata = self.load_or_create_index(user_id)
        
        if index.ntotal == 0:
            return []
        
        # Generate query embedding
        query_embedding = self.create_query_embedding(query)
        
        # Search
        distances, indices = index.search(query_embedding, min(top_k * 2, index.ntotal))
        
        # Filter and format results
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for empty slots
                continue
            
            chunk = metadata[idx].copy()
            
            # Filter by document_ids if specified
            if document_ids and chunk["document_id"] not in document_ids:
                continue
            
            # Convert L2 distance to similarity score (0-1)
            # Lower distance = higher similarity
            similarity_score = 1 / (1 + dist)
            
            chunk["similarity_score"] = float(similarity_score)
            chunk["distance"] = float(dist)
            
            # Only include results above threshold
            if similarity_score >= settings.SIMILARITY_THRESHOLD:
                results.append(chunk)
            
            if len(results) >= top_k:
                break
        
        return results
    
    def delete_document(self, user_id: str, document_id: str) -> bool:
        """
        Remove all chunks of a document from vector store
        Note: FAISS doesn't support deletion, so we rebuild the index
        """
        try:
            # Load existing index and metadata
            index, metadata = self.load_or_create_index(user_id)
            
            # Filter out chunks from the document to delete
            filtered_metadata = [
                chunk for chunk in metadata 
                if chunk["document_id"] != document_id
            ]
            
            if len(filtered_metadata) == len(metadata):
                # Document not found
                return False
            
            # Rebuild index with remaining chunks
            new_index = faiss.IndexFlatL2(self.dimension)
            
            if filtered_metadata:
                texts = [chunk["text"] for chunk in filtered_metadata]
                embeddings = self.create_embeddings(texts)
                new_index.add(embeddings)
            
            # Save new index
            self.save_index(user_id, new_index, filtered_metadata)
            
            return True
            
        except Exception as e:
            print(f"Error deleting document from vector store: {e}")
            return False
    
    def get_document_count(self, user_id: str) -> int:
        """Get total number of chunks in user's vector store"""
        index, _ = self.load_or_create_index(user_id)
        return index.ntotal
