import { useNavigate, Link } from 'react-router-dom';
import {
    Scale, Search, FileText, Sparkles,
    MessageCircle, Shield, ArrowRight, Plus,
    Zap, Activity, Database, Globe
} from 'lucide-react';
import LawLibrary from '../components/LawLibrary';

export default function Dashboard() {
    const navigate = useNavigate();

    const features = [
        {
            icon: Search,
            title: 'Semantic Search',
            description: 'Locate precedents via intent-based legal reasoning.',
            color: 'from-blue-600 to-indigo-600',
            action: () => navigate('/library', { state: { focusSearch: true } })
        },
        {
            icon: Sparkles,
            title: 'AI Case Briefs',
            description: 'Automated extraction of facts, issues, and verdict.',
            color: 'from-purple-600 to-pink-600',
            action: () => navigate('/library', { state: { message: 'Select a case to generate an AI brief' } })
        },
        {
            icon: MessageCircle,
            title: 'Chat with Cases',
            description: 'Direct interactive dialogue grounded in judgment text.',
            color: 'from-violet-600 to-purple-600',
            action: () => navigate('/library', { state: { message: 'Select a case to start an AI chat session' } })
        },
        {
            icon: Shield,
            title: 'Strategy Room',
            description: 'Simulate adversary theories and rebuttals instantly.',
            color: 'from-amber-600 to-orange-600',
            action: () => navigate('/library', { state: { message: 'Select a case to simulate opposing counsel' } })
        }
    ];

    const stats = [
        { label: 'Active Judgments', value: '1,248', icon: Database, color: 'text-blue-500' },
        { label: 'AI Operations', value: '24.5k', icon: Zap, color: 'text-yellow-500' },
        { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-green-500' },
        { label: 'Jurisdictions', value: '12', icon: Globe, color: 'text-indigo-500' }
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200">
            {/* Super Premium Hero Section */}
            <div className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-primary-400 text-xs font-black tracking-widest uppercase mb-8 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            Next-Gen Legal Intelligence
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                            Decode the Law<br />With <span className="text-primary-500">Precision.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
                            Transforming scattered court judgments into actionable legal insights. LegalGenie uses advanced RAG to ensure every AI thought is grounded in fact.
                        </p>

                        <div className="flex flex-wrap justify-center gap-5">
                            <Link
                                to="/upload"
                                className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-3"
                            >
                                <Plus className="w-5 h-5" />
                                Start Research
                            </Link>
                            <Link
                                to="/library"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black transition-all backdrop-blur-xl flex items-center gap-3"
                            >
                                <FileText className="w-5 h-5" />
                                Browse Library
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Stats Overlay */}
            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl group hover:border-primary-500/50 transition-all duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 bg-slate-800 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-green-500 text-[10px] font-black uppercase">Active</span>
                            </div>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Intelligence Suite */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-primary-500" />
                                Intelligence Suite
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">Advanced AI modules specialized for legal document analysis.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, i) => (
                                <button
                                    key={i}
                                    onClick={feature.action}
                                    className="relative group overflow-hidden bg-slate-900/40 border border-white/5 rounded-[32px] p-8 text-left hover:border-white/20 transition-all duration-500"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity`} />

                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-all duration-500`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>

                                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-primary-400 transition-colors flex items-center justify-between">
                                        {feature.title}
                                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                                    </h3>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                                        {feature.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-primary-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Launch Module <Zap className="w-3 h-3" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live Library Feed */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                                <Database className="w-6 h-6 text-primary-500" />
                                Dossier Feed
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">Recent judgments integrated into the system.</p>
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-[32px] overflow-hidden p-2 backdrop-blur-xl">
                            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                <LawLibrary isCompact inverse />
                            </div>
                            <div className="p-6 border-t border-white/5 flex items-center justify-between">
                                <p className="text-xs text-slate-500 font-bold uppercase">System Fully Indexed</p>
                                <Link to="/library" className="text-primary-500 text-xs font-black hover:text-primary-400 transition-colors">View Archve →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
