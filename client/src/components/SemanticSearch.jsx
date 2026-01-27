import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, FileText, Calendar, Building2, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function SemanticSearch({ onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        setSearched(true);

        try {
            const response = await api.semanticSearch(query);
            setResults(response.results || []);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleResultClick = (caseId) => {
        onClose();
        navigate(`/case/${caseId}`);
    };

    const exampleQueries = [
        "cases involving medical negligence",
        "property dispute between family members",
        "violation of fundamental rights",
        "Section 302 IPC murder cases"
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-start justify-center p-4 pt-20">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
                    {/* Search Header */}
                    <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 p-6">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Semantic Search</h2>
                                <p className="text-primary-100 text-sm">Find cases by meaning, not just keywords</p>
                            </div>
                        </div>

                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Describe the type of case you're looking for..."
                                className="w-full pl-12 pr-24 py-4 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-primary-300"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!query.trim() || loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                            </button>
                        </form>
                    </div>

                    {/* Example Queries */}
                    {!searched && (
                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                            <p className="text-xs text-slate-500 mb-2">Try searching for:</p>
                            <div className="flex flex-wrap gap-2">
                                {exampleQueries.map((eq, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setQuery(eq);
                                            setTimeout(() => handleSearch(), 100);
                                        }}
                                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors"
                                    >
                                        {eq}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 flex flex-col items-center justify-center text-slate-500">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-3" />
                                <p>Searching with AI...</p>
                                <p className="text-sm text-slate-400">Finding semantically similar cases</p>
                            </div>
                        ) : searched && results.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No matching cases found</p>
                                <p className="text-sm mt-1">Try different search terms</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {results.map((result) => (
                                    <button
                                        key={result._id}
                                        onClick={() => handleResultClick(result._id)}
                                        className="w-full p-4 hover:bg-slate-50 text-left transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-slate-800 group-hover:text-primary-600">
                                                    {result.title}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="w-3.5 h-3.5" />
                                                        {result.court}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {result.year}
                                                    </span>
                                                </div>
                                                {result.matchedChunk && (
                                                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                                        {result.matchedChunk}
                                                    </p>
                                                )}
                                            </div>
                                            {/* {result.relevanceScore && (
                                                <div className="ml-4 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                    {Math.round(result.relevanceScore * 100)}% match
                                                </div>
                                            )} */}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
