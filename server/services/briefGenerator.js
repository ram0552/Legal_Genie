// import genAI, { getGenerativeModel } from '../config/gemini.js';
// import { queryVectors } from './pineconeService.js';
// import { generateEmbedding } from './embeddingService.js';
// import { BRIEF_GENERATION_PROMPT } from '../utils/promptTemplates.js';

// /**
//  * Generate a structured case brief using RAG
//  * @param {string} caseId - Case ID
//  * @param {string} fullText - Full case text (fallback)
//  * @returns {Promise<object>} - Structured brief
//  */
// export const generateBrief = async (caseId, fullText) => {
//     try {
//         // Try to get relevant chunks from Pinecone first
//         let context = '';

//         try {
//             // Query for different aspects of the case
//             const queries = [
//                 'facts of the case background circumstances',
//                 'legal issues questions of law raised',
//                 'court decision verdict judgment held',
//                 'reasoning ratio decidendi legal principles'
//             ];

//             const allChunks = new Set();

//             for (const query of queries) {
//                 const queryEmbedding = await generateEmbedding(query);
//                 const results = await queryVectors(queryEmbedding, 5, { caseId });
//                 results.forEach(r => {
//                     if (r.metadata?.text) {
//                         allChunks.add(r.metadata.text);
//                     }
//                 });
//             }

//             context = Array.from(allChunks).join('\n\n---\n\n');
//         } catch (pineconeError) {
//             console.log('Pinecone not available, using full text');
//         }

//         // If no chunks from Pinecone, use truncated full text
//         if (!context) {
//             context = fullText.slice(0, 15000); // Limit to ~15k chars
//         }

//         const prompt = BRIEF_GENERATION_PROMPT.replace('{context}', context);

//         const result = await genAI.models.generateContent({
//             model: getGenerativeModel(),
//             contents: [{ role: 'user', parts: [{ text: prompt }] }],
//             generationConfig: {
//                 responseMimeType: 'application/json'
//             }
//         });

//         // The new SDK returns text directly on the response or via result.text
//         const responseText = result.text || result.response?.text?.() || '';

//         // Extract JSON from response (handling potential markdown blocks)
//         const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//         if (!jsonMatch) {
//             console.error('Raw response text:', responseText);
//             throw new Error('Invalid JSON response from AI');
//         }

//         const brief = JSON.parse(jsonMatch[0]);

//         return {
//             facts: brief.facts || 'Unable to extract facts',
//             issues: brief.issues || 'Unable to extract issues',
//             verdict: brief.verdict || 'Unable to extract verdict',
//             reasoning: brief.reasoning || 'Unable to extract reasoning',
//             keyPoints: brief.keyPoints || []
//         };
//     } catch (error) {
//         console.error('Brief generation error:', error.message);
//         throw new Error(`Failed to generate brief: ${error.message}`);
//     }
// };

// export default { generateBrief };
// // import { getTextModel } from '../config/gemini.js';
// // import { queryVectors } from './pineconeService.js';
// // import { generateEmbedding } from './embeddingService.js';
// // import { BRIEF_GENERATION_PROMPT } from '../utils/promptTemplates.js';

// // export const generateBrief = async (caseId, fullText) => {
// //   try {
// //     let context = '';

// //     try {
// //       const queries = [
// //         'facts of the case',
// //         'legal issues involved',
// //         'court decision and verdict',
// //         'reasoning and legal principles'
// //       ];

// //       const chunks = new Set();

// //       for (const q of queries) {
// //         const emb = await generateEmbedding(q);
// //         const results = await queryVectors(emb, 5, { caseId });
// //         results.forEach(r => r.metadata?.text && chunks.add(r.metadata.text));
// //       }

// //       context = Array.from(chunks).join('\n\n');
// //     } catch {
// //       context = fullText.slice(0, 15000);
// //     }

// //     const prompt = BRIEF_GENERATION_PROMPT.replace('{context}', context);

// //     const model = getTextModel();
// //     const result = await model.generateContent(prompt);

// //     const text = result.response.text();

// //     const jsonMatch = text.match(/\{[\s\S]*\}/);
// //     if (!jsonMatch) throw new Error('Invalid JSON response');

// //     return JSON.parse(jsonMatch[0]);
// //   } catch (error) {
// //     console.error('Brief generation error:', error.message);
// //     throw new Error(`Failed to generate brief: ${error.message}`);
// //   }
// // };

// // export default { generateBrief };
import genAI, { getGenerativeModel } from '../config/gemini.js';
import { BRIEF_GENERATION_PROMPT } from '../utils/promptTemplates.js';

/**
 * Generate a structured case brief (LLM-ONLY MODE)
 * Pinecone and embeddings intentionally disabled
 */
export const generateBrief = async (caseId, fullText) => {
  try {
    if (!fullText) {
      throw new Error('Case text is empty');
    }

    // ✅ LLM-only context
    const context = fullText.slice(0, 8000);

    const prompt = BRIEF_GENERATION_PROMPT.replace('{context}', context);

    const result = await genAI.models.generateContent({
      model: getGenerativeModel(),
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const text = result.text || result.response?.text?.() || '';

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error('AI raw output:', text);
      throw new Error('Invalid JSON from AI');
    }

    const brief = JSON.parse(match[0]);

    return {
      facts: brief.facts ?? 'Not available',
      issues: brief.issues ?? 'Not available',
      verdict: brief.verdict ?? 'Not available',
      reasoning: brief.reasoning ?? 'Not available',
      keyPoints: brief.keyPoints ?? []
    };
  } catch (error) {
    console.error('Brief generation failed:', error.message);
    throw error;
  }
};

export default { generateBrief };
