import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

let pineconeClient = null;
let pineconeIndex = null;

export const initPinecone = async () => {
    if (pineconeClient) return pineconeIndex;

    try {
        pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });

        pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX);
        console.log('✅ Pinecone initialized');
        return pineconeIndex;
    } catch (error) {
        console.error('❌ Pinecone initialization error:', error.message);
        return null;
    }
};

export const getPineconeIndex = () => pineconeIndex;

export default { initPinecone, getPineconeIndex };
