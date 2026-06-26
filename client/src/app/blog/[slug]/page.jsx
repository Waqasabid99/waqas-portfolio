import { getPostBySlug } from "@/actions/blog.action";
import BlogPostPage from "@/pages/Blog/SingleBlog";

const page = async ({ params }) => {
    const { slug } = await params;
    const { blog } = await getPostBySlug(slug);

    return (
        <BlogPostPage blog={blog} />
    )
}

export default page