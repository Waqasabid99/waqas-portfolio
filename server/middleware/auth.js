const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

const isAdminAuthenticated = (req, res, next) => {
  if (req.session.adminId) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Admin authentication required" });
  }
};

module.exports = { isAuthenticated, isAdminAuthenticated };

