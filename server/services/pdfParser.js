import pdf from 'pdf-parse';

/**
 * Parse PDF buffer and extract text content
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<{text: string, numPages: number, info: object}>}
 */
export const parsePDF = async (pdfBuffer) => {
    try {
        const data = await pdf(pdfBuffer);

        return {
            text: data.text,
            numPages: data.numpages,
            info: data.info
        };
    } catch (error) {
        console.error('PDF parsing error:', error.message);
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
};

/**
 * Clean extracted text by removing excessive whitespace
 * @param {string} text - Raw extracted text
 * @returns {string} - Cleaned text
 */
export const cleanText = (text) => {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .trim();
};

export default { parsePDF, cleanText };
