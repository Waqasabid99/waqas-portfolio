import express from "express";
import { register, login, logout, checkSession, forgetPassword, resetPassword } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/check-session", checkSession);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password", resetPassword);

export default userRouter;


