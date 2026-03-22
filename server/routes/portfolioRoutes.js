import express from "express";
import { isAdminAuthenticated } from "../middleware/auth.js";
import {
  getPortfolioProjects,
  getAdminPortfolioProjects,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  getPortfolioProjectById,
  getPortfolioStats
} from "../controllers/portfolioController.js";

const portfolioRouter = express.Router();

portfolioRouter.get("/portfolio-projects", getPortfolioProjects);
portfolioRouter.get("/admin/portfolio-projects", isAdminAuthenticated, getAdminPortfolioProjects);
portfolioRouter.post("/admin/portfolio-projects", isAdminAuthenticated, createPortfolioProject);
portfolioRouter.put("/admin/portfolio-projects/:id", isAdminAuthenticated, updatePortfolioProject);
portfolioRouter.delete("/admin/portfolio-projects/:id", isAdminAuthenticated, deletePortfolioProject);
portfolioRouter.get("/portfolio-projects/:id", getPortfolioProjectById);
portfolioRouter.get("/admin/portfolio-stats", isAdminAuthenticated, getPortfolioStats);

export default portfolioRouter;


