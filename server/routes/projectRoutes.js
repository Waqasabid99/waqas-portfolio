import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { hireProject, addProject, getUserProjects } from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/hire", hireProject);
projectRouter.post("/add-project", isAuthenticated, addProject);
projectRouter.get("/user-projects", isAuthenticated, getUserProjects);

export default projectRouter;


