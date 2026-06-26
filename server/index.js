import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.ORIGIN || "http://localhost:3000",
  credentials: true,
}));

app.set("trust proxy", 1);

app.get("/", (req, res) => {
  res.json({ message: "Backend server is running!" });
});

app.get("/health", (req, res) => {
  res.json({ success: true, message: "All systems operational" });
});

// Routes
app.use(userRoutes);
app.use(blogRouter);
app.use(contactRoutes);
app.use(projectRoutes);
app.use(portfolioRoutes);
app.use(adminRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "An unexpected error occurred" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
