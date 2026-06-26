import cloudinary from "../config/cloudinary.js";

/**
 * Uploads an in-memory buffer (from multer's memoryStorage) straight to
 * Cloudinary via its upload stream, so nothing ever touches disk.
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: process.env.CLOUDINARY_BLOG_FOLDER || "blog-images",
                resource_type: "image",
                // Lets Cloudinary auto-pick the best format/quality per requesting browser
                fetch_format: "auto",
                quality: "auto",
                ...options,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};

export const deleteFromCloudinary = (publicId) => cloudinary.uploader.destroy(publicId);
