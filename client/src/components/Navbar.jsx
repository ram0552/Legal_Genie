import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Search, Upload, Settings, Menu, X, FileText } from 'lucide-react';
import SemanticSearch from './SemanticSearch';

export default function Navbar() {
    const [showSearch, setShowSearch] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Dashboard', icon: Scale },
        { path: '/library', label: 'Library', icon: FileText },
        { path: '/upload', label: 'Upload', icon: Upload },
        { path: '/admin', label: 'Admin', icon: Settings },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-legal-navy shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                                <Scale className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Legal<span className="text-primary-400">Genie</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map(({ path, label, icon: Icon }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isActive(path)
                                        ? 'text-primary-400 bg-primary-900/30'
                                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                </Link>
                            ))}

                            {/* Search Button */}
                            <button
                                onClick={() => setShowSearch(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                            >
                                <Search className="w-4 h-4" />
                                <span>Search Cases</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white p-2"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-legal-navy border-t border-white/10">
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map(({ path, label, icon: Icon }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${isActive(path)
                                        ? 'text-primary-400 bg-primary-900/30'
                                        : 'text-gray-300'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{label}</span>
                                </Link>
                            ))}
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setShowSearch(true);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg"
                            >
                                <Search className="w-5 h-5" />
                                <span>Search Cases</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Search Modal */}
            {showSearch && <SemanticSearch onClose={() => setShowSearch(false)} />}
        </>
    );
}
