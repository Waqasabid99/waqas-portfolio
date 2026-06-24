"use server";

import { apiRequest } from "@/api/apiHandler";

export const getAdminStats = async () => {
    const response = await apiRequest({
        url: "/admin/stats",
        method: "GET",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    console.log(response)
    return response || [];
};

export const getAdminProjects = async () => {
    const response = await apiRequest({
        url: "/admin/projects",
        method: "GET",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    console.log(response)
    return response || [];
};

export const getSingleProject = async (projectId) => {
    const response = await apiRequest({
        url: `/admin/projects/${projectId}`,
        method: "GET",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};

export const getAdminPortfolioProjects = async () => {
    const response = await apiRequest({
        url: "/admin/portfolio-projects",
        method: "GET",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};

export const updateAdminPortfolioProject = async (id, payload) => {
    const response = await apiRequest({
        url: `/admin/portfolio-projects?id=${id}`,
        method: "PUT",
        data: payload,
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};

export const getAdminPortfolioStats = async () => {
    const response = await apiRequest({
        url: "/admin/portfolio-stats",
        method: "GET",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};

export const createAdminPortfolioProject = async (payload) => {
    const response = await apiRequest({
        url: "/admin/portfolio-projects",
        method: "POST",
        data: payload,
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};

export const createAdminProject = async (payload) => {
    const response = await apiRequest({
        url: "/admin/projects",
        method: "POST",
        data: payload,
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};

export const updateAdminProject = async (payload) => {
    const response = await apiRequest({
        url: `/admin/projects/${payload.id}`,
        method: "PUT",
        data: payload,
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};

export const deleteAdminProject = async (projectId) => {
    const response = await apiRequest({
        url: `/admin/projects/${projectId}`,
        method: "DELETE",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};

export const deleteAdminPortfolioProject = async (projectId) => {
    const response = await apiRequest({
        url: `/admin/portfolio-projects/${projectId}`,
        method: "DELETE",
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};

export const updateProjectStatus = async (projectId, payload) => {
    const response = await apiRequest({
        url: `/admin/projects/${projectId}/status`,
        method: "PUT",
        data: payload,
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    return response || [];
};
