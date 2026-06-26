import BlogPage from "@/pages/Blog/BlogPage"

export const generateMetadata = async () => {
    return {
        title: "Blog - Dashboard",
        description: "Blog - Dashboard",
        keywords: "Blog - Dashboard",
    }
}

const page = () => {
    return (
        <BlogPage />
    )
}

export default page