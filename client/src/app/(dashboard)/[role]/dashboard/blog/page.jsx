import { getBlogPosts } from "@/actions/blog.action";
import BlogPage from "@/pages/Blog/BlogPage"
import PostGrid from "@/pages/Blog/PostGrid";
import { FolderOpen, Plus } from "lucide-react";
import Link from "next/link";

export const generateMetadata = async () => {
    return {
        title: "Blog - Dashboard",
        description: "Blog - Dashboard",
        keywords: "Blog - Dashboard",
    }
}

const page = async () => {
    const { blogs } = await getBlogPosts() || {};

    return (
        <main className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Manage Blog Posts</h2>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        {/* Add Post */}
                        <Link
                            href="blog/create"
                            className="flex items-center space-x-2 px-4 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Post</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Post Grid */}
            <PostGrid posts={blogs} className="p-10" />


            {blogs.length === 0 && (
                <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                    <p className="text-gray-500 mb-4">
                        {'No posts have been created yet.'}
                    </p>
                    <Link
                        href="blog/create"
                        className="inline-flex items-center px-4 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Post
                    </Link>
                </div>
            )}
        </main>
    )
};

export default page;
