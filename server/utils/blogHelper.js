import prisma from "../config/prisma.js";

const WORDS_PER_MINUTE = 200;

export const extractTextFromContent = (content) => {
    if (!content?.blocks || !Array.isArray(content.blocks)) return "";

    return content.blocks
        .map((block) => {
            const { type, data } = block;

            switch (type) {
                case "paragraph":
                case "header":
                case "quote":
                    return data?.text || "";
                case "list":
                    return (data?.items || [])
                        .map((item) => (typeof item === "string" ? item : item?.content || ""))
                        .join(" ");
                case "checklist":
                    return (data?.items || []).map((item) => item?.text || "").join(" ");
                case "table":
                    return (data?.content || []).flat().join(" ");
                default:
                    return "";
            }
        })
        .join(" ")
        .replace(/<[^>]*>/g, " "); // strip inline formatting tags (b, i, mark, etc.)
};

export const calculateReadingTime = (content) => {
    const text = extractTextFromContent(content);
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};

export const generateExcerptFromContent = (content, maxLength = 160) => {
    const text = extractTextFromContent(content).trim().replace(/\s+/g, " ");
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
};

export const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

export const generateUniqueBlogSlug = async (title, excludeId = null) => {
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await prisma.blog.findUnique({ where: { slug } });
        if (!existing || existing.id === excludeId) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

export const buildTagConnectOrCreate = (tags = []) =>
    tags
        .filter((tagName) => typeof tagName === "string" && tagName.trim().length > 0)
        .map((tagName) => {
            const tagSlug = slugify(tagName);
            return {
                where: { slug: tagSlug },
                create: { name: tagName.trim(), slug: tagSlug },
            };
        });
