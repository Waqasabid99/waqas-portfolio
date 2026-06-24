import express from "express";
import { forgetPassword, loginUser, logoutUser, refreshToken, registerUser, resetPassword, verifyUsers } from "../controllers/userController.js";
import { verifyUser } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", verifyUser, logoutUser);
userRouter.get("/verify", verifyUser, verifyUsers);
userRouter.post("/refresh-token", refreshToken);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password", verifyUser, resetPassword);

export default userRouter;
