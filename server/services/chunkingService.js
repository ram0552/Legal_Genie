/**
 * Chunk text into smaller segments for embedding
 * Uses paragraph-based chunking with overlap
 */

const DEFAULT_CHUNK_SIZE = 500; // ~500 words
const DEFAULT_OVERLAP = 100; // ~100 words overlap

/**
 * Split text into chunks with overlap
 * @param {string} text - Full document text
 * @param {number} chunkSize - Target words per chunk
 * @param {number} overlap - Words to overlap between chunks
 * @returns {Array<{text: string, index: number, paragraphNum: number}>}
 */
export const chunkText = (text, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_OVERLAP) => {
    const paragraphs = text.split(/\n\n+/);
    const chunks = [];
    let currentChunk = '';
    let currentWordCount = 0;
    let chunkIndex = 0;
    let paragraphNum = 1;

    for (const paragraph of paragraphs) {
        const words = paragraph.split(/\s+/);
        const paragraphWordCount = words.length;

        if (currentWordCount + paragraphWordCount > chunkSize && currentChunk) {
            // Save current chunk
            chunks.push({
                text: currentChunk.trim(),
                index: chunkIndex,
                paragraphNum: paragraphNum - 1,
                wordCount: currentWordCount
            });

            // Start new chunk with overlap
            const overlapWords = currentChunk.split(/\s+/).slice(-overlap);
            currentChunk = overlapWords.join(' ') + ' ' + paragraph;
            currentWordCount = overlapWords.length + paragraphWordCount;
            chunkIndex++;
        } else {
            currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
            currentWordCount += paragraphWordCount;
        }

        paragraphNum++;
    }

    // Don't forget the last chunk
    if (currentChunk.trim()) {
        chunks.push({
            text: currentChunk.trim(),
            index: chunkIndex,
            paragraphNum,
            wordCount: currentWordCount
        });
    }

    return chunks;
};

/**
 * Chunk by sentence for finer granularity
 */
export const chunkBySentence = (text, sentencesPerChunk = 10) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];

    for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
        const chunkSentences = sentences.slice(i, i + sentencesPerChunk);
        chunks.push({
            text: chunkSentences.join(' ').trim(),
            index: Math.floor(i / sentencesPerChunk),
            sentenceStart: i,
            sentenceEnd: Math.min(i + sentencesPerChunk, sentences.length)
        });
    }

    return chunks;
};

export default { chunkText, chunkBySentence };
