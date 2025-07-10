const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO contact_forms (name, email, subject, message, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [name, email, subject, message, req.session.userId || null]
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contactForm: {
        id: result.insertId,
        name: name,
        email: email,
        subject: subject,
      },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
});

module.exports = router;

