import express from "express";
import { verifyUser, isAdminAuthenticated } from "../middleware/auth.js";
import {
    getBlogs, getBlogBySlug,
    getAdminBlogs, getBlogById, createBlog, updateBlog, deleteBlog,
} from "../controllers/blogController.js";
import {
    getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory,
} from "../controllers/categoryController.js";
import { getBlogTags, deleteBlogTag } from "../controllers/tagController.js";

import { uploadSingleImage } from "../middleware/upload.js";
import { uploadEditorImage, deleteImage } from "../controllers/uploadController.js";

const blogRouter = express.Router();

// Public
blogRouter.get("/posts", getBlogs);
blogRouter.get("/posts/slug", getBlogBySlug);
blogRouter.get("/categories", getBlogCategories);
blogRouter.get("/tags", getBlogTags);

// Admin
blogRouter.get("/admin/blogs", verifyUser, isAdminAuthenticated, getAdminBlogs);
blogRouter.get("/admin/blogs/:id", verifyUser, isAdminAuthenticated, getBlogById);
blogRouter.post("/admin/blogs", verifyUser, isAdminAuthenticated, createBlog);
blogRouter.put("/admin/blogs/:id", verifyUser, isAdminAuthenticated, updateBlog);
blogRouter.delete("/admin/blogs/:id", verifyUser, isAdminAuthenticated, deleteBlog);

blogRouter.post("/admin/blog-categories", verifyUser, isAdminAuthenticated, createBlogCategory);
blogRouter.put("/admin/blog-categories/:id", verifyUser, isAdminAuthenticated, updateBlogCategory);
blogRouter.delete("/admin/blog-categories/:id", verifyUser, isAdminAuthenticated, deleteBlogCategory);
blogRouter.delete("/admin/blog-tags/:id", verifyUser, isAdminAuthenticated, deleteBlogTag);

// Images
blogRouter.post(
    "/admin/blogs/upload-image",
    verifyUser,
    isAdminAuthenticated,
    uploadSingleImage("image"),
    uploadEditorImage
);

blogRouter.delete("/admin/blogs/delete-image", verifyUser, isAdminAuthenticated, deleteImage);

export default blogRouter;
