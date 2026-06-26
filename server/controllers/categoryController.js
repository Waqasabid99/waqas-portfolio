import prisma from "../config/prisma.js";
import { apiResponse, asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/error.js";
import { slugify } from "../utils/blogHelper.js";

export const getBlogCategories = asyncHandler(async (req, res) => {
    const categories = await prisma.blogCategory.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { blogs: true } } },
    });

    return apiResponse(res, 200, true, "Categories fetched successfully", { categories });
});

export const createBlogCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) throw ApiError.badRequest("Category name is required");

    const slug = slugify(name);

    const existing = await prisma.blogCategory.findUnique({ where: { slug } });
    if (existing) throw ApiError.conflict("A category with this name already exists");

    const category = await prisma.blogCategory.create({
        data: { name: name.trim(), slug },
    });

    return apiResponse(res, 201, true, "Category created successfully", { category });
});

export const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) throw ApiError.badRequest("Category name is required");

    const existingCategory = await prisma.blogCategory.findUnique({ where: { id } });
    if (!existingCategory) throw ApiError.notFound("Category not found");

    const slug = slugify(name);

    const slugClash = await prisma.blogCategory.findFirst({
        where: { slug, id: { not: id } },
    });
    if (slugClash) throw ApiError.conflict("A category with this name already exists");

    const category = await prisma.blogCategory.update({
        where: { id },
        data: { name: name.trim(), slug },
    });

    return apiResponse(res, 200, true, "Category updated successfully", { category });
});

export const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingCategory = await prisma.blogCategory.findUnique({
        where: { id },
        include: { _count: { select: { blogs: true } } },
    });

    if (!existingCategory) throw ApiError.notFound("Category not found");

    if (existingCategory._count.blogs > 0) {
        throw ApiError.conflict("Cannot delete a category that still has blogs assigned to it");
    }

    await prisma.blogCategory.delete({ where: { id } });

    return apiResponse(res, 200, true, "Category deleted successfully");
});
