import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import api from '../services/api';

export default function UploadCase() {
    const [files, setFiles] = useState([]);
    const [textInput, setTextInput] = useState('');
    const [mode, setMode] = useState('file'); // 'file' or 'text'
    const [metadata, setMetadata] = useState({ title: '', court: '', year: '' });
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileDrop = (e) => {
        e.preventDefault();
        const incomingFiles = Array.from(e.dataTransfer?.files || e.target.files || []);

        const validFiles = incomingFiles.filter(file =>
            file.type === 'application/pdf' || file.type === 'text/plain' ||
            file.name.endsWith('.pdf') || file.name.endsWith('.txt')
        );

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
            setError(null);

            // If only one file and title is empty, auto-fill title
            if (files.length === 0 && validFiles.length === 1 && !metadata.title) {
                const name = validFiles[0].name.replace(/\.[^/.]+$/, '');
                setMetadata(m => ({ ...m, title: name }));
            }
        } else if (incomingFiles.length > 0) {
            setError('Please upload PDF or text files');
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        setError(null);
        setUploading(true);

        try {
            let response;

            if (mode === 'file' && files.length > 0) {
                if (files.length === 1) {
                    // Single file uses specific metadata
                    response = await api.uploadCase(files[0], metadata);
                } else {
                    // Multiple files
                    response = await api.uploadMultipleCases(files);
                }
            } else if (mode === 'text' && textInput.trim()) {
                response = await api.uploadText({
                    ...metadata,
                    text: textInput
                });
            } else {
                throw new Error('Please provide file(s) or text');
            }

            setResult(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleViewCase = () => {
        if (Array.isArray(result)) {
            navigate('/library');
        } else if (result?.id) {
            navigate(`/case/${result.id}`);
        }
    };

    const resetForm = () => {
        setFiles([]);
        setTextInput('');
        setMetadata({ title: '', court: '', year: '' });
        setResult(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Upload Case</h1>
                    <p className="text-slate-500 mt-2">
                        Add new judgments to your law library
                    </p>
                </div>

                {/* Success State */}
                {result && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center animate-fadeIn border border-green-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">
                            {Array.isArray(result) ? 'Files Uploaded Successfully!' : 'Case Uploaded Successfully!'}
                        </h2>
                        <p className="text-slate-500 mb-6">
                            {Array.isArray(result)
                                ? `Processed ${result.length} cases.`
                                : `${result.title || 'Your case'} has been added.`
                            }
                            {' Embeddings are being generated in the background.'}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleViewCase}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                            >
                                {Array.isArray(result) ? 'Go to Library' : 'View Case'}
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-6 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
                            >
                                Upload More
                            </button>
                        </div>
                    </div>
                )}

                {/* Upload Form */}
                {!result && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                        {/* Mode Toggle */}
                        <div className="flex border-b border-slate-200">
                            <button
                                onClick={() => setMode('file')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'file'
                                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-500'
                                    : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                Upload Files
                            </button>
                            <button
                                onClick={() => setMode('text')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'text'
                                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-500'
                                    : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                Paste Text
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* File Upload */}
                            {mode === 'file' && (
                                <div className="space-y-4">
                                    <div
                                        onDrop={handleFileDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0
                                            ? 'border-primary-300 bg-primary-50/30'
                                            : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept=".pdf,.txt"
                                            onChange={handleFileDrop}
                                            className="hidden"
                                        />

                                        <Upload className={`w-12 h-12 mx-auto mb-3 transition-colors ${files.length > 0 ? 'text-primary-500' : 'text-slate-300'}`} />
                                        <p className="text-slate-600 font-medium">
                                            Drop your PDF or text files here
                                        </p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            or click to browse
                                        </p>
                                    </div>

                                    {/* File List */}
                                    {files.length > 0 && (
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {files.map((f, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-primary-500" />
                                                        <div className="text-left overflow-hidden">
                                                            <p className="font-medium text-slate-800 text-sm truncate max-w-[300px]">{f.name}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {(f.size / 1024).toFixed(1)} KB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFile(i);
                                                        }}
                                                        className="p-1.5 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-md transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Text Input */}
                            {mode === 'text' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Case Text
                                    </label>
                                    <textarea
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder="Paste the full judgment text here..."
                                        rows={10}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">
                                        Minimum 100 characters required
                                    </p>
                                </div>
                            )}

                            {/* Metadata Fields (Only for single file or text mode) */}
                            {(files.length <= 1 || mode === 'text') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Case Title {mode === 'text' || files.length === 1 ? '*' : ''}
                                        </label>
                                        <input
                                            type="text"
                                            value={metadata.title}
                                            onChange={(e) => setMetadata(m => ({ ...m, title: e.target.value }))}
                                            placeholder={files.length === 1 ? files[0].name.replace(/\.[^/.]+$/, '') : "e.g., State v. John Doe"}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Court
                                        </label>
                                        <input
                                            type="text"
                                            value={metadata.court}
                                            onChange={(e) => setMetadata(m => ({ ...m, court: e.target.value }))}
                                            placeholder="e.g., Supreme Court of India"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Year
                                        </label>
                                        <input
                                            type="number"
                                            value={metadata.year}
                                            onChange={(e) => setMetadata(m => ({ ...m, year: e.target.value }))}
                                            placeholder={new Date().getFullYear().toString()}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Info for multi-upload */}
                            {mode === 'file' && files.length > 1 && (
                                <div className="p-4 bg-primary-50 rounded-lg border border-primary-100 flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-primary-700">
                                        Titles will be automatically generated from filenames. You can edit them later in the library.
                                    </p>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 animate-shake">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleUpload}
                                disabled={uploading || (files.length === 0 && !textInput.trim()) || (files.length <= 1 && mode === 'file' && !metadata.title && !files[0]?.name) || (mode === 'text' && !metadata.title)}
                                className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing {files.length > 1 ? `${files.length} Files` : 'Case'}...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        {files.length > 1 ? `Upload ${files.length} Cases` : 'Upload Case'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

