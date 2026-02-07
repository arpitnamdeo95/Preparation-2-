# Velosify Study Copilot Backend

Production-ready AI Study Assistant with RAG capabilities.

## Features

- 📄 **PDF Upload & Processing**: Automatic text extraction and intelligent chunking
- 🤖 **RAG Chat**: Chat with your documents using Gemini AI
- 📝 **Notes Generation**: AI-generated structured study notes
- 📊 **Quiz Creation**: Auto-generate MCQs from your content
- 📅 **Study Planner**: Personalized study schedules
- 🔒 **User Isolation**: Complete data privacy per user
- ⚡ **Vector Search**: Fast semantic search with FAISS

## Tech Stack

- **Framework**: FastAPI
- **LLM**: Google Gemini Pro
- **Embeddings**: Gemini Embedding Model
- **Vector Store**: FAISS
- **PDF Processing**: PyPDF2
- **RAG Framework**: LangChain

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `GOOGLE_API_KEY`: Your Gemini API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase service role key

### 3. Run the Server

```bash
python main.py
```

Server will start at `http://localhost:8000`

## API Endpoints

### Document Management

- `POST /api/upload` - Upload PDF document
- `GET /api/documents/{user_id}` - List user's documents
- `POST /api/documents/delete` - Delete document

### AI Features

- `POST /api/chat` - RAG-based chat
- `POST /api/notes/generate` - Generate study notes
- `POST /api/quiz/generate` - Generate quiz
- `POST /api/planner/generate` - Generate study plan

### Health

- `GET /` - Service info
- `GET /health` - Health check

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Architecture

```
backend/
├── main.py              # FastAPI app & endpoints
├── config.py            # Configuration management
├── models.py            # Pydantic models
├── pdf_processor.py     # PDF handling
├── vector_store.py      # FAISS vector operations
├── rag_engine.py        # RAG implementation
├── ai_services.py       # Notes, Quiz, Planner
├── requirements.txt     # Dependencies
└── .env                 # Environment variables
```

## Security

- User-isolated vector stores
- File size validation
- Type validation with Pydantic
- CORS configuration
- No cross-user data access

## Production Deployment

For production:

1. Set `ENVIRONMENT=production` in `.env`
2. Configure proper CORS origins
3. Use production-grade database for metadata
4. Set up proper file storage (S3, etc.)
5. Enable HTTPS
6. Add rate limiting
7. Implement authentication middleware

## License

Part of Velosify platform
