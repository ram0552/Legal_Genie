// import { MongoClient } from 'mongodb';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// import { Pinecone } from '@pinecone-database/pinecone';
// import { GoogleGenAI } from '@google/genai';

// // Fix: Load .env from the server directory (parent of seeds)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.join(__dirname, '..', '.env') });

// const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/legalgenie';
// const DB_NAME = process.env.MONGO_DB_NAME || 'legalgenie';
// const PINECONE_INDEX = process.env.PINECONE_INDEX;
// const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'judgments';

// if (!PINECONE_INDEX) {
//     console.error('❌ ERROR: PINECONE_INDEX is not defined in .env');
//     process.exit(1);
// }

// const client = new MongoClient(MONGO_URI);
// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
// const index = pinecone.index(PINECONE_INDEX);

// const cases = [
//     {
//         caseId: "CASE_101",
//         caseName: "State of X vs Rahul Sharma",
//         status: "completed",
//         year: 2018,
//         court: "Supreme Court of India",
//         jurisdiction: "Criminal",
//         judgmentText: "Accused charged under Section 302 IPC. Prosecution relied on circumstantial evidence. Defense highlighted procedural lapses.",
//         extractedActs: ["Section 302 of IPC", "Article 21 of Constitution of India"],
//         aiBrief: {
//             facts: "The accused was alleged to have committed murder based on circumstantial evidence.",
//             issues: "Whether circumstantial evidence was sufficient for conviction.",
//             verdict: "The accused was acquitted.",
//             reasoning: "The evidence did not establish guilt beyond reasonable doubt."
//         },
//         createdAt: new Date()
//     },
//     {
//         caseId: "CASE_102",
//         caseName: "Meera Devi vs Municipal Corporation",
//         status: "completed",
//         year: 2020,
//         court: "Delhi High Court",
//         jurisdiction: "Civil",
//         judgmentText: "Petitioner suffered injuries due to potholes. Municipal authority argued contributory negligence.",
//         extractedActs: ["Article 14 of Constitution of India", "Motor Vehicles Act, 1988"],
//         aiBrief: {
//             facts: "Injuries caused by poor road maintenance.",
//             issues: "Liability of municipal authority for negligence.",
//             verdict: "Compensation awarded.",
//             reasoning: "Failure to maintain roads amounted to breach of duty of care."
//         },
//         createdAt: new Date()
//     },
//     // ... other cases could be added back, keep it short for seed script robustness
// ];

// function chunkText(text, chunkSize = 800, overlap = 200) {
//     const words = text.split(/\s+/);
//     const chunks = [];
//     let start = 0;
//     let chunkIndex = 0;
//     while (start < words.length) {
//         const end = start + chunkSize;
//         const chunkWords = words.slice(start, end);
//         chunks.push({ chunkIndex, text: chunkWords.join(' ') });
//         start = end - overlap;
//         chunkIndex++;
//     }
//     return chunks;
// }

// async function seedCasesAndEmbeddings() {
//     try {
//         await client.connect();
//         const db = client.db(DB_NAME);
//         const collection = db.collection('cases');
//         await collection.deleteMany({});
//         const result = await collection.insertMany(cases);
//         console.log(`Inserted ${result.insertedCount} cases into MongoDB`);

//         let totalVectors = 0;
//         const seededCases = await collection.find({ status: 'completed' }).toArray();

//         for (const legalCase of seededCases) {
//             if (!legalCase.judgmentText) continue;
//             console.log(`Processing case: ${legalCase.caseName}`);
//             const chunks = chunkText(legalCase.judgmentText);

//             // Extract texts for bulk embedding
//             const texts = chunks.map(c => c.text);

//             const embeddingResponse = await genAI.models.embedContent({
//                 model: 'gemini-embedding-001',
//                 contents: texts
//             });

//             const vectors = chunks.map((chunk, i) => ({
//                 id: `${legalCase._id}_${chunk.chunkIndex}`,
//                 values: embeddingResponse.embeddings[i].values,
//                 metadata: {
//                     caseId: legalCase._id.toString(),
//                     chunkIndex: chunk.chunkIndex,
//                     text: chunk.text.slice(0, 1000)
//                 }
//             }));

//             await index.upsert(vectors, { namespace: PINECONE_NAMESPACE });
//             totalVectors += vectors.length;
//             console.log(`Inserted ${vectors.length} vectors for this case`);
//         }

//         console.log(`✅ Embedding seeding complete. Total vectors: ${totalVectors}`);
//         await client.close();
//         process.exit(0);
//     } catch (err) {
//         console.error('❌ Seeding failed:', err);
//         await client.close();
//         process.exit(1);
//     }
// }

// seedCasesAndEmbeddings();
/**
 * seedEmbeddings.js
 * Run with: node seedEmbeddings.js
 */

/**
 * seedEmbeddings.js
 * Run from: server/seeds
 * Command: node seedEmbeddings.js
 */

/* -------------------- LOAD ENV (FIXED FOR WINDOWS) -------------------- */
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Explicitly load server/.env
// dotenv.config({
//   path: path.resolve(__dirname, '..', '.env')
// });

// // DEBUG (keep until it works)
// console.log('ENV CHECK:', {
//   GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
//   PINECONE_API_KEY: !!process.env.PINECONE_API_KEY,
//   PINECONE_INDEX: process.env.PINECONE_INDEX
// });

// if (!process.env.GEMINI_API_KEY) {
//   console.error('❌ GEMINI_API_KEY missing in .env');
//   process.exit(1);
// }

// /* -------------------- IMPORTS -------------------- */
// import { MongoClient } from 'mongodb';
// import { Pinecone } from '@pinecone-database/pinecone';
// import { GoogleGenerativeAI } from '@google/genai';

// /* -------------------- CONFIG -------------------- */
// const MONGO_URI =
//   process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/legalgenie';

// const DB_NAME = process.env.MONGO_DB_NAME || 'legalgenie';
// const PINECONE_INDEX = process.env.PINECONE_INDEX;
// const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'judgments';

// /* -------------------- CLIENTS -------------------- */
// const mongoClient = new MongoClient(MONGO_URI);

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const embeddingModel = genAI.getGenerativeModel({
//   model: 'gemini-embedding-001'
// });

// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY
// });
// const index = pinecone.index(PINECONE_INDEX);

// /* -------------------- SAMPLE CASE DATA -------------------- */
// const cases = [
//   {
//     caseName: 'State of X vs Rahul Sharma',
//     status: 'completed',
//     year: 2018,
//     court: 'Supreme Court of India',
//     judgmentText:
//       'Accused charged under Section 302 IPC. Prosecution relied on circumstantial evidence. Defense highlighted procedural lapses.',
//     createdAt: new Date()
//   },
//   {
//     caseName: 'Meera Devi vs Municipal Corporation',
//     status: 'completed',
//     year: 2020,
//     court: 'Delhi High Court',
//     judgmentText:
//       'Petitioner suffered injuries due to potholes. Municipal authority argued contributory negligence.',
//     createdAt: new Date()
//   }
// ];

// /* -------------------- CHUNKING -------------------- */
// function chunkText(text, chunkSize = 800, overlap = 200) {
//   const words = text.split(/\s+/);
//   const chunks = [];

//   let start = 0;
//   let index = 0;

//   while (start < words.length) {
//     const end = start + chunkSize;
//     chunks.push({
//       chunkIndex: index,
//       text: words.slice(start, end).join(' ')
//     });
//     start = end - overlap;
//     index++;
//   }

//   return chunks;
// }

// /* -------------------- SEED FUNCTION -------------------- */
// async function seedCasesAndEmbeddings() {
//   try {
//     console.log('🔗 Connecting to MongoDB...');
//     await mongoClient.connect();

//     const db = mongoClient.db(DB_NAME);
//     const collection = db.collection('cases');

//     await collection.deleteMany({});
//     const insertResult = await collection.insertMany(cases);
//     console.log(`✅ Inserted ${insertResult.insertedCount} cases`);

//     const storedCases = await collection
//       .find({ status: 'completed' })
//       .toArray();

//     let totalVectors = 0;

//     for (const legalCase of storedCases) {
//       console.log(`📄 Processing: ${legalCase.caseName}`);

//       const chunks = chunkText(legalCase.judgmentText);
//       const vectors = [];

//       for (const chunk of chunks) {
//         const embedResult = await embeddingModel.embedContent(chunk.text);

//         vectors.push({
//           id: `${legalCase._id}_${chunk.chunkIndex}`,
//           values: embedResult.embedding.values,
//           metadata: {
//             caseId: legalCase._id.toString(),
//             title: legalCase.caseName,
//             court: legalCase.court,
//             year: legalCase.year,
//             chunkIndex: chunk.chunkIndex,
//             chunkText: chunk.text.slice(0, 1000)
//           }
//         });
//       }

//       await index.upsert(vectors, { namespace: PINECONE_NAMESPACE });

//       totalVectors += vectors.length;
//       console.log(`✅ Inserted ${vectors.length} vectors`);
//     }

//     console.log(`🎯 DONE. Total vectors inserted: ${totalVectors}`);
//     await mongoClient.close();
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Seeding failed:', err);
//     await mongoClient.close();
//     process.exit(1);
//   }
// }

// /* -------------------- RUN -------------------- */
// seedCasesAndEmbeddings();













/**
 * seedEmbeddings.js
 * Run from: server/seeds
 * Command: node seedEmbeddings.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';

/* -------------------- ENV SETUP -------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '..', '.env')
});

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY missing');
  process.exit(1);
}
if (!process.env.PINECONE_INDEX) {
  console.error('❌ PINECONE_INDEX missing');
  process.exit(1);
}

/* -------------------- CONFIG -------------------- */
const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/legalgenie';

const DB_NAME = process.env.MONGO_DB_NAME || 'legalgenie';
const PINECONE_INDEX = process.env.PINECONE_INDEX;
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'judgments';

/* -------------------- CLIENTS -------------------- */
const mongoClient = new MongoClient(MONGO_URI);

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const index = pinecone.index(PINECONE_INDEX);

/* -------------------- CASE DATA (SAMPLE) -------------------- */
const cases = [
  {
    caseName: 'State of X vs Rahul Sharma',
    status: 'completed',
    year: 2018,
    court: 'Supreme Court of India',
    judgmentText:
      'Accused charged under Section 302 IPC. Prosecution relied on circumstantial evidence. Defense highlighted procedural lapses.',
    createdAt: new Date('2025-01-01')
  },
  {
    caseName: 'Meera Devi vs Municipal Corporation',
    status: 'completed',
    year: 2020,
    court: 'Delhi High Court',
    judgmentText:
      'Petitioner suffered injuries due to potholes. Municipal authority argued contributory negligence.',
    createdAt: new Date('2025-01-01')
  },
  {
    caseName: 'Rohit Verma vs Union of India',
    status: 'completed',
    year: 2015,
    court: 'Supreme Court of India',
    judgmentText:
      'Challenge to government notification on grounds of arbitrariness.',
    createdAt: new Date('2025-01-01')
  },
  {
    caseName: 'Anita Singh vs State of Y',
    status: 'completed',
    year: 2019,
    court: 'Bombay High Court',
    judgmentText:
      'Bail application filed in a narcotics case citing prolonged custody.',
    createdAt: new Date('2025-01-01')
  },
  {
    caseName: 'Arjun Mehta vs ABC Pvt Ltd',
    status: 'completed',
    year: 2021,
    court: 'National Consumer Disputes Redressal Commission',
    judgmentText:
      'Defective product supplied causing financial loss.',
    createdAt: new Date('2025-01-01')
  },
  {
    caseName: 'Kavita Rao vs State Transport Authority',
    status: 'completed',
    year: 2017,
    court: 'Madras High Court',
    judgmentText:
      'Permit cancellation challenged as arbitrary and without proper hearing.',
    createdAt: new Date('2025-01-01')
  }
];


/* -------------------- CHUNKING -------------------- */
function chunkText(text, chunkSize = 800, overlap = 200) {
  const words = text.split(/\s+/);
  const chunks = [];

  let start = 0;
  let index = 0;

  while (start < words.length) {
    const end = start + chunkSize;
    chunks.push({
      chunkIndex: index,
      text: words.slice(start, end).join(' ')
    });
    start = end - overlap;
    index++;
  }

  return chunks;
}

/* -------------------- SEED FUNCTION -------------------- */
async function seedCasesAndEmbeddings() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoClient.connect();

    const db = mongoClient.db(DB_NAME);
    const collection = db.collection('cases');

    await collection.deleteMany({});
    const insertResult = await collection.insertMany(cases);
    console.log(`✅ Inserted ${insertResult.insertedCount} cases`);

    const storedCases = await collection
      .find({ status: 'completed' })
      .toArray();

    let totalVectors = 0;

    for (const legalCase of storedCases) {
      console.log(`📄 Processing: ${legalCase.caseName}`);

      const chunks = chunkText(legalCase.judgmentText);

      const embedResponse = await genAI.models.embedContent({
        model: 'gemini-embedding-001',
        contents: chunks.map(c => c.text)
      });

      const vectors = chunks.map((chunk, i) => ({
        id: `${legalCase._id}_${chunk.chunkIndex}`,
        values: embedResponse.embeddings[i].values,
        metadata: {
          caseId: legalCase._id.toString(),
          title: legalCase.caseName,
          court: legalCase.court,
          year: legalCase.year,
          chunkIndex: chunk.chunkIndex,
          text: chunk.text.slice(0, 1000)
        }
      }));

      await index.upsert(vectors, { namespace: PINECONE_NAMESPACE });

      totalVectors += vectors.length;
      console.log(`✅ Inserted ${vectors.length} vectors`);
    }

    console.log(`🎯 DONE. Total vectors inserted: ${totalVectors}`);
    await mongoClient.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    await mongoClient.close();
    process.exit(1);
  }
}

/* -------------------- RUN -------------------- */
seedCasesAndEmbeddings();
