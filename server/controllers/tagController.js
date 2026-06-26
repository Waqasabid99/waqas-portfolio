import prisma from "../config/prisma.js";
import { apiResponse, asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/error.js";

export const getBlogTags = asyncHandler(async (req, res) => {
    const { search } = req.query;

    const tags = await prisma.blogTag.findMany({
        where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
        orderBy: { name: "asc" },
        include: { _count: { select: { blogs: true } } },
    });

    return apiResponse(res, 200, true, "Tags fetched successfully", { tags });
});

export const deleteBlogTag = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingTag = await prisma.blogTag.findUnique({ where: { id } });
    if (!existingTag) throw ApiError.notFound("Tag not found");

    await prisma.blogTag.delete({ where: { id } });

    return apiResponse(res, 200, true, "Tag deleted successfully");
});
