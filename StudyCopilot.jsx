/**
 * Velosify Study Copilot - Frontend Component
 * 
 * This file contains the complete Study Copilot React component
 * To integrate into index.html:
 * 1. Copy the StudyCopilot component code
 * 2. Add 'study-copilot' to the sidebar navigation
 * 3. Add the route in MainApp: {tab === 'study-copilot' && <StudyCopilot user={data} />}
 * 4. Update API_BASE_URL to your backend URL
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = 'http://localhost:8000';  // Update this to your backend URL

// ============================================================================
// STUDY COPILOT MAIN COMPONENT
// ============================================================================

const StudyCopilot = ({ user }) => {
    const [activeTab, setActiveTab] = useState('upload');
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Fetch user's documents on mount
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/documents/${user.id}`);
            const data = await response.json();
            if (data.success) {
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const tabs = [
        { id: 'upload', label: 'Upload', icon: 'upload' },
        { id: 'chat', label: 'Chat', icon: 'message-circle' },
        { id: 'notes', label: 'Notes', icon: 'file-text' },
        { id: 'quiz', label: 'Quiz', icon: 'help-circle' },
        { id: 'planner', label: 'Planner', icon: 'calendar' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                        <Icon name="brain-circuit" size={32} className="text-brand-400" />
                        Study Copilot
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 font-mono">
                        AI-powered learning assistant with RAG capabilities
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-slate-400">
                        {documents.length} Documents
                    </span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-brand-600 text-white shadow-[0_0_20px_rgba(var(--brand-500),0.3)]'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <Icon name={tab.icon} size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
                {activeTab === 'upload' && <UploadTab userId={user.id} documents={documents} onUploadComplete={fetchDocuments} />}
                {activeTab === 'chat' && <ChatTab userId={user.id} documents={documents} />}
                {activeTab === 'notes' && <NotesTab userId={user.id} documents={documents} />}
                {activeTab === 'quiz' && <QuizTab userId={user.id} documents={documents} />}
                {activeTab === 'planner' && <PlannerTab userId={user.id} documents={documents} />}
            </div>
        </div>
    );
};

// ============================================================================
// UPLOAD TAB
// ============================================================================

const UploadTab = ({ userId, documents, onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            setUploadStatus({ success: false, message: 'Only PDF files are allowed' });
            return;
        }

        setUploading(true);
        setUploadStatus(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', userId);
        if (subject) formData.append('subject', subject);
        if (topic) formData.append('topic', topic);

        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setUploadStatus({ success: true, message: `✅ ${data.filename} uploaded successfully! ${data.chunks_created} chunks created.` });
                setSubject('');
                setTopic('');
                onUploadComplete();
            } else {
                setUploadStatus({ success: false, message: data.error || 'Upload failed' });
            }
        } catch (error) {
            setUploadStatus({ success: false, message: `Error: ${error.message}` });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (documentId) => {
        if (!confirm('Delete this document? This cannot be undone.')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/documents/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, document_id: documentId }),
            });

            const data = await response.json();
            if (data.success) {
                onUploadComplete();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Card */}
            <Card className="p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Icon name="upload-cloud" size={24} className="text-brand-400" />
                    Upload Study Materials
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Subject (Optional)
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., Data Structures"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Topic (Optional)
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Trees and Graphs"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-brand-500/50 transition-colors">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label
                            htmlFor="pdf-upload"
                            className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Icon name="file-text" size={48} className="mx-auto mb-4 text-brand-400" />
                            <p className="text-white font-bold mb-2">
                                {uploading ? 'Processing...' : 'Click to upload PDF'}
                            </p>
                            <p className="text-xs text-slate-500">
                                Max file size: 50MB
                            </p>
                        </label>
                    </div>

                    {uploadStatus && (
                        <div className={`p-4 rounded-xl border ${uploadStatus.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                            {uploadStatus.message}
                        </div>
                    )}
                </div>
            </Card>

            {/* Documents List */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Icon name="folder" size={20} className="text-brand-400" />
                    Your Documents ({documents.length})
                </h3>

                {documents.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Icon name="inbox" size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No documents uploaded yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {documents.map((doc) => (
                            <div
                                key={doc.document_id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-brand-500/30 transition-colors group"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <Icon name="file-text" size={20} className="text-brand-400" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{doc.filename}</p>
                                        <p className="text-xs text-slate-500">
                                            {doc.total_pages} pages • {doc.subject || 'No subject'} • {new Date(doc.upload_timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(doc.document_id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <Icon name="trash-2" size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

// ============================================================================
// CHAT TAB
// ============================================================================

const ChatTab = ({ userId, documents }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    query: input,
                    document_ids: selectedDocs.length > 0 ? selectedDocs : null,
                    max_results: 5,
                }),
            });

            const data = await response.json();

            const assistantMessage = {
                role: 'assistant',
                content: data.answer,
                sources: data.sources || [],
                found: data.found_in_documents,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage = {
                role: 'assistant',
                content: `Error: ${error.message}`,
                sources: [],
                found: false,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
            {/* Sidebar - Document Filter */}
            <div className="lg:col-span-1">
                <Card className="p-4 h-full">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                        Filter Documents
                    </h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setSelectedDocs([])}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedDocs.length === 0
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                        >
                            All Documents
                        </button>
                        {documents.map(doc => (
                            <button
                                key={doc.document_id}
                                onClick={() => {
                                    if (selectedDocs.includes(doc.document_id)) {
                                        setSelectedDocs(prev => prev.filter(id => id !== doc.document_id));
                                    } else {
                                        setSelectedDocs(prev => [...prev, doc.document_id]);
                                    }
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors truncate ${selectedDocs.includes(doc.document_id)
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {doc.filename}
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
                <Card className="p-6 h-full flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <Icon name="message-circle" size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="font-bold mb-2">Start a conversation</p>
                                <p className="text-xs">Ask questions about your uploaded documents</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-brand-600' : 'bg-white/5'} rounded-xl p-4`}>
                                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.content}
                                    </p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <p className="text-xs font-bold text-slate-400 mb-2">SOURCES:</p>
                                            {msg.sources.map((source, i) => (
                                                <div key={i} className="text-xs text-slate-500 mb-1">
                                                    📄 {source.document_name} (Page {source.page_number}) - {(source.relevance_score * 100).toFixed(0)}% match
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question about your documents..."
                            disabled={loading || documents.length === 0}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all disabled:opacity-50"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={loading || !input.trim() || documents.length === 0}
                            icon="send"
                            className="px-6"
                        >
                            Send
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// ============================================================================
// NOTES TAB
// ============================================================================

const NotesTab = ({ userId, documents }) => {
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [includeExamples, setIncludeExamples] = useState(true);
    const [includeHighlights, setIncludeHighlights] = useState(true);

    const handleGenerate = async () => {
        if (selectedDocs.length === 0) {
            alert('Please select at least one document');
            return;
        }

        setLoading(true);
        setNotes(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/notes/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    document_ids: selectedDocs,
                    topic: topic || null,
                    include_examples: includeExamples,
                    include_highlights: includeHighlights,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setNotes(data);
            }
        } catch (error) {
            console.error('Error generating notes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
                <Card className="p-6 sticky top-6">
                    <h3 className="text-lg font-bold text-white mb-4">Generate Notes</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Topic (Optional)
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Binary Trees"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Select Documents
                            </label>
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                {documents.map(doc => (
                                    <label key={doc.document_id} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedDocs.includes(doc.document_id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDocs(prev => [...prev, doc.document_id]);
                                                } else {
                                                    setSelectedDocs(prev => prev.filter(id => id !== doc.document_id));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-xs text-white truncate">{doc.filename}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeExamples}
                                    onChange={(e) => setIncludeExamples(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-xs text-white">Include Examples</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeHighlights}
                                    onChange={(e) => setIncludeHighlights(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-xs text-white">Include Exam Highlights</span>
                            </label>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={loading || selectedDocs.length === 0}
                            icon="file-text"
                            className="w-full"
                        >
                            {loading ? 'Generating...' : 'Generate Notes'}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Notes Display */}
            <div className="lg:col-span-2">
                <Card className="p-6">
                    {!notes && !loading && (
                        <div className="text-center py-12 text-slate-500">
                            <Icon name="file-text" size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-bold mb-2">No notes generated yet</p>
                            <p className="text-xs">Configure settings and click "Generate Notes"</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white font-bold">Generating your notes...</p>
                        </div>
                    )}

                    {notes && notes.success && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">{notes.topic}</h2>
                                <p className="text-xs text-slate-500">
                                    Generated from {notes.source_documents.length} document(s)
                                </p>
                            </div>

                            {notes.sections.map((section, idx) => (
                                <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <h3 className="text-lg font-bold text-brand-400 mb-4">{section.title}</h3>

                                    <ul className="space-y-2 mb-4">
                                        {section.content.map((point, i) => (
                                            <li key={i} className="text-white text-sm flex gap-2">
                                                <span className="text-brand-400">•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {section.examples && section.examples.length > 0 && (
                                        <div className="mt-4 p-4 bg-brand-500/10 rounded-lg border border-brand-500/20">
                                            <p className="text-xs font-bold text-brand-400 mb-2">EXAMPLES:</p>
                                            <ul className="space-y-1">
                                                {section.examples.map((ex, i) => (
                                                    <li key={i} className="text-white text-xs">{ex}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {section.highlights && section.highlights.length > 0 && (
                                        <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                            <p className="text-xs font-bold text-yellow-400 mb-2">⭐ EXAM IMPORTANT:</p>
                                            <ul className="space-y-1">
                                                {section.highlights.map((hl, i) => (
                                                    <li key={i} className="text-white text-xs">{hl}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

// ============================================================================
// QUIZ TAB
// ============================================================================

const QuizTab = ({ userId, documents }) => {
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [numQuestions, setNumQuestions] = useState(10);
    const [difficulty, setDifficulty] = useState('');
    const [topic, setTopic] = useState('');
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleGenerate = async () => {
        if (selectedDocs.length === 0) {
            alert('Please select at least one document');
            return;
        }

        setLoading(true);
        setQuiz(null);
        setUserAnswers({});
        setShowResults(false);

        try {
            const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    document_ids: selectedDocs,
                    num_questions: numQuestions,
                    difficulty: difficulty || null,
                    topic: topic || null,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setQuiz(data);
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setShowResults(true);
    };

    const calculateScore = () => {
        if (!quiz) return 0;
        let correct = 0;
        quiz.questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correct_answer) correct++;
        });
        return correct;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
                <Card className="p-6 sticky top-6">
                    <h3 className="text-lg font-bold text-white mb-4">Generate Quiz</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Number of Questions
                            </label>
                            <input
                                type="number"
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(Math.max(1, Math.min(50, parseInt(e.target.value) || 10)))}
                                min="1"
                                max="50"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Difficulty
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 outline-none"
                            >
                                <option value="">Mixed</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Topic (Optional)
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Sorting Algorithms"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Select Documents
                            </label>
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                {documents.map(doc => (
                                    <label key={doc.document_id} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedDocs.includes(doc.document_id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDocs(prev => [...prev, doc.document_id]);
                                                } else {
                                                    setSelectedDocs(prev => prev.filter(id => id !== doc.document_id));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-xs text-white truncate">{doc.filename}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={loading || selectedDocs.length === 0}
                            icon="help-circle"
                            className="w-full"
                        >
                            {loading ? 'Generating...' : 'Generate Quiz'}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Quiz Display */}
            <div className="lg:col-span-2">
                <Card className="p-6">
                    {!quiz && !loading && (
                        <div className="text-center py-12 text-slate-500">
                            <Icon name="help-circle" size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-bold mb-2">No quiz generated yet</p>
                            <p className="text-xs">Configure settings and click "Generate Quiz"</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white font-bold">Generating your quiz...</p>
                        </div>
                    )}

                    {quiz && quiz.success && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-white">{quiz.total_questions} Questions</h2>
                                {showResults && (
                                    <div className="bg-brand-600 px-4 py-2 rounded-xl">
                                        <span className="text-white font-bold">
                                            Score: {calculateScore()}/{quiz.total_questions}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {quiz.questions.map((q, idx) => (
                                <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-white font-bold flex-1">
                                            {idx + 1}. {q.question}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded ${q.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                                q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {q.options.map((option, optIdx) => {
                                            const isSelected = userAnswers[idx] === optIdx;
                                            const isCorrect = q.correct_answer === optIdx;
                                            const showCorrect = showResults && isCorrect;
                                            const showWrong = showResults && isSelected && !isCorrect;

                                            return (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => !showResults && setUserAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                                    disabled={showResults}
                                                    className={`w-full text-left p-3 rounded-lg border transition-all ${showCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                                                            showWrong ? 'bg-red-500/20 border-red-500 text-red-400' :
                                                                isSelected ? 'bg-brand-600 border-brand-500 text-white' :
                                                                    'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    {option}
                                                    {showCorrect && ' ✓'}
                                                    {showWrong && ' ✗'}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {showResults && (
                                        <div className="p-4 bg-brand-500/10 rounded-lg border border-brand-500/20">
                                            <p className="text-xs font-bold text-brand-400 mb-2">EXPLANATION:</p>
                                            <p className="text-white text-sm">{q.explanation}</p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                Source: {q.source_document} (Page {q.source_page})
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {!showResults && (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={Object.keys(userAnswers).length !== quiz.total_questions}
                                    icon="check"
                                    className="w-full"
                                >
                                    Submit Quiz
                                </Button>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

// ============================================================================
// PLANNER TAB
// ============================================================================

const PlannerTab = ({ userId, documents }) => {
    const [examDate, setExamDate] = useState('');
    const [hoursPerDay, setHoursPerDay] = useState(3);
    const [weakTopics, setWeakTopics] = useState('');
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!examDate) {
            alert('Please select an exam date');
            return;
        }

        setLoading(true);
        setPlan(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/planner/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    exam_date: examDate,
                    available_hours_per_day: hoursPerDay,
                    weak_topics: weakTopics ? weakTopics.split(',').map(t => t.trim()) : null,
                    document_ids: selectedDocs.length > 0 ? selectedDocs : null,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setPlan(data);
            }
        } catch (error) {
            console.error('Error generating plan:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
                <Card className="p-6 sticky top-6">
                    <h3 className="text-lg font-bold text-white mb-4">Study Planner</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Exam Date
                            </label>
                            <input
                                type="date"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Hours Per Day
                            </label>
                            <input
                                type="number"
                                value={hoursPerDay}
                                onChange={(e) => setHoursPerDay(Math.max(1, Math.min(24, parseFloat(e.target.value) || 3)))}
                                min="1"
                                max="24"
                                step="0.5"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Weak Topics (comma-separated)
                            </label>
                            <textarea
                                value={weakTopics}
                                onChange={(e) => setWeakTopics(e.target.value)}
                                placeholder="e.g., Dynamic Programming, Graphs"
                                rows="3"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-500 outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Include Documents (Optional)
                            </label>
                            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                                {documents.map(doc => (
                                    <label key={doc.document_id} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedDocs.includes(doc.document_id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDocs(prev => [...prev, doc.document_id]);
                                                } else {
                                                    setSelectedDocs(prev => prev.filter(id => id !== doc.document_id));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-xs text-white truncate">{doc.filename}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={loading || !examDate}
                            icon="calendar"
                            className="w-full"
                        >
                            {loading ? 'Generating...' : 'Generate Plan'}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Plan Display */}
            <div className="lg:col-span-2">
                <Card className="p-6">
                    {!plan && !loading && (
                        <div className="text-center py-12 text-slate-500">
                            <Icon name="calendar" size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-bold mb-2">No study plan generated yet</p>
                            <p className="text-xs">Configure settings and click "Generate Plan"</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white font-bold">Creating your personalized study plan...</p>
                        </div>
                    )}

                    {plan && plan.success && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">{plan.total_days}-Day Study Plan</h2>
                                <p className="text-xs text-slate-500">
                                    {plan.weak_topic_focus.length > 0 && `Focus areas: ${plan.weak_topic_focus.join(', ')}`}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {plan.daily_tasks.map((task, idx) => {
                                    const isRevision = plan.revision_slots.includes(task.day);
                                    const taskTypeColors = {
                                        study: 'border-brand-500/30 bg-brand-500/10',
                                        revision: 'border-yellow-500/30 bg-yellow-500/10',
                                        practice: 'border-emerald-500/30 bg-emerald-500/10',
                                        mock_test: 'border-red-500/30 bg-red-500/10',
                                    };

                                    return (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border ${taskTypeColors[task.task_type] || 'border-white/10 bg-white/5'}`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-white font-bold">
                                                        Day {task.day} - {task.topic}
                                                    </h3>
                                                    <p className="text-xs text-slate-500">{task.date}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs px-2 py-1 bg-white/10 rounded uppercase font-bold">
                                                        {task.task_type.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {task.duration_hours}h
                                                    </span>
                                                </div>
                                            </div>

                                            {task.resources && task.resources.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-bold text-slate-400 mb-1">Resources:</p>
                                                    <ul className="text-xs text-white space-y-1">
                                                        {task.resources.map((resource, i) => (
                                                            <li key={i}>• {resource}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {isRevision && (
                                                <div className="mt-2 text-xs text-yellow-400 font-bold">
                                                    ⭐ REVISION DAY
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

// Export for integration
// Add this to your index.html after the other component definitions
