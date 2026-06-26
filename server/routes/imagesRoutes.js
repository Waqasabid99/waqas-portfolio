import { uploadSingleImage } from "../middleware/upload.js";
import { uploadEditorImage, deleteImage } from "../controllers/uploadController.js";
import { isAdminAuthenticated, verifyUser } from "../middleware/auth.js";

router.post(
    "/admin/blogs/upload-image",
    verifyUser,
    isAdminAuthenticated,
    uploadSingleImage("image"),
    uploadEditorImage
);

router.delete("/admin/blogs/delete-image", verifyUser, isAdminAuthenticated, deleteImage);