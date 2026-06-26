import prisma from "../config/prisma.js";
import { BlogStatus } from "../generated/prisma/enums.ts";
import { apiResponse, asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/error.js";
import {
    buildTagConnectOrCreate,
    calculateReadingTime,
    generateExcerptFromContent,
    generateUniqueBlogSlug,
} from "../utils/blogHelper.js";

export const getBlogs = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, tag, search, featured } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));

    const whereClause = { status: BlogStatus.PUBLISHED };

    if (category) whereClause.category = { slug: category };
    if (tag) whereClause.tags = { some: { slug: tag } };
    if (featured === "true") whereClause.featured = true;

    if (search) {
        whereClause.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
        ];
    }

    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
            where: whereClause,
            orderBy: { published_at: "desc" },
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            include: {
                category: true,
                tags: true,
                author: { select: { id: true, full_name: true } },
            },
        }),
        prisma.blog.count({ where: whereClause }),
    ]);

    return apiResponse(res, 200, true, "Blogs fetched successfully", {
        blogs,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.query;

    const blog = await prisma.blog.findFirst({
        where: { slug, status: BlogStatus.PUBLISHED },
        include: {
            category: true,
            tags: true,
            seo: true,
            author: { select: { id: true, full_name: true } },
        },
    });

    if (!blog) throw ApiError.notFound("Blog not found");

    // Don't block the response on this — views are a nice-to-have, not critical data
    prisma.blog
        .update({ where: { id: blog.id }, data: { views: { increment: 1 } } })
        .catch((err) => console.error("Failed to increment blog views:", err));

    return apiResponse(res, 200, true, "Blog fetched successfully", { blog });
});

export const getAdminBlogs = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, search } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));

    const whereClause = {};

    if (status && Object.values(BlogStatus).includes(status.toUpperCase())) {
        whereClause.status = status.toUpperCase();
    }

    if (search) {
        whereClause.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
        ];
    }

    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
            where: whereClause,
            orderBy: { created_at: "desc" },
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            include: {
                category: true,
                tags: true,
                author: { select: { id: true, full_name: true } },
            },
        }),
        prisma.blog.count({ where: whereClause }),
    ]);

    return apiResponse(res, 200, true, "Blogs fetched successfully", {
        blogs,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    });
});

export const getBlogById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
        where: { id },
        include: {
            category: true,
            tags: true,
            seo: true,
            author: { select: { id: true, full_name: true } },
        },
    });

    if (!blog) throw ApiError.notFound("Blog not found");

    return apiResponse(res, 200, true, "Blog fetched successfully", { blog });
});

export const createBlog = asyncHandler(async (req, res) => {
    console.log(req.body);
    const loggedInUser = req.user;
    const { title, excerpt, content, cover_image, status, featured, category_id, tags, seo } = req.body;

    if (!title || !content) throw ApiError.badRequest("Title and content are required");

    if (!content.blocks || !Array.isArray(content.blocks)) {
        throw ApiError.badRequest("Content must be a valid Editor.js document");
    }

    if (status && !Object.values(BlogStatus).includes(status.toUpperCase())) {
        throw ApiError.badRequest("Invalid status");
    }

    if (category_id) {
        const category = await prisma.blogCategory.findUnique({ where: { id: category_id } });
        if (!category) throw ApiError.badRequest("Selected category does not exist");
    }

    const slug = await generateUniqueBlogSlug(title);
    const blogStatus = status?.toUpperCase() || BlogStatus.DRAFT;

    const blog = await prisma.blog.create({
        data: {
            title,
            slug,
            excerpt: excerpt?.trim() || generateExcerptFromContent(content),
            content,
            cover_image: cover_image || null,
            status: blogStatus,
            featured: featured || false,
            reading_time: calculateReadingTime(content),
            author_id: loggedInUser.id,
            category_id: category_id || null,
            published_at: blogStatus === BlogStatus.PUBLISHED ? new Date() : null,
            tags: tags?.length ? { connectOrCreate: buildTagConnectOrCreate(tags) } : undefined,
            seo: seo
                ? {
                    create: {
                        meta_title: seo.meta_title || null,
                        meta_description: seo.meta_description || null,
                        keywords: seo.keywords || null,
                        og_image: seo.og_image || null,
                    },
                }
                : undefined,
        },
        include: {
            category: true,
            tags: true,
            seo: true,
        },
    });

    return apiResponse(res, 201, true, "Blog created successfully", { blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, excerpt, content, cover_image, status, featured, category_id, tags, seo } = req.body;

    const existingBlog = await prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) throw ApiError.notFound("Blog not found");

    if (content && (!content.blocks || !Array.isArray(content.blocks))) {
        throw ApiError.badRequest("Content must be a valid Editor.js document");
    }

    if (status && !Object.values(BlogStatus).includes(status.toUpperCase())) {
        throw ApiError.badRequest("Invalid status");
    }

    if (category_id) {
        const category = await prisma.blogCategory.findUnique({ where: { id: category_id } });
        if (!category) throw ApiError.badRequest("Selected category does not exist");
    }

    const updateData = {};

    if (title && title !== existingBlog.title) {
        updateData.title = title;
        updateData.slug = await generateUniqueBlogSlug(title, existingBlog.id);
    }

    if (content) {
        updateData.content = content;
        updateData.reading_time = calculateReadingTime(content);
    }

    if (excerpt !== undefined) {
        updateData.excerpt = excerpt?.trim() || generateExcerptFromContent(content || existingBlog.content);
    }

    if (cover_image !== undefined) updateData.cover_image = cover_image || null;
    if (featured !== undefined) updateData.featured = featured;
    if (category_id !== undefined) updateData.category_id = category_id || null;

    if (status) {
        const newStatus = status.toUpperCase();
        updateData.status = newStatus;
        if (newStatus === BlogStatus.PUBLISHED && !existingBlog.published_at) {
            updateData.published_at = new Date();
        }
    }

    if (tags) {
        updateData.tags = {
            set: [], // clear existing tags first, then attach the new set below
            connectOrCreate: buildTagConnectOrCreate(tags),
        };
    }

    if (seo) {
        updateData.seo = {
            upsert: {
                create: {
                    meta_title: seo.meta_title || null,
                    meta_description: seo.meta_description || null,
                    keywords: seo.keywords || null,
                    og_image: seo.og_image || null,
                },
                update: {
                    meta_title: seo.meta_title || null,
                    meta_description: seo.meta_description || null,
                    keywords: seo.keywords || null,
                    og_image: seo.og_image || null,
                },
            },
        };
    }

    const updatedBlog = await prisma.blog.update({
        where: { id },
        data: updateData,
        include: {
            category: true,
            tags: true,
            seo: true,
        },
    });

    return apiResponse(res, 200, true, "Blog updated successfully", { blog: updatedBlog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingBlog = await prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) throw ApiError.notFound("Blog not found");

    await prisma.blog.delete({ where: { id } });

    return apiResponse(res, 200, true, "Blog deleted successfully");
});
