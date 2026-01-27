import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CaseProvider } from './context/CaseContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import CaseDetails from './pages/CaseDetails';
import UploadCase from './pages/UploadCase';
import AdminPanel from './pages/AdminPanel';

function App() {
    return (
        <CaseProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-legal-cream">
                    <Navbar />
                    <main className="pt-16">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/case/:id" element={<CaseDetails />} />
                            <Route path="/upload" element={<UploadCase />} />
                            <Route path="/admin" element={<AdminPanel />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </CaseProvider>
    );
}

export default App;
