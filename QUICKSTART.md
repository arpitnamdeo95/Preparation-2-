# Velosify Study Copilot - Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Gemini API key
# Get it from: https://makersuite.google.com/app/apikey

# Start the server
python main.py
```

### 2. Frontend Integration

Add to `index.html`:

**Step 1:** Add navigation item (line ~5193):
```javascript
{ id: 'study-copilot', i: 'brain-circuit', l: 'Study Copilot' }
```

**Step 2:** Copy component from `StudyCopilot.jsx` into `index.html`

**Step 3:** Add route (line ~5277):
```javascript
{tab === 'study-copilot' && <StudyCopilot user={data} />}
```

### 3. Test It!

1. Open http://localhost:8000/health (backend)
2. Open your Velosify app
3. Click "Study Copilot" in sidebar
4. Upload a PDF
5. Start chatting!

## 📚 Features

- ✅ PDF Upload & Processing
- ✅ RAG Chat (No Hallucinations)
- ✅ Smart Notes Generator
- ✅ Quiz Creator
- ✅ AI Study Planner

## 🔑 Get Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Click "Get API Key"
3. Copy and paste into `.env`

## 📖 Full Documentation

See `STUDY_COPILOT_GUIDE.md` for complete documentation.

## 🆘 Issues?

- Backend not starting? Check `.env` file
- Upload failing? Check file size (<50MB) and format (PDF only)
- Chat not working? Ensure backend is running on port 8000

---

**Built with ❤️ for Velosify**
