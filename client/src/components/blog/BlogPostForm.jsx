"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronDown, Loader2 } from "lucide-react";
import BlogContentEditor from "./BlogEditor";
import ImageUploadField from "./ImageUploadField";
import TagInput from "./TagInput";
import { createBlog, getBlogById, getCategories } from "@/actions/blog.action";

export default function BlogPostForm({ blogId }) {
    const router = useRouter();
    const editorRef = useRef(null);
    const isEditMode = Boolean(blogId);

    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);
    const [showSeo, setShowSeo] = useState(false);
    const [categories, setCategories] = useState([]);
    const [initialContent, setInitialContent] = useState(null);

    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tags, setTags] = useState([]);
    const [featured, setFeatured] = useState(false);
    const [coverImage, setCoverImage] = useState(null); // { url, public_id }
    const [seo, setSeo] = useState({ meta_title: "", meta_description: "", keywords: "", og_image: null });

    useEffect(() => {
        const fetchCategories = async () => {
            const { categories } = await getCategories();
            setCategories(categories || []);
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!isEditMode) return;
        const fetchBlog = async () => {
            const blog = await getBlogById(blogId);
            if (blog) {
                setTitle(blog.title || "");
                setExcerpt(blog.excerpt || "");
                setCategoryId(blog.category_id || "");
                setTags(blog.tags?.map((t) => t.name) || []);
                setFeatured(blog.featured || false);
                setCoverImage(blog.cover_image ? { url: blog.cover_image, public_id: null } : null);
                setInitialContent(blog.content || null);
                setSeo({
                    meta_title: blog.seo?.meta_title || "",
                    meta_description: blog.seo?.meta_description || "",
                    keywords: (blog.seo?.keywords || []).join(", "),
                    og_image: blog.seo?.og_image ? { url: blog.seo.og_image, public_id: null } : null,
                });
            }
            setIsLoading(false);
        }

        fetchBlog();

    }, [blogId, isEditMode]);

    const handleSubmit = async (status) => {
        if (!title.trim()) return toast.error("Title is required");

        const content = await editorRef.current?.save();
        if (!content?.blocks?.length) return toast.error("Blog content can't be empty");

        setIsSaving(true);
        try {
            const payload = {
                title: title.trim(),
                excerpt: excerpt.trim() || undefined,
                content,
                cover_image: coverImage?.url || null,
                status,
                featured,
                category_id: categoryId || null,
                tags,
                seo: {
                    meta_title: seo.meta_title || null,
                    meta_description: seo.meta_description || null,
                    keywords: seo.keywords
                        ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
                        : null,
                    og_image: seo.og_image?.url || null,
                },
            };
            console.log(payload)

            const res = await createBlog(payload);
            if (res) {
                toast.success(isEditMode ? "Blog post updated" : "Blog post created");
            }

        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32 text-[#6e7b8d]">
                <Loader2 className="animate-spin mr-2" /> Loading post…
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-5 py-10">
            <h1 className="text-2xl font-bold text-[#1b2430] mb-8">
                {isEditMode ? "Edit Blog Post" : "Create Blog Post"}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#1b2430] mb-2">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your post a title…"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1365ff] outline-none text-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1b2430] mb-2">Excerpt</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Short summary (auto-generated from content if left blank)"
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1365ff] outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1b2430] mb-2">Content</label>
                        <BlogContentEditor ref={editorRef} initialData={initialContent} holderId="blog-content-editor" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 p-5 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#1b2430] mb-2">Cover Image</label>
                            <ImageUploadField value={coverImage} onChange={setCoverImage} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1b2430] mb-2">Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#1365ff] outline-none"
                            >
                                <option value="">No category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1b2430] mb-2">Tags</label>
                            <TagInput value={tags} onChange={setTags} />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-[#1b2430]">
                            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[#1365ff]" />
                            Feature this post
                        </label>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-5">
                        <button
                            type="button"
                            onClick={() => setShowSeo((s) => !s)}
                            className="w-full flex items-center justify-between text-sm font-medium text-[#1b2430]"
                        >
                            SEO Settings
                            <ChevronDown className={`transition-transform ${showSeo ? "rotate-180" : ""}`} size={16} />
                        </button>

                        {showSeo && (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-xs text-[#6e7b8d] mb-1">Meta Title</label>
                                    <input
                                        value={seo.meta_title}
                                        onChange={(e) => setSeo((s) => ({ ...s, meta_title: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#1365ff] outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#6e7b8d] mb-1">Meta Description</label>
                                    <textarea
                                        value={seo.meta_description}
                                        onChange={(e) => setSeo((s) => ({ ...s, meta_description: e.target.value }))}
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#1365ff] outline-none text-sm resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#6e7b8d] mb-1">Keywords (comma separated)</label>
                                    <input
                                        value={seo.keywords}
                                        onChange={(e) => setSeo((s) => ({ ...s, keywords: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#1365ff] outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#6e7b8d] mb-1">Social Share Image</label>
                                    <ImageUploadField
                                        value={seo.og_image}
                                        onChange={(img) => setSeo((s) => ({ ...s, og_image: img }))}
                                        aspect="aspect-[16/9]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleSubmit("PUBLISHED")}
                            className="w-full rounded-full px-5 py-3 bg-[#1365ff] text-white font-medium hover:bg-[#0f52cc] transition disabled:opacity-60"
                        >
                            {isSaving ? "Saving…" : isEditMode ? "Update & Publish" : "Publish"}
                        </button>
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleSubmit("DRAFT")}
                            className="w-full rounded-full px-5 py-3 bg-white border border-[#1365ff] text-[#1365ff] font-medium hover:bg-[#e5eff9] transition disabled:opacity-60"
                        >
                            Save as Draft
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
