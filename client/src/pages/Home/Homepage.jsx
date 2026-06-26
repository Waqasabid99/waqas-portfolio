import { getBlogPosts } from "@/actions/blog.action"
import About from "./about/About"
import Hero from "./hero/Hero"
import ServMarquee from "./hero/ServMarquee"
import Portfolio from "./portfolio/Portfolio"
import Services from "./services/Services"
import PostGrid from "../Blog/PostGrid"
import { FaArrowCircleRight } from "react-icons/fa"
import Link from "next/link"

const HomePage = async () => {
    const { blogs } = await getBlogPosts();
    console.log(blogs);
    return (
        <main>
            <Hero />
            <ServMarquee />
            <Services />
            <About />
            <Portfolio />
            {blogs.length > 0 && (
                <section className="max-w-7xl mx-auto px-10 md:px-2 pt-3 pb-12">
                    <div className="header-section">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-2 bg-[#1365ff]"></div>
                            <h3 className='text-[#1365ff] text-xl font-semibold'>Blogs</h3>
                            <div className="w-3 h-2 bg-[#1365ff]"></div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h1 className='text-4xl font-bold mb-3'>
                                    Our Latest <span className='text-[#1365ff]'>Blogs</span>
                                </h1>
                                <p className='text-[#b7bdbd] max-w-2xl'>
                                    Explore latest blogs on various topics and stay updated with the latest trends.
                                </p>
                            </div>
                            <div className=' hover:text-white group transition-all duration-300'>
                                <Link href="/blog" className="contact rounded-full pl-6 pr-2 py-2 text-[#1365ff] bg-white inline-flex items-center gap-3 border-2 border-[#1365ff] group-hover:bg-[#1365ff] group-hover:text-white hover:border-white transition-all duration-300">
                                    View all
                                    <FaArrowCircleRight className='text-2xl transition-all duration-300' />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <PostGrid posts={blogs} />
                </section>
            )}
        </main>
    )
}

export default HomePage