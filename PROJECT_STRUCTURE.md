# Velosify Study Copilot - Project Structure

```
gate tracker/
│
├── backend/                          # Backend API (FastAPI + Python)
│   ├── main.py                       # FastAPI app with all endpoints
│   ├── config.py                     # Configuration & environment variables
│   ├── models.py                     # Pydantic models for validation
│   ├── pdf_processor.py              # PDF text extraction & chunking
│   ├── vector_store.py               # FAISS vector operations
│   ├── rag_engine.py                 # RAG implementation for chat
│   ├── ai_services.py                # Notes, Quiz, Planner generators
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment variables template
│   ├── .env                          # Your actual environment variables (gitignored)
│   ├── README.md                     # Backend documentation
│   ├── test_api.py                   # API testing script
│   ├── uploads/                      # User-uploaded PDFs (gitignored)
│   │   └── {user_id}/                # User-specific directories
│   └── vector_stores/                # FAISS indices (gitignored)
│       └── {user_id}/                # User-specific vector stores
│           ├── faiss_index.bin       # FAISS index file
│           └── metadata.pkl          # Chunk metadata
│
├── StudyCopilot.jsx                  # Frontend component (React)
│   ├── StudyCopilot (main)           # Main component with tab navigation
│   ├── UploadTab                     # PDF upload & document management
│   ├── ChatTab                       # RAG-based chat interface
│   ├── NotesTab                      # Notes generation UI
│   ├── QuizTab                       # Quiz generation & taking UI
│   └── PlannerTab                    # Study plan generation UI
│
├── index.html                        # Main application (single-file React)
│   └── [Integration point for StudyCopilot component]
│
├── STUDY_COPILOT_GUIDE.md            # Complete implementation guide
├── QUICKSTART.md                     # Quick setup guide
└── PROJECT_STRUCTURE.md              # This file
```

## 📁 Key Files Explained

### Backend Files

| File | Purpose | Key Functions |
|------|---------|---------------|
| `main.py` | FastAPI application | All API endpoints, CORS, error handling |
| `config.py` | Configuration | Environment variables, settings, paths |
| `models.py` | Data models | Pydantic models for request/response validation |
| `pdf_processor.py` | PDF handling | Text extraction, chunking, file management |
| `vector_store.py` | Vector operations | FAISS indexing, similarity search, embeddings |
| `rag_engine.py` | RAG logic | Context retrieval, LLM prompting, chat |
| `ai_services.py` | AI features | Notes, quiz, and planner generation |

### Frontend Files

| File | Purpose | Components |
|------|---------|------------|
| `StudyCopilot.jsx` | Main component | All Study Copilot UI components |
| `index.html` | Application | Integration point for Study Copilot |

### Documentation Files

| File | Purpose |
|------|---------|
| `STUDY_COPILOT_GUIDE.md` | Complete setup & usage guide |
| `QUICKSTART.md` | 5-minute quick start |
| `PROJECT_STRUCTURE.md` | This file - project overview |
| `backend/README.md` | Backend-specific documentation |

## 🔄 Data Flow

### 1. Document Upload Flow
```
User uploads PDF
    ↓
Frontend sends to /api/upload
    ↓
Backend: PDF Processor extracts text
    ↓
Backend: Text is chunked intelligently
    ↓
Backend: Chunks are embedded (Gemini)
    ↓
Backend: Embeddings stored in FAISS
    ↓
Backend: Metadata saved
    ↓
Frontend: Success message displayed
```

### 2. Chat Flow
```
User asks question
    ↓
Frontend sends to /api/chat
    ↓
Backend: Query is embedded
    ↓
Backend: FAISS similarity search
    ↓
Backend: Top-K chunks retrieved
    ↓
Backend: Context + Query → Gemini LLM
    ↓
Backend: Answer generated
    ↓
Frontend: Answer + sources displayed
```

### 3. Notes Generation Flow
```
User selects documents & topic
    ↓
Frontend sends to /api/notes/generate
    ↓
Backend: Retrieve relevant chunks
    ↓
Backend: Build context from chunks
    ↓
Backend: Generate structured notes (Gemini)
    ↓
Backend: Parse JSON response
    ↓
Frontend: Display formatted notes
```

## 🗄️ Storage Structure

### User Uploads Directory
```
uploads/
├── user_abc123/
│   ├── 20260206_143000_syllabus.pdf
│   ├── 20260206_144500_notes.pdf
│   └── 20260206_150000_pyqs.pdf
└── user_xyz789/
    └── 20260206_151000_textbook.pdf
```

### Vector Store Directory
```
vector_stores/
├── user_abc123/
│   ├── faiss_index.bin          # FAISS index with embeddings
│   └── metadata.pkl             # Chunk metadata (text, page, doc_id)
└── user_xyz789/
    ├── faiss_index.bin
    └── metadata.pkl
```

## 🔐 Security & Privacy

### User Isolation
- Each user has separate upload directory
- Each user has separate vector store
- No cross-user data access
- Document IDs are unique per user

### Data Protection
- File size validation (max 50MB)
- File type validation (PDF only)
- Input sanitization (Pydantic)
- No model training on user data

## 📊 Database Schema (Future Enhancement)

Currently using in-memory storage. For production, use Supabase:

```sql
-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    document_id VARCHAR(16) UNIQUE,
    filename TEXT,
    subject TEXT,
    topic TEXT,
    total_pages INTEGER,
    file_size_bytes BIGINT,
    upload_timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own documents
CREATE POLICY "Users can view own documents"
    ON documents FOR SELECT
    USING (auth.uid() = user_id);
```

## 🚀 Deployment Architecture

### Development
```
Frontend (localhost:5173) → Backend (localhost:8000) → Gemini API
                                ↓
                          Local File System
                          (uploads/ + vector_stores/)
```

### Production
```
Frontend (Vercel) → Backend (Railway/Render) → Gemini API
                         ↓
                    Cloud Storage (S3/GCS)
                         ↓
                    Supabase (Metadata)
```

## 📈 Scalability Considerations

### Current Limitations
- In-memory document metadata (lost on restart)
- Local file storage (not distributed)
- Single-server architecture

### Production Enhancements
1. **Database**: Use Supabase for metadata
2. **Storage**: Use S3/GCS for PDFs
3. **Caching**: Add Redis for embeddings
4. **Queue**: Use Celery for async processing
5. **Load Balancer**: Distribute traffic
6. **CDN**: Cache static assets

## 🔧 Configuration Files

### `.env` (Backend)
```env
GOOGLE_API_KEY=...           # Gemini API key
SUPABASE_URL=...             # Supabase project URL
SUPABASE_KEY=...             # Supabase service role key
HOST=0.0.0.0                 # Server host
PORT=8000                    # Server port
ENVIRONMENT=development      # development/production
```

### `.gitignore`
```
backend/.env
backend/uploads/
backend/vector_stores/
backend/__pycache__/
*.pyc
*.pyo
*.pyd
.Python
```

## 📝 Code Style & Conventions

### Backend (Python)
- PEP 8 style guide
- Type hints for all functions
- Docstrings for classes and complex functions
- Error handling with try/except
- Logging for debugging

### Frontend (React/JavaScript)
- Functional components with hooks
- Descriptive variable names
- Comments for complex logic
- Consistent formatting
- Reusable components

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_api.py
```

### Manual Testing Checklist
- [ ] Upload PDF successfully
- [ ] List uploaded documents
- [ ] Chat with documents
- [ ] Generate notes
- [ ] Create quiz
- [ ] Generate study plan
- [ ] Delete document

## 📚 Dependencies

### Backend
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **LangChain**: RAG framework
- **Google Generative AI**: Gemini LLM & embeddings
- **FAISS**: Vector similarity search
- **PyPDF2**: PDF text extraction
- **Pydantic**: Data validation

### Frontend
- **React**: UI framework
- **Lucide Icons**: Icon library
- **Tailwind CSS**: Styling (via CDN)

## 🎯 Future Enhancements

1. **Multi-format Support**: DOCX, TXT, PPTX
2. **OCR**: Extract text from scanned PDFs
3. **Collaborative Study**: Share documents with friends
4. **Progress Tracking**: Track quiz scores over time
5. **Flashcard Generation**: Auto-create flashcards
6. **Voice Input**: Ask questions via voice
7. **Mobile App**: React Native version
8. **Offline Mode**: Download notes for offline study

---

**Last Updated**: February 6, 2026
**Version**: 1.0.0
