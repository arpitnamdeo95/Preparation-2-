"""
Pydantic models for request/response validation
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    """Quiz difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class DocumentMetadata(BaseModel):
    """Metadata for uploaded documents"""
    document_id: str
    filename: str
    subject: Optional[str] = None
    topic: Optional[str] = None
    total_pages: int
    upload_timestamp: datetime
    file_size_bytes: int

class UploadResponse(BaseModel):
    """Response after successful document upload"""
    success: bool
    message: str
    document_id: str
    filename: str
    total_pages: int
    chunks_created: int

class ChatRequest(BaseModel):
    """Request for RAG-based chat"""
    user_id: str
    query: str
    document_ids: Optional[List[str]] = None  # If None, search all user's documents
    max_results: int = Field(default=5, ge=1, le=10)

class SourceReference(BaseModel):
    """Source reference for RAG answers"""
    document_name: str
    page_number: int
    relevance_score: float
    snippet: str

class ChatResponse(BaseModel):
    """Response from RAG chat"""
    answer: str
    sources: List[SourceReference]
    found_in_documents: bool
    query: str

class NotesRequest(BaseModel):
    """Request for generating study notes"""
    user_id: str
    document_ids: List[str]
    topic: Optional[str] = None
    include_examples: bool = True
    include_highlights: bool = True

class NotesSection(BaseModel):
    """A section in generated notes"""
    title: str
    content: List[str]  # Bullet points
    examples: Optional[List[str]] = None
    highlights: Optional[List[str]] = None

class NotesResponse(BaseModel):
    """Response with generated notes"""
    success: bool
    topic: str
    sections: List[NotesSection]
    source_documents: List[str]

class QuizQuestion(BaseModel):
    """A single quiz question"""
    question: str
    options: List[str]
    correct_answer: int  # Index of correct option (0-3)
    explanation: str
    difficulty: DifficultyLevel
    source_page: int
    source_document: str

class QuizRequest(BaseModel):
    """Request for generating quiz"""
    user_id: str
    document_ids: List[str]
    num_questions: int = Field(default=10, ge=1, le=50)
    difficulty: Optional[DifficultyLevel] = None
    topic: Optional[str] = None

class QuizResponse(BaseModel):
    """Response with generated quiz"""
    success: bool
    questions: List[QuizQuestion]
    total_questions: int

class StudyPlanRequest(BaseModel):
    """Request for AI study planner"""
    user_id: str
    exam_date: str  # ISO format date
    available_hours_per_day: float
    weak_topics: Optional[List[str]] = None
    document_ids: Optional[List[str]] = None

class DailyTask(BaseModel):
    """A task in the study plan"""
    day: int
    date: str
    topic: str
    duration_hours: float
    task_type: str  # "study", "revision", "practice", "mock_test"
    resources: List[str]

class StudyPlanResponse(BaseModel):
    """Response with generated study plan"""
    success: bool
    total_days: int
    daily_tasks: List[DailyTask]
    revision_slots: List[int]  # Day numbers for revision
    weak_topic_focus: List[str]

class DocumentListResponse(BaseModel):
    """Response with list of user's documents"""
    success: bool
    documents: List[DocumentMetadata]
    total_count: int

class DeleteDocumentRequest(BaseModel):
    """Request to delete a document"""
    user_id: str
    document_id: str

class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = False
    error: str
    details: Optional[Dict[str, Any]] = None
