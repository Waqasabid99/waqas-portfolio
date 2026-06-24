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
adminRouter.get("/admin/stats", getAdminStats);

// Projects
adminRouter.get("/admin/projects", getAllProjects);
adminRouter.get("/admin/projects/:id", getProjectById);
adminRouter.post("/admin/projects", createProject);
adminRouter.put("/admin/projects/:id/status", updateProjectStatus);
adminRouter.delete("/admin/projects/:id", deleteProject);

export default adminRouter;
