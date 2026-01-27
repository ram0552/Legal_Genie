// import genAI, { getGenerativeModel } from '../config/gemini.js';
// import { queryVectors } from './pineconeService.js';
// import { generateEmbedding } from './embeddingService.js';
// import { OPPOSING_COUNSEL_PROMPT } from '../utils/promptTemplates.js';

// /**
//  * Generate counter-arguments as opposing counsel
//  * @param {string} caseId - Case ID for context
//  * @param {string} userStance - User's legal position
//  * @param {string} fullText - Full case text (fallback)
//  * @returns {Promise<object>} - Counter-arguments with citations
//  */
// export const generateCounterArguments = async (caseId, userStance, fullText) => {
//     try {
//         let context = '';

//         // Try to get relevant chunks
//         try {
//             const queryEmbedding = await generateEmbedding(userStance);
//             const results = await queryVectors(queryEmbedding, 8, { caseId });
//             context = results.map(r => r.metadata?.text || '').filter(Boolean).join('\n\n---\n\n');
//         } catch (e) {
//             console.log('Using full text for counter-arguments');
//         }

//         if (!context) {
//             context = fullText.slice(0, 12000);
//         }

//         const prompt = OPPOSING_COUNSEL_PROMPT
//             .replace('{userStance}', userStance)
//             .replace('{context}', context);

//         const result = await genAI.models.generateContent({
//             model: getGenerativeModel(),
//             contents: [{ role: 'user', parts: [{ text: prompt }] }],
//             generationConfig: {
//                 responseMimeType: 'application/json'
//             }
//         });

//         const responseText = result.text || result.response?.text?.() || '';

//         // Try to parse as JSON, fallback to structured text
//         try {
//             const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//             if (jsonMatch) {
//                 return JSON.parse(jsonMatch[0]);
//             }
//         } catch (e) {
//             // Not JSON, parse as text
//         }

//         return {
//             counterArguments: responseText,
//             citations: [],
//             summary: 'Counter-arguments generated based on case context'
//         };
//     } catch (error) {
//         console.error('Counter-argument generation error:', error.message);
//         throw new Error(`Failed to generate counter-arguments: ${error.message}`);
//     }
// };

// export default { generateCounterArguments };
// // import { getTextModel } from '../config/gemini.js';
// // import { generateEmbedding } from './embeddingService.js';
// // import { queryVectors } from './pineconeService.js';

// // export const generateCounterArguments = async (caseId, fullText) => {
// //   try {
// //     let context = '';

// //     try {
// //       const emb = await generateEmbedding('possible weaknesses and counter arguments');
// //       const results = await queryVectors(emb, 5, { caseId });
// //       context = results.map(r => r.metadata?.text).filter(Boolean).join('\n\n');
// //     } catch {
// //       context = fullText.slice(0, 10000);
// //     }

// //     const prompt = `
// // You are opposing counsel.
// // Based on the following case material, generate strong counter-arguments.

// // ${context}
// // `;

// //     const model = getTextModel();
// //     const result = await model.generateContent(prompt);
// //     return result.response.text();
// //   } catch (error) {
// //     console.error('Counter-argument generation error:', error.message);
// //     throw new Error(`Failed to generate counter-arguments: ${error.message}`);
// //   }
// // };

// // export default { generateCounterArguments };
import genAI, { getGenerativeModel } from '../config/gemini.js';
import { OPPOSING_COUNSEL_PROMPT } from '../utils/promptTemplates.js';

/**
 * Generate counter-arguments (LLM-ONLY MODE)
 * Pinecone and embeddings intentionally disabled
 */
export const generateCounterArguments = async (caseId, stance, fullText) => {
  try {
    if (!fullText) {
      throw new Error('Case text is empty');
    }

    const context = fullText.slice(0, 8000);

    const prompt = OPPOSING_COUNSEL_PROMPT
      .replace('{userStance}', stance)
      .replace('{context}', context);

    const result = await genAI.models.generateContent({
      model: getGenerativeModel(),
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const text = result.text || result.response?.text?.() || '';

    return {
      points: [
        {
          argument: text,
          rebuttal: 'Requires legal review'
        }
      ]
    };
  } catch (error) {
    console.error('Counter-argument generation failed:', error.message);
    throw error;
  }
};

export default { generateCounterArguments };
