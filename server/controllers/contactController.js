import prisma from "../config/prisma.js";

export const createContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const contactForm = await prisma.contactForm.create({
            data: {
                name,
                email,
                subject,
                message,
                user_id: req.session?.userId || null,
            },
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            contactForm: {
                id: contactForm.id,
                name: contactForm.name,
                email: contactForm.email,
                subject: contactForm.subject,
            },
        });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred",
        });
    }
};
