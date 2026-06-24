import prisma from "../config/prisma.js";
import { UserRole, UserStatus } from "../generated/prisma/enums.ts";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/error.js";
import { getSafeUser, verifyAccessToken } from "../utils/helpers.js";

export const verifyUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) throw ApiError.unauthorized("Unauthorized");

  const decoded = verifyAccessToken(token);

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.id,
      status: UserStatus.ACTIVE,
    }
  })

  if (!user) throw ApiError.unauthorized("Invalid or expired session");
  const safeUser = getSafeUser(user);
  req.user = safeUser;
  next();
});

export const isAdminAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) throw ApiError.unauthorized("Unauthorized");

  const decoded = verifyAccessToken(token);

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.id,
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN
    }
  })

  if (!user) throw ApiError.unauthorized("Invalid or expired session");
  const safeUser = getSafeUser(user);
  req.user = safeUser;
  next();
});
