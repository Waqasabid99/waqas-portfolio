"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

function formatDate(dateString) {
    if (!dateString) return null;
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(dateString));
}

const PostCard = ({ post, variant = "default" }) => {
    const isCompact = variant === "compact";

    return (
        <Link
            href={`/blog/${post?.slug}`}
            className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            <div className={`relative w-full ${isCompact ? "aspect-16/10" : "aspect-4/3"} overflow-hidden bg-gray-100`}>
                {post?.cover_image ? (
                    <Image
                        src={post?.cover_image}
                        alt={post?.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#b7bdbd] text-sm">
                        No image
                    </div>
                )}

                {post?.category?.name && (
                    <span className="absolute top-3 left-3 bg-[#1365ff] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {post?.category?.name}
                    </span>
                )}
            </div>

            <div className={`flex flex-col flex-1 ${isCompact ? "p-4" : "p-5"} gap-2`}>
                <h3
                    className={`font-semibold text-[#1b2430] line-clamp-2 group-hover:text-[#1365ff] transition-colors ${isCompact ? "text-base" : "text-lg"
                        }`}
                >
                    {post?.title}
                </h3>

                {!isCompact && post?.excerpt && <p className="text-sm text-[#6e7b8d] line-clamp-2">{post?.excerpt}</p>}

                <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-[#6e7b8d]">
                    {post?.author?.full_name && <span>{post?.author?.full_name}</span>}
                    {post?.author?.full_name && post?.published_at && <span>·</span>}
                    {post?.published_at && <span>{formatDate(post?.published_at)}</span>}
                    {post?.reading_time && (
                        <span className="flex items-center gap-1 ml-auto">
                            <Clock size={12} /> {post?.reading_time} min
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default PostCard;
