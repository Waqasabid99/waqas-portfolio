"use server";

import { apiRequest } from "@/api/apiHandler"

export const getUserProjects = async () => {
    const response = await apiRequest({
        url: "/project/user-projects",
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

export const createProject = async (payload) => {
    const response = await apiRequest({
        url: "/project/add-project",
        method: "POST",
        data: payload,
        withCredentials: true,
        cache: "no-store"
    });

    if (!response.success) {
        return response
    }

    console.log(response)
    return response || [];
};
