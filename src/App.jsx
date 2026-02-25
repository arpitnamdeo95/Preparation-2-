import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    LayoutDashboard,
    Map,
    BookOpen,
    Menu,
    X,
    BarChart3,
    Compass
} from 'lucide-react';
import { supabase } from './lib/supabase';
import Sidebar from './components/Layout/Sidebar';

// Lazy load heavy components for better initial load performance
const RoadmapHub = lazy(() => import('./components/Roadmap/RoadmapHub'));
const SystemSyllabus = lazy(() => import('./components/SystemSyllabus'));

// Bridge for legacy icon usage (optimized)
const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
        'zap': Zap,
        'layout-dashboard': LayoutDashboard,
        'compass': Compass,
        'map': Map,
        'book-open': BookOpen,
        'bar-chart': BarChart3
    };
    const LucideIcon = icons[name] || Zap;
    return <LucideIcon size={size} className={className} />;
};

const LoadingFallback = () => (
    <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Syncing Data...</span>
    </div>
);

const App = () => {
    const [session, setSession] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [tab, setTab] = useState('roadmaps');
    const [isExpanded, setIsExpanded] = useState(true);

    // Persistence Logic
    const storageKey = useMemo(() => session?.user?.id ? `velosify_user_${session.user.id}` : 'velosify_guest', [session]);
    const [data, setData] = useState(() => {
        const base = {
            themeColor: 'violet',
            goalName: 'GATE 2026',
            examDate: '2026-02-01',
            totalTime: 0,
            syllabus: [],
            kanban: { todo: [], doing: [], done: [] },
            flashcards: [],
            resources: [],
            dsa: [],
            focus: { timeLeft: 1500, initialTime: 1500, isActive: false },
            roadmapProgress: {}
        };
        const s = localStorage.getItem(storageKey);
        if (s) {
            try { return { ...base, ...JSON.parse(s) }; } catch (e) { return base; }
        }
        return base;
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(data));
    }, [data, storageKey]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoadingAuth(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
    };

    if (loadingAuth) return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#05050a]">
            <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-brand-500 animate-[spin_3s_linear_infinite] shadow-[0_0_50px_rgba(var(--brand-500),0.4)] flex items-center justify-center">
                    <div className="w-10 h-10 bg-black rounded-xl" />
                </div>
                <div className="text-brand-400 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">Initializing Neural Link...</div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#05050a] text-slate-200 selection:bg-brand-500/30">
            {/* Background Aesthetic */}
            <div className="scifi-grid" />

            <Sidebar
                tab={tab}
                setTab={setTab}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                logout={logout}
            />

            <main className="flex-1 overflow-y-auto relative custom-scrollbar flex flex-col">
                {/* HUD HEADER */}
                <header className="sticky top-0 z-30 p-4 md:p-8 flex justify-between items-center pointer-events-none shrink-0">
                    <div className="bg-black/80 backdrop-blur-xl border border-white/5 rounded-2xl px-4 py-2 md:px-6 md:py-3 pointer-events-auto shadow-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">System Online</span>
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                        <div className="bg-black/80 backdrop-blur-xl border border-white/5 rounded-2xl px-4 py-2 md:px-6 md:py-3 shadow-2xl flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Global Sync</div>
                                <div className="text-[10px] md:text-sm font-black text-white">74.2%</div>
                            </div>
                            <div className="w-12 md:w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "74.2%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-brand-500 shadow-[0_0_10px_rgba(var(--brand-500),0.5)]"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT AREA */}
                <div className="flex-1 px-4 md:px-8 pb-8 pt-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="w-full h-full"
                        >
                            <Suspense fallback={<LoadingFallback />}>
                                {tab === 'roadmaps' && <RoadmapHub />}
                                {tab === 'syllabus' && (
                                    <SystemSyllabus
                                        user={data}
                                        update={setData}
                                        log={() => console.log('Knowledge Update Logged')}
                                    />
                                )}
                                {tab === 'dashboard' && (
                                    <div className="py-20 text-center flex flex-col items-center gap-6">
                                        <div className="w-24 h-24 rounded-[2.5rem] bg-white/2 border border-white/5 flex items-center justify-center text-slate-800">
                                            <Icon name="bar-chart" size={48} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Core Module Analysis</h3>
                                            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Migration in Progress // 0x7F4E Connected</p>
                                        </div>
                                        <button
                                            onClick={() => setTab('roadmaps')}
                                            className="px-8 py-3 bg-brand-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-400 transition-all"
                                        >
                                            Return to Active Track
                                        </button>
                                    </div>
                                )}
                            </Suspense>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default App;
