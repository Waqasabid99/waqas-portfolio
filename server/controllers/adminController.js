import { prisma } from "../config/prisma.js";
import { hashPassword, verifyPassword } from "../utils/auth.js";
import getFeaturePrice from "../utils/priceCalculator.js";

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingAdmin = await prisma.admin.findUnique({ where: { email } });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin email already registered",
            });
        }

        const hashedPassword = await hashPassword(password);

        const admin = await prisma.admin.create({
            data: { name, email, password: hashedPassword, role: "admin" },
        });

        req.session.adminId = admin.id;
        req.session.adminEmail = admin.email;
        req.session.adminName = admin.name;
        req.session.adminRole = admin.role;

        return res.status(201).json({
            success: true,
            message: "Admin account created successfully",
            admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
        });
    } catch (error) {
        console.error("Admin registration error:", error);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isValidPassword = await verifyPassword(password, admin.password);

        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        req.session.adminId = admin.id;
        req.session.adminEmail = admin.email;
        req.session.adminName = admin.name;
        req.session.adminRole = admin.role;

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
        });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
};

export const logoutAdmin = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Could not log out" });
        }
        return res.json({ success: true, message: "Admin logged out successfully" });
    });
};

export const checkAdminSession = (req, res) => {
    if (req.session.adminId) {
        return res.json({
            success: true,
            isAuthenticated: true,
            admin: {
                id: req.session.adminId,
                email: req.session.adminEmail,
                name: req.session.adminName,
                role: req.session.adminRole,
            },
        });
    }
    return res.json({ success: false, isAuthenticated: false });
};

// ─────────────────────────────────────────────
// PROJECTS — helpers
// ─────────────────────────────────────────────

/** Attach sub-detail relations to an array of Prisma project objects */
const attachProjectDetails = async (projects) => {
    return Promise.all(
        projects.map(async (project) => {
            const out = { ...project };

            if (project.webDevelopmentDetail) {
                out.webFeatures = await prisma.webDevelopmentFeature.findMany({
                    where: { web_dev_detail_id: project.webDevelopmentDetail.id },
                    select: { feature: true, price: true },
                });
            }

            if (project.seoDetail) {
                out.seoTypes = await prisma.seoType.findMany({
                    where: { seo_detail_id: project.seoDetail.id },
                    select: { seo_type: true, price: true },
                });
            }

            if (project.digitalMarketingDetail) {
                out.marketingServices = await prisma.digitalMarketingService.findMany({
                    where: { digital_marketing_detail_id: project.digitalMarketingDetail.id },
                    select: { service: true, price: true },
                });
                out.socialPlatforms = await prisma.socialPlatform.findMany({
                    where: { digital_marketing_detail_id: project.digitalMarketingDetail.id },
                    select: { platform: true, price: true },
                });
            }

            if (project.contentGenerationDetail) {
                out.contentTypes = await prisma.contentType.findMany({
                    where: { content_generation_detail_id: project.contentGenerationDetail.id },
                    select: { content_type: true, price: true },
                });
                out.contentLanguages = await prisma.contentLanguage.findMany({
                    where: { content_generation_detail_id: project.contentGenerationDetail.id },
                    select: { language: true, price: true },
                });
            }

            if (project.appDevelopmentDetail) {
                out.appFeatures = await prisma.appFeature.findMany({
                    where: { app_development_detail_id: project.appDevelopmentDetail.id },
                    select: { feature: true, price: true },
                });
            }

            return out;
        })
    );
};

const projectInclude = {
    user: { select: { id: true, full_name: true, email: true } },
    webDevelopmentDetail: true,
    seoDetail: true,
    digitalMarketingDetail: true,
    contentGenerationDetail: true,
    appDevelopmentDetail: true,
};

// ─────────────────────────────────────────────
// PROJECTS — CRUD
// ─────────────────────────────────────────────

export const getAllProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: projectInclude,
            orderBy: { created_at: "desc" },
        });

        const detailed = await attachProjectDetails(projects);

        return res.json({ success: true, projects: detailed });
    } catch (error) {
        console.error("Get admin projects error:", error);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const project = await prisma.project.findUnique({
            where: { id },
            include: projectInclude,
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const [detailed] = await attachProjectDetails([project]);

        return res.json({ success: true, project: detailed });
    } catch (error) {
        console.error("Get project details error:", error);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
};

export const updateProjectStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        const validStatuses = ["pending", "in-progress", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const currentProject = await prisma.project.findUnique({
            where: { id },
            select: { id: true, status: true },
        });

        if (!currentProject) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        await prisma.project.update({
            where: { id },
            data: { status },
        });

        await prisma.projectStatusHistory.create({
            data: {
                project_id: id,
                old_status: currentProject.status,
                new_status: status,
                changed_by: req.session.adminName || "Admin",
                notes: `Status changed from ${currentProject.status} to ${status}`,
            },
        });

        return res.json({
            success: true,
            message: "Project status updated successfully",
            project: { id, status },
        });
    } catch (error) {
        console.error("Update project status error:", error);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const project = await prisma.project.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        await prisma.project.delete({ where: { id } });

        return res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error("Delete project error:", error);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
};

export const createProject = async (req, res) => {
    try {
        const {
            username, email, password, projectName, projectTitle, category,
            price, deadline, details,
            tech, webPages, webFeatures,
            seoType,
            digitalMarketingServices, socialPlatforms, marketingDuration,
            targetAudience, marketingBudget,
            contentTypes, contentVolume, contentLanguages,
            contentTone, targetKeywords,
            appType, appFeatures, appComplexity,
            targetPlatforms, expectedUsers,
        } = req.body;

        if (!username || !email || !password || !projectName || !projectTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled",
            });
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            const hashedPassword = await hashPassword(password);
            user = await prisma.user.create({
                data: { full_name: username, email, password: hashedPassword },
            });
        }

        // Create the project
        const project = await prisma.project.create({
            data: {
                username,
                email,
                password: await hashPassword(password),
                project_name: projectName,
                project_title: projectTitle,
                category,
                price: parseFloat(price) || 0,
                deadline: deadline || null,
                details: details || null,
                user_id: user.id,
                status: "pending",
            },
        });

        const projectId = project.id;

        // Category-specific details
        if (category === "web-development") {
            const webDetail = await prisma.webDevelopmentDetail.create({
                data: { project_id: projectId, tech: tech || "", web_pages: parseInt(webPages) || 0 },
            });

            if (webFeatures?.length > 0) {
                await prisma.webDevelopmentFeature.createMany({
                    data: webFeatures.map((feature) => ({
                        web_dev_detail_id: webDetail.id,
                        feature,
                        price: getFeaturePrice(feature, "web"),
                    })),
                });
            }
        }

        if (category === "seo") {
            const seoDetail = await prisma.seoDetail.create({
                data: { project_id: projectId },
            });

            if (seoType?.length > 0) {
                await prisma.seoType.createMany({
                    data: seoType.map((type) => ({
                        seo_detail_id: seoDetail.id,
                        seo_type: type,
                        price: getFeaturePrice(type, "seo"),
                    })),
                });
            }
        }

        if (category === "digital-marketing") {
            const dmDetail = await prisma.digitalMarketingDetail.create({
                data: {
                    project_id: projectId,
                    target_audience: targetAudience || null,
                    marketing_budget: parseFloat(marketingBudget) || null,
                    duration: marketingDuration || null,
                },
            });

            if (digitalMarketingServices?.length > 0) {
                await prisma.digitalMarketingService.createMany({
                    data: digitalMarketingServices.map((service) => ({
                        digital_marketing_detail_id: dmDetail.id,
                        service,
                        price: getFeaturePrice(service, "digital-marketing"),
                    })),
                });
            }

            if (socialPlatforms?.length > 0) {
                await prisma.socialPlatform.createMany({
                    data: socialPlatforms.map((platform) => ({
                        digital_marketing_detail_id: dmDetail.id,
                        platform,
                        price: getFeaturePrice(platform, "social-platform"),
                    })),
                });
            }
        }

        if (category === "content-generation") {
            const contentDetail = await prisma.contentGenerationDetail.create({
                data: {
                    project_id: projectId,
                    volume: contentVolume || null,
                    content_tone: contentTone || null,
                    target_keywords: targetKeywords || null,
                },
            });

            if (contentTypes?.length > 0) {
                await prisma.contentType.createMany({
                    data: contentTypes.map((type) => ({
                        content_generation_detail_id: contentDetail.id,
                        content_type: type,
                        price: getFeaturePrice(type, "content-type"),
                    })),
                });
            }

            if (contentLanguages?.length > 0) {
                await prisma.contentLanguage.createMany({
                    data: contentLanguages.map((language) => ({
                        content_generation_detail_id: contentDetail.id,
                        language,
                        price: getFeaturePrice(language, "content-language"),
                    })),
                });
            }
        }

        if (category === "app-development") {
            const appDetail = await prisma.appDevelopmentDetail.create({
                data: {
                    project_id: projectId,
                    app_type: appType || null,
                    complexity: appComplexity || null,
                    target_platforms: targetPlatforms || null,
                    expected_users: parseInt(expectedUsers) || null,
                },
            });

            if (appFeatures?.length > 0) {
                await prisma.appFeature.createMany({
                    data: appFeatures.map((feature) => ({
                        app_development_detail_id: appDetail.id,
                        feature,
                        price: getFeaturePrice(feature, "app-feature"),
                    })),
                });
            }
        }

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project: {
                id: projectId,
                projectName,
                projectTitle,
                category,
                price: parseFloat(price) || 0,
                status: "pending",
            },
        });
    } catch (error) {
        console.error("Admin create project error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error occurred while creating the project",
        });
    }
};

// ─────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────

export const getAdminStats = async (req, res) => {
    try {
        const [users, projects, contacts, revenueData] = await Promise.all([
            prisma.user.count(),
            prisma.project.count(),
            prisma.contactForm.count(),
            prisma.project.aggregate({
                _sum: { price: true },
                where: { status: "completed" },
            }),
        ]);

        return res.json({
            success: true,
            stats: {
                users,
                projects,
                contacts,
                revenue: revenueData._sum.price || 0,
            },
        });
    } catch (error) {
        console.error("Get admin stats error:", error);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
};
