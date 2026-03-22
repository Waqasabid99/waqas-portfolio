import express from "express";
import { isAdminAuthenticated } from "../middleware/auth.js";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  checkAdminSession,
  getAllProjects,
  getProjectById,
  updateProjectStatus,
  deleteProject,
  createProject,
  getAdminStats,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Auth
adminRouter.post("/admin/register", registerAdmin);
adminRouter.post("/admin/login", loginAdmin);
adminRouter.post("/admin/logout", logoutAdmin);
adminRouter.get("/admin/check-session", checkAdminSession);

// Stats
adminRouter.get("/admin/stats", isAdminAuthenticated, getAdminStats);

// Projects
adminRouter.get("/admin/projects", isAdminAuthenticated, getAllProjects);
adminRouter.get("/admin/projects/:id", isAdminAuthenticated, getProjectById);
adminRouter.post("/admin/projects", isAdminAuthenticated, createProject);
adminRouter.put("/admin/projects/:id/status", isAdminAuthenticated, updateProjectStatus);
adminRouter.delete("/admin/projects/:id", isAdminAuthenticated, deleteProject);

export default adminRouter;
