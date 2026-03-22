import prisma from "../config/prisma.js";
import { hashPassword } from "../utils/auth.js";
import getFeaturePrice from "../utils/priceCalculator.js";

export const hireProject = async (req, res) => {
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
            targetPlatforms, expectedUsers
        } = req.body;

        if (!username || !email || !password || !projectName || !projectTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        const result = await prisma.$transaction(async (tx) => {
            let user = await tx.user.findUnique({ where: { email } });

            if (!user) {
                const hashedPassword = await hashPassword(password);
                user = await tx.user.create({
                    data: {
                        full_name: username,
                        email,
                        password: hashedPassword
                    }
                });
            }

            const projectData = {
                username,
                email,
                password: await hashPassword(password),
                project_name: projectName,
                project_title: projectTitle,
                category,
                price: parseFloat(price) || 0,
                deadline: deadline || null,
                details: details || null,
                user_id: user.id
            };

            if (category === "web-development") {
                projectData.webDevelopmentDetail = {
                    create: {
                        tech: tech || "",
                        web_pages: parseInt(webPages) || 0,
                        features: {
                            create: (webFeatures || []).map(feature => ({
                                feature,
                                price: getFeaturePrice(feature, "web")
                            }))
                        }
                    }
                };
            } else if (category === "seo") {
                projectData.seoDetail = {
                    create: {
                        seoTypes: {
                            create: (seoType || []).map(type => ({
                                seo_type: type,
                                price: getFeaturePrice(type, "seo")
                            }))
                        }
                    }
                };
            } else if (category === "digital-marketing") {
                projectData.digitalMarketingDetail = {
                    create: {
                        target_audience: targetAudience || null,
                        marketing_budget: parseFloat(marketingBudget) || null,
                        duration: marketingDuration || null,
                        services: {
                            create: (digitalMarketingServices || []).map(service => ({
                                service,
                                price: getFeaturePrice(service, "digital-marketing")
                            }))
                        },
                        socialPlatforms: {
                            create: (socialPlatforms || []).map(platform => ({
                                platform,
                                price: getFeaturePrice(platform, "social-platform")
                            }))
                        }
                    }
                };
            } else if (category === "content-generation") {
                projectData.contentGenerationDetail = {
                    create: {
                        volume: contentVolume || null,
                        content_tone: contentTone || null,
                        target_keywords: targetKeywords || null,
                        contentTypes: {
                            create: (contentTypes || []).map(type => ({
                                content_type: type,
                                price: getFeaturePrice(type, "content-type")
                            }))
                        },
                        contentLanguages: {
                            create: (contentLanguages || []).map(language => ({
                                language,
                                price: getFeaturePrice(language, "content-language")
                            }))
                        }
                    }
                };
            } else if (category === "app-development") {
                projectData.appDevelopmentDetail = {
                    create: {
                        app_type: appType || null,
                        complexity: appComplexity || null,
                        target_platforms: targetPlatforms || null,
                        expected_users: parseInt(expectedUsers) || null,
                        appFeatures: {
                            create: (appFeatures || []).map(feature => ({
                                feature,
                                price: getFeaturePrice(feature, "app-feature")
                            }))
                        }
                    }
                };
            }

            const project = await tx.project.create({
                data: projectData
            });

            return { user, project };
        });

        req.session.userId = result.user.id;
        req.session.userEmail = result.user.email;
        req.session.userName = result.user.full_name;

        res.status(201).json({
            success: true,
            message: "Project request submitted successfully",
            project: {
                id: result.project.id,
                projectName: projectName,
                projectTitle: projectTitle,
                category: category,
                price: parseFloat(price) || 0
            }
        });

    } catch (error) {
        console.error("Hire form error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred while processing your request"
        });
    }
};

export const addProject = async (req, res) => {
    try {
        const {
            projectName, projectTitle, category, price, deadline, details,
            tech, webPages, webFeatures,
            seoType,
            digitalMarketingServices, socialPlatforms, marketingDuration,
            targetAudience, marketingBudget,
            contentTypes, contentVolume, contentLanguages,
            contentTone, targetKeywords,
            appType, appFeatures, appComplexity,
            targetPlatforms, expectedUsers
        } = req.body;

        if (!projectName || !projectTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "Project name, title, and category are required"
            });
        }

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: req.session.userId }
            });

            if (!user) {
                throw new Error("User not found");
            }

            const projectData = {
                username: user.full_name,
                email: user.email,
                password: user.password,
                project_name: projectName,
                project_title: projectTitle,
                category,
                price: parseFloat(price) || 0,
                deadline: deadline || null,
                details: details || null,
                status: "pending",
                user_id: user.id
            };

            if (category === "web-development") {
                projectData.webDevelopmentDetail = {
                    create: {
                        tech: tech || "",
                        web_pages: parseInt(webPages) || 0,
                        features: {
                            create: (webFeatures || []).map(feature => ({
                                feature,
                                price: getFeaturePrice(feature, "web")
                            }))
                        }
                    }
                };
            } else if (category === "seo") {
                projectData.seoDetail = {
                    create: {
                        seoTypes: {
                            create: (seoType || []).map(type => ({
                                seo_type: type,
                                price: getFeaturePrice(type, "seo")
                            }))
                        }
                    }
                };
            } else if (category === "digital-marketing") {
                projectData.digitalMarketingDetail = {
                    create: {
                        target_audience: targetAudience || null,
                        marketing_budget: parseFloat(marketingBudget) || null,
                        duration: marketingDuration || null,
                        services: {
                            create: (digitalMarketingServices || []).map(service => ({
                                service,
                                price: getFeaturePrice(service, "digital-marketing")
                            }))
                        },
                        socialPlatforms: {
                            create: (socialPlatforms || []).map(platform => ({
                                platform,
                                price: getFeaturePrice(platform, "social-platform")
                            }))
                        }
                    }
                };
            } else if (category === "content-generation") {
                projectData.contentGenerationDetail = {
                    create: {
                        volume: contentVolume || null,
                        content_tone: contentTone || null,
                        target_keywords: targetKeywords || null,
                        contentTypes: {
                            create: (contentTypes || []).map(type => ({
                                content_type: type,
                                price: getFeaturePrice(type, "content-type")
                            }))
                        },
                        contentLanguages: {
                            create: (contentLanguages || []).map(language => ({
                                language,
                                price: getFeaturePrice(language, "content-language")
                            }))
                        }
                    }
                };
            } else if (category === "app-development") {
                projectData.appDevelopmentDetail = {
                    create: {
                        app_type: appType || null,
                        complexity: appComplexity || null,
                        target_platforms: targetPlatforms || null,
                        expected_users: parseInt(expectedUsers) || null,
                        appFeatures: {
                            create: (appFeatures || []).map(feature => ({
                                feature,
                                price: getFeaturePrice(feature, "app-feature")
                            }))
                        }
                    }
                };
            }

            const project = await tx.project.create({
                data: projectData
            });

            return { project };
        });

        res.status(201).json({
            success: true,
            message: "Project added successfully",
            project: {
                id: result.project.id,
                projectName: projectName,
                projectTitle: projectTitle,
                category: category,
                price: parseFloat(price) || 0,
                status: "pending"
            }
        });

    } catch (error) {
        console.error("Add project error:", error);
        if (error.message === "User not found") {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error occurred while adding the project"
        });
    }
};

export const getUserProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: { user_id: req.session.userId },
            orderBy: { created_at: 'desc' },
            include: {
                webDevelopmentDetail: {
                    include: { features: true }
                },
                seoDetail: {
                    include: { seoTypes: true }
                },
                digitalMarketingDetail: {
                    include: { services: true, socialPlatforms: true }
                },
                contentGenerationDetail: {
                    include: { contentTypes: true, contentLanguages: true }
                },
                appDevelopmentDetail: {
                    include: { appFeatures: true }
                }
            }
        });

        const formattedProjects = projects.map(p => {
            const formatted = { ...p };

            if (p.webDevelopmentDetail) {
                formatted.web_dev_id = p.webDevelopmentDetail.id;
                formatted.tech = p.webDevelopmentDetail.tech;
                formatted.web_pages = p.webDevelopmentDetail.web_pages;
                formatted.webFeatures = p.webDevelopmentDetail.features.map(f => ({
                    feature: f.feature, price: f.price
                }));
                delete formatted.webDevelopmentDetail;
            }

            if (p.seoDetail) {
                formatted.seo_id = p.seoDetail.id;
                formatted.seoTypes = p.seoDetail.seoTypes.map(t => ({
                    seo_type: t.seo_type, price: t.price
                }));
                delete formatted.seoDetail;
            }

            if (p.digitalMarketingDetail) {
                formatted.digital_marketing_id = p.digitalMarketingDetail.id;
                formatted.target_audience = p.digitalMarketingDetail.target_audience;
                formatted.marketing_budget = p.digitalMarketingDetail.marketing_budget;
                formatted.duration = p.digitalMarketingDetail.duration;
                formatted.marketingServices = p.digitalMarketingDetail.services.map(s => ({
                    service: s.service, price: s.price
                }));
                formatted.socialPlatforms = p.digitalMarketingDetail.socialPlatforms.map(s => ({
                    platform: s.platform, price: s.price
                }));
                delete formatted.digitalMarketingDetail;
            }

            if (p.contentGenerationDetail) {
                formatted.content_id = p.contentGenerationDetail.id;
                formatted.volume = p.contentGenerationDetail.volume;
                formatted.content_tone = p.contentGenerationDetail.content_tone;
                formatted.target_keywords = p.contentGenerationDetail.target_keywords;
                formatted.contentTypes = p.contentGenerationDetail.contentTypes.map(c => ({
                    content_type: c.content_type, price: c.price
                }));
                formatted.contentLanguages = p.contentGenerationDetail.contentLanguages.map(c => ({
                    language: c.language, price: c.price
                }));
                delete formatted.contentGenerationDetail;
            }

            if (p.appDevelopmentDetail) {
                formatted.app_dev_id = p.appDevelopmentDetail.id;
                formatted.app_type = p.appDevelopmentDetail.app_type;
                formatted.complexity = p.appDevelopmentDetail.complexity;
                formatted.target_platforms = p.appDevelopmentDetail.target_platforms;
                formatted.expected_users = p.appDevelopmentDetail.expected_users;
                formatted.appFeatures = p.appDevelopmentDetail.appFeatures.map(a => ({
                    feature: a.feature, price: a.price
                }));
                delete formatted.appDevelopmentDetail;
            }

            return formatted;
        });

        res.json({
            success: true,
            projects: formattedProjects
        });

    } catch (error) {
        console.error("Get projects error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred"
        });
    }
};
