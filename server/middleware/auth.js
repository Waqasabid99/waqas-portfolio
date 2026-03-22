export const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export const isAdminAuthenticated = (req, res, next) => {
  if (req.session.adminId) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Admin authentication required" });
  }
};
