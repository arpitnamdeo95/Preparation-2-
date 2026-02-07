# 🚀 Velosify Study Copilot - Complete Implementation Guide

## 📋 Overview

The **Velosify Study Copilot** is a production-ready AI-powered learning assistant that uses Retrieval-Augmented Generation (RAG) to help students learn from their uploaded PDFs.

### ✨ Features

- **📄 PDF Upload & Processing**: Automatic text extraction and intelligent chunking
- **💬 RAG Chat**: Ask questions and get answers ONLY from your documents (no hallucinations)
- **📝 Smart Notes Generator**: AI-generated structured study notes with examples and highlights
- **📊 Quiz Generator**: Auto-create MCQs with explanations and source attribution
- **📅 AI Study Planner**: Personalized study schedules based on exam date and weak topics
- **🔒 User Isolation**: Complete data privacy - each user has isolated vector storage
- **⚡ Fast Search**: FAISS-powered semantic search for instant retrieval

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  Upload  │   Chat   │  Notes   │   Quiz   │ Planner  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON
┌──────────────────────────▼──────────────────────────────────┐
│                   BACKEND (FastAPI)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PDF Processor → Vector Store → RAG Engine            │ │
│  │       ↓              ↓              ↓                  │ │
│  │  Text Extract   FAISS Index    Gemini LLM             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Installation & Setup

### Step 1: Backend Setup

#### 1.1 Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### 1.2 Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Gemini API Configuration
GOOGLE_API_KEY=your_actual_gemini_api_key_here

# Supabase Configuration
SUPABASE_URL=https://wgjwgovcarpsvvmwuaww.supabase.co
SUPABASE_KEY=your_supabase_service_role_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# Storage Configuration
UPLOAD_DIR=./uploads
VECTOR_STORE_DIR=./vector_stores

# Security
MAX_FILE_SIZE_MB=50
ALLOWED_EXTENSIONS=pdf
```

**🔑 How to get your Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste it into your `.env` file

#### 1.3 Start the Backend Server

```bash
python main.py
```

You should see:
```
✅ Velosify Study Copilot API started successfully
📁 Upload directory: F:\gate tracker\backend\uploads
🗄️  Vector store directory: F:\gate tracker\backend\vector_stores
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### 1.4 Test the API

Open your browser and go to:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

### Step 2: Frontend Integration

#### 2.1 Add Study Copilot to Navigation

Open `index.html` and find the sidebar navigation section (around line 5190).

Add the Study Copilot link to the main navigation array:

```javascript
// MAIN LINKS
{[
    { id: 'dashboard', i: 'layout-dashboard', l: 'Dashboard' },
    { id: 'roadmaps', i: 'map', l: 'Roadmaps' },
    { id: 'dsa', i: 'code', l: 'DSA Tracker' },
    { id: 'syllabus', i: 'book-open', l: 'Syllabus' },
    { id: 'study-copilot', i: 'brain-circuit', l: 'Study Copilot' }  // ← ADD THIS LINE
].map(x => (
    // ... existing code
))}
```

#### 2.2 Copy the Study Copilot Component

1. Open `StudyCopilot.jsx`
2. Copy ALL the component code (everything after the configuration section)
3. In `index.html`, find where other components are defined (search for `const Dashboard`)
4. Paste the Study Copilot component code there

#### 2.3 Add the Route

Find the main content area (around line 5273) and add the Study Copilot route:

```javascript
<div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-full w-full">
    {tab === 'dashboard' && <Dashboard user={data} setTab={setTab} />}
    {tab === 'focus' && <FocusEngine focus={data.focus} setFocus={f => setData(d => ({ ...d, focus: (typeof f === 'function' ? f(d.focus) : f) }))} setTab={setTab} />}
    {tab === 'roadmaps' && <RoadmapHub user={data} update={setData} />}
    {tab === 'syllabus' && <Syllabus user={data} update={setData} log={log} />}
    {tab === 'study-copilot' && <StudyCopilot user={data} />}  {/* ← ADD THIS LINE */}
    {/* ... other routes ... */}
</div>
```

#### 2.4 Update API Base URL

In the Study Copilot component code, update the API_BASE_URL:

```javascript
const API_BASE_URL = 'http://localhost:8000';  // For local development
// const API_BASE_URL = 'https://your-backend.com';  // For production
```

---

## 🎯 Usage Guide

### 1. Upload Documents

1. Click "Study Copilot" in the sidebar
2. Go to the "Upload" tab
3. (Optional) Enter subject and topic
4. Click "Click to upload PDF" and select your PDF file
5. Wait for processing (you'll see a success message with chunk count)

### 2. Chat with Documents

1. Go to the "Chat" tab
2. (Optional) Filter by specific documents using the sidebar
3. Type your question in the input field
4. Press Enter or click "Send"
5. View the AI's answer with source citations (PDF name + page number)

**Example Questions:**
- "What are the main concepts covered in this chapter?"
- "Explain the algorithm described on page 5"
- "What are the key differences between X and Y?"

### 3. Generate Notes

1. Go to the "Notes" tab
2. Select documents to generate notes from
3. (Optional) Enter a specific topic
4. Toggle "Include Examples" and "Include Exam Highlights"
5. Click "Generate Notes"
6. View structured notes with bullet points, examples, and highlights

### 4. Create Quizzes

1. Go to the "Quiz" tab
2. Set number of questions (1-50)
3. Choose difficulty (Easy/Medium/Hard or Mixed)
4. (Optional) Enter a topic
5. Select documents
6. Click "Generate Quiz"
7. Answer questions and click "Submit Quiz" to see results

### 5. Generate Study Plan

1. Go to the "Planner" tab
2. Select your exam date
3. Set available hours per day
4. (Optional) Enter weak topics (comma-separated)
5. (Optional) Select documents for syllabus context
6. Click "Generate Plan"
7. View your personalized day-by-day study schedule

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: "GOOGLE_API_KEY is required"**
- Solution: Make sure you've created a `.env` file and added your Gemini API key

**Problem: "Module not found"**
- Solution: Run `pip install -r requirements.txt` again

**Problem: "Port 8000 already in use"**
- Solution: Change the PORT in `.env` to a different number (e.g., 8001)

### Frontend Issues

**Problem: "Failed to fetch" errors**
- Solution: Make sure the backend is running on http://localhost:8000
- Check that API_BASE_URL matches your backend URL

**Problem: Study Copilot tab doesn't appear**
- Solution: Make sure you added the navigation item correctly
- Clear browser cache and reload

**Problem: Upload fails**
- Solution: Check file size (max 50MB)
- Ensure file is a PDF
- Check backend logs for errors

---

## 📊 API Endpoints Reference

### Document Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload PDF document |
| `/api/documents/{user_id}` | GET | List user's documents |
| `/api/documents/delete` | POST | Delete document |

### AI Features

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | RAG-based chat |
| `/api/notes/generate` | POST | Generate study notes |
| `/api/quiz/generate` | POST | Generate quiz |
| `/api/planner/generate` | POST | Generate study plan |

### Health & Status

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service info |
| `/health` | GET | Health check |

Full API documentation: http://localhost:8000/docs

---

## 🚀 Production Deployment

### Backend Deployment

1. **Set environment to production:**
   ```env
   ENVIRONMENT=production
   ```

2. **Configure CORS:**
   In `main.py`, update allowed origins:
   ```python
   allow_origins=["https://your-frontend-domain.com"]
   ```

3. **Deploy to a cloud platform:**
   - **Railway**: Connect GitHub repo, set environment variables
   - **Render**: Create web service, add environment variables
   - **Heroku**: Use Procfile: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Use production database:**
   - Store document metadata in Supabase instead of in-memory dict
   - Use cloud storage (S3, Google Cloud Storage) for PDFs

### Frontend Deployment

1. **Update API_BASE_URL:**
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.com';
   ```

2. **Deploy to Vercel:**
   ```bash
   npm run build
   vercel --prod
   ```

---

## 🎨 Customization

### Modify RAG Behavior

Edit `backend/config.py`:

```python
# RAG Configuration
CHUNK_SIZE: int = 1000  # Increase for longer chunks
CHUNK_OVERLAP: int = 200  # Increase for more context
TOP_K_RESULTS: int = 5  # Number of chunks to retrieve
SIMILARITY_THRESHOLD: float = 0.7  # Minimum similarity score
```

### Change LLM Settings

Edit `backend/config.py`:

```python
# LLM Configuration
MODEL_NAME: str = "gemini-pro"  # Or "gemini-pro-vision"
TEMPERATURE: float = 0.3  # Lower = more focused, Higher = more creative
MAX_OUTPUT_TOKENS: int = 2048  # Maximum response length
```

### Customize Prompts

Edit prompts in:
- `backend/rag_engine.py` - Chat prompt
- `backend/ai_services.py` - Notes, Quiz, Planner prompts

---

## 📈 Performance Tips

1. **Chunk Size**: Smaller chunks = more precise, Larger chunks = more context
2. **Top K Results**: More results = more context but slower
3. **Similarity Threshold**: Higher = stricter matching, Lower = more results
4. **Caching**: Implement Redis for frequently accessed embeddings
5. **Batch Processing**: Process multiple PDFs in parallel

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use service role keys** for Supabase (not anon keys)
3. **Implement rate limiting** in production
4. **Validate all user inputs** (already implemented)
5. **Use HTTPS** in production
6. **Implement authentication middleware** to verify user sessions

---

## 📝 License

Part of the Velosify platform.

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs: `python main.py`
3. Check browser console for frontend errors
4. Verify API is accessible: http://localhost:8000/health

---

## 🎉 You're All Set!

Your Velosify Study Copilot is now ready to use. Upload some PDFs and start learning with AI! 🚀

**Next Steps:**
1. Upload your first PDF
2. Try the chat feature
3. Generate some notes
4. Create a quiz
5. Build your study plan

Happy studying! 📚✨
