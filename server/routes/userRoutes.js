const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { hashPassword, verifyPassword } = require("../utils/auth");

router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const [existingUser] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    const [result] = await pool.execute(
      "INSERT INTO users (full_name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [full_name, email, hashedPassword]
    );

    const userId = result.insertId;

    req.session.userId = userId;
    req.session.userEmail = email;
    req.session.userName = full_name;

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: userId,
        full_name: full_name,
        email: email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [users] = await pool.execute(
      "SELECT id, full_name, email, password FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];
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
});

router.post("/logout", (req, res) => {
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
});

router.get("/check-session", (req, res) => {
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
});

router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const [users] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
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
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const hashedPassword = await hashPassword(password);

    await pool.execute(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?",
      [hashedPassword, email]
    );

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
});

module.exports = router;

