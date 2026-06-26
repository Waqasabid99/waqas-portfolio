"use server";

import { apiRequest } from "@/api/apiHandler";
import { revalidateTag } from "next/cache";

export const getAdminPortfolioProjects = async () => {
    const response = await apiRequest({
        url: "/portfolio/portfolio-projects",
        method: "GET",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return []
    };

    console.log(response)
    return response || [];
};

export const updateAdminPortfolioProject = async (id, payload) => {
    const response = await apiRequest({
        url: `/portfolio/admin/portfolio-projects?id=${id}`,
        method: "PUT",
        data: payload,
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    };

    revalidateTag("portfolio-projects", "max");
    return response || [];
};

export const getAdminPortfolioStats = async () => {
    const response = await apiRequest({
        url: "/portfolio/admin/portfolio-stats",
        method: "GET",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return []
    };

    console.log(response)
    return response || [];
};

export const createAdminPortfolioProject = async (payload) => {
    const response = await apiRequest({
        url: "/portfolio/admin/portfolio-projects",
        method: "POST",
        data: payload,
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    };

    revalidateTag("portfolio-projects", "max");
    return response || [];
};

export const getPortfolioProjects = async () => {
    const response = await apiRequest({
        url: "/portfolio/portfolio-projects",
        method: "GET",
        withCredentials: false,
        tags: ["portfolio-projects"]
    });

    if (!response.success) {
        return response
    }

    console.log(response)
    return response || [];
};

export const deleteAdminPortfolioProject = async (projectId) => {
    const response = await apiRequest({
        url: `/portfolio/admin/portfolio-projects/${projectId}`,
        method: "DELETE",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    };

    revalidateTag("portfolio-projects", "max");
    return response || [];
};
