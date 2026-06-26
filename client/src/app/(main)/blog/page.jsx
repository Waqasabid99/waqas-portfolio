import { getBlogPosts } from '@/actions/blog.action'
import PostGrid from '@/pages/Blog/PostGrid'

const page = async () => {
    const { blogs } = await getBlogPosts() || {};

    return (
        <main className="max-w-screen mx-auto px-10 md:px-10 pt-3 pb-12">
            <div className="header-section">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className='text-4xl font-bold mb-3'>
                            Our Latest <span className='text-[#1365ff]'>Blogs</span>
                        </h1>
                        <p className='text-[#b7bdbd] max-w-2xl'>
                            Explore latest blogs on various topics and stay updated with the latest trends.
                        </p>
                    </div>
                </div>
            </div>
            <PostGrid posts={blogs || []} />
        </main>
    )
};

export default page;
