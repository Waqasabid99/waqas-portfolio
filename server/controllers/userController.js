import prisma from "../config/prisma.js";
import { hashPassword, verifyPassword } from "../utils/auth.js";

export const register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                full_name,
                email,
                password: hashedPassword
            }
        });

        req.session.userId = user.id;
        req.session.userEmail = user.email;
        req.session.userName = user.full_name;

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        req.session.userId = user.id;
        req.session.userEmail = user.email;
        req.session.userName = user.full_name;

        res.status(200).json({
            success: true,
            message: "Login successful, redirecting to dashboard",
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred",
        });
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Could not log out",
            });
        }
        res.json({
            success: true,
            message: "Logged out successfully",
        });
    });
};

export const checkSession = (req, res) => {
    if (req.session.userId) {
        res.json({
            success: true,
            isAuthenticated: true,
            user: {
                id: req.session.userId,
                email: req.session.userEmail,
                full_name: req.session.userName,
            },
        });
    } else {
        res.json({
            success: false,
            isAuthenticated: false,
        });
    }
};

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Email verified, you can now change your password",
        });
    } catch (error) {
        console.error("Forget password error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred",
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const hashedPassword = await hashPassword(password);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred",
        });
    }
};
