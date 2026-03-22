import prisma from "../config/prisma.js";

export const getPortfolioProjects = async (req, res) => {
    try {
        const { category, featured } = req.query;

        const whereClause = { status: "active" };

        if (category && category !== "all") {
            whereClause.category = category;
        }

        if (featured === "true") {
            whereClause.featured = true;
        }

        const portfolioProjects = await prisma.portfolioProject.findMany({
            where: whereClause,
            orderBy: { created_at: "desc" },
        });

        const projectsWithParsedTechnologies = portfolioProjects.map(project => ({
            ...project,
            technologies: JSON.parse(project.technologies || "[]")
        }));

        res.json({
            success: true,
            projects: projectsWithParsedTechnologies
        });

    } catch (error) {
        console.error("Get portfolio projects error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred"
        });
    }
};

export const getAdminPortfolioProjects = async (req, res) => {
    try {
        const portfolioProjects = await prisma.portfolioProject.findMany({
            orderBy: { created_at: "desc" },
        });

        const projectsWithParsedTechnologies = portfolioProjects.map(project => ({
            ...project,
            technologies: JSON.parse(project.technologies || "[]")
        }));

        res.json({
            success: true,
            projects: projectsWithParsedTechnologies
        });

    } catch (error) {
        console.error("Get admin portfolio projects error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred"
        });
    }
};

export const createPortfolioProject = async (req, res) => {
    try {
        const {
            title,
            category,
            image,
            description,
            technologies,
            liveUrl,
            githubUrl,
            featured,
            status
        } = req.body;

        if (!title || !category || !image || !description || !technologies || !liveUrl) {
            return res.status(400).json({
                success: false,
                message: "Title, category, image, description, technologies, and live URL are required"
            });
        }

        if (!Array.isArray(technologies)) {
            return res.status(400).json({
                success: false,
                message: "Technologies must be an array"
            });
        }

        const project = await prisma.portfolioProject.create({
            data: {
                title,
                category,
                image,
                description,
                technologies: JSON.stringify(technologies),
                live_url: liveUrl,
                github_url: githubUrl || null,
                featured: featured || false,
                status: status || "active"
            }
        });

        res.status(201).json({
            success: true,
            message: "Portfolio project created successfully",
            project: {
                id: project.id,
                title,
                category,
                image,
                description,
                technologies,
                liveUrl,
                githubUrl: githubUrl || null,
                featured: featured || false,
                status: status || "active"
            }
        });

    } catch (error) {
        console.error("Create portfolio project error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred while creating the portfolio project"
        });
    }
};

export const updatePortfolioProject = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            category,
            image,
            description,
            technologies,
            liveUrl,
            githubUrl,
            featured,
            status
        } = req.body;

        const existingProject = await prisma.portfolioProject.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Portfolio project not found"
            });
        }

        if (technologies && !Array.isArray(technologies)) {
            return res.status(400).json({
                success: false,
                message: "Technologies must be an array"
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (category) updateData.category = category;
        if (image) updateData.image = image;
        if (description) updateData.description = description;
        if (technologies) updateData.technologies = JSON.stringify(technologies);
        if (liveUrl) updateData.live_url = liveUrl;
        if (githubUrl !== undefined) updateData.github_url = githubUrl;
        if (featured !== undefined) updateData.featured = featured;
        if (status) updateData.status = status;

        const updatedProject = await prisma.portfolioProject.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json({
            success: true,
            message: "Portfolio project updated successfully",
            project: {
                ...updatedProject,
                technologies: JSON.parse(updatedProject.technologies)
            }
        });

    } catch (error) {
        console.error("Update portfolio project error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred while updating the portfolio project"
        });
    }
};

export const deletePortfolioProject = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProject = await prisma.portfolioProject.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Portfolio project not found"
            });
        }

        await prisma.portfolioProject.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            success: true,
            message: "Portfolio project deleted successfully"
        });

    } catch (error) {
        console.error("Delete portfolio project error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred while deleting the portfolio project"
        });
    }
};

export const getPortfolioProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await prisma.portfolioProject.findFirst({
            where: { id: parseInt(id), status: "active" }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Portfolio project not found"
            });
        }

        res.json({
            success: true,
            project: {
                ...project,
                technologies: JSON.parse(project.technologies)
            }
        });

    } catch (error) {
        console.error("Get portfolio project error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred"
        });
    }
};

export const getPortfolioStats = async (req, res) => {
    try {
        const totalProjects = await prisma.portfolioProject.count();
        const activeProjects = await prisma.portfolioProject.count({
            where: { status: "active" }
        });
        const featuredProjects = await prisma.portfolioProject.count({
            where: { featured: true }
        });

        const categoryStats = await prisma.portfolioProject.groupBy({
            by: ['category'],
            _count: true
        });

        const stats = {
            total: totalProjects,
            active: activeProjects,
            featured: featuredProjects,
            byCategory: categoryStats.reduce((acc, item) => {
                acc[item.category] = item._count;
                return acc;
            }, {})
        };

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error("Get portfolio stats error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred"
        });
    }
};
