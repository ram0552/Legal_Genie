import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, User, Bot, X } from 'lucide-react';
import api from '../services/api';

export default function ChatWithCase({ caseId, caseName }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Add welcome message on mount
    useEffect(() => {
        setMessages([{
            role: 'ai',
            content: `Hello! I'm your legal research assistant. Ask me anything about "${caseName || 'this case'}". I'll answer based only on the case document, with paragraph citations where applicable.`
        }]);
    }, [caseName]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await api.chatWithCase(caseId, userMessage);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: response.data.answer
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Sorry, I encountered an error: ${error.message}`,
                error: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickQuestions = [
        "What are the main facts?",
        "What was the verdict?",
        "What laws were cited?",
        "What is the ratio decidendi?"
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-600 to-purple-600 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h2 className="font-semibold text-white">Chat with Case</h2>
            </div>

            {/* Quick Questions */}
            <div className="px-4 py-2 bg-violet-50 border-b border-violet-100 flex gap-2 overflow-x-auto">
                {quickQuestions.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => setInput(q)}
                        className="px-3 py-1 bg-white text-violet-600 text-xs rounded-full border border-violet-200 hover:bg-violet-100 whitespace-nowrap transition-colors"
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                    >
                        <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                    ? 'bg-primary-500'
                                    : msg.error
                                        ? 'bg-red-500'
                                        : 'bg-violet-500'
                                }`}>
                                {msg.role === 'user'
                                    ? <User className="w-4 h-4 text-white" />
                                    : <Bot className="w-4 h-4 text-white" />
                                }
                            </div>
                            <div className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'} ${msg.error ? 'bg-red-50 text-red-800' : ''}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-fadeIn">
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="chat-bubble ai flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                                <span className="text-sm text-slate-500">Analyzing case...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question about this case..."
                        rows={1}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                    Answers are grounded in case text with paragraph citations
                </p>
            </div>
        </div>
    );
}
