import { UserRole, UserStatus } from "../generated/prisma/enums.ts";
import { apiResponse, asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/error.js";
import { clearAuthCookies, comparePassword, generateAccessToken, generatePasswordResetToken, generateRefreshToken, getSafeUser, hashPassword, JWT_REFRESH_EXPIRES_IN, setAuthCookies, verifyPasswordResetToken } from "../utils/helpers.js";
import prisma from "../config/prisma.js";
import ms from "ms";

export const registerUser = asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const { full_name, email, password, role, status } = req.body;

    // Validate required fields
    if (!full_name || !email || !password) throw ApiError.badRequest("Name, email and password are required");

    if (role && loggedInUser && loggedInUser.role !== UserRole.ADMIN) throw ApiError.forbidden("You are not authorized to assign roles");

    if (status && loggedInUser && loggedInUser.role !== UserRole.ADMIN) throw ApiError.forbidden("You are not authorized to change status");

    if (status && !Object.values(UserStatus).includes(status)) throw ApiError.badRequest("Invalid status");

    if (password.length < 8) throw ApiError.badRequest("Password must be at least 8 characters long");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) throw ApiError.conflict("User already exists with this email");

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
        data: {
            full_name,
            email,
            password: passwordHash,
            role: role?.toUpperCase() || UserRole.USER,
            status: status?.toUpperCase() || UserStatus.INACTIVE,
        },
    });

    const safeUser = getSafeUser(user);

    return apiResponse(res, 201, true, "Success, Verification email has been sent to your email.", { user: safeUser });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) throw ApiError.badRequest("Email and password are required");

    const user = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (!user) {
        throw ApiError.unauthorized("Invalid email or password");
    }

    if (user.status !== UserStatus.ACTIVE) {
        throw ApiError.unauthorized("Your account is not active. Please contact the administrator.");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) throw ApiError.unauthorized("Invalid email or password");

    const safeUser = getSafeUser(user);
    const accessToken = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);

    const tokenHash = await hashPassword(refreshToken);

    const refreshMaxAge = rememberMe
        ? ms("30d")
        : (process.env.REFRESH_TOKEN_MAX_AGE ? ms(process.env.REFRESH_TOKEN_MAX_AGE) : ms("7d"));

    await prisma.refreshToken.create({
        data: {
            tokenHash,
            userId: user.id,
            ipHash: req.ip,
            userAgent: req.headers["user-agent"],
            expiresAt: new Date(Date.now() + refreshMaxAge),
        },
    });

    setAuthCookies(
        res,
        accessToken,
        refreshToken,
        refreshMaxAge
    );
    return apiResponse(res, 200, true, "User logged in successfully", {
        user: safeUser,
    });
});

export const logoutUser = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) throw ApiError.badRequest("Token not found");

    if (refreshToken) {
        const tokens = await prisma.refreshToken.findMany({
            where: { expiresAt: { gt: new Date() } },
        });

        for (const token of tokens) {
            const isMatch = await comparePassword(refreshToken, token.tokenHash);

            if (isMatch) {
                await prisma.refreshToken.delete({
                    where: { id: token.id },
                });
                break;
            }
        }
    }

    clearAuthCookies(res);

    return apiResponse(res, 200, true, "Logout successful");
});

export const verifyUsers = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) throw ApiError.unauthorized("User not found");

    return apiResponse(res, 200, true, "User verified successfully", { user: getSafeUser(user) });
})

export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) throw ApiError.unauthorized("Refresh token not found");

    const tokens = await prisma.refreshToken.findMany({
        where: {
            expiresAt: { gt: new Date() },
        },
    });

    let matchedToken = null;

    for (const token of tokens) {
        const isMatch = await comparePassword(refreshToken, token.tokenHash);
        if (isMatch) {
            matchedToken = token;
            break;
        }
    }

    if (!matchedToken) throw ApiError.badRequest("Invalid refresh token");

    const user = await prisma.user.findUnique({
        where: { id: matchedToken.userId }
    });

    if (!user) throw ApiError.notFound("User not found");

    const safeUser = getSafeUser(user);

    const newAccessToken = generateAccessToken(safeUser);
    const newRefreshToken = generateRefreshToken(safeUser);

    const newHash = await hashPassword(newRefreshToken);

    // delete old refresh token (rotation)
    await prisma.refreshToken.delete({
        where: { id: matchedToken.id },
    });

    // create new refresh token
    await prisma.refreshToken.create({
        data: {
            tokenHash: newHash,
            userId: user.id,
            ipHash: req.ip,
            userAgent: req.headers["user-agent"],
            expiresAt: new Date(Date.now() + ms(JWT_REFRESH_EXPIRES_IN)),
        },
    });

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return apiResponse(res, 200, true, "Token refreshed");
});

// Forget password — generates a reset token and emails a link
export const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) throw ApiError.badRequest("Email is required");

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return 200 so we don't reveal whether an account exists
    if (!user) {
        return apiResponse(res, 200, true, "If that email is registered, a reset link has been sent.");
    }

    const resetToken = generatePasswordResetToken(user.id);
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordResetToken: resetToken,
            passwordResetExpiry: resetExpiry,
        },
    });

    return apiResponse(res, 200, true, "If that email is registered, a reset link has been sent.");
});

// Verify password reset token and set new password
export const verifyPasswordReset = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) throw ApiError.badRequest("Token and new password are required");

    if (newPassword.length < 8) throw ApiError.badRequest("Password must be at least 8 characters long");

    const decoded = verifyPasswordResetToken(token);

    const user = await prisma.user.findFirst({
        where: {
            id: decoded.userId,
            passwordResetToken: token,
            passwordResetExpiry: { gt: new Date() },
        },
    });

    if (!user) throw ApiError.badRequest("Invalid or expired password reset token");

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpiry: null,
        },
    });

    // Invalidate all refresh tokens for security
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    return apiResponse(res, 200, true, "Password reset successfully. Please log in with your new password.");
});

// Chnage password
export const resetPassword = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw ApiError.badRequest("Missing required fields");
    }

    if (newPassword.length < 8) {
        throw ApiError.badRequest("Password must be at least 8 characters long");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) throw ApiError.notFound("User not found");

    const isMatch = await comparePassword(oldPassword, user.password);

    if (oldPassword === newPassword) {
        throw ApiError.badRequest(
            "New password must be different"
        );
    }

    if (!isMatch) throw ApiError.unauthorized("Invalid old password");

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    await prisma.refreshToken.deleteMany({
        where: { userId },
    });

    return apiResponse(res, 200, true, "Password updated");
});
