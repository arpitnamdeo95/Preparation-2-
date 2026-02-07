"""
AI Services Module
Handles notes generation, quiz creation, and study planning
"""
from typing import List, Optional
from datetime import datetime, timedelta
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from config import settings
from models import (
    NotesResponse, NotesSection,
    QuizResponse, QuizQuestion, DifficultyLevel,
    StudyPlanResponse, DailyTask
)
from rag_engine import RAGEngine
import json

class AIServices:
    """AI-powered services for study assistance"""
    
    def __init__(self):
        """Initialize LLM and RAG engine"""
        self.llm = ChatGoogleGenerativeAI(
            model=settings.MODEL_NAME,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.4,  # Slightly higher for creative tasks
            max_output_tokens=settings.MAX_OUTPUT_TOKENS
        )
        self.rag_engine = RAGEngine()
    
    def generate_notes(
        self,
        user_id: str,
        document_ids: List[str],
        topic: Optional[str] = None,
        include_examples: bool = True,
        include_highlights: bool = True
    ) -> NotesResponse:
        """Generate structured study notes from documents"""
        
        # Determine topic if not provided
        if not topic:
            topic = "General Study Notes"
        
        # Retrieve relevant context
        relevant_chunks = self.rag_engine.get_context_for_topic(
            user_id=user_id,
            topic=topic,
            document_ids=document_ids,
            max_chunks=15
        )
        
        if not relevant_chunks:
            return NotesResponse(
                success=False,
                topic=topic,
                sections=[],
                source_documents=[]
            )
        
        # Build context
        context = "\n\n".join([chunk['text'] for chunk in relevant_chunks])
        source_docs = list(set([chunk['filename'] for chunk in relevant_chunks]))
        
        # Notes generation prompt
        prompt = f"""You are Velosify Study Copilot. Generate comprehensive, exam-focused study notes.

TOPIC: {topic}

CONTENT FROM DOCUMENTS:
{context}

Generate structured notes with:
1. Clear section titles
2. Bullet points for key concepts
3. {"Examples for each concept" if include_examples else ""}
4. {"Exam-important highlights" if include_highlights else ""}

Format your response as JSON:
{{
    "sections": [
        {{
            "title": "Section Title",
            "content": ["Point 1", "Point 2", ...],
            "examples": ["Example 1", ...],
            "highlights": ["Important point 1", ...]
        }}
    ]
}}

GENERATE NOTES:"""
        
        try:
            response = self.llm.invoke(prompt)
            content = response.content
            
            # Parse JSON response
            # Remove markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            data = json.loads(content.strip())
            
            sections = []
            for section_data in data.get("sections", []):
                section = NotesSection(
                    title=section_data.get("title", ""),
                    content=section_data.get("content", []),
                    examples=section_data.get("examples") if include_examples else None,
                    highlights=section_data.get("highlights") if include_highlights else None
                )
                sections.append(section)
            
            return NotesResponse(
                success=True,
                topic=topic,
                sections=sections,
                source_documents=source_docs
            )
            
        except Exception as e:
            print(f"Error generating notes: {e}")
            return NotesResponse(
                success=False,
                topic=topic,
                sections=[],
                source_documents=source_docs
            )
    
    def generate_quiz(
        self,
        user_id: str,
        document_ids: List[str],
        num_questions: int = 10,
        difficulty: Optional[DifficultyLevel] = None,
        topic: Optional[str] = None
    ) -> QuizResponse:
        """Generate MCQ quiz from documents"""
        
        # Determine topic
        if not topic:
            topic = "General Assessment"
        
        # Retrieve relevant context
        relevant_chunks = self.rag_engine.get_context_for_topic(
            user_id=user_id,
            topic=topic,
            document_ids=document_ids,
            max_chunks=20
        )
        
        if not relevant_chunks:
            return QuizResponse(
                success=False,
                questions=[],
                total_questions=0
            )
        
        # Build context with page references
        context_parts = []
        for chunk in relevant_chunks:
            context_parts.append(
                f"[{chunk['filename']} - Page {chunk['page_number']}]\n{chunk['text']}"
            )
        context = "\n\n".join(context_parts)
        
        # Quiz generation prompt
        difficulty_str = difficulty.value if difficulty else "mixed (easy, medium, hard)"
        
        prompt = f"""You are Velosify Study Copilot. Generate {num_questions} multiple-choice questions.

TOPIC: {topic}
DIFFICULTY: {difficulty_str}

CONTENT FROM DOCUMENTS:
{context}

Generate questions that:
1. Test understanding, not just memorization
2. Have 4 options each
3. Include clear explanations
4. Reference source page numbers

Format as JSON:
{{
    "questions": [
        {{
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "explanation": "Why this is correct...",
            "difficulty": "easy|medium|hard",
            "source_page": 5,
            "source_document": "filename.pdf"
        }}
    ]
}}

GENERATE {num_questions} QUESTIONS:"""
        
        try:
            response = self.llm.invoke(prompt)
            content = response.content
            
            # Parse JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            data = json.loads(content.strip())
            
            questions = []
            for q_data in data.get("questions", [])[:num_questions]:
                question = QuizQuestion(
                    question=q_data.get("question", ""),
                    options=q_data.get("options", []),
                    correct_answer=q_data.get("correct_answer", 0),
                    explanation=q_data.get("explanation", ""),
                    difficulty=DifficultyLevel(q_data.get("difficulty", "medium")),
                    source_page=q_data.get("source_page", 1),
                    source_document=q_data.get("source_document", "")
                )
                questions.append(question)
            
            return QuizResponse(
                success=True,
                questions=questions,
                total_questions=len(questions)
            )
            
        except Exception as e:
            print(f"Error generating quiz: {e}")
            return QuizResponse(
                success=False,
                questions=[],
                total_questions=0
            )
    
    def generate_study_plan(
        self,
        user_id: str,
        exam_date: str,
        available_hours_per_day: float,
        weak_topics: Optional[List[str]] = None,
        document_ids: Optional[List[str]] = None
    ) -> StudyPlanResponse:
        """Generate personalized study plan"""
        
        # Calculate days until exam
        try:
            exam_datetime = datetime.fromisoformat(exam_date)
            today = datetime.now()
            days_remaining = (exam_datetime - today).days
            
            if days_remaining <= 0:
                days_remaining = 7  # Default to 1 week
        except:
            days_remaining = 30  # Default to 1 month
        
        # Get document context if available
        context = ""
        if document_ids:
            chunks = self.rag_engine.get_context_for_topic(
                user_id=user_id,
                topic="study topics and syllabus",
                document_ids=document_ids,
                max_chunks=10
            )
            context = "\n".join([chunk['text'][:500] for chunk in chunks])
        
        weak_topics_str = ", ".join(weak_topics) if weak_topics else "None specified"
        
        # Study plan generation prompt
        prompt = f"""You are Velosify Study Copilot. Create a personalized study plan.

EXAM DATE: {exam_date}
DAYS REMAINING: {days_remaining}
AVAILABLE HOURS/DAY: {available_hours_per_day}
WEAK TOPICS: {weak_topics_str}

SYLLABUS CONTEXT:
{context if context else "General comprehensive preparation"}

Create a day-by-day study plan with:
1. Balanced topic coverage
2. Extra focus on weak topics
3. Regular revision slots
4. Mock tests before exam
5. Realistic daily tasks

Format as JSON:
{{
    "daily_tasks": [
        {{
            "day": 1,
            "date": "2026-02-07",
            "topic": "Topic name",
            "duration_hours": 3.0,
            "task_type": "study|revision|practice|mock_test",
            "resources": ["Resource 1", "Resource 2"]
        }}
    ],
    "revision_slots": [5, 10, 15],
    "weak_topic_focus": ["Topic 1", "Topic 2"]
}}

GENERATE STUDY PLAN:"""
        
        try:
            response = self.llm.invoke(prompt)
            content = response.content
            
            # Parse JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            data = json.loads(content.strip())
            
            daily_tasks = []
            for task_data in data.get("daily_tasks", []):
                task = DailyTask(
                    day=task_data.get("day", 1),
                    date=task_data.get("date", ""),
                    topic=task_data.get("topic", ""),
                    duration_hours=task_data.get("duration_hours", 2.0),
                    task_type=task_data.get("task_type", "study"),
                    resources=task_data.get("resources", [])
                )
                daily_tasks.append(task)
            
            return StudyPlanResponse(
                success=True,
                total_days=len(daily_tasks),
                daily_tasks=daily_tasks,
                revision_slots=data.get("revision_slots", []),
                weak_topic_focus=data.get("weak_topic_focus", weak_topics or [])
            )
            
        except Exception as e:
            print(f"Error generating study plan: {e}")
            return StudyPlanResponse(
                success=False,
                total_days=0,
                daily_tasks=[],
                revision_slots=[],
                weak_topic_focus=[]
            )
