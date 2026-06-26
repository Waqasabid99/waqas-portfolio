import express from "express";
import { isAdminAuthenticated, verifyUser } from "../middleware/auth.js";
import {
  getAllProjects,
  getProjectById,
  updateProjectStatus,
  deleteProject,
  createProject,
  getAdminStats,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.use(verifyUser, isAdminAuthenticated)

// Stats
adminRouter.get("/stats", getAdminStats);

// Projects
adminRouter.get("/projects", getAllProjects);
adminRouter.get("/projects/:id", getProjectById);
adminRouter.post("/projects", createProject);
adminRouter.put("/projects/:id/status", updateProjectStatus);
adminRouter.delete("/projects/:id", deleteProject);

export default adminRouter;
