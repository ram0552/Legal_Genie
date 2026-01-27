import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    FileText, Calendar, Building2,
    ChevronRight, Loader2, Filter,
    Gavel, Hash, Activity
} from 'lucide-react';
import { useCases } from '../context/CaseContext';

export default function LawLibrary({ isCompact = false, inverse = true }) {
    const { cases, loading, error, fetchCases } = useCases();
    const [filter, setFilter] = useState({ court: '', year: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCases(filter);
    }, [fetchCases, filter]);

    const courts = [...new Set(cases.map(c => c.court))];
    const years = [...new Set(cases.map(c => c.year))].sort((a, b) => b - a);

    if (loading && cases.length === 0) {
        return (
            <div className="p-20 text-center">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse" />
                    <Loader2 className="w-12 h-12 animate-spin text-primary-500 relative z-10" />
                </div>
                <p className="font-black text-xs uppercase tracking-[0.3em] mt-6 text-slate-500">Syncing Intelligence...</p>
            </div>
        );
    }

    return (
        <div className={`rounded-[40px] shadow-2xl overflow-hidden border border-white/5 bg-slate-900/30 backdrop-blur-md`}>
            {/* Header */}
            {!isCompact && (
                <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/[0.02]">
                    <div>
                        <h2 className="text-3xl font-black flex items-center gap-4 text-white">
                            <div className="p-2.5 bg-primary-600/20 rounded-2xl border border-primary-500/20">
                                <Gavel className="w-7 h-7 text-primary-500" />
                            </div>
                            Case Dossier
                        </h2>
                        <div className="flex items-center gap-2 mt-3 p-1 pl-3 pr-4 bg-emerald-500/5 border border-emerald-500/10 rounded-full w-fit">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-500/80">
                                {cases.length} validated judgments currently indexed
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <select
                                value={filter.court}
                                onChange={(e) => setFilter(f => ({ ...f, court: e.target.value }))}
                                className="pl-12 pr-6 py-3 bg-slate-800/50 border border-white/10 rounded-2xl text-xs font-black text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none appearance-none min-w-[220px] transition-all hover:bg-slate-800"
                            >
                                <option value="">All Jurisdictions</option>
                                {courts.map(court => (
                                    <option key={court} value={court}>{court}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <select
                                value={filter.year}
                                onChange={(e) => setFilter(f => ({ ...f, year: e.target.value }))}
                                className="pl-12 pr-6 py-3 bg-slate-800/50 border border-white/10 rounded-2xl text-xs font-black text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none appearance-none min-w-[140px] transition-all hover:bg-slate-800"
                            >
                                <option value="">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Case List */}
            <div className={`divide-y divide-white/5`}>
                {cases.map((caseItem) => (
                    <div
                        key={caseItem._id}
                        onClick={() => navigate(`/case/${caseItem._id}`)}
                        className="group relative p-8 transition-all cursor-pointer hover:bg-white/[0.03]"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg flex items-center gap-1.5">
                                        <Hash className="w-3 h-3" />
                                        ID: {caseItem._id.toString().slice(-6).toUpperCase()}
                                    </span>
                                    {caseItem.status === 'completed' && (
                                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg flex items-center gap-1.5">
                                            <Activity className="w-3 h-3" />
                                            Indexed
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-black text-white group-hover:text-primary-400 transition-colors leading-tight truncate">
                                    {caseItem.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-6 mt-6">
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs group-hover:text-indigo-400 transition-colors">
                                        <Building2 className="w-4 h-4" />
                                        {caseItem.court}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs group-hover:text-amber-400 transition-colors">
                                        <Calendar className="w-4 h-4" />
                                        {caseItem.year}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-500 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-500 transition-all group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
