"""
Velosify Study Copilot - FastAPI Backend
Main application with all API endpoints
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
import uvicorn
from pathlib import Path

from config import settings
from models import (
    ChatRequest, ChatResponse,
    NotesRequest, NotesResponse,
    QuizRequest, QuizResponse,
    StudyPlanRequest, StudyPlanResponse,
    DocumentListResponse, DocumentMetadata,
    DeleteDocumentRequest, UploadResponse,
    ErrorResponse
)
from pdf_processor import PDFProcessor
from vector_store import VectorStore
from rag_engine import RAGEngine
from ai_services import AIServices
from contextlib import asynccontextmanager

# Initialize service placeholders
pdf_processor = None
vector_store = None
rag_engine = None
ai_services = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize services
    global pdf_processor, vector_store, rag_engine, ai_services
    try:
        settings.validate()
        pdf_processor = PDFProcessor()
        vector_store = VectorStore()
        rag_engine = RAGEngine()
        ai_services = AIServices()
        print("[SUCCESS] Velosify Study Copilot API services initialized")
        print(f"[INFO] Upload directory: {settings.UPLOAD_DIR}")
        print(f"[INFO] Vector store directory: {settings.VECTOR_STORE_DIR}")
    except Exception as e:
        print(f"[ERROR] Initialization error: {e}")
        raise
    yield
    # Shutdown: Clean up resources if needed
    print("[INFO] Shutting down Velosify Study Copilot API")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Velosify Study Copilot API",
    description="AI-powered study assistant with RAG capabilities",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pdf_processor = PDFProcessor()
vector_store = VectorStore()
rag_engine = RAGEngine()
ai_services = AIServices()

# In-memory document metadata storage (in production, use Supabase)
# Format: {user_id: {document_id: DocumentMetadata}}
document_store = {}


# Health check moved to regular endpoint


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Velosify Study Copilot",
        "status": "operational",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "vector_store": "operational",
        "llm": "operational",
        "storage": "operational"
    }


# ============================================================================
# DOCUMENT UPLOAD & MANAGEMENT
# ============================================================================

@app.post("/api/upload", response_model=UploadResponse)
async def upload_document(
    user_id: str = Form(...),
    file: UploadFile = File(...),
    subject: Optional[str] = Form(None),
    topic: Optional[str] = Form(None)
):
    """
    Upload and process a PDF document
    """
    try:
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
        
        # Validate file
        is_valid, error_msg = pdf_processor.validate_file(file.filename, file_size)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Save file
        file_path = pdf_processor.save_uploaded_file(
            file_content=file_content,
            user_id=user_id,
            filename=file.filename
        )
        
        # Process PDF
        metadata, chunks = pdf_processor.process_pdf(
            file_path=file_path,
            user_id=user_id,
            filename=file.filename,
            subject=subject,
            topic=topic
        )
        
        # Add to vector store
        chunks_added = vector_store.add_documents(
            user_id=user_id,
            chunks=chunks
        )
        
        # Store metadata
        if user_id not in document_store:
            document_store[user_id] = {}
        document_store[user_id][metadata.document_id] = metadata
        
        return UploadResponse(
            success=True,
            message="Document uploaded and processed successfully",
            document_id=metadata.document_id,
            filename=metadata.filename,
            total_pages=metadata.total_pages,
            chunks_created=chunks_added
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/api/documents/{user_id}", response_model=DocumentListResponse)
async def list_documents(user_id: str):
    """
    Get list of all documents for a user
    """
    try:
        user_docs = document_store.get(user_id, {})
        documents = list(user_docs.values())
        
        return DocumentListResponse(
            success=True,
            documents=documents,
            total_count=len(documents)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/documents/delete")
async def delete_document(request: DeleteDocumentRequest):
    """
    Delete a document and its embeddings
    """
    try:
        user_id = request.user_id
        document_id = request.document_id
        
        # Check if document exists
        if user_id not in document_store or document_id not in document_store[user_id]:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Delete from vector store
        vector_store.delete_document(user_id, document_id)
        
        # Delete from metadata store
        del document_store[user_id][document_id]
        
        # Delete physical files
        pdf_processor.delete_document_files(user_id, document_id)
        
        return {"success": True, "message": "Document deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# RAG CHAT
# ============================================================================

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with documents using RAG
    """
    try:
        response = rag_engine.chat(
            user_id=request.user_id,
            query=request.query,
            document_ids=request.document_ids,
            max_results=request.max_results
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


# ============================================================================
# NOTES GENERATION
# ============================================================================

@app.post("/api/notes/generate", response_model=NotesResponse)
async def generate_notes(request: NotesRequest):
    """
    Generate structured study notes from documents
    """
    try:
        response = ai_services.generate_notes(
            user_id=request.user_id,
            document_ids=request.document_ids,
            topic=request.topic,
            include_examples=request.include_examples,
            include_highlights=request.include_highlights
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notes generation failed: {str(e)}")


# ============================================================================
# QUIZ GENERATION
# ============================================================================

@app.post("/api/quiz/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """
    Generate MCQ quiz from documents
    """
    try:
        response = ai_services.generate_quiz(
            user_id=request.user_id,
            document_ids=request.document_ids,
            num_questions=request.num_questions,
            difficulty=request.difficulty,
            topic=request.topic
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")


# ============================================================================
# STUDY PLANNER
# ============================================================================

@app.post("/api/planner/generate", response_model=StudyPlanResponse)
async def generate_study_plan(request: StudyPlanRequest):
    """
    Generate personalized study plan
    """
    try:
        response = ai_services.generate_study_plan(
            user_id=request.user_id,
            exam_date=request.exam_date,
            available_hours_per_day=request.available_hours_per_day,
            weak_topics=request.weak_topics,
            document_ids=request.document_ids
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Study plan generation failed: {str(e)}")


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=exc.detail,
            details={"status_code": exc.status_code}
        ).dict()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            details={"message": str(exc)}
        ).dict()
    )


# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )
