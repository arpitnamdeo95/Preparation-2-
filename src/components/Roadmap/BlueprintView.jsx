import React from 'react';
import { ArrowLeft, CheckCircle2, Target, Award, ShieldAlert, Rocket, BookMarked, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const BlueprintView = ({ data, onBack }) => {
    // If no full blueprint data, fallback or show simple version
    const blueprint = data.fullBlueprint || {
        title: data.title,
        intro: "Advanced strategic blueprint for professional mastery.",
        phases: data.nodes.filter(n => n.id !== 'root').map(n => ({
            name: n.data.label,
            goal: n.data.description,
            steps: n.data.details ? n.data.details.split('\n').filter(l => l.trim()).map(l => ({ title: l.replace(/^[✔-🎯]\s*/, ''), content: "" })) : []
        }))
    };

    return (
        <div className="min-h-screen bg-[#05050a] text-slate-300 font-sans selection:bg-brand-500/30">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-[#05050a]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> [ Back to Neural Link ]
                </button>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                        <FileText size={14} /> Download PDF
                    </button>
                    <span className="text-[10px] font-mono text-brand-400 animate-pulse uppercase tracking-[0.2em] hidden md:block">Live Intelligence Protocol Active</span>
                </div>
            </div>

            <main className="max-w-4xl mx-auto py-20 px-8 space-y-24">
                {/* Hero Section */}
                <header className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-widest">
                        Strategic Career Protocol v2.4
                    </div>
                    <h1 className="doc-h1">
                        {blueprint.title.split(' ').map((word, i) => i === 0 ? <span key={i} className="premium-gradient-text">{word} </span> : word + ' ')}
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed font-medium border-l-2 border-brand-500 pl-8 italic">
                        {blueprint.intro}
                    </p>
                </header>

                {/* Common Mistakes Section */}
                <section className="p-10 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 space-y-6">
                    <div className="flex items-center gap-3 text-rose-400">
                        <ShieldAlert size={24} />
                        <h3 className="text-sm font-black uppercase tracking-widest">Critical Vulnerabilities (Common Mistakes)</h3>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Engaging in 'Tutorial Hell' without implementation",
                            "Ignoring fundamental data structures for framework hype",
                            "Zero optimization of personal brand (GitHub/LinkedIn)",
                            "Lack of consistent problem-solving rhythm",
                            "Neglecting soft skills and interview psychology"
                        ].map((mistake, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-500 leading-relaxed">
                                <span className="text-rose-500/50">✕</span>
                                {mistake}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Evolution Phases */}
                <div className="space-y-32">
                    {blueprint.phases.map((phase, idx) => (
                        <motion.section
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -left-12 top-0 text-[120px] font-black text-white/[0.02] select-none leading-none">
                                0{idx + 1}
                            </div>

                            <div className="relative space-y-12">
                                <div className="space-y-4">
                                    <h2 className="doc-h2">{phase.name}</h2>
                                    <div className="flex items-center gap-3 py-2 px-4 rounded-xl bg-brand-500/5 border border-brand-500/10 w-fit">
                                        <Target size={18} className="text-brand-400" />
                                        <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Target Objective: {phase.goal}</span>
                                    </div>
                                </div>

                                <div className="grid gap-8">
                                    {phase.steps.map((step, sIdx) => (
                                        <div key={sIdx} className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brand-500/20 transition-all">
                                            <div className="flex items-start gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-brand-400 transition-colors">
                                                    <BookMarked size={20} />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{step.title}</h4>
                                                    <p className="text-slate-500 text-sm leading-relaxed">{step.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Career Progression Model */}
                {blueprint.career_progression && (
                    <section className="space-y-12 pb-20">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                                <Award className="text-brand-400" />
                                Career Progression Model
                            </h2>
                            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Standard ROI Analysis based on Global Market Trends</p>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01]">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    <tr>
                                        <th className="px-8 py-6">Maturity Level</th>
                                        <th className="px-8 py-6">Skill Stack</th>
                                        <th className="px-8 py-6 text-right">Market Valuation (EST)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {blueprint.career_progression.map((item, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6 font-bold text-white uppercase tracking-tighter italic">{item.stage}</td>
                                            <td className="px-8 py-6 text-sm text-slate-400">{item.skills}</td>
                                            <td className="px-8 py-6 text-right font-mono text-brand-400">{item.income}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Final Outcome */}
                <footer className="p-16 rounded-[4rem] bg-gradient-to-br from-brand-600 to-cyan-600 text-white space-y-10 shadow-[0_0_100px_rgba(var(--brand-600),0.2)]">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black uppercase italic leading-none">Execution Outcome</h2>
                        <p className="text-brand-100 font-medium">Following this protocol with precision guarantees elite-level positioning within 12 months.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            "Elite Fundamentals Mastery",
                            "High-Impact Project Portfolio",
                            "Placement-Ready Interview Skillset",
                            "Strategic Industry Positioning"
                        ].map((outcome, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <CheckCircle2 size={20} className="text-brand-200" />
                                <span className="text-sm font-bold uppercase tracking-tight">{outcome}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/20">
                        <div className="flex items-center gap-4">
                            <Rocket className="animate-bounce" />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em]">Ready for Liftoff?</div>
                        </div>
                        <button className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-100 transition-all active:scale-95 shadow-2xl">
                            Initialize Protocol
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default BlueprintView;
