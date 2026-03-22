import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://waqas-portfolio-psi.vercel.app",
  credentials: true,
}));

app.set("trust proxy", 1);

app.use(session({
  key: process.env.KEY,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.get("/", (req, res) => {
  res.json({ message: "Backend server is running!" });
});

// Routes
app.use(userRoutes);
app.use(projectRoutes);
app.use(contactRoutes);
app.use(adminRoutes);
app.use(portfolioRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "An unexpected error occurred" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
