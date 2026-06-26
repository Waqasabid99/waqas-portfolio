"use server";
import { apiRequest } from "@/api/apiHandler";
import { revalidateTag } from "next/cache";

export const getBlogPosts = async (params = {}) => {
    const response = await apiRequest({
        url: "/blog/posts",
        method: "GET",
        params,
        withCredentials: false,
        tags: ['blogs']
    });

    if (!response) {
        return []
    };

    return response.data;
};

export const getPostBySlug = async (slug) => {
    const response = await apiRequest({
        url: `/blog/posts/slug?slug=${slug}`,
        method: "GET",
        withCredentials: false,
        cache: "no-store",
    });

    if (!response) {
        return null;
    };

    return response.data;
};

export const getBlogById = async (id) => {
    const response = await apiRequest({
        url: `/blog/admin/blogs`,
        method: "GET",
        params: { id },
        withCredentials: true,
    });

    if (!response) {
        return null;
    };

    return response.data.blog;
}

export const getCategories = async () => {
    const response = await apiRequest({
        url: "/blog/categories",
        method: "GET",
        withCredentials: false,
        tags: ['categories']
    });

    if (!response) {
        return []
    }

    return response.data;
};

export const createBlog = async (payload) => {
    const response = await apiRequest({
        url: "/blog/admin/blogs",
        method: "POST",
        data: payload,
        withCredentials: true,
    });

    if (!response) {
        return null;
    }

    revalidateTag("blogs", "max");
    return response.data;
};

export const uploadImage = async (image) => {
    const response = await apiRequest({
        url: "/blog/admin/blogs/upload-image",
        method: "POST",
        data: image,
        withCredentials: true,
    });

    if (!response) {
        return null;
    };

    return response.file;
};

export const deleteImage = async (publicId) => {
    const response = await apiRequest({
        url: "/blog/admin/blogs/delete-image",
        method: "DELETE",
        data: { public_id: publicId },
        withCredentials: true,
    });

    if (!response) {
        return null;
    }

    return response.file;
};
