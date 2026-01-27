import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText, Calendar, Building2, Scale,
    Sparkles, MessageCircle, Shield,
    ChevronRight, ArrowLeft, Loader2,
    Send, Bot, User, Bookmark, Share2
} from 'lucide-react';
import api from '../services/api';

export default function CaseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('text'); // text, brief, chat, counter
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [brief, setBrief] = useState(null);
    const [counterArgs, setCounterArgs] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const loadCase = async () => {
            try {
                const response = await api.getCaseById(id);
                setCaseData(response.data);
            } catch (error) {
                console.error('Error loading case:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCase();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat]);

   const generateAiBrief = async () => {
    if (brief) return;
    setAiLoading(true);
    try {
        const res = await api.generateBrief(id);

        // ✅ THIS IS THE FIX
        if (!res?.data) throw new Error('Invalid AI brief response');

        setBrief(res.data);
    } catch (err) {
        console.error('Brief error:', err);
    } finally {
        setAiLoading(false);
    }
};




    const generateCounter = async () => {
    if (counterArgs) return;
    setAiLoading(true);
    try {
        const res = await api.generateCounterArguments(id, 'defense');

        // ✅ FIX
        if (!res?.data) throw new Error('Invalid counter response');

        setCounterArgs(res.data);
    } catch (err) {
        console.error('Counter error:', err);
    } finally {
        setAiLoading(false);
    }
};



    const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || aiLoading) return;

    const userMsg = { role: 'user', content: message };
    setChat(prev => [...prev, userMsg]);
    setMessage('');
    setAiLoading(true);

    try {
        const res = await api.chatWithCase(id, message);

        // ✅ FIX
        if (!res?.data?.answer) {
            throw new Error('Invalid chat response');
        }

        setChat(prev => [
            ...prev,
            {
                role: 'assistant',
                content: res.data.answer
            }
        ]);
    } catch (err) {
        setChat(prev => [
            ...prev,
            { role: 'assistant', content: 'AI failed to respond.' }
        ]);
    } finally {
        setAiLoading(false);
    }
};


    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!caseData) return <div className="p-8 text-center">Case not found</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Case Header - Glassmorphism */}
            <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Library
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-800 leading-tight">
                                {caseData.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 mt-4 text-slate-500 text-sm font-medium">
                                <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200">
                                    <Building2 className="w-4 h-4 text-primary-500" />
                                    {caseData.court}
                                </span>
                                <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200">
                                    <Calendar className="w-4 h-4 text-primary-500" />
                                    {caseData.year}
                                </span>
                                <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200">
                                    <Scale className="w-4 h-4 text-primary-500" />
                                    {caseData.fileType?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                                <Bookmark className="w-5 h-5 text-slate-400" />
                            </button>
                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                                <Share2 className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-1 mt-8 p-1 bg-slate-100 w-fit rounded-xl border border-slate-200/50">
                        {[
                            { id: 'text', label: 'Judgment Text', icon: FileText },
                            { id: 'brief', label: 'AI Case Brief', icon: Sparkles },
                            { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
                            { id: 'counter', label: 'Strategy Room', icon: Shield }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    if (tab.id === 'brief') generateAiBrief();
                                    if (tab.id === 'counter') generateCounter();
                                }}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-white text-primary-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary-500' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Content Area */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                    {/* Main Section */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8 lg:p-12">
                            {activeTab === 'text' && (
                                <div className="prose prose-slate max-w-none">
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 flex items-center gap-3">
                                        <div className="w-1.5 h-12 bg-primary-500 rounded-full" />
                                        <p className="text-slate-600 italic leading-relaxed">
                                            The following judgment text is extracted and cleaned from the original {caseData.fileType} document.
                                        </p>
                                    </div>
                                    <div className="whitespace-pre-wrap font-serif text-lg text-slate-700 leading-loose tracking-wide">
                                        {caseData.fullText}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'brief' && (
                                <div className="space-y-8 animate-fadeIn">
                                    {aiLoading ? (
                                        <AiLoadingPlaceholder label="Generating Legal Brief..." />
                                    ) : brief ? (
                                        <div className="grid grid-cols-1 gap-8">
                                            <BriefSection
    title="Summary Table"
    caseData={caseData}
    brief={brief}
/>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <BriefCard title="Facts of the Case" content={brief.facts} icon={FileText} />
                                                <BriefCard title="Court's Verdict" content={brief.verdict} icon={Scale} variant="success" />
                                            </div>
                                            <BriefCard title="Legal Reasoning" content={brief.reasoning} icon={Sparkles} />
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                                            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-slate-800">No Brief Available</h3>
                                            <button onClick={generateAiBrief} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-xl">Generate Now</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'counter' && (
                                <div className="space-y-8 animate-fadeIn">
                                    {aiLoading ? (
                                        <AiLoadingPlaceholder label="Simulating Opposing Counsel..." />
                                    ) : counterArgs ? (
                                        <div className="space-y-8">
                                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
                                                <Shield className="w-8 h-8 text-amber-500" />
                                                <div>
                                                    <h3 className="font-bold text-amber-900">Adversary Strategy Initialized</h3>
                                                    <p className="text-amber-700 text-sm mt-1">
                                                        The AI has analyzed the judgment to find legal loopholes and alternative theories.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {counterArgs.points?.map((pt, i) => (
                                                    <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-amber-300 transition-colors">
                                                        <h4 className="font-black text-slate-900 border-b border-slate-100 pb-3 mb-3"># {i + 1} Argument</h4>
                                                        <p className="text-slate-600 text-sm leading-relaxed mb-4">{pt.argument}</p>
                                                        <div className="p-3 bg-red-50 rounded-xl text-red-700 text-xs font-semibold">
                                                            Weakness: {pt.rebuttal}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                                            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-slate-800">Ready to Strategize?</h3>
                                            <button onClick={generateCounter} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-xl">Simulate Opposition</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'chat' && (
                                <div className="flex flex-col h-[600px] animate-fadeIn">
                                    <div className="flex-1 overflow-y-auto space-y-6 pb-8">
                                        {chat.length === 0 && (
                                            <div className="text-center py-12 px-8 bg-primary-50 rounded-3xl border border-primary-100 mb-8">
                                                <Bot className="w-12 h-12 text-primary-500 mx-auto mb-6 bg-white p-2 rounded-2xl shadow-md" />
                                                <h3 className="text-xl font-black text-slate-800 mb-2">LegalGenie Assistant</h3>
                                                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                                                    Ask anything about this case. I have read the full judgment and will cite sources.
                                                </p>
                                                <div className="flex flex-wrap justify-center gap-2 mt-8">
                                                    {['Key legal issues?', 'What was the final verdict?', 'Primary citations?'].map(q => (
                                                        <button key={q} onClick={() => setMessage(q)} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold hover:border-primary-300 hover:bg-primary-50 transition-all shadow-sm">{q}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {chat.map((msg, i) => (
                                            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary-600' : 'bg-white border border-slate-200'
                                                    }`}>
                                                    {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-primary-600" />}
                                                </div>
                                                <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                                    }`}>
                                                    {msg.content}
                                                    {msg.citations && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sources Found</p>
                                                            <div className="space-y-2">
                                                                {msg.citations.map((c, ci) => (
                                                                    <div key={ci} className="p-2 bg-slate-50 rounded-xl text-slate-600 text-xs border border-slate-200/50">
                                                                        "{c.text.substring(0, 100)}..."
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Chat Input */}
                                    <form onSubmit={handleSendMessage} className="relative mt-auto border-t border-slate-100 pt-6">
                                        <input
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Ask a question about this judgment..."
                                            className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-300 focus:bg-white transition-all text-sm font-medium"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim() || aiLoading}
                                            className="absolute right-2 top-[34px] -translate-y-1/2 p-2.5 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-900/30 hover:bg-primary-500 disabled:bg-slate-300 transition-all active:scale-95"
                                        >
                                            {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Quick Facts */}
                    <div className="w-full md:w-80 bg-slate-50 border-l border-slate-100 p-8 pt-12">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-between">
                            Legal Intelligence
                            <Sparkles className="w-3 h-3" />
                        </h3>
                        <div className="space-y-8">
                            <SidebarStat label="Processing Status" value={caseData.status} icon={Loader2} isStatus />
                            <SidebarStat label="Text Length" value={`${caseData.fullText?.length.toLocaleString()} chars`} icon={FileText} />
                            <SidebarStat label="Chunks Indexed" value={caseData.chunkCount || 'N/A'} icon={MessageCircle} />

                            <div className="pt-8 mt-8 border-t border-slate-200">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Citations Found</h3>
                                <div className="flex flex-wrap gap-2">
                                    {caseData.citations?.map((cite, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                                            {cite.reference}
                                        </span>
                                    ))}
                                    {(!caseData.citations || caseData.citations.length === 0) && (
                                        <p className="text-slate-400 text-xs italic">No static citations found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components for Cleaner Main UI
function SidebarStat({ label, value, icon: Icon, isStatus }) {
    return (
        <div className="group">
            <p className="text-[10px] font-bold text-slate-400 mb-1 group-hover:text-primary-500 transition-colors uppercase">{label}</p>
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-xs group-hover:border-primary-100 transition-colors">
                    <Icon className={`w-3.5 h-3.5 ${isStatus && value === 'completed' ? 'text-green-500' : 'text-slate-400'}`} />
                </div>
                <span className={`text-sm font-black ${isStatus && value === 'completed' ? 'text-green-600' : 'text-slate-700'}`}>
                    {value}
                </span>
            </div>
        </div>
    );
}

function BriefCard({ title, content, icon: Icon, variant = 'default' }) {
    const variants = {
        default: 'border-slate-200 bg-white',
        success: 'border-green-100 bg-green-50/30'
    };
    return (
        <div className={`p-6 rounded-3xl border-2 ${variants[variant]} shadow-sm`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-xl">
                    <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h4 className="font-black text-slate-800 uppercase tracking-tight">{title}</h4>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
        </div>
    );
}

function BriefSection({ title, caseData, brief }) {
    const rows = [
        {
            label: 'Court Name',
            value: caseData.court
        },
        {
            label: 'Year',
            value: caseData.year
        },
        {
            label: 'Principal Rule',
            value: "Judicial decisions must be based on law, evidence, and reasoned analysis."
        }
    ];

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                {title}
            </h4>

            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-600 border-b border-slate-100">
                                Key Identifier
                            </th>
                            <th className="px-6 py-4 font-bold text-slate-600 border-b border-slate-100">
                                Case-Specific Insight
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50">
                        {rows.map(row => (
                            <tr key={row.label} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-black text-slate-800">
                                    {row.label}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


function AiLoadingPlaceholder({ label }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 bg-primary-50 rounded-3xl border border-dashed border-primary-200 animate-pulse">
            <Sparkles className="w-12 h-12 text-primary-300 animate-bounce mb-6" />
            <p className="text-slate-500 font-bold text-lg">{label}</p>
            <p className="text-slate-400 text-sm mt-2">Consulting with AI models...</p>
        </div>
    );
}
