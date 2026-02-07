"""
PDF Processing Module
Handles PDF upload, text extraction, and chunking
"""
import os
import hashlib
from pathlib import Path
from typing import List, Dict, Tuple
from datetime import datetime
import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter
from config import settings
from models import DocumentMetadata

class PDFProcessor:
    """Handles PDF document processing"""
    
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", " ", ""],
            length_function=len,
        )
    
    def validate_file(self, filename: str, file_size: int) -> Tuple[bool, str]:
        """
        Validate uploaded file
        Returns: (is_valid, error_message)
        """
        # Check extension
        if not filename.lower().endswith('.pdf'):
            return False, "Only PDF files are allowed"
        
        # Check file size
        if file_size > settings.MAX_FILE_SIZE_BYTES:
            return False, f"File size exceeds {settings.MAX_FILE_SIZE_MB}MB limit"
        
        return True, ""
    
    def generate_document_id(self, user_id: str, filename: str) -> str:
        """Generate unique document ID"""
        timestamp = datetime.utcnow().isoformat()
        unique_string = f"{user_id}_{filename}_{timestamp}"
        return hashlib.sha256(unique_string.encode()).hexdigest()[:16]
    
    def extract_text_from_pdf(self, pdf_path: Path) -> Dict[int, str]:
        """
        Extract text from PDF, page by page
        Returns: {page_number: text_content}
        """
        page_texts = {}
        
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                total_pages = len(pdf_reader.pages)
                
                for page_num in range(total_pages):
                    page = pdf_reader.pages[page_num]
                    text = page.extract_text()
                    
                    # Clean and normalize text
                    text = self._clean_text(text)
                    page_texts[page_num + 1] = text  # 1-indexed pages
                    
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
        
        return page_texts
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Remove special characters that might interfere
        text = text.replace('\x00', '')
        
        return text.strip()
    
    def chunk_document(
        self, 
        page_texts: Dict[int, str],
        document_id: str,
        filename: str
    ) -> List[Dict]:
        """
        Split document into chunks with metadata
        Returns: List of chunk dictionaries
        """
        chunks = []
        
        for page_num, text in page_texts.items():
            if not text.strip():
                continue
            
            # Split page text into chunks
            page_chunks = self.text_splitter.split_text(text)
            
            for chunk_idx, chunk_text in enumerate(page_chunks):
                chunk_metadata = {
                    "document_id": document_id,
                    "filename": filename,
                    "page_number": page_num,
                    "chunk_index": chunk_idx,
                    "text": chunk_text
                }
                chunks.append(chunk_metadata)
        
        return chunks
    
    def process_pdf(
        self,
        file_path: Path,
        user_id: str,
        filename: str,
        subject: str = None,
        topic: str = None
    ) -> Tuple[DocumentMetadata, List[Dict]]:
        """
        Complete PDF processing pipeline
        Returns: (metadata, chunks)
        """
        # Generate document ID
        document_id = self.generate_document_id(user_id, filename)
        
        # Extract text from PDF
        page_texts = self.extract_text_from_pdf(file_path)
        
        # Create metadata
        metadata = DocumentMetadata(
            document_id=document_id,
            filename=filename,
            subject=subject,
            topic=topic,
            total_pages=len(page_texts),
            upload_timestamp=datetime.utcnow(),
            file_size_bytes=file_path.stat().st_size
        )
        
        # Chunk the document
        chunks = self.chunk_document(page_texts, document_id, filename)
        
        return metadata, chunks
    
    def save_uploaded_file(
        self,
        file_content: bytes,
        user_id: str,
        filename: str
    ) -> Path:
        """
        Save uploaded file to disk
        Returns: Path to saved file
        """
        # Create user-specific directory
        user_dir = settings.UPLOAD_DIR / user_id
        user_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename to avoid conflicts
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{filename}"
        file_path = user_dir / safe_filename
        
        # Write file
        with open(file_path, 'wb') as f:
            f.write(file_content)
        
        return file_path
    
    def delete_document_files(self, user_id: str, document_id: str) -> bool:
        """Delete physical files associated with a document"""
        try:
            user_dir = settings.UPLOAD_DIR / user_id
            if user_dir.exists():
                # Find and delete files matching document_id
                for file_path in user_dir.glob(f"*"):
                    # You might want to store document_id in filename
                    # For now, this is a placeholder
                    pass
            return True
        except Exception as e:
            print(f"Error deleting files: {e}")
            return False
