import express from "express";
import { verifyUser } from "../middleware/auth.js";
import { hireProject, addProject, getUserProjects } from "../controllers/projectController.js";
import { getPortfolioProjects } from "../controllers/portfolioController.js";

const projectRouter = express.Router();
projectRouter.get("/portfolio-projects", getPortfolioProjects);

projectRouter.post("/hire", hireProject);
projectRouter.post("/add-project", verifyUser, addProject);
projectRouter.get("/user-projects", verifyUser, getUserProjects);

export default projectRouter;


