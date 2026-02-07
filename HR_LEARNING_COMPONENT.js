// HR Protocol - Role-Based Learning & SOP Hub Component
// This is a standalone component file that can be integrated into index.html

const HRPrep = ({ user, update, log }) => {
    const [view, setView] = useState('dashboard'); // dashboard, learning-path, module, sop-hub, sop-detail, admin
    const [selectedPath, setSelectedPath] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedSOP, setSelectedSOP] = useState(null);
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiResponse, setAiResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock data - Replace with actual API calls
    const mockLearningPaths = [
        {
            id: '1',
            title: 'Sales Executive Onboarding',
            description: 'Complete onboarding program for sales team',
            estimated_hours: 40,
            is_mandatory: true,
            role: { name: 'Sales Executive' },
            progress: {
                total_modules: 12,
                completed_modules: 5,
                completion_percentage: 42,
                last_accessed: new Date().toISOString()
            },
            assignment: {
                due_date: '2026-03-15',
                priority: 'high'
            }
        },
        {
            id: '2',
            title: 'HR Compliance Training',
            description: 'Essential HR policies and compliance',
            estimated_hours: 20,
            is_mandatory: true,
            role: { name: 'All Employees' },
            progress: {
                total_modules: 8,
                completed_modules: 8,
                completion_percentage: 100,
                last_accessed: new Date().toISOString()
            },
            assignment: {
                due_date: '2026-02-28',
                priority: 'urgent'
            }
        }
    ];

    const mockModules = [
        {
            id: 'm1',
            title: 'CRM System Basics',
            description: 'Learn to use our CRM platform',
            module_type: 'video',
            estimated_minutes: 30,
            sequence_order: 1,
            is_locked: false,
            user_progress: { status: 'completed', progress_percentage: 100 }
        },
        {
            id: 'm2',
            title: 'Sales Process Overview',
            description: '5-step sales methodology',
            module_type: 'text',
            estimated_minutes: 45,
            sequence_order: 2,
            is_locked: false,
            user_progress: { status: 'in_progress', progress_percentage: 60 }
        },
        {
            id: 'm3',
            title: 'Product Knowledge Quiz',
            description: 'Test your understanding',
            module_type: 'quiz',
            estimated_minutes: 20,
            sequence_order: 3,
            is_locked: true,
            unlock_after: { module_title: 'Sales Process Overview' }
        }
    ];

    const mockSOPs = [
        {
            id: 's1',
            title: 'Employee Onboarding Process',
            sop_code: 'SOP-HR-001',
            category: 'HR',
            description: 'Standard process for onboarding new employees',
            version: '2.1',
            status: 'active'
        },
        {
            id: 's2',
            title: 'Sales Lead Management',
            sop_code: 'SOP-SALES-003',
            category: 'Sales',
            description: 'How to manage and qualify leads',
            version: '1.5',
            status: 'active'
        }
    ];

    // Dashboard View
    const DashboardView = () => (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-end justify-between border-b dark:border-white/5 border-slate-200 pb-6">
                <div>
                    <h2 className="text-4xl font-bold dark:text-white text-slate-900 tracking-tight">Learning Hub</h2>
                    <p className="dark:text-slate-400 text-slate-600 mt-2 text-sm">Role-Based Training & SOP Management</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => setView('sop-hub')} variant="secondary" icon="book-open">
                        SOP Library
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="dark:bg-gradient-to-br dark:from-blue-500/10 dark:to-transparent bg-blue-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs dark:text-slate-400 text-slate-600 uppercase tracking-wider mb-1">In Progress</p>
                            <p className="text-3xl font-bold dark:text-white text-slate-900">2</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl dark:bg-blue-500/20 bg-blue-100 flex items-center justify-center">
                            <Icon name="book-open" className="text-blue-500" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="dark:bg-gradient-to-br dark:from-green-500/10 dark:to-transparent bg-green-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs dark:text-slate-400 text-slate-600 uppercase tracking-wider mb-1">Completed</p>
                            <p className="text-3xl font-bold dark:text-white text-slate-900">1</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl dark:bg-green-500/20 bg-green-100 flex items-center justify-center">
                            <Icon name="check-circle" className="text-green-500" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-transparent bg-purple-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs dark:text-slate-400 text-slate-600 uppercase tracking-wider mb-1">Learning Hours</p>
                            <p className="text-3xl font-bold dark:text-white text-slate-900">42</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl dark:bg-purple-500/20 bg-purple-100 flex items-center justify-center">
                            <Icon name="clock" className="text-purple-500" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-transparent bg-orange-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs dark:text-slate-400 text-slate-600 uppercase tracking-wider mb-1">SOPs Accessed</p>
                            <p className="text-3xl font-bold dark:text-white text-slate-900">8</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl dark:bg-orange-500/20 bg-orange-100 flex items-center justify-center">
                            <Icon name="file-text" className="text-orange-500" size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* My Learning Paths */}
            <div>
                <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-4">My Learning Paths</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockLearningPaths.map(path => (
                        <Card key={path.id} onClick={() => { setSelectedPath(path); setView('learning-path'); }} className="cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-bold dark:text-white text-slate-900">{path.title}</h4>
                                        {path.is_mandatory && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full dark:bg-red-500/20 dark:text-red-400 bg-red-100 text-red-600 border dark:border-red-500/30 border-red-200">
                                                Required
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm dark:text-slate-400 text-slate-600 mb-3">{path.description}</p>
                                    <div className="flex items-center gap-4 text-xs dark:text-slate-500 text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Icon name="clock" size={12} />
                                            {path.estimated_hours}h
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Icon name="layers" size={12} />
                                            {path.progress.total_modules} modules
                                        </span>
                                        <span className={`flex items-center gap-1 font-bold ${path.assignment.priority === 'urgent' ? 'text-red-500' : path.assignment.priority === 'high' ? 'text-orange-500' : 'text-blue-500'}`}>
                                            <Icon name="flag" size={12} />
                                            {path.assignment.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="dark:text-slate-400 text-slate-600">Progress</span>
                                    <span className="font-bold dark:text-white text-slate-900">{path.progress.completion_percentage}%</span>
                                </div>
                                <div className="h-2 dark:bg-white/5 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
                                        style={{ width: `${path.progress.completion_percentage}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs dark:text-slate-500 text-slate-500">
                                    <span>{path.progress.completed_modules}/{path.progress.total_modules} completed</span>
                                    <span>Due: {new Date(path.assignment.due_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );

    // Learning Path Detail View
    const LearningPathView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setView('dashboard')} className="p-2 dark:hover:bg-white/5 hover:bg-slate-100 rounded-lg transition-colors">
                    <Icon name="arrow-left" size={20} />
                </button>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold dark:text-white text-slate-900">{selectedPath?.title}</h2>
                    <p className="dark:text-slate-400 text-slate-600 mt-1">{selectedPath?.description}</p>
                </div>
            </div>

            {/* Modules List */}
            <div className="space-y-4">
                {mockModules.map((module, idx) => (
                    <Card key={module.id} className={`${module.is_locked ? 'opacity-50' : 'cursor-pointer'}`} onClick={() => !module.is_locked && setSelectedModule(module)}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${module.user_progress?.status === 'completed' ? 'dark:bg-green-500/20 bg-green-100' :
                                    module.user_progress?.status === 'in_progress' ? 'dark:bg-blue-500/20 bg-blue-100' :
                                        'dark:bg-white/5 bg-slate-100'
                                }`}>
                                {module.is_locked ? (
                                    <Icon name="lock" size={20} className="dark:text-slate-500 text-slate-400" />
                                ) : module.user_progress?.status === 'completed' ? (
                                    <Icon name="check-circle" size={20} className="text-green-500" />
                                ) : (
                                    <Icon name={module.module_type === 'video' ? 'play-circle' : module.module_type === 'quiz' ? 'help-circle' : 'file-text'} size={20} className="text-brand-500" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs dark:text-slate-500 text-slate-500 font-mono">#{idx + 1}</span>
                                    <h4 className="font-bold dark:text-white text-slate-900">{module.title}</h4>
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full dark:bg-white/5 bg-slate-100 dark:text-slate-400 text-slate-600">
                                        {module.module_type}
                                    </span>
                                </div>
                                <p className="text-sm dark:text-slate-400 text-slate-600">{module.description}</p>
                                {module.is_locked && (
                                    <p className="text-xs dark:text-orange-400 text-orange-600 mt-1 flex items-center gap-1">
                                        <Icon name="alert-circle" size={12} />
                                        Complete "{module.unlock_after.module_title}" to unlock
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-xs dark:text-slate-500 text-slate-500">{module.estimated_minutes} min</p>
                                {module.user_progress && (
                                    <p className="text-sm font-bold dark:text-white text-slate-900 mt-1">{module.user_progress.progress_percentage}%</p>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    // SOP Hub View
    const SOPHubView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setView('dashboard')} className="p-2 dark:hover:bg-white/5 hover:bg-slate-100 rounded-lg transition-colors">
                    <Icon name="arrow-left" size={20} />
                </button>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold dark:text-white text-slate-900">SOP Library</h2>
                    <p className="dark:text-slate-400 text-slate-600 mt-1">Company Standard Operating Procedures</p>
                </div>
            </div>

            {/* SOP Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSOPs.map(sop => (
                    <Card key={sop.id} onClick={() => { setSelectedSOP(sop); setView('sop-detail'); }} className="cursor-pointer">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg dark:bg-brand-500/20 bg-brand-100 flex items-center justify-center flex-shrink-0">
                                <Icon name="file-text" className="text-brand-500" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono dark:text-slate-500 text-slate-500">{sop.sop_code}</span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full dark:bg-white/5 bg-slate-100 dark:text-slate-400 text-slate-600">
                                        {sop.category}
                                    </span>
                                </div>
                                <h4 className="font-bold dark:text-white text-slate-900 mb-1 truncate">{sop.title}</h4>
                                <p className="text-sm dark:text-slate-400 text-slate-600 line-clamp-2">{sop.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs dark:text-slate-500 text-slate-500 pt-3 border-t dark:border-white/5 border-slate-200">
                            <span>Version {sop.version}</span>
                            <span className="flex items-center gap-1 text-green-500">
                                <Icon name="check-circle" size={12} />
                                Active
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    // SOP Detail with AI Q&A
    const SOPDetailView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setView('sop-hub')} className="p-2 dark:hover:bg-white/5 hover:bg-slate-100 rounded-lg transition-colors">
                    <Icon name="arrow-left" size={20} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono dark:text-slate-400 text-slate-600">{selectedSOP?.sop_code}</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full dark:bg-brand-500/20 bg-brand-100 text-brand-500">
                            {selectedSOP?.category}
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold dark:text-white text-slate-900">{selectedSOP?.title}</h2>
                    <p className="dark:text-slate-400 text-slate-600 mt-1">Version {selectedSOP?.version}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SOP Content */}
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="font-bold dark:text-white text-slate-900 mb-4">Procedure</h3>
                        <div className="space-y-4 dark:text-slate-300 text-slate-700">
                            <p>This is a placeholder for the actual SOP content. In production, this would display the full SOP sections, steps, and procedures.</p>
                            <div className="p-4 dark:bg-blue-500/10 bg-blue-50 rounded-lg border dark:border-blue-500/20 border-blue-200">
                                <p className="text-sm"><strong>Note:</strong> This SOP is currently active and approved for use.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* AI Q&A Panel */}
                <div>
                    <Card className="sticky top-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Icon name="sparkles" className="text-brand-500" size={20} />
                            <h3 className="font-bold dark:text-white text-slate-900">Ask AI</h3>
                        </div>
                        <p className="text-sm dark:text-slate-400 text-slate-600 mb-4">Get instant answers about this SOP</p>

                        <textarea
                            value={aiQuestion}
                            onChange={(e) => setAiQuestion(e.target.value)}
                            placeholder="e.g., What are the key steps?"
                            className="w-full p-3 dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 rounded-lg dark:text-white text-slate-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={3}
                        />

                        <Button onClick={() => setAiResponse('AI response would appear here based on SOP content.')} className="w-full mt-3" icon="send">
                            Ask Question
                        </Button>

                        {aiResponse && (
                            <div className="mt-4 p-4 dark:bg-green-500/10 bg-green-50 rounded-lg border dark:border-green-500/20 border-green-200">
                                <p className="text-sm dark:text-slate-300 text-slate-700">{aiResponse}</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );

    // Main Render
    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {view === 'dashboard' && <DashboardView />}
            {view === 'learning-path' && <LearningPathView />}
            {view === 'sop-hub' && <SOPHubView />}
            {view === 'sop-detail' && <SOPDetailView />}
        </div>
    );
};
