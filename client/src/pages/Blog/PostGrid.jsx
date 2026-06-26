"use client";

import PostCard from "./PostCard";

const COLUMN_CLASSES = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
};

function PostCardSkeleton({ variant = "default" }) {
    const isCompact = variant === "compact";
    return (
        <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white animate-pulse">
            <div className={`w-full ${isCompact ? "aspect-16/10" : "aspect-4/3"} bg-gray-200`} />
            <div className={`${isCompact ? "p-4" : "p-5"} space-y-3`}>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3 mt-4" />
            </div>
        </div>
    );
}

const PostGrid = ({
    posts = [],
    isLoading = false,
    columns = 3,
    variant = "default",
    emptyMessage = "No posts found.",
    skeletonCount = 6,
}) => {
    const gridColsClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES[3];

    if (isLoading) {
        return (
            <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <PostCardSkeleton key={i} variant={variant} />
                ))}
            </div>
        );
    }

    if (!posts.length) {
        return <div className="flex items-center justify-center py-20 text-[#6e7b8d] text-sm">{emptyMessage}</div>;
    }

    return (
        <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
            {posts?.map((post) => (
                <PostCard key={post.id} post={post} variant={variant} />
            ))}
        </div>
    );
}

export default PostGrid;