import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    ChevronUp,
    ChevronRight,
    Trash,
    Plus,
    X
} from 'lucide-react';
import { Logo } from './Logo';

// Reusable Icon component to match legacy usage if needed, 
// but here we use direct lucide imports for better performance
const Icon = ({ name, size = 18, className = "" }) => {
    // This is a simplified version for the modular component
    return <BookOpen size={size} className={className} />;
};

const SystemSyllabus = ({ user, update, log }) => {
    const defaultProtocols = ['GATE', 'PLACEMENT', 'INTERVIEW'];
    const [exams, setExams] = useState(() => {
        try {
            const saved = localStorage.getItem('velosify_exams');
            return saved ? JSON.parse(saved) : defaultProtocols;
        } catch (e) { return defaultProtocols; }
    });

    const [mode, setMode] = useState('GATE');

    useEffect(() => {
        localStorage.setItem('velosify_exams', JSON.stringify(exams));
    }, [exams]);

    const [showExamModal, setShowExamModal] = useState(false);
    const [newExamName, setNewExamName] = useState("");

    const handleCreateExam = (e) => {
        e.preventDefault();
        if (!newExamName.trim()) return;
        const name = newExamName.trim().toUpperCase();
        if (!exams.includes(name)) {
            setExams(prev => [...prev, name]);
            setMode(name);
        } else {
            setMode(name);
        }
        setNewExamName("");
        setShowExamModal(false);
    };

    const handleDeleteExam = (examToDelete, e) => {
        e.stopPropagation();
        if (defaultProtocols.includes(examToDelete)) return;
        if (window.confirm(`Delete protocol ${examToDelete}? This cannot be undone.`)) {
            const newExams = exams.filter(e => e !== examToDelete);
            setExams(newExams);
            if (mode === examToDelete) setMode(newExams[0] || 'GATE');
        }
    };

    const [expandedSubjectId, setExpandedSubjectId] = useState(null);
    const [customTopic, setCustomTopic] = useState({ subject: '', topic: '' });

    const getTemplateData = () => ({
        GATE: [
            { id: 'g1', name: 'Engineering Mathematics', topics: ['Linear Algebra', 'Calculus', 'Probability', 'Discrete Mathematics'] },
            { id: 'g2', name: 'Digital Logic', topics: ['Boolean Algebra', 'Combinational Circuits', 'Sequential Circuits', 'Number Systems'] },
            { id: 'g3', name: 'Computer Organization', topics: ['Machine Instructions', 'Pipelining', 'Memory Hierarchy', 'I/O Organization'] },
            { id: 'g4', name: 'Data Structures & Algorithms', topics: ['Arrays', 'Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Sorting & Searching'] },
            { id: 'g5', name: 'Theory of Computation', topics: ['Regular Expressions', 'Context-Free Grammars', 'Turing Machines', 'Undecidability'] },
            { id: 'g6', name: 'Compiler Design', topics: ['Lexical Analysis', 'Parsing', 'Syntax Directed Translation', 'Code Optimization'] },
            { id: 'g7', name: 'Operating Systems', topics: ['Processes & Threads', 'CPU Scheduling', 'Deadlocks', 'Memory Management'] },
            { id: 'g8', name: 'Database Management', topics: ['ER-Model', 'SQL', 'Normalization', 'Transactions', 'Indexing'] },
            { id: 'g9', name: 'Computer Networks', topics: ['OSI Model', 'TCP/IP', 'Subnetting', 'Routing Algorithms', 'Application Layer'] }
        ],
        PLACEMENT: [
            { id: 'p1', name: 'Data Structures (Coding)', topics: ['Arrays & Strings', 'Linked List Manipulation', 'Tree Traversals', 'Graph BFS/DFS'] },
            { id: 'p2', name: 'Algorithms', topics: ['Dynamic Programming (DP)', 'Greedy Algorithms', 'Backtracking', 'Bit Manipulation'] },
            { id: 'p3', name: 'Aptitude & Logic', topics: ['Time & Work', 'Profit & Loss', 'Permutations & Combinations', 'Data Interpretation'] },
            { id: 'p4', name: 'CS Fundamentals', topics: ['OS Concepts', 'DBMS SQL Queries', 'CN Basics', 'OOPs Concepts'] }
        ],
        INTERVIEW: [
            { id: 'i1', name: 'HR Round Prep', topics: ['Tell me about yourself', 'Strengths & Weaknesses', 'Where do you see yourself in 5 years?', 'Why should we hire you?'] },
            { id: 'i2', name: 'Behavioral Questions', topics: ['Handling Conflict', 'Leadership Experience', 'Failure & Learning', 'Teamwork Situations'] },
            { id: 'i3', name: 'Project Discussions', topics: ['Project Architecture', 'Challenges Faced', 'Tech Stack Justification', 'Future Improvements'] }
        ]
    });

    const [syllabusState, setSyllabusState] = useState(user?.syllabusTracker || {});

    useEffect(() => {
        if (user && JSON.stringify(user.syllabusTracker) !== JSON.stringify(syllabusState)) {
            update({ ...user, syllabusTracker: syllabusState });
        }
    }, [syllabusState]);

    const displayData = useMemo(() => {
        const templates = getTemplateData()[mode] || [];
        const custom = (user?.customSyllabus || []).filter(item => item.mode === mode);

        return [...templates, ...custom].map(subject => {
            const trackedSubject = syllabusState[subject.id] || {};
            const hydratedTopics = subject.topics.map((t, idx) => {
                const tTitle = typeof t === 'string' ? t : t.title || t.name;
                const tId = typeof t === 'object' && t.id ? t.id : `${subject.id}_t${idx}`;
                return {
                    id: tId,
                    title: tTitle,
                    status: trackedSubject[tId] || 'not-started'
                };
            });

            const total = hydratedTopics.length;
            const done = hydratedTopics.filter(t => t.status === 'done').length;
            const progress = total === 0 ? 0 : Math.round((done / total) * 100);

            return { ...subject, progress, topics: hydratedTopics };
        });
    }, [mode, syllabusState, user?.customSyllabus]);

    const handleStatusChange = (subjectId, topicId, newStatus) => {
        setSyllabusState(prev => ({
            ...prev,
            [subjectId]: {
                ...(prev[subjectId] || {}),
                [topicId]: newStatus
            }
        }));
        if (newStatus === 'done' && log) log();
    };

    const handleAddTopic = (e) => {
        e.preventDefault();
        if (!customTopic.subject) return;

        const newSubject = {
            id: `custom_${Date.now()}`,
            name: customTopic.subject,
            topics: customTopic.topic ? [{ id: `ct_${Date.now()}`, title: customTopic.topic }] : [],
            mode: mode
        };

        if (user) {
            update({ ...user, customSyllabus: [...(user.customSyllabus || []), newSubject] });
        }
        setCustomTopic({ subject: '', topic: '' });
    };

    const handleDeleteModule = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Delete this module and all its contents?")) {
            const newCustom = (user?.customSyllabus || []).filter(s => s.id !== id);
            update({ ...user, customSyllabus: newCustom });
        }
    };

    const toggleAccordion = (id) => {
        setExpandedSubjectId(expandedSubjectId === id ? null : id);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Logo className="w-10 h-10 text-white" />
                        <h1 className="text-4xl font-black tracking-tighter text-white">
                            System Syllabus
                        </h1>
                    </div>
                    <p className="text-slate-400 mt-2 font-mono text-xs">KNOWLEDGE GRAPH // {mode} PROTOCOL</p>
                </div>

                <div className="flex items-center gap-2 max-w-full overflow-hidden">
                    <div className="flex-1 overflow-x-auto flex gap-2 pb-2 px-1">
                        {exams.map(m => (
                            <div
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap flex items-center gap-3 flex-shrink-0 cursor-pointer border ${mode === m ? 'bg-brand-500 text-white border-brand-500 shadow-lg' : 'bg-[#0f172a]/60 border-white/5 text-slate-400 hover:text-white hover:border-brand-500/50'}`}
                            >
                                <span>{m}</span>
                                {!defaultProtocols.includes(m) && (
                                    <button
                                        onClick={(e) => handleDeleteExam(m, e)}
                                        className="p-1.5 rounded-md text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-70 hover:opacity-100"
                                    >
                                        <Trash size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowExamModal(true)}
                        className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-brand-400 hover:border-brand-500/50 transition-all flex-shrink-0 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                    >
                        <Plus size={14} /> <span>Create</span>
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {displayData.map((item) => (
                    <div key={item.id} className="group overflow-hidden bg-[#0f172a]/60 backdrop-blur-md border border-white/5 hover:border-brand-500/30 rounded-xl transition-all duration-300">
                        <div className="p-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                <div className="w-full md:w-1/4">
                                    <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                                    <p className="text-[10px] text-slate-500 font-mono truncate">{item.topics.length} SUB-MODULES</p>
                                </div>

                                <div className="flex-1 w-full flex items-center gap-4">
                                    <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-600 to-cyan-400 relative transition-all duration-1000 ease-out"
                                            style={{ width: `${item.progress}%` }}
                                        >
                                            <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex items-center justify-between gap-4">
                                    <span className="font-mono font-bold text-brand-400 text-sm w-12 text-right">{item.progress}%</span>

                                    <div className="flex items-center gap-2">
                                        {item.id.toString().startsWith('custom_') && (
                                            <button
                                                onClick={(e) => handleDeleteModule(item.id, e)}
                                                className="p-2 rounded-lg text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all border border-transparent hover:border-red-500/20"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => toggleAccordion(item.id)}
                                            className={`px-4 py-2 border rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2
                                                ${expandedSubjectId === item.id ? 'bg-brand-500 text-white border-brand-500' : 'bg-white/5 hover:bg-brand-500 hover:text-white border-white/10'}
                                            `}
                                        >
                                            {expandedSubjectId === item.id ? 'CLOSE' : 'ACCESS'} <ChevronRight size={12} className={expandedSubjectId === item.id ? "rotate-90 transition-transform" : "transition-transform"} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedSubjectId === item.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden bg-black/40 border-t border-white/5"
                                >
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {item.topics.map((t) => (
                                            <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                <span className="text-xs font-medium text-slate-300">{t.title}</span>
                                                <div className="flex gap-1 bg-black/50 rounded-lg p-1">
                                                    {[
                                                        { v: 'not-started', l: '🔴' },
                                                        { v: 'in-progress', l: '🟡' },
                                                        { v: 'done', l: '🟢' }
                                                    ].map(opt => (
                                                        <button
                                                            key={opt.v}
                                                            onClick={() => handleStatusChange(item.id, t.id, opt.v)}
                                                            className={`w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/10 ${t.status === opt.v ? 'bg-white/10 scale-110' : 'opacity-40 grayscale'}`}
                                                            title={opt.v.replace('-', ' ')}
                                                        >
                                                            <span className="text-xs">{opt.l}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t border-white/5 pt-8">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Extend Knowledge Base</h3>
                <form onSubmit={handleAddTopic} className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col md:flex-row gap-2">
                    <input
                        value={customTopic.subject}
                        onChange={e => setCustomTopic({ ...customTopic, subject: e.target.value })}
                        placeholder="Subject Name"
                        className="bg-transparent px-4 py-2 text-sm text-white outline-none flex-1 placeholder:text-slate-600"
                    />
                    <div className="w-px bg-white/10 hidden md:block"></div>
                    <input
                        value={customTopic.topic}
                        onChange={e => setCustomTopic({ ...customTopic, topic: e.target.value })}
                        placeholder="Sub-topic (Optional)"
                        className="bg-transparent px-4 py-2 text-sm text-white outline-none flex-1 placeholder:text-slate-600"
                    />
                    <button type="submit" className="px-6 py-2 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-lg text-xs font-bold uppercase hover:bg-brand-500 hover:text-white transition-all">
                        + Add Module
                    </button>
                </form>
            </div>

            <AnimatePresence>
                {showExamModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0c0c12] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative"
                        >
                            <button onClick={() => setShowExamModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={18} /></button>
                            <h3 className="text-lg font-bold text-white mb-1">Initialize Protocol</h3>
                            <p className="text-xs text-slate-500 mb-6">Create a new container for logic modules.</p>
                            <form onSubmit={handleCreateExam}>
                                <input
                                    autoFocus
                                    value={newExamName}
                                    onChange={e => setNewExamName(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mb-4 outline-none focus:border-brand-500 transition-colors placeholder:text-slate-600 font-mono uppercase"
                                    placeholder="PROTOCOL NAME (E.G. UPSC)"
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowExamModal(false)}
                                        className="px-4 py-2 text-slate-400 text-xs font-bold hover:text-white transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newExamName.trim()}
                                        className="px-6 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all uppercase text-xs tracking-widest"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SystemSyllabus;
