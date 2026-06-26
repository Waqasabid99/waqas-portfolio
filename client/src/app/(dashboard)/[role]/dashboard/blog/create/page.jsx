import BlogPage from "@/pages/Blog/BlogPage"

export const generateMetadata = async () => {
    return {
        title: "Create New Blog - Dashboard",
        description: "Create New Blog - Dashboard",
        keywords: "Create New Blog",
    }
}

const page = () => {
    return (
        <BlogPage />
    )
};

export default page;
