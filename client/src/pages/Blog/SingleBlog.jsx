import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import BlogContentRenderer from "@/components/blog/BlogContentRenderer";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import { extractHeadings } from "@/lib/blogContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

function formatDate(dateString) {
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
        new Date(dateString)
    );
}

const BlogPostPage = ({ blog, relatedPosts = [] }) => {
    if (!blog) return null;

    const headings = extractHeadings(blog.content?.blocks);

    const postUrl = `${SITE_URL}/blog/${blog.slug}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.excerpt,
        image: blog.cover_image ? [blog.cover_image] : [],
        datePublished: blog.published_at,
        dateModified: blog.updated_at || blog.published_at,
        author: { "@type": "Person", name: blog.author?.full_name },
    };

    return (
        <article className="max-w-7xl mx-auto px-5 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="max-w-3xl mx-auto mb-8 text-center">
                {blog.category?.name && (
                    <Link
                        href={`/blog?category=${blog.category.slug}`}
                        className="inline-block bg-[#e5eff9] text-[#1365ff] text-sm font-medium px-4 py-1.5 rounded-full mb-4"
                    >
                        {blog.category.name}
                    </Link>
                )}

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b2430] leading-tight mb-6">
                    {blog.title}
                </h1>

                <div className="flex items-center justify-center gap-4 text-sm text-[#6e7b8d]">
                    {blog.author?.full_name && <span className="font-medium text-[#1b2430]">{blog.author.full_name}</span>}
                    <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(blog.published_at)}
                    </span>
                    {blog.reading_time && (
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> {blog.reading_time} min read
                        </span>
                    )}
                </div>
            </div>

            {blog.cover_image && (
                <div className="relative w-full aspect-16/8 rounded-3xl overflow-hidden mb-12 max-w-5xl mx-auto">
                    <Image src={blog.cover_image} alt={blog.title} fill priority className="object-cover" sizes="100vw" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12 max-w-5xl mx-auto">
                <div>
                    <BlogContentRenderer blocks={blog.content?.blocks || []} />

                    {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                            {blog.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/blog?tag=${tag.slug}`}
                                    className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-[#6e7b8d] hover:bg-[#e5eff9] hover:text-[#1365ff] transition"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                        <span className="text-sm text-[#6e7b8d]">Found this useful? Share it:</span>
                        <ShareButtons url={postUrl} title={blog.title} />
                    </div>
                </div>

                <TableOfContents headings={headings} />
            </div>

            {relatedPosts.length > 0 && (
                <div className="max-w-5xl mx-auto mt-20 pt-12 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-[#1b2430] mb-6">Related Posts</h2>
                    <PostGrid posts={relatedPosts} columns={3} variant="compact" />
                </div>
            )}
        </article>
    );
};

export default BlogPostPage;
