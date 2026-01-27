import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const key = (process.env.GEMINI_API_KEY || '').trim();

async function testConnection() {
    console.log('--- LegalGenie AI Diagnostics ---');
    console.log('Testing Key:', key ? (key.substring(0, 7) + '...' + key.substring(key.length - 4)) : 'EMPTY');
    console.log('Key Length:', key.length);

    if (!key) {
        console.error('❌ Error: GEMINI_API_KEY is empty!');
        return;
    }

    const client = new GoogleGenAI({ apiKey: key });

    try {
        console.log('\n1. Testing Text Generation (gemini-2.0-flash)...');
        const result = await client.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: 'Say "AI is working"' }] }]
        });
        console.log('✅ Success:', result.response.text());
    } catch (e) {
        console.error('❌ Text Generation Failed:', e.message);
    }

    try {
        console.log('\n2. Testing Embeddings (text-embedding-001)...');
        const embedResult = await client.models.embedContent({
            model: 'text-embedding-001',
            content: { parts: [{ text: 'Legal research is fun' }] }
        });
        console.log('✅ Success: Embedding generated (Length:', embedResult.embeddings[0].values.length, ')');
    } catch (e) {
        console.error('❌ Embedding Failed:', e.message);
    }

    console.log('\n--- Diagnostics Complete ---');
}

testConnection();
