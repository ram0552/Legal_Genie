import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LawLibrary from '../components/LawLibrary';
import SemanticSearch from '../components/SemanticSearch';
import { Search, Sparkles, FolderOpen, Zap, Shield } from 'lucide-react';

export default function Library() {
    const location = useLocation();
    const [showSearch, setShowSearch] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (location.state?.focusSearch) {
            setShowSearch(true);
        }
        if (location.state?.message) {
            setMessage(location.state.message);
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-12 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/5 pb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary-500/10 rounded-lg">
                                <FolderOpen className="w-5 h-5 text-primary-400" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Repository</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Law <span className="text-primary-500">Library</span>
                        </h1>
                        <p className="text-slate-400 mt-3 text-lg font-medium max-w-md">
                            Manage and research your court judgments with deep-learning precision.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowSearch(true)}
                        className="group relative flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Semantic Search
                    </button>
                </div>

                {message && (
                    <div className="mb-8 p-5 bg-slate-900/50 backdrop-blur-xl border border-primary-500/20 rounded-2xl flex items-center gap-4 text-primary-300 animate-slideIn">
                        <div className="p-2 bg-primary-500/20 rounded-xl">
                            <Zap className="w-5 h-5 text-primary-400 animate-pulse" />
                        </div>
                        <p className="font-bold tracking-tight">{message}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 animate-fadeIn">
                    <LawLibrary inverse />
                </div>
            </div>

            {/* Semantic Search Modal */}
            {showSearch && (
                <SemanticSearch onClose={() => setShowSearch(false)} />
            )}
        </div>
    );
}
