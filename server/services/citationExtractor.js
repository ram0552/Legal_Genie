/**
 * Extract legal citations from text
 * Handles Indian law references: IPC sections, Constitution articles, Acts
 */

// Patterns for common Indian legal citations
const PATTERNS = {
    ipcSection: /Section\s+(\d+[A-Z]?)\s+(?:of\s+)?(?:the\s+)?(?:Indian\s+Penal\s+Code|IPC|I\.P\.C\.)/gi,
    crpcSection: /Section\s+(\d+[A-Z]?)\s+(?:of\s+)?(?:the\s+)?(?:Code\s+of\s+Criminal\s+Procedure|Cr\.?P\.?C\.?|CrPC)/gi,
    cpcSection: /Section\s+(\d+[A-Z]?)\s+(?:of\s+)?(?:the\s+)?(?:Code\s+of\s+Civil\s+Procedure|C\.?P\.?C\.?|CPC)/gi,
    constitutionArticle: /Article\s+(\d+[A-Z]?(?:\s*\([a-z0-9]+\))?)\s+(?:of\s+)?(?:the\s+)?Constitution/gi,
    genericSection: /Section\s+(\d+[A-Z]?(?:\s*\([a-z0-9]+\))?)\s+of\s+(?:the\s+)?([A-Z][a-zA-Z\s]+Act(?:,?\s+\d{4})?)/gi,
    caseReference: /(\d{4})\s*\(\d+\)\s*(?:SCC|SCR|AIR|SC)\s+\d+/g,
    airCitation: /AIR\s+(\d{4})\s+(?:SC|HC|[A-Z]+)\s+\d+/gi
};

/**
 * Extract all citations from text
 * @param {string} text - Legal document text
 * @returns {Array<{type: string, section: string, act: string, reference: string}>}
 */
export const extractCitations = (text) => {
    const citations = [];
    const seen = new Set();

    // IPC Sections
    let match;
    while ((match = PATTERNS.ipcSection.exec(text)) !== null) {
        const ref = `Section ${match[1]} IPC`;
        if (!seen.has(ref)) {
            seen.add(ref);
            citations.push({
                type: 'statute',
                section: match[1],
                act: 'Indian Penal Code',
                reference: ref
            });
        }
    }

    // CrPC Sections
    PATTERNS.crpcSection.lastIndex = 0;
    while ((match = PATTERNS.crpcSection.exec(text)) !== null) {
        const ref = `Section ${match[1]} CrPC`;
        if (!seen.has(ref)) {
            seen.add(ref);
            citations.push({
                type: 'statute',
                section: match[1],
                act: 'Code of Criminal Procedure',
                reference: ref
            });
        }
    }

    // CPC Sections
    PATTERNS.cpcSection.lastIndex = 0;
    while ((match = PATTERNS.cpcSection.exec(text)) !== null) {
        const ref = `Section ${match[1]} CPC`;
        if (!seen.has(ref)) {
            seen.add(ref);
            citations.push({
                type: 'statute',
                section: match[1],
                act: 'Code of Civil Procedure',
                reference: ref
            });
        }
    }

    // Constitution Articles
    PATTERNS.constitutionArticle.lastIndex = 0;
    while ((match = PATTERNS.constitutionArticle.exec(text)) !== null) {
        const ref = `Article ${match[1]} of Constitution`;
        if (!seen.has(ref)) {
            seen.add(ref);
            citations.push({
                type: 'constitutional',
                article: match[1],
                act: 'Constitution of India',
                reference: ref
            });
        }
    }

    // Generic Act Sections
    PATTERNS.genericSection.lastIndex = 0;
    while ((match = PATTERNS.genericSection.exec(text)) !== null) {
        const ref = `Section ${match[1]} of ${match[2]}`;
        if (!seen.has(ref)) {
            seen.add(ref);
            citations.push({
                type: 'statute',
                section: match[1],
                act: match[2].trim(),
                reference: ref
            });
        }
    }

    // Case References
    PATTERNS.caseReference.lastIndex = 0;
    while ((match = PATTERNS.caseReference.exec(text)) !== null) {
        const ref = match[0];
        if (!seen.has(ref)) {
            seen.add(ref);
            citations.push({
                type: 'case',
                year: match[1],
                reference: ref
            });
        }
    }

    return citations;
};

/**
 * Format citations as clickable tags
 * @param {Array} citations - Extracted citations
 * @returns {Array<{label: string, type: string, color: string}>}
 */
export const formatCitationsAsTags = (citations) => {
    return citations.map(c => ({
        label: c.reference,
        type: c.type,
        color: c.type === 'constitutional' ? 'blue' :
            c.type === 'case' ? 'purple' : 'green'
    }));
};

export default { extractCitations, formatCitationsAsTags };
