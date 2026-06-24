import prisma from "../config/prisma.js";
import slugify from "slugify";

export const createBlog = async (req, res) => {
    try {
        const { title, excerpt, content, cover_image, status, featured, reading_time, author_id, category_id, tags, meta_title, meta_description, keywords, og_image } = req.body;

        if (!title || !excerpt || !content || !author_id || !category_id || !tags) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const slug = slugify(title, {
            lower: true,
            strict: true,
        });

        const blog = await prisma.blog.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                cover_image,
                status,
                featured,
                reading_time,
                author_id,
                category_id,
                tags,
                meta_title,
                meta_description,
                keywords,
                og_image,
            },
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog: {
                id: blog.id,
                title: blog.title,
                slug: blog.slug,
                excerpt: blog.excerpt,
                content: blog.content,
                cover_image: blog.cover_image,
                status: blog.status,
                featured: blog.featured,
                reading_time: blog.reading_time,
                author_id: blog.author_id,
                category_id: blog.category_id,
                tags: blog.tags,
                meta_title: blog.meta_title,
                meta_description: blog.meta_description,
                keywords: blog.keywords,
                og_image: blog.og_image,
            },
        });
    } catch (error) {
        console.error("Blog creation error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred",
        });
    }
};