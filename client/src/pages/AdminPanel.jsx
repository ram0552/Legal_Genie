// import { useState, useEffect } from 'react';
// import { Settings, Database, Trash2, RefreshCw, Loader2, CheckCircle, XCircle } from 'lucide-react';
// import api from '../services/api';

// export default function AdminPanel() {
//     const [cases, setCases] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [deleting, setDeleting] = useState(null);
//     const [stats, setStats] = useState({ total: 0, completed: 0, processing: 0 });

//     // const fetchCases = async () => {
//     //     setLoading(true);
//     //     try {
//     //         const response = await api.getCases({ limit: 100 });
//     //         setCases(response.data);

//     //         // Calculate stats
//     //         const total = response.data.length;
//     //         const completed = response.data.filter(c => c.status === 'completed').length;
//     //         const processing = response.data.filter(c => c.status === 'processing').length;
//     //         setStats({ total, completed, processing });
//     //     } catch (error) {
//     //         console.error('Error fetching cases:', error);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//     const fetchCases = async () => {
//     setLoading(true);
//     try {
//         const response = await api.getCases({ limit: 100 });

//         const rawCases =
//             Array.isArray(response.data)
//                 ? response.data
//                 : Array.isArray(response.data?.cases)
//                 ? response.data.cases
//                 : [];

//         console.log('RAW CASES:', rawCases);

//         const normalizedCases = rawCases.map(c => ({
//             ...c,
//             status: c.status === 'completed' ? 'completed' : 'processing'
//         }));

//         setCases(normalizedCases);

//         const total = normalizedCases.length;
//         const completed = normalizedCases.filter(c => c.status === 'completed').length;
//         const processing = total - completed;

//         setStats({ total, completed, processing });
//     } catch (error) {
//         console.error('Error fetching cases:', error);
//     } finally {
//         setLoading(false);
//     }
// };


//     useEffect(() => {
//         fetchCases();
//     }, []);

//     const handleDelete = async (id, title) => {
//         if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;

//         setDeleting(id);
//         try {
//             await api.deleteCase(id);
//             setCases(cases.filter(c => c._id !== id));
//             setStats(s => ({ ...s, total: s.total - 1 }));
//         } catch (error) {
//             alert('Failed to delete case: ' + error.message);
//         } finally {
//             setDeleting(null);
//         }
//     };

//     // const getStatusBadge = (status) => {
//     //     const styles = {
//     //         completed: 'bg-green-100 text-green-700',
//     //         processing: 'bg-blue-100 text-blue-700',
//     //         pending: 'bg-yellow-100 text-yellow-700',
//     //         error: 'bg-red-100 text-red-700'
//     //     };

//     //     const icons = {
//     //         completed: CheckCircle,
//     //         processing: RefreshCw,
//     //         pending: RefreshCw,
//     //         error: XCircle
//     //     };

//     //     const Icon = icons[status] || RefreshCw;

//     //     return (
//     //         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
//     //             <Icon className={`w-3 h-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
//     //             {status}
//     //         </span>
//     //     );
//     // };
//     const getStatusBadge = (status) => {
//     const safeStatus = status === 'completed' ? 'completed' : 'processing';

//     const config = {
//         completed: {
//             className: 'bg-green-100 text-green-700',
//             Icon: CheckCircle
//         },
//         processing: {
//             className: 'bg-blue-100 text-blue-700',
//             Icon: RefreshCw
//         }
//     };

//     const { className, Icon } = config[safeStatus];

//     return (
//         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
//             <Icon className={`w-3 h-3 ${safeStatus === 'processing' ? 'animate-spin' : ''}`} />
//             {safeStatus}
//         </span>
//     );
// };



//     return (
//         <div className="min-h-screen bg-slate-50 py-8">
//             <div className="max-w-6xl mx-auto px-4">
//                 <div className="flex items-center justify-between mb-8">
//                     <div>
//                         <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
//                             <Settings className="w-7 h-7" />
//                             Admin Panel
//                         </h1>
//                         <p className="text-slate-500 mt-1">Manage cases and system settings</p>
//                     </div>
//                     <button
//                         onClick={fetchCases}
//                         disabled={loading}
//                         className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
//                     >
//                         <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                         Refresh
//                     </button>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
//                                 <Database className="w-6 h-6 text-primary-600" />
//                             </div>
//                             <div>
//                                 <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
//                                 <p className="text-sm text-slate-500">Total Cases</p>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                                 <CheckCircle className="w-6 h-6 text-green-600" />
//                             </div>
//                             <div>
//                                 <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
//                                 <p className="text-sm text-slate-500">completed</p>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                                 <RefreshCw className="w-6 h-6 text-blue-600" />
//                             </div>
//                             <div>
//                                 <p className="text-2xl font-bold text-slate-800">{stats.processing}</p>
//                                 <p className="text-sm text-slate-500">in case</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Cases Table */}
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                     <div className="px-6 py-4 border-b border-slate-100">
//                         <h2 className="font-semibold text-slate-800">All Cases</h2>
//                     </div>

//                     {loading ? (
//                         <div className="p-8 flex items-center justify-center">
//                             <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
//                         </div>
//                     ) : cases.length === 0 ? (
//                         <div className="p-8 text-center text-slate-500">
//                             No cases in the database
//                         </div>
//                     ) : (
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-slate-50 text-left">
//                                     <tr>
//                                         <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
//                                         <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Court</th>
//                                         <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Year</th>
//                                         <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
//                                         <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Chunks</th>
//                                         <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-100">
//                                     {cases.map((caseItem) => (
//                                         <tr key={caseItem._id} className="hover:bg-slate-50">
//                                             <td className="px-6 py-4">
//                                                 <a
//                                                     href={`/case/${caseItem._id}`}
//                                                     className="font-medium text-slate-800 hover:text-primary-600"
//                                                 >
//                                                     {caseItem.title}
//                                                 </a>
//                                             </td>
//                                             <td className="px-6 py-4 text-sm text-slate-600">{caseItem.court}</td>
//                                             <td className="px-6 py-4 text-sm text-slate-600">{caseItem.year}</td>
//                                             <td className="px-6 py-4">{getStatusBadge(caseItem.status)}</td>
//                                             <td className="px-6 py-4 text-sm text-slate-600">{caseItem.chunkCount || 0}</td>
//                                             <td className="px-6 py-4">
//                                                 <button
//                                                     onClick={() => handleDelete(caseItem._id, caseItem.title)}
//                                                     disabled={deleting === caseItem._id}
//                                                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
//                                                     title="Delete case"
//                                                 >
//                                                     {deleting === caseItem._id ? (
//                                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                                     ) : (
//                                                         <Trash2 className="w-4 h-4" />
//                                                     )}
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
import { useState, useEffect } from 'react';
import {
    Settings,
    Database,
    Trash2,
    RefreshCw,
    Loader2,
    CheckCircle
} from 'lucide-react';
import api from '../services/api';

export default function AdminPanel() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        processing: 0
    });

    /* =========================
       FETCH + NORMALIZE CASES
       ========================= */
    const fetchCases = async () => {
        setLoading(true);
        try {
            const response = await api.getCases({ limit: 100 });

            const rawCases =
                Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.cases)
                    ? response.data.cases
                    : [];

            const normalizedCases = rawCases.map(c => ({
                ...c,
                status: c.status === 'completed' ? 'completed' : 'processing'
            }));

            setCases(normalizedCases);

            const total = normalizedCases.length;
            const completed = normalizedCases.filter(
                c => c.status === 'completed'
            ).length;
            const processing = total - completed;

            setStats({ total, completed, processing });
        } catch (error) {
            console.error('Error fetching cases:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    /* =========================
       DELETE CASE
       ========================= */
    const handleDelete = async (id, title) => {
        if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;

        setDeleting(id);
        try {
            const deletedCase = cases.find(c => c._id === id);
            await api.deleteCase(id);

            const updatedCases = cases.filter(c => c._id !== id);
            setCases(updatedCases);

            setStats(prev => ({
                total: prev.total - 1,
                completed:
                    deletedCase.status === 'completed'
                        ? prev.completed - 1
                        : prev.completed,
                processing:
                    deletedCase.status === 'processing'
                        ? prev.processing - 1
                        : prev.processing
            }));
        } catch (error) {
            alert('Failed to delete case: ' + error.message);
        } finally {
            setDeleting(null);
        }
    };

    /* =========================
       STATUS BADGE (IN USE)
       ========================= */
    const getStatusBadge = status => {
        const safeStatus = status === 'completed' ? 'completed' : 'processing';

        const config = {
            completed: {
                className: 'bg-green-100 text-green-700',
                Icon: CheckCircle,
                label: 'Completed'
            },
            processing: {
                className: 'bg-blue-100 text-blue-700',
                Icon: RefreshCw,
                label: 'In Use'
            }
        };

        const { className, Icon, label } = config[safeStatus];

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
                <Icon
                    className={`w-3 h-3 ${
                        safeStatus === 'processing' ? 'animate-spin' : ''
                    }`}
                />
                {label}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Settings className="w-7 h-7" />
                            Admin Panel
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Manage cases and system settings
                        </p>
                    </div>

                    <button
                        onClick={fetchCases}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard icon={Database} value={stats.total} label="Total Cases" />
                    <StatCard
                        icon={CheckCircle}
                        value={stats.completed}
                        label="Completed"
                        bg="bg-green-100"
                        iconColor="text-green-600"
                    />
                    <StatCard
                        icon={RefreshCw}
                        value={stats.processing}
                        label="In Use"
                        bg="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-800">All Cases</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                        </div>
                    ) : cases.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            No cases in the database
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs uppercase text-slate-500">Title</th>
                                        <th className="px-6 py-3 text-xs uppercase text-slate-500">Court</th>
                                        <th className="px-6 py-3 text-xs uppercase text-slate-500">Year</th>
                                        <th className="px-6 py-3 text-xs uppercase text-slate-500">Status</th>
                                        <th className="px-6 py-3 text-xs uppercase text-slate-500">Chunks</th>
                                        <th className="px-6 py-3 text-xs uppercase text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {cases.map(caseItem => (
                                        <tr key={caseItem._id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium">
                                                {caseItem.title || 'Untitled Case'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">{caseItem.court}</td>
                                            <td className="px-6 py-4 text-sm">{caseItem.year}</td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(caseItem.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {caseItem.chunkCount || 0}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        handleDelete(caseItem._id, caseItem.title)
                                                    }
                                                    disabled={deleting === caseItem._id}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    {deleting === caseItem._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================
   STAT CARD
   ========================= */
function StatCard({
    icon: Icon,
    value,
    label,
    bg = 'bg-primary-100',
    iconColor = 'text-primary-600'
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                </div>
            </div>
        </div>
    );
}