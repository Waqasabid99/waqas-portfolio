import React, { useState, useEffect } from 'react';
import { FaArrowCircleRight, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { BiCode, BiTrendingUp } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import axios from 'axios';

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const API_BASE_URL = 'https://waqas-portfolio-qlpx.onrender.com';

    useEffect(() => {
        fetchPortfolioProjects();
    }, []);

    const fetchPortfolioProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${API_BASE_URL}/portfolio-projects`);
            
            if (response.data.success) {
                setProjects(response.data.projects);
            } else {
                setError('Failed to fetch portfolio projects');
            }
        } catch (err) {
            console.error('Error fetching portfolio projects:', err);
            setError('Failed to load portfolio projects');
        } finally {
            setLoading(false);
        }
    };

    // Generate categories dynamically from fetched projects
    const categories = [
        { id: 'all', label: 'All Projects', count: projects.length },
        ...Array.from(new Set(projects.map(p => p.category))).map(category => ({
            id: category,
            label: category.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            count: projects.filter(p => p.category === category).length
        }))
    ];

    const filteredProjects = activeFilter === 'all' 
        ? projects 
        : projects.filter(project => project.category === activeFilter);

    // Calculate stats from actual data
    const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        featuredProjects: projects.filter(p => p.featured).length,
        categories: Array.from(new Set(projects.map(p => p.category))).length
    };

    if (loading) {
        return (
            <div id='portfolio' className='flex flex-col gap-8 pt-5 px-15'>
                <div className="header-section">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-2 bg-[#1365ff]"></div>
                        <h3 className='text-[#1365ff] text-xl font-semibold'>Portfolio</h3>
                        <div className="w-3 h-2 bg-[#1365ff]"></div>
                    </div>
                    
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1365ff] mx-auto mb-4"></div>
                            <p className="text-[#b7bdbd]">Loading portfolio projects...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div id='portfolio' className='flex flex-col gap-8 pt-5 px-15'>
                <div className="header-section">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-2 bg-[#1365ff]"></div>
                        <h3 className='text-[#1365ff] text-xl font-semibold'>Portfolio</h3>
                        <div className="w-3 h-2 bg-[#1365ff]"></div>
                    </div>
                    
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="text-red-500 text-xl mb-4">Error Loading Portfolio</div>
                            <p className="text-[#b7bdbd] mb-4">{error}</p>
                            <button
                                onClick={fetchPortfolioProjects}
                                className="px-6 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id='portfolio' className='flex flex-col gap-8 pt-5 px-15'>
            <div className="header-section">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-2 bg-[#1365ff]"></div>
                    <h3 className='text-[#1365ff] text-xl font-semibold'>Portfolio</h3>
                    <div className="w-3 h-2 bg-[#1365ff]"></div>
                </div>
                
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className='text-4xl font-bold mb-3'>
                            My Recent <span className='text-[#1365ff]'>Projects</span>
                        </h1>
                        <p className='text-[#b7bdbd] max-w-2xl'>
                            Explore my latest work showcasing web development, design, and SEO projects. 
                            Each project represents my commitment to quality and innovation.
                        </p>
                    </div>
                    <div className=' hover:text-white group transition-all duration-300'>
                        <button className="contact rounded-full pl-6 pr-2 py-2 text-[#1365ff] bg-white inline-flex items-center gap-3 border-2 border-[#1365ff] group-hover:bg-[#1365ff] group-hover:text-white hover:border-white transition-all duration-300">
                            View All
                            <FaArrowCircleRight className='text-2xl transition-all duration-300' />
                        </button>
                    </div>
                </div>
            </div>

            {projects.length > 0 && (
                <>
                    <div className="filter-section mb-8">
                        <div className="flex flex-wrap gap-3">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveFilter(category.id)}
                                    className={`px-6 py-2 rounded-full border-2 transition-all duration-300 ${
                                        activeFilter === category.id
                                            ? 'bg-[#1365ff] text-white border-[#1365ff]'
                                            : 'bg-white text-[#1365ff] border-[#1365ff] hover:bg-[#1365ff] hover:text-white'
                                    }`}
                                >
                                    {category.label} ({category.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {filteredProjects.map(project => (
                            <div 
                                key={project.id} 
                                className="project-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                            >
                                <div className="relative overflow-hidden">
                                    <img 
                                        src={project.image} 
                                        alt={project.title}
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-[#1365ff] bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center">
                                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <a 
                                                href={project.live_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-white text-[#1365ff] rounded-full hover:bg-[#1365ff] hover:text-white transition-all duration-300"
                                            >
                                                <FiEye className="text-xl" />
                                            </a>
                                            {project.github_url && (
                                                <a 
                                                    href={project.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-white text-[#1365ff] rounded-full hover:bg-[#1365ff] hover:text-white transition-all duration-300"
                                                >
                                                    <FaGithub className="text-xl" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {project.featured && (
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-[#1365ff] bg-[#ecf2f8] px-3 py-1 rounded-full font-medium">
                                            {project.category.replace('-', ' ').toUpperCase()}
                                        </span>
                                        <FaExternalLinkAlt className="text-[#b7bdbd] text-sm" />
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold text-zinc-800 mb-2 group-hover:text-[#1365ff] transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    
                                    <p className="text-[#b7bdbd] text-sm mb-4 leading-relaxed line-clamp-3">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.slice(0, 4).map((tech, index) => (
                                            <span 
                                                key={index}
                                                className="text-xs text-[#1365ff] border border-[#1365ff] px-2 py-1 rounded-md"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 4 && (
                                            <span className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded-md">
                                                +{project.technologies.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <a 
                                            href={project.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center py-2 bg-[#1365ff] text-white rounded-lg text-sm font-medium hover:bg-[#0f4fb3] transition-colors duration-300"
                                        >
                                            Live Demo
                                        </a>
                                        {project.github_url && (
                                            <a 
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 border border-[#1365ff] text-[#1365ff] rounded-lg text-sm font-medium hover:bg-[#1365ff] hover:text-white transition-colors duration-300"
                                            >
                                                <FaGithub className="text-lg" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="stats-section bg-[#ecf2f8] rounded-xl p-8 mb-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <BiCode className="text-[#1365ff] text-4xl mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-zinc-800">{stats.totalProjects}+</h3>
                                <p className="text-[#b7bdbd]">Projects Completed</p>
                            </div>
                            <div className="text-center">
                                <BiTrendingUp className="text-[#1365ff] text-4xl mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-zinc-800">{stats.activeProjects}+</h3>
                                <p className="text-[#b7bdbd]">Active Projects</p>
                            </div>
                            <div className="text-center">
                                <FiEye className="text-[#1365ff] text-4xl mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-zinc-800">{stats.featuredProjects}+</h3>
                                <p className="text-[#b7bdbd]">Featured Projects</p>
                            </div>
                            <div className="text-center">
                                <FaGithub className="text-[#1365ff] text-4xl mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-zinc-800">{stats.categories}+</h3>
                                <p className="text-[#b7bdbd]">Categories</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {projects.length === 0 && !loading && (
                <div className="text-center py-20">
                    <BiCode className="text-[#1365ff] text-6xl mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-zinc-800 mb-2">No Projects Yet</h3>
                    <p className="text-[#b7bdbd] max-w-md mx-auto">
                        Portfolio projects will appear here once they are added by the admin.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Portfolio;