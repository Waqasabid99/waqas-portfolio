import express from "express";
import { verifyUser } from "../middleware/auth.js";
import { hireProject, addProject, getUserProjects } from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/hire", hireProject);
projectRouter.post("/add-project", verifyUser, addProject);
projectRouter.get("/user-projects", verifyUser, getUserProjects);

export default projectRouter;


