const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { hashPassword, verifyPassword } = require("../utils/auth");
const { isAdminAuthenticated } = require("../middleware/auth");
const getFeaturePrice = require("../utils/priceCalculator");

router.post("/admin/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const [existingAdmin] = await pool.execute(
      "SELECT id FROM admins WHERE email = ?",
      [email]
    );

    if (existingAdmin.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Admin email already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    const [result] = await pool.execute(
      "INSERT INTO admins (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [name, email, hashedPassword, "admin"]
    );

    req.session.adminId = result.insertId;
    req.session.adminEmail = email;
    req.session.adminName = name;
    req.session.adminRole = "admin";

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        id: result.insertId,
        name: name,
        email: email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [admins] = await pool.execute(
      "SELECT id, name, email, password, role FROM admins WHERE email = ?",
      [email]
    );

    if (admins.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const admin = admins[0];
    const isValidPassword = await verifyPassword(password, admin.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;
    req.session.adminName = admin.name;
    req.session.adminRole = admin.role;

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
});

router.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Could not log out",
      });
    }
    res.json({
      success: true,
      message: "Admin logged out successfully",
    });
  });
});

router.get("/admin/check-session", (req, res) => {
  if (req.session.adminId) {
    res.json({
      success: true,
      isAuthenticated: true,
      admin: {
        id: req.session.adminId,
        email: req.session.adminEmail,
        name: req.session.adminName,
        role: req.session.adminRole,
      },
    });
  } else {
    res.json({
      success: false,
      isAuthenticated: false,
    });
  }
});

router.get("/admin/projects", isAdminAuthenticated, async (req, res) => {
  try {
    const [projects] = await pool.execute(`
      SELECT p.*, u.id as user_id, u.full_name as user_name, u.email as user_email,
             wd.id as web_dev_id, wd.tech, wd.web_pages,
             sd.id as seo_id,
             dm.id as digital_marketing_id, dm.target_audience, dm.marketing_budget, dm.duration,
             cd.id as content_id, cd.volume, cd.content_tone, cd.target_keywords,
             ad.id as app_dev_id, ad.app_type, ad.complexity, ad.target_platforms, ad.expected_users
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN web_development_details wd ON p.id = wd.project_id
      LEFT JOIN seo_details sd ON p.id = sd.project_id
      LEFT JOIN digital_marketing_details dm ON p.id = dm.project_id
      LEFT JOIN content_generation_details cd ON p.id = cd.project_id
      LEFT JOIN app_development_details ad ON p.id = ad.project_id
      ORDER BY p.created_at DESC
    `);

    for (let project of projects) {
      if (project.web_dev_id) {
        const [webFeatures] = await pool.execute(
          "SELECT feature, price FROM web_development_features WHERE web_dev_detail_id = ?",
          [project.web_dev_id]
        );
        project.webFeatures = webFeatures;
      }

      if (project.seo_id) {
        const [seoTypes] = await pool.execute(
          "SELECT seo_type, price FROM seo_types WHERE seo_detail_id = ?",
          [project.seo_id]
        );
        project.seoTypes = seoTypes;
      }

      if (project.digital_marketing_id) {
        const [marketingServices] = await pool.execute(
          "SELECT service, price FROM digital_marketing_services WHERE digital_marketing_detail_id = ?",
          [project.digital_marketing_id]
        );
        const [socialPlatforms] = await pool.execute(
          "SELECT platform, price FROM social_platforms WHERE digital_marketing_detail_id = ?",
          [project.digital_marketing_id]
        );
        project.marketingServices = marketingServices;
        project.socialPlatforms = socialPlatforms;
      }

      if (project.content_id) {
        const [contentTypes] = await pool.execute(
          "SELECT content_type, price FROM content_types WHERE content_generation_detail_id = ?",
          [project.content_id]
        );
        const [contentLanguages] = await pool.execute(
          "SELECT language, price FROM content_languages WHERE content_generation_detail_id = ?",
          [project.content_id]
        );
        project.contentTypes = contentTypes;
        project.contentLanguages = contentLanguages;
      }

      if (project.app_dev_id) {
        const [appFeatures] = await pool.execute(
          "SELECT feature, price FROM app_features WHERE app_development_detail_id = ?",
          [project.app_dev_id]
        );
        project.appFeatures = appFeatures;
      }
    }

    res.json({
      success: true,
      projects
    });

  } catch (error) {
    console.error("Get admin projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred"
    });
  }
});

router.get("/admin/stats", isAdminAuthenticated, async (req, res) => {
  try {
    const [userCount] = await pool.execute("SELECT COUNT(*) as count FROM users");
    const [projectCount] = await pool.execute("SELECT COUNT(*) as count FROM projects");
    const [contactCount] = await pool.execute("SELECT COUNT(*) as count FROM contact_forms");
    const [revenueData] = await pool.execute("SELECT SUM(price) as total FROM projects WHERE status = ?", ["completed"]);

    const stats = {
      users: userCount[0].count,
      projects: projectCount[0].count,
      contacts: contactCount[0].count,
      revenue: revenueData[0].total || 0
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred"
    });
  }
});

router.put("/admin/projects/:id/status", isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["pending", "in-progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const [currentProject] = await pool.execute(
      "SELECT id, status FROM projects WHERE id = ?",
      [parseInt(id)]
    );

    if (currentProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await pool.execute(
      "UPDATE projects SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, parseInt(id)]
    );

    await pool.execute(
      "INSERT INTO project_status_history (project_id, old_status, new_status, changed_by, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [parseInt(id), currentProject[0].status, status, req.session.adminName || "Admin", `Status changed from ${currentProject[0].status} to ${status}`]
    );

    res.json({
      success: true,
      message: "Project status updated successfully",
      project: {
        id: parseInt(id),
        status: status,
      },
    });
  } catch (error) {
    console.error("Update project status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
});

router.delete("/admin/projects/:id", isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const [project] = await pool.execute(
      "SELECT id FROM projects WHERE id = ?",
      [parseInt(id)]
    );

    if (project.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await pool.execute("DELETE FROM projects WHERE id = ?", [parseInt(id)]);

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
});

router.get("/admin/projects/:id", isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const [projects] = await pool.execute(`
      SELECT p.*, u.id as user_id, u.full_name as user_name, u.email as user_email,
             wd.id as web_dev_id, wd.tech, wd.web_pages,
             sd.id as seo_id,
             dm.id as digital_marketing_id, dm.target_audience, dm.marketing_budget, dm.duration,
             cd.id as content_id, cd.volume, cd.content_tone, cd.target_keywords,
             ad.id as app_dev_id, ad.app_type, ad.complexity, ad.target_platforms, ad.expected_users
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN web_development_details wd ON p.id = wd.project_id
      LEFT JOIN seo_details sd ON p.id = sd.project_id
      LEFT JOIN digital_marketing_details dm ON p.id = dm.project_id
      LEFT JOIN content_generation_details cd ON p.id = cd.project_id
      LEFT JOIN app_development_details ad ON p.id = ad.project_id
      WHERE p.id = ?
    `, [parseInt(id)]);

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const project = projects[0];

    if (project.web_dev_id) {
      const [webFeatures] = await pool.execute(
        "SELECT feature, price FROM web_development_features WHERE web_dev_detail_id = ?",
        [project.web_dev_id]
      );
      project.webFeatures = webFeatures;
    }

    if (project.seo_id) {
      const [seoTypes] = await pool.execute(
        "SELECT seo_type, price FROM seo_types WHERE seo_detail_id = ?",
        [project.seo_id]
      );
      project.seoTypes = seoTypes;
    }

    if (project.digital_marketing_id) {
      const [marketingServices] = await pool.execute(
        "SELECT service, price FROM digital_marketing_services WHERE digital_marketing_detail_id = ?",
        [project.digital_marketing_id]
      );
      const [socialPlatforms] = await pool.execute(
        "SELECT platform, price FROM social_platforms WHERE digital_marketing_detail_id = ?",
        [project.digital_marketing_id]
      );
      project.marketingServices = marketingServices;
      project.socialPlatforms = socialPlatforms;
    }

    if (project.content_id) {
      const [contentTypes] = await pool.execute(
        "SELECT content_type, price FROM content_types WHERE content_generation_detail_id = ?",
        [project.content_id]
      );
      const [contentLanguages] = await pool.execute(
        "SELECT language, price FROM content_languages WHERE content_generation_detail_id = ?",
        [project.content_id]
      );
      project.contentTypes = contentTypes;
      project.contentLanguages = contentLanguages;
    }

    if (project.app_dev_id) {
      const [appFeatures] = await pool.execute(
        "SELECT feature, price FROM app_features WHERE app_development_detail_id = ?",
        [project.app_dev_id]
      );
      project.appFeatures = appFeatures;
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error("Get project details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred"
    });
  }
});

router.post("/admin/projects", isAdminAuthenticated, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

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

    const [existingUsers] = await connection.execute(
      "SELECT id, full_name, email, password FROM users WHERE email = ?",
      [email]
    );

    let user;
    if (existingUsers.length === 0) {
      const hashedPassword = await hashPassword(password);
      const [userResult] = await connection.execute(
        "INSERT INTO users (full_name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
        [username, email, hashedPassword]
      );
      user = { id: userResult.insertId, full_name: username, email: email };
    } else {
      user = existingUsers[0];
    }

    const [projectResult] = await connection.execute(
      "INSERT INTO projects (username, email, password, project_name, project_title, category, price, deadline, details, user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [username, email, await hashPassword(password), projectName, projectTitle, category, parseFloat(price) || 0, deadline || null, details || null, user.id, "pending"]
    );

    const projectId = projectResult.insertId;

    if (category === "web-development") {
      const [webDevResult] = await connection.execute(
        "INSERT INTO web_development_details (project_id, tech, web_pages, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
        [projectId, tech || "", parseInt(webPages) || 0]
      );

      if (webFeatures && webFeatures.length > 0) {
        for (const feature of webFeatures) {
          await connection.execute(
            "INSERT INTO web_development_features (web_dev_detail_id, feature, price, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
            [webDevResult.insertId, feature, getFeaturePrice(feature, "web")]
          );
        }
      }
    }

    if (category === "seo") {
      const [seoResult] = await connection.execute(
        "INSERT INTO seo_details (project_id, created_at, updated_at) VALUES (?, NOW(), NOW())",
        [projectId]
      );

      if (seoType && seoType.length > 0) {
        for (const type of seoType) {
          await connection.execute(
            "INSERT INTO seo_types (seo_detail_id, seo_type, price, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
            [seoResult.insertId, type, getFeaturePrice(type, "seo")]
          );
        }
      }
    }

    if (category === "digital-marketing") {
      const [digitalMarketingResult] = await connection.execute(
        "INSERT INTO digital_marketing_details (project_id, target_audience, marketing_budget, duration, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
        [projectId, targetAudience || null, parseFloat(marketingBudget) || null, marketingDuration || null]
      );

      if (digitalMarketingServices && digitalMarketingServices.length > 0) {
        for (const service of digitalMarketingServices) {
          await connection.execute(
            "INSERT INTO digital_marketing_services (digital_marketing_detail_id, service, price, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
            [digitalMarketingResult.insertId, service, getFeaturePrice(service, "digital-marketing")]
          );
        }
      }

      if (socialPlatforms && socialPlatforms.length > 0) {
        for (const platform of socialPlatforms) {
          await connection.execute(
            "INSERT INTO social_platforms (digital_marketing_detail_id, platform, price, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
            [digitalMarketingResult.insertId, platform, getFeaturePrice(platform, "social-platform")]
          );
        }
      }
    }

    if (category === "content-generation") {
      const [contentResult] = await connection.execute(
        "INSERT INTO content_generation_details (project_id, volume, content_tone, target_keywords, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
        [projectId, contentVolume || null, contentTone || null, targetKeywords || null]
      );

      if (contentTypes && contentTypes.length > 0) {
        for (const type of contentTypes) {
          await connection.execute(
            "INSERT INTO content_types (content_generation_detail_id, content_type, price, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
            [contentResult.insertId, type, getFeaturePrice(type, "content-type")]
          );
        }
      }

      if (contentLanguages && contentLanguages.length > 0) {
        for (const language of contentLanguages) {
          await connection.execute(
            "INSERT INTO content_languages (content_generation_detail_id, language, price, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
            [contentResult.insertId, language, getFeaturePrice(language, "content-language")]
          );
        }
      }
    }

    if (category === "app-development") {
      const [appResult] = await connection.execute(
        "INSERT INTO app_development_details (project_id, app_type, complexity, target_platforms, expected_users, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
        [projectId, appType || null, appComplexity || null, targetPlatforms || null, parseInt(expectedUsers) || null]
      );

      if (appFeatures && appFeatures.length > 0) {
        for (const feature of appFeatures) {
          await connection.execute(
            "INSERT INTO app_features (app_development_detail_id, feature, price, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
            [appResult.insertId, feature, getFeaturePrice(feature, "app-feature")]
          );
        }
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: {
        id: projectId,
        projectName: projectName,
        projectTitle: projectTitle,
        category: category,
        price: parseFloat(price) || 0,
        status: "pending"
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error("Admin create project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while creating the project"
    });
  } finally {
    connection.release();
  }
});

module.exports = router;

