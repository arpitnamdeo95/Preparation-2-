import React, { useState } from 'react';
import RoadmapViewer from './RoadmapViewer';
import BlueprintView from './BlueprintView';
import csData from '../../data/roadmaps/cs_mastery.json';
import gateData from '../../data/roadmaps/gate.json';
import salesData from '../../data/roadmaps/sales.json';
import coreData from '../../data/roadmaps/btech_core.json';
import { Map, Code, BookOpen, LayoutDashboard, Compass, Download, ShieldCheck } from 'lucide-react';
import { generateMasterBlueprintPDF } from '../../utils/MasterPDFGenerator';

const ROADMAP_METADATA = [
    {
        id: "cs-mastery",
        title: "CS Mastery",
        desc: "Strategic 12-month blueprint for high-tier software engineering roles.",
        icon: <Code size={24} />,
        color: "from-blue-500/20 to-brand-500/10",
        data: csData
    },
    {
        id: "gate-strategy",
        title: "GATE Protocol",
        desc: "Advanced subject mastery and mistaking tracking for competitive edge.",
        icon: <BookOpen size={24} />,
        color: "from-emerald-500/20 to-teal-500/10",
        data: gateData
    },
    {
        id: "sales-growth",
        title: "Sales & Growth",
        desc: "Revenue-focused roadmap covering funnel optimization and CRM mastery.",
        icon: <Compass size={24} />,
        color: "from-amber-500/20 to-orange-500/10",
        data: salesData
    },
    {
        id: "btech-core",
        title: "B.Tech Core",
        desc: "Bridging the gap between software and core engineering infrastructure.",
        icon: <LayoutDashboard size={24} />,
        color: "from-rose-500/20 to-red-500/10",
        data: coreData
    }
];

const RoadmapHub = () => {
    const [view, setView] = useState('hub');
    const [activeRoadmap, setActiveRoadmap] = useState(null);

    if (view === 'blueprint' && activeRoadmap) {
        return (
            <BlueprintView
                data={activeRoadmap.data}
                onBack={() => setView('hub')}
            />
        );
    }

    if (view === 'roadmap' && activeRoadmap) {
        return (
            <RoadmapViewer
                data={activeRoadmap.data}
                onBack={() => setView('hub')}
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-16 animate-fade-in py-12 px-6">
            <div className="flex flex-col gap-6 max-w-3xl">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-brand-500/5 text-brand-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-brand-500/10">
                        Strategic Career Systems
                    </span>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight uppercase">
                    Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400">Roadmaps</span>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                    Our high-value blueprints are designed by senior engineers and industry mentors.
                    Each path provides a strategic progression model, skill stacking logic, and measurable milestones.
                </p>
            </div>

            {/* Master Blueprint Feature Card */}
            <div className="relative group cursor-pointer" onClick={() => generateMasterBlueprintPDF("Velosify Elite User")}>
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative p-8 rounded-3xl border border-white/10 bg-[#0a0a14] flex flex-col md:flex-row items-center justify-between gap-8 h-full overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <ShieldCheck size={120} />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                            <Download size={32} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[8px] font-black uppercase tracking-widest border border-brand-500/30">
                                    Premium Access
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    40+ Page Expert Guide
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Complete Career Blueprint <span className="text-brand-400">2026</span></h3>
                            <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                                Download the unified 40-page master document covering CS protocols, GATE strategies, Sales frameworks, and Core Engineering industry transitions.
                            </p>
                        </div>
                    </div>

                    <button className="flex-shrink-0 px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-400 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                        Generate PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {ROADMAP_METADATA.map((roadmap) => (
                    <div
                        key={roadmap.id}
                        onClick={() => {
                            setActiveRoadmap(roadmap);
                            setView('roadmap');
                        }}
                        className="group relative overflow-hidden rounded-3xl border border-white/5 bg-surface-900/40 transition-all hover:border-brand-500/30 hover:bg-white/[0.02] cursor-pointer active:scale-[0.99] shadow-xl"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${roadmap.color} opacity-20 group-hover:opacity-30 transition-opacity`} />

                        <div className="relative p-8 flex items-start gap-8">
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                {roadmap.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{roadmap.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">{roadmap.desc}</p>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveRoadmap(roadmap);
                                            setView('blueprint');
                                        }}
                                        className="px-4 py-2 bg-brand-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/20"
                                    >
                                        Execute Blueprint
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveRoadmap(roadmap);
                                            setView('roadmap');
                                        }}
                                        className="px-4 py-2 bg-white/5 text-slate-400 border border-white/10 font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Visual Graph
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium Note */}
            <div className="p-8 rounded-[2rem] border border-white/5 bg-gradient-to-r from-brand-500/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Advanced Resource Integration</h4>
                    <p className="text-xs text-slate-500">All blueprints include curated resources, interview prep, and project blueprints.</p>
                </div>
                <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    Version 2.4.0 Build Stable
                </div>
            </div>
        </div>
    );
};


export default RoadmapHub;
