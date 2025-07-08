import React, { useEffect, useState } from 'react';
import { Users, FolderOpen, Mail, Settings, LogOut, Bell, Search, BarChart3, Calendar, DollarSign, Eye, Edit, Trash2, Plus, Filter, Download, X, CheckCircle, Clock, AlertCircle, Image, Star, Globe } from 'lucide-react';
import axios from 'axios';
import AdminHireForm from './AdminHireForm';
import AdminPortfolioForm from './AdminPortfolioForm';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    contacts: 0,
    revenue: 0,
  });

  const [portfolioStats, setPortfolioStats] = useState({
    total: 0,
    active: 0,
    featured: 0,
    byCategory: {}
  });

  const [projects, setProjects] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showHireForm, setShowHireForm] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingPortfolioProject, setEditingPortfolioProject] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  axios.defaults.withCredentials = true;
  const API_BASE_URL = 'https://routes.waqasabidwork.online';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both stats and projects
      const [statsResponse, projectsResponse, portfolioResponse, portfolioStatsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/stats`),
        axios.get(`${API_BASE_URL}/admin/projects`),
        axios.get(`${API_BASE_URL}/admin/portfolio-projects`),
        axios.get(`${API_BASE_URL}/admin/portfolio-stats`)
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (projectsResponse.data.success) {
        setProjects(projectsResponse.data.projects);
      }

      if (portfolioResponse.data.success) {
        setPortfolioProjects(portfolioResponse.data.projects);
      }

      if (portfolioStatsResponse.data.success) {
        setPortfolioStats(portfolioStatsResponse.data.stats);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/admin/logout`);
      // Redirect to admin login page
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        setUpdating(true);
        const response = await axios.delete(`${API_BASE_URL}/admin/projects/${projectId}`);
        
        if (response.data.success) {
          setProjects(projects.filter(p => p.id !== projectId));
          alert('Project deleted successfully!');
          // Refresh stats after deletion
          fetchDashboardData();
        }
      } catch (error) {
        console.error('Delete project error:', error);
        alert(error.response?.data?.message || 'Failed to delete project');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleDeletePortfolioProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this portfolio project? This action cannot be undone.')) {
      try {
        setUpdating(true);
        const response = await axios.delete(`${API_BASE_URL}/admin/portfolio-projects/${projectId}`);
        
        if (response.data.success) {
          setPortfolioProjects(portfolioProjects.filter(p => p.id !== projectId));
          alert('Portfolio project deleted successfully!');
          // Refresh stats after deletion
          fetchDashboardData();
        }
      } catch (error) {
        console.error('Delete portfolio project error:', error);
        alert(error.response?.data?.message || 'Failed to delete portfolio project');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      setUpdating(true);
      const response = await axios.put(`${API_BASE_URL}/admin/projects/${projectId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        setProjects(projects.map(p => 
          p.id === projectId ? { ...p, status: newStatus } : p
        ));
        
        // Update stats if project is completed
        if (newStatus === 'completed') {
          fetchDashboardData();
        }
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert(error.response?.data?.message || 'Failed to update project status');
    } finally {
      setUpdating(false);
    }
  };

  const handleViewProject = async (projectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/projects/${projectId}`);
      if (response.data.success) {
        setSelectedProject(response.data.project);
        setShowProjectDetails(true);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      alert('Failed to fetch project details');
    }
  };

  const handleProjectCreated = () => {
    // Refresh the dashboard data after a new project is created
    fetchDashboardData();
  };

  const handlePortfolioProjectCreated = () => {
    // Refresh the dashboard data after a new portfolio project is created
    fetchDashboardData();
  };

  const handleEditPortfolioProject = (project) => {
    setEditingPortfolioProject(project);
    setShowPortfolioForm(true);
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Client,Title,Category,Price,Deadline,Status,Created Date\n" +
      projects.map(p => `${p.id},${p.username},${p.projectTitle},${p.category},${p.price},${p.deadline || 'N/A'},${p.status},${new Date(p.createdAt).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `projects_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPortfolioData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Title,Category,Status,Featured,Technologies,Live URL,Created Date\n" +
      portfolioProjects.map(p => `${p.id},"${p.title}",${p.category},${p.status},${p.featured},"${p.technologies.join(', ')}",${p.liveUrl},${new Date(p.createdAt).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `portfolio_projects_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const filteredPortfolioProjects = portfolioProjects.filter(project => {
    if (portfolioFilter === 'all') return true;
    if (portfolioFilter === 'featured') return project.featured;
    return project.category === portfolioFilter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'deadline') {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === 'price') return b.price - a.price;
    if (sortBy === 'title') return a.projectTitle.localeCompare(b.projectTitle);
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'in-progress':
        return 'bg-blue-100 text-blue-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getPortfolioStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'inactive':
        return 'bg-red-100 text-red-600';
      case 'draft':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const ProjectDetailsModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1365ff]">Project Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <div><strong>Project Name:</strong> {project.projectName}</div>
                  <div><strong>Title:</strong> {project.projectTitle}</div>
                  <div><strong>Category:</strong> <span className="capitalize">{project.category?.replace('-', ' ')}</span></div>
                  <div><strong>Client:</strong> {project.username}</div>
                  <div><strong>Email:</strong> {project.email}</div>
                  <div><strong>Price:</strong> ${project.price?.toLocaleString()}</div>
                  <div><strong>Deadline:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not specified'}</div>
                  <div className="flex items-center space-x-2">
                    <strong>Status:</strong>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Timeline</h3>
                <div className="space-y-2">
                  <div><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</div>
                  <div><strong>Updated:</strong> {new Date(project.updatedAt).toLocaleDateString()}</div>
                </div>
                
                {/* Status Update Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Update Status</h3>
                  <select
                    value={project.status}
                    onChange={(e) => {
                      handleStatusChange(project.id, e.target.value);
                      setSelectedProject({...project, status: e.target.value});
                    }}
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            
            {project.details && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Details</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{project.details}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1365ff] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading dashboard</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#1365ff]">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="w-6 h-6" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FolderOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.projects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Image className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Portfolio Projects</p>
                <p className="text-2xl font-bold text-gray-900">{portfolioStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-[#1365ff] text-[#1365ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Client Projects ({stats.projects})
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'portfolio'
                    ? 'border-[#1365ff] text-[#1365ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Portfolio Projects ({portfolioStats.total})
              </button>
            </nav>
          </div>
        </div>

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Client Projects Management</h2>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Filters */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="deadline">Sort by Deadline</option>
                    <option value="price">Sort by Price</option>
                    <option value="title">Sort by Title</option>
                    <option value="date">Sort by Date</option>
                  </select>

                  {/* Export */}
                  <button
                    onClick={exportData}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>

                  {/* Add Project */}
                  <button
                    onClick={() => setShowHireForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.projectTitle}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.projectName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{project.username}</div>
                        <div className="text-sm text-gray-500">{project.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                          {project.category?.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${project.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(project.status)}
                          <select
                            value={project.status}
                            onChange={(e) => handleStatusChange(project.id, e.target.value)}
                            disabled={updating}
                            className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(project.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewProject(project.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={updating}
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedProjects.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500 mb-4">
                  {filter === 'all' ? 'No projects have been created yet.' : `No projects with status "${filter}".`}
                </p>
                <button
                  onClick={() => setShowHireForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Project
                </button>
              </div>
            )}
          </div>
        )}

        {/* Portfolio Projects Section */}
        {activeTab === 'portfolio' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Portfolio Projects Management</h2>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Portfolio Filters */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={portfolioFilter}
                      onChange={(e) => setPortfolioFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Projects</option>
                      <option value="featured">Featured</option>
                      <option value="web-development">Web Development</option>
                      <option value="web-design">Web Design</option>
                      <option value="ui-ux">UI/UX Design</option>
                      <option value="seo">SEO Projects</option>
                      <option value="mobile-app">Mobile App</option>
                    </select>
                  </div>

                  {/* Export Portfolio */}
                  <button
                    onClick={exportPortfolioData}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>

                  {/* Add Portfolio Project */}
                  <button
                    onClick={() => {
                      setEditingPortfolioProject(null);
                      setShowPortfolioForm(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Portfolio Project</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Projects Grid */}
            <div className="p-6">
              {filteredPortfolioProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPortfolioProjects.map((project) => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {project.featured && (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPortfolioStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => window.open(project.liveUrl, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Live Project"
                            >
                              <Globe className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditPortfolioProject(project)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Edit Project"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePortfolioProject(project.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={updating}
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Category: <span className="capitalize">{project.category.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio projects found</h3>
                  <p className="text-gray-500 mb-4">
                    {portfolioFilter === 'all' ? 'No portfolio projects have been created yet.' : `No projects in "${portfolioFilter}" category.`}
                  </p>
                  <button
                    onClick={() => {
                      setEditingPortfolioProject(null);
                      setShowPortfolioForm(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Portfolio Project
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showProjectDetails && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => {
            setShowProjectDetails(false);
            setSelectedProject(null);
          }}
        />
      )}

      {showHireForm && (
        <AdminHireForm
          onClose={() => setShowHireForm(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {showPortfolioForm && (
        <AdminPortfolioForm
          onClose={() => {
            setShowPortfolioForm(false);
            setEditingPortfolioProject(null);
          }}
          onProjectCreated={handlePortfolioProjectCreated}
          editProject={editingPortfolioProject}
        />
      )}
    </div>
  );
};

export default AdminDashboard;