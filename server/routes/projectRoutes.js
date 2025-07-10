const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { hashPassword } = require("../utils/auth");
const { isAuthenticated } = require("../middleware/auth");
const getFeaturePrice = require("../utils/priceCalculator");

router.post("/hire", async (req, res) => {
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
      "INSERT INTO projects (username, email, password, project_name, project_title, category, price, deadline, details, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [username, email, await hashPassword(password), projectName, projectTitle, category, parseFloat(price) || 0, deadline || null, details || null, user.id]
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

    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.full_name;

    res.status(201).json({
      success: true,
      message: "Project request submitted successfully",
      project: {
        id: projectId,
        projectName: projectName,
        projectTitle: projectTitle,
        category: category,
        price: parseFloat(price) || 0
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error("Hire form error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while processing your request"
    });
  } finally {
    connection.release();
  }
});

router.post("/add-project", isAuthenticated, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

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

    const [users] = await connection.execute(
      "SELECT id, full_name, email, password FROM users WHERE id = ?",
      [req.session.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const user = users[0];

    const [projectResult] = await connection.execute(
      "INSERT INTO projects (username, email, password, project_name, project_title, category, price, deadline, details, user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [user.full_name, user.email, user.password, projectName, projectTitle, category, parseFloat(price) || 0, deadline || null, details || null, user.id, "pending"]
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
      message: "Project added successfully",
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
    console.error("Add project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while adding the project"
    });
  } finally {
    connection.release();
  }
});

router.get("/user-projects", isAuthenticated, async (req, res) => {
  try {
    const [projects] = await pool.execute(`
      SELECT p.*, 
             wd.id as web_dev_id, wd.tech, wd.web_pages,
             sd.id as seo_id,
             dm.id as digital_marketing_id, dm.target_audience, dm.marketing_budget, dm.duration,
             cd.id as content_id, cd.volume, cd.content_tone, cd.target_keywords,
             ad.id as app_dev_id, ad.app_type, ad.complexity, ad.target_platforms, ad.expected_users
      FROM projects p
      LEFT JOIN web_development_details wd ON p.id = wd.project_id
      LEFT JOIN seo_details sd ON p.id = sd.project_id
      LEFT JOIN digital_marketing_details dm ON p.id = dm.project_id
      LEFT JOIN content_generation_details cd ON p.id = cd.project_id
      LEFT JOIN app_development_details ad ON p.id = ad.project_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [req.session.userId]);

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
    console.error("Get projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred"
    });
  }
});

module.exports = router;

