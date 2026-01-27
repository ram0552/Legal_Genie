// import genAI, { getEmbeddingModel } from '../config/gemini.js';

// /**
//  * Generate embedding for a single text
//  * @param {string} text - Text to embed
//  * @returns {Promise<number[]>} - Embedding vector
//  */
// export const generateEmbedding = async (text) => {
//     try {
//         const result = await genAI.models.embedContent({
//             model: getEmbeddingModel(),
//             content: { parts: [{ text }] },
//         });
//         return result.embeddings[0].values;
//     } catch (error) {
//         console.error('Embedding generation error:', error.message);
//         throw new Error(`Failed to generate embedding: ${error.message}`);
//     }
// };

// /**
//  * Generate embeddings for multiple texts (batch)
//  * @param {string[]} texts - Array of texts to embed
//  * @returns {Promise<number[][]>} - Array of embedding vectors
//  */
// export const generateEmbeddings = async (texts) => {
//     try {
//         const result = await genAI.models.embedContent({
//             model: getEmbeddingModel(),
//             requests: texts.map(text => ({
//                 content: { parts: [{ text }] }
//             }))
//         });
//         return result.embeddings.map(e => e.values);
//     } catch (error) {
//         console.error('Batch embedding error:', error.message);
//         throw error;
//     }
// };

// export default { generateEmbedding, generateEmbeddings };
import { getEmbeddingModel } from '../config/gemini.js';

/**
 * Generate embedding for a single text
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const generateEmbedding = async (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text for embedding');
  }

  try {
    const model = getEmbeddingModel();

    const result = await model.embedContent({
      content: [text] // ✅ MUST be an array
    });

    return result.embedding.values;
  } catch (error) {
    console.error('Embedding generation error:', error.message);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
};

/**
 * Generate embeddings for multiple texts (batch)
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export const generateEmbeddings = async (texts) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error('Invalid texts array for embeddings');
  }

  try {
    const model = getEmbeddingModel();

    const result = await model.embedContent({
      content: texts // ✅ array of strings
    });

    return result.embeddings.map(e => e.values);
  } catch (error) {
    console.error('Batch embedding error:', error.message);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
};

export default {
  generateEmbedding,
  generateEmbeddings
};
// import { getEmbeddingModel } from '../config/gemini.js';

// /**
//  * Generate embedding for a single text
//  * @param {string} text
//  * @returns {Promise<number[]>}
//  */
// export const generateEmbedding = async (text) => {
//   if (!text || typeof text !== 'string') {
//     throw new Error('Invalid text for embedding');
//   }

//   try {
//     const model = getEmbeddingModel();

//     if (typeof model.embedContent !== 'function') {
//       throw new Error('Embedding model does not support embedContent');
//     }

//     const result = await model.embedContent(text);

//     return result.embedding.values;
//   } catch (error) {
//     console.error('Embedding generation error:', error.message);
//     throw new Error(`Failed to generate embedding: ${error.message}`);
//   }
// };

// /**
//  * Generate embeddings for multiple texts (batch)
//  * @param {string[]} texts
//  * @returns {Promise<number[][]>}
//  */
// export const generateEmbeddings = async (texts) => {
//   if (!Array.isArray(texts) || texts.length === 0) {
//     throw new Error('Invalid texts array for embeddings');
//   }

//   try {
//     const model = getEmbeddingModel();

//     if (typeof model.embedContent !== 'function') {
//       throw new Error('Embedding model does not support embedContent');
//     }

//     const result = await model.embedContent(texts);

//     return result.embeddings.map(e => e.values);
//   } catch (error) {
//     console.error('Batch embedding error:', error.message);
//     throw new Error(`Failed to generate embeddings: ${error.message}`);
//   }
// };

// export default {
//   generateEmbedding,
//   generateEmbeddings
// };
