import multer from "multer";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});

/**
 * Wraps multer's single-file upload so errors come back in the same
 * { success: 0, message } shape Editor.js expects, instead of bubbling
 * past the middleware chain to your generic error handler.
 */
export const uploadSingleImage = (fieldName = "image") => (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            const message = err.code === "LIMIT_FILE_SIZE" ? "Image must be smaller than 5MB" : err.message;
            return res.status(400).json({ success: 0, message });
        }

        if (err) {
            return res.status(400).json({ success: 0, message: err.message });
        }

        next();
    });
};
