import { useState, useRef } from 'react';
import { FileText, ZoomIn, ZoomOut, Download, ChevronUp, ChevronDown } from 'lucide-react';

export default function DocumentViewer({ fullText, title, citations = [] }) {
    const [fontSize, setFontSize] = useState(16);
    const [showCitations, setShowCitations] = useState(true);
    const contentRef = useRef(null);

    const adjustFontSize = (delta) => {
        setFontSize(prev => Math.min(24, Math.max(12, prev + delta)));
    };

    const scrollToTop = () => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        contentRef.current?.scrollTo({
            top: contentRef.current.scrollHeight,
            behavior: 'smooth'
        });
    };

    // Add paragraph numbers to text
    const formatText = (text) => {
        const paragraphs = text.split(/\n\n+/);
        return paragraphs.map((para, i) => (
            <p key={i} className="mb-4" id={`para-${i + 1}`}>
                <span className="text-xs text-slate-400 mr-2 font-mono">[{i + 1}]</span>
                {para}
            </p>
        ));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-600" />
                        <h2 className="font-semibold text-slate-800 truncate max-w-md">
                            {title || 'Case Document'}
                        </h2>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => adjustFontSize(-2)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            title="Decrease font size"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-slate-500 w-8 text-center">{fontSize}px</span>
                        <button
                            onClick={() => adjustFontSize(2)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            title="Increase font size"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <button
                            onClick={scrollToTop}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            title="Scroll to top"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                            onClick={scrollToBottom}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            title="Scroll to bottom"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Citations Bar */}
            {citations.length > 0 && (
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                    <button
                        onClick={() => setShowCitations(!showCitations)}
                        className="text-xs text-slate-500 hover:text-slate-700 mb-2"
                    >
                        {showCitations ? 'Hide' : 'Show'} Citations ({citations.length})
                    </button>
                    {showCitations && (
                        <div className="flex flex-wrap gap-1.5">
                            {citations.map((cite, i) => (
                                <span
                                    key={i}
                                    className={`citation-tag ${cite.type || 'statute'}`}
                                >
                                    {cite.reference}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Document Content */}
            <div
                ref={contentRef}
                className="flex-1 overflow-y-auto p-6"
                style={{ fontSize: `${fontSize}px` }}
            >
                {fullText ? (
                    <div className="legal-text max-w-none prose prose-slate">
                        {formatText(fullText)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <FileText className="w-16 h-16 mb-4 opacity-30" />
                        <p className="text-lg">No document selected</p>
                        <p className="text-sm mt-1">Select a case from the library to view</p>
                    </div>
                )}
            </div>
        </div>
    );
}
