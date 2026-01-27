import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const CaseContext = createContext();

export const useCases = () => {
    const context = useContext(CaseContext);
    if (!context) {
        throw new Error('useCases must be used within a CaseProvider');
    }
    return context;
};

export function CaseProvider({ children }) {
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [caseBrief, setCaseBrief] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all cases
    const fetchCases = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.getCases(params);
            setCases(response.data);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch single case
    const fetchCaseById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.getCaseById(id);
            setSelectedCase(response.data);
            if (response.data.brief) {
                setCaseBrief(response.data.brief);
            }
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Semantic search
    const searchCases = useCallback(async (query, options = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.semanticSearch(query, options);
            setSearchResults(response.results);
            return response.results;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Generate brief
    const generateBrief = useCallback(async (caseId) => {
        setLoading(true);
        try {
            const response = await api.generateBrief(caseId);
            setCaseBrief(response.data);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Upload case
    const uploadCase = useCallback(async (file, metadata) => {
        setLoading(true);
        try {
            const response = await api.uploadCase(file, metadata);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear selection
    const clearSelection = useCallback(() => {
        setSelectedCase(null);
        setCaseBrief(null);
    }, []);

    const value = {
        cases,
        selectedCase,
        caseBrief,
        searchResults,
        loading,
        error,
        fetchCases,
        fetchCaseById,
        searchCases,
        generateBrief,
        uploadCase,
        clearSelection,
        setError
    };

    return (
        <CaseContext.Provider value={value}>
            {children}
        </CaseContext.Provider>
    );
}

export default CaseContext;
