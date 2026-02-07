"""
RAG Engine Module
Handles retrieval-augmented generation for chat and Q&A
"""
from typing import List, Optional, Dict
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from config import settings
from models import ChatResponse, SourceReference
from vector_store import VectorStore

class RAGEngine:
    """Retrieval-Augmented Generation engine for Study Copilot"""
    
    def __init__(self):
        """Initialize LLM and vector store"""
        self.llm = ChatGoogleGenerativeAI(
            model=settings.MODEL_NAME,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=settings.TEMPERATURE,
            max_output_tokens=settings.MAX_OUTPUT_TOKENS
        )
        self.vector_store = VectorStore()
        
        # Chat prompt template
        self.chat_prompt = PromptTemplate(
            input_variables=["context", "question"],
            template="""You are Velosify Study Copilot, an AI learning assistant.

STRICT RULES:
1. Answer ONLY based on the provided context
2. If the answer is not in the context, say "I couldn't find this information in your uploaded documents."
3. Be clear, concise, and student-friendly
4. Use bullet points for better readability
5. Cite page numbers when relevant

CONTEXT FROM DOCUMENTS:
{context}

STUDENT QUESTION:
{question}

ANSWER:"""
        )
    
    def chat(
        self,
        user_id: str,
        query: str,
        document_ids: Optional[List[str]] = None,
        max_results: int = 5
    ) -> ChatResponse:
        """
        Process a chat query using RAG
        """
        # Retrieve relevant chunks
        relevant_chunks = self.vector_store.search(
            user_id=user_id,
            query=query,
            top_k=max_results,
            document_ids=document_ids
        )
        
        # Check if we found relevant information
        if not relevant_chunks:
            return ChatResponse(
                answer="I couldn't find this information in your uploaded documents. Please make sure you've uploaded relevant study materials.",
                sources=[],
                found_in_documents=False,
                query=query
            )
        
        # Build context from retrieved chunks
        context_parts = []
        for i, chunk in enumerate(relevant_chunks, 1):
            context_parts.append(
                f"[Source {i}] From '{chunk['filename']}' (Page {chunk['page_number']}):\n{chunk['text']}\n"
            )
        
        context = "\n".join(context_parts)
        
        # Generate answer using LLM
        prompt = self.chat_prompt.format(context=context, question=query)
        
        try:
            response = self.llm.invoke(prompt)
            answer = response.content
        except Exception as e:
            answer = f"Error generating response: {str(e)}"
        
        # Build source references
        sources = []
        for chunk in relevant_chunks:
            source = SourceReference(
                document_name=chunk['filename'],
                page_number=chunk['page_number'],
                relevance_score=round(chunk['similarity_score'], 3),
                snippet=chunk['text'][:200] + "..." if len(chunk['text']) > 200 else chunk['text']
            )
            sources.append(source)
        
        return ChatResponse(
            answer=answer,
            sources=sources,
            found_in_documents=True,
            query=query
        )
    
    def get_context_for_topic(
        self,
        user_id: str,
        topic: str,
        document_ids: List[str],
        max_chunks: int = 10
    ) -> List[Dict]:
        """
        Retrieve relevant context for a specific topic
        Used by notes generator and quiz generator
        """
        relevant_chunks = self.vector_store.search(
            user_id=user_id,
            query=topic,
            top_k=max_chunks,
            document_ids=document_ids
        )
        
        return relevant_chunks
