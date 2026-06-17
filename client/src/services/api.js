import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.error || error.message || 'An error occurred';
        return Promise.reject(new Error(message));
    }
);

const api = {
    // Cases
    getCases: (params = {}) => apiClient.get('/cases', { params }),
    getCaseById: (id) => apiClient.get(`/cases/${id}`),
    createCase: (data) => apiClient.post('/cases', data),
    updateCase: (id, data) => apiClient.put(`/cases/${id}`, data),
    deleteCase: (id) => apiClient.delete(`/cases/${id}`),

    // Upload
    uploadCase: (file, metadata = {}) => {
        const formData = new FormData();
        formData.append('file', file);
        Object.keys(metadata).forEach(key => {
            formData.append(key, metadata[key]);
        });
        return apiClient.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadMultipleCases: (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        return apiClient.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadText: (data) => apiClient.post('/upload/text', data),

    // Search
    semanticSearch: (query, options = {}) =>
        apiClient.post('/search', { query, ...options }),
    findSimilarCases: (id, limit = 5) =>
        apiClient.post(`/search/similar/${id}`, { limit }),

    // AI
    generateBrief: (caseId) => apiClient.post('/ai/brief', { caseId }),
    regenerateBrief: (caseId) => apiClient.post('/ai/brief/regenerate', { caseId }),
    generateCounterArguments: (caseId, stance) =>
        apiClient.post('/ai/counter', { caseId, stance }),
    chatWithCase: (caseId, question) =>
        apiClient.post('/ai/chat', { caseId, question }),
    getCitations: (caseId) => apiClient.get(`/ai/citations/${caseId}`)
};

export default api;
