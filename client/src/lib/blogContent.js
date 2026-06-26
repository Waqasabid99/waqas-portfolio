export function stripHtml(html = "") {
    return html.replace(/<[^>]*>/g, "");
}

export function slugifyHeading(text, index) {
    const base = stripHtml(text)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    return base ? `${base}-${index}` : `heading-${index}`;
}

// Walks the same blocks array as the renderer, incrementing the counter
// only on header blocks — so ids line up between this and BlogContentRenderer
// without needing to pass state between the two components.
export function extractHeadings(blocks = []) {
    let headingIndex = 0;
    return blocks
        .filter((block) => block.type === "header")
        .map((block) => ({
            id: slugifyHeading(block.data.text, headingIndex++),
            text: stripHtml(block.data.text),
            level: block.data.level || 2,
        }));
};
