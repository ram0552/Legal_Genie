import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

let pinecone = null;
let index = null;

/**
 * Initialize Pinecone client
 */
export const initializePinecone = async () => {
    if (pinecone) return index;

    try {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });

        index = pinecone.index(process.env.PINECONE_INDEX);
        console.log('✅ Pinecone service initialized');
        return index;
    } catch (error) {
        console.error('Pinecone init error:', error.message);
        // Return null to allow graceful degradation
        return null;
    }
};

/**
 * Upsert vectors to Pinecone
 * @param {Array<{id: string, values: number[], metadata: object}>} vectors
 */
export const upsertVectors = async (vectors) => {
    if (!index) await initializePinecone();
    if (!index) throw new Error('Pinecone not initialized');

    try {
        // Upsert in batches of 100
        const batchSize = 100;
        for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize);
            await index.upsert(batch);
        }

        return { upserted: vectors.length };
    } catch (error) {
        console.error('Pinecone upsert error:', error.message);
        throw error;
    }
};

/**
 * Query vectors by similarity
 * @param {number[]} queryVector - Query embedding
 * @param {number} topK - Number of results
 * @param {object} filter - Metadata filter
 * @returns {Promise<Array>} - Matching vectors with scores
 */
export const queryVectors = async (queryVector, topK = 10, filter = {}) => {
    if (!index) await initializePinecone();
    if (!index) throw new Error('Pinecone not initialized');

    try {
        const results = await index.query({
            vector: queryVector,
            topK,
            includeMetadata: true,
            filter: Object.keys(filter).length > 0 ? filter : undefined
        });

        return results.matches || [];
    } catch (error) {
        console.error('Pinecone query error:', error.message);
        throw error;
    }
};

/**
 * Delete vectors by ID prefix (for a specific case)
 * @param {string} caseId - Case ID prefix
 */
export const deleteVectorsByCase = async (caseId) => {
    if (!index) await initializePinecone();
    if (!index) throw new Error('Pinecone not initialized');

    try {
        await index.deleteMany({
            filter: { caseId: { $eq: caseId } }
        });
        return { deleted: true };
    } catch (error) {
        console.error('Pinecone delete error:', error.message);
        throw error;
    }
};

export default {
    initializePinecone,
    upsertVectors,
    queryVectors,
    deleteVectorsByCase
};
