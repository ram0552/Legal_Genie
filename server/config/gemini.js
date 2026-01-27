import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const client = new GoogleGenAI({
    apiKey: (process.env.GEMINI_API_KEY || '').trim(),
});

// Model for text generation (RAG responses)
export const getGenerativeModel = () => {
    return 'gemini-2.5-flash';
};

// Model for embeddings
export const getEmbeddingModel = () => {
    return 'gemini-embedding-001';
};

export default client;
// import { GoogleGenerativeAI } from '@google/genai';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const getEmbeddingModel = () =>
//   genAI.getGenerativeModel({
//     model: 'text-embedding-004'
//   });

// export default genAI;
//import { GoogleGenerativeAI } from '@google/generative-ai';
// import dotenv from 'dotenv';

// dotenv.config();

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error('GEMINI_API_KEY missing');
// }

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// /**
//  * Text generation model (briefs, assistant, strategy room)
//  */
// export const getTextModel = () => {
//   return genAI.getGenerativeModel({
//     model: 'gemini-1.5-flash'
//   });
// };

// /**
//  * Embedding model (semantic search, Pinecone)
//  */
// export const getEmbeddingModel = () => {
//   return genAI.getGenerativeModel({
//     model: 'text-embedding-004'
//   });
// };

// export default genAI;
