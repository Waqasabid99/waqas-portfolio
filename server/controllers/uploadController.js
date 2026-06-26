import { apiResponse, asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/error.js";
import { deleteFromCloudinary, uploadBufferToCloudinary } from "../utils/cloudinaryHelper.js";

/**
 * Hit by Editor.js's image tool (config.endpoints.byFile) whenever an
 * image is picked, dragged in, or pasted into the editor. The response
 * shape here is dictated by Editor.js itself — not your usual apiResponse
 * format — so this intentionally skips asyncHandler/ApiError.
 */
export const uploadEditorImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: 0, message: "No image file provided" });
        }

        const result = await uploadBufferToCloudinary(req.file.buffer);

        return res.status(200).json({
            success: 1,
            file: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ success: 0, message: "Failed to upload image" });
    }
};

/**
 * Standalone admin action — e.g. cleaning up an image after a block is
 * removed in the editor, or after a cover image gets replaced. Uses your
 * normal apiResponse format since nothing here is dictated by Editor.js.
 */
export const deleteImage = asyncHandler(async (req, res) => {
    const { public_id } = req.body;

    if (!public_id) throw ApiError.badRequest("public_id is required");

    const result = await deleteFromCloudinary(public_id);

    if (result.result !== "ok" && result.result !== "not found") {
        throw ApiError.badRequest("Failed to delete image from Cloudinary");
    }

    return apiResponse(res, 200, true, "Image deleted successfully");
});
