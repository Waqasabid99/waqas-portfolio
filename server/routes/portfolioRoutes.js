const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { isAdminAuthenticated } = require("../middleware/auth");

router.get("/portfolio-projects", async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    let whereClause = "WHERE status = ?";
    let params = ["active"];
    
    if (category && category !== "all") {
      whereClause += " AND category = ?";
      params.push(category);
    }
    
    if (featured === "true") {
      whereClause += " AND featured = ?";
      params.push(true);
    }

    const [portfolioProjects] = await pool.execute(
      `SELECT * FROM portfolio_projects ${whereClause} ORDER BY created_at DESC`,
      params
    );

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
});

router.get("/admin/portfolio-projects", isAdminAuthenticated, async (req, res) => {
  try {
    const [portfolioProjects] = await pool.execute(
      "SELECT * FROM portfolio_projects ORDER BY created_at DESC"
    );

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
});

router.post("/admin/portfolio-projects", isAdminAuthenticated, async (req, res) => {
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

    const [result] = await pool.execute(
      "INSERT INTO portfolio_projects (title, category, image, description, technologies, live_url, github_url, featured, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [title, category, image, description, JSON.stringify(technologies), liveUrl, githubUrl || null, featured || false, status || "active"]
    );

    res.status(201).json({
      success: true,
      message: "Portfolio project created successfully",
      project: {
        id: result.insertId,
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
});

router.put("/admin/portfolio-projects/:id", isAdminAuthenticated, async (req, res) => {
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

    const [existingProject] = await pool.execute(
      "SELECT id FROM portfolio_projects WHERE id = ?",
      [parseInt(id)]
    );

    if (existingProject.length === 0) {
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

    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push("title = ?");
      updateValues.push(title);
    }
    if (category) {
      updateFields.push("category = ?");
      updateValues.push(category);
    }
    if (image) {
      updateFields.push("image = ?");
      updateValues.push(image);
    }
    if (description) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }
    if (technologies) {
      updateFields.push("technologies = ?");
      updateValues.push(JSON.stringify(technologies));
    }
    if (liveUrl) {
      updateFields.push("live_url = ?");
      updateValues.push(liveUrl);
    }
    if (githubUrl !== undefined) {
      updateFields.push("github_url = ?");
      updateValues.push(githubUrl);
    }
    if (featured !== undefined) {
      updateFields.push("featured = ?");
      updateValues.push(featured);
    }
    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    updateFields.push("updated_at = NOW()");
    updateValues.push(parseInt(id));

    await pool.execute(
      `UPDATE portfolio_projects SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    const [updatedProject] = await pool.execute(
      "SELECT * FROM portfolio_projects WHERE id = ?",
      [parseInt(id)]
    );

    res.json({
      success: true,
      message: "Portfolio project updated successfully",
      project: {
        ...updatedProject[0],
        technologies: JSON.parse(updatedProject[0].technologies)
      }
    });

  } catch (error) {
    console.error("Update portfolio project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while updating the portfolio project"
    });
  }
});

router.delete("/admin/portfolio-projects/:id", isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const [existingProject] = await pool.execute(
      "SELECT id FROM portfolio_projects WHERE id = ?",
      [parseInt(id)]
    );

    if (existingProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Portfolio project not found"
      });
    }

    await pool.execute("DELETE FROM portfolio_projects WHERE id = ?", [parseInt(id)]);

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
});

router.get("/portfolio-projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [portfolioProjects] = await pool.execute(
      "SELECT * FROM portfolio_projects WHERE id = ? AND status = ?",
      [parseInt(id), "active"]
    );

    if (portfolioProjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Portfolio project not found"
      });
    }

    const project = portfolioProjects[0];

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
});

router.get("/admin/portfolio-stats", isAdminAuthenticated, async (req, res) => {
  try {
    const [totalProjects] = await pool.execute("SELECT COUNT(*) as count FROM portfolio_projects");
    const [activeProjects] = await pool.execute("SELECT COUNT(*) as count FROM portfolio_projects WHERE status = ?", ["active"]);
    const [featuredProjects] = await pool.execute("SELECT COUNT(*) as count FROM portfolio_projects WHERE featured = ?", [true]);
    const [categoryStats] = await pool.execute("SELECT category, COUNT(*) as count FROM portfolio_projects GROUP BY category");

    const stats = {
      total: totalProjects[0].count,
      active: activeProjects[0].count,
      featured: featuredProjects[0].count,
      byCategory: categoryStats.reduce((acc, item) => {
        acc[item.category] = item.count;
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
});

module.exports = router;

