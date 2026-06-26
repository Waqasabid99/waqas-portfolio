"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteImage, uploadImage } from "@/actions/blog.action";

const deleteRemoteImage = async (publicId) => {
    const data = await deleteImage(publicId);
    if (data) toast.success("Image deleted successfully");
}

export default function ImageUploadField({ value, onChange, aspect = "aspect-video" }) {
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const data = await uploadImage(formData);

            if (!data) throw new Error("Upload failed");

            if (value?.public_id) deleteRemoteImage(value.public_id);

            onChange({ url: data.url, public_id: data.public_id });
        } catch (err) {
            toast.error(err.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const handleRemove = () => {
        if (value?.public_id) deleteRemoteImage(value.public_id);
        onChange(null);
    };

    return (
        <div>
            {value?.url ? (
                <div className={`relative ${aspect} w-full overflow-hidden rounded-2xl border border-gray-200`}>
                    <img src={value.url} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className={`flex flex-col items-center justify-center gap-2 w-full ${aspect} rounded-2xl border-2 border-dashed border-gray-300 text-[#6e7b8d] hover:border-[#1365ff] hover:text-[#1365ff] transition`}
                >
                    {isUploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
                    <span className="text-sm">{isUploading ? "Uploading…" : "Click to upload image"}</span>
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
