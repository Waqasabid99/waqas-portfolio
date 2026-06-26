import express from "express";
import { isAdminAuthenticated, verifyUser } from "../middleware/auth.js";
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

portfolioRouter.get("/admin/portfolio-projects", verifyUser, isAdminAuthenticated, getAdminPortfolioProjects);
portfolioRouter.post("/admin/portfolio-projects", verifyUser, isAdminAuthenticated, createPortfolioProject);
portfolioRouter.put("/admin/portfolio-projects", verifyUser, isAdminAuthenticated, updatePortfolioProject);
portfolioRouter.delete("/admin/portfolio-projects/:id", verifyUser, isAdminAuthenticated, deletePortfolioProject);
portfolioRouter.get("/portfolio-projects/:id", getPortfolioProjectById);
portfolioRouter.get("/admin/portfolio-stats", verifyUser, isAdminAuthenticated, getPortfolioStats);

export default portfolioRouter;


