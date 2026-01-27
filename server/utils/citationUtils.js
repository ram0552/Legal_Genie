/**
 * Citation utility helpers
 */

/**
 * Add paragraph numbers to text
 * @param {string} text - Document text
 * @returns {string} - Text with [Para N] markers
 */
export const addParagraphNumbers = (text) => {
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.map((p, i) => `[Para ${i + 1}] ${p}`).join('\n\n');
};

/**
 * Find paragraph containing a quote
 * @param {string} fullText - Full document text
 * @param {string} quote - Quote to find
 * @returns {number|null} - Paragraph number or null
 */
export const findParagraphNumber = (fullText, quote) => {
    const paragraphs = fullText.split(/\n\n+/);
    const normalizedQuote = quote.toLowerCase().trim();

    for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].toLowerCase().includes(normalizedQuote)) {
            return i + 1;
        }
    }

    return null;
};

/**
 * Extract text around a citation
 * @param {string} fullText - Full document text
 * @param {string} citation - Citation reference
 * @param {number} contextWords - Words of context
 * @returns {string} - Text snippet around citation
 */
export const getCitationContext = (fullText, citation, contextWords = 50) => {
    const index = fullText.indexOf(citation);
    if (index === -1) return '';

    const words = fullText.split(/\s+/);
    const citationWordIndex = fullText.slice(0, index).split(/\s+/).length;

    const start = Math.max(0, citationWordIndex - contextWords);
    const end = Math.min(words.length, citationWordIndex + contextWords);

    return words.slice(start, end).join(' ');
};

export default {
    addParagraphNumbers,
    findParagraphNumber,
    getCitationContext
};
