import React, { useEffect, useState } from 'react';
import { Menu, X, Bell, Search, Filter, Calendar, Clock, CheckCircle, AlertCircle, User, LogOut, Settings, RefreshCw, Link, Plus } from 'lucide-react';
import { useNavigate } from 'react-router'
import ClientNavbar from './ClientNavbar';
import ClientHireForm from './ClientHireForm';
import axios from 'axios';

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const navigate = useNavigate()

 const checkAuth = async () => {
  console.log('checkAuth: Initiating authentication check...');
  try {
    const response = await axios.get('https://waqas-portfolio-qlpx.onrender.com/check-session', {
      withCredentials: true
    });
    
    const data = response.data;
    console.log('checkAuth: Response from /check-session:', data);

    if (data.success && data.isAuthenticated) {
      console.log('checkAuth: User is authenticated. User data:', data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } else {
      console.log('checkAuth: User is NOT authenticated. Response:', data);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  } catch (error) {
    console.error('checkAuth: Auth check error:', error.response ? error.response.data : error.message);
    setIsAuthenticated(false);
    setUser(null);
    return false;
  }
};


  // Fetch user projects
    const fetchUserProjects = async () => {
  console.log('fetchUserProjects: Attempting to fetch user projects...');
  try {
    const response = await axios.get('https://waqas-portfolio-qlpx.onrender.com/user-projects', {
      withCredentials: true
    });

    const data = response.data;
    console.log('fetchUserProjects: Response from /user-projects:', data);

    if (data.success) {
      console.log('fetchUserProjects: Projects fetched successfully. Count:', data.projects.length);
      const transformedProjects = data.projects.map(project => ({
        id: project.id,
        projectTitle: project.projectTitle,
        projectName: project.projectName,
        category: project.category,
        deadline: project.deadline,
        status: mapStatus(project.status),
        progress: getProgressByStatus(project.status),
        priority: getPriorityByCategory(project.category),
        description: project.details || `${project.category} project`,
        price: project.price,
        createdAt: project.createdAt
      }));

      setProjects(transformedProjects);

      // Calculate stats
      const completed = transformedProjects.filter(p => p.status === 'Completed').length;
      const pending = transformedProjects.filter(p => p.status === 'Pending').length;
      const inProgress = transformedProjects.filter(p => p.status === 'In Progress').length;

      setStats({ 
        total: transformedProjects.length, 
        completed, 
        pending, 
        inProgress 
      });
      console.log('fetchUserProjects: Stats updated:', { total: transformedProjects.length, completed, pending, inProgress });
    }
  } catch (error) {
    console.error('fetchUserProjects: Fetch projects error:', error.response ? error.response.data : error.message);
    setError('Failed to load projects');
  }
};


  // Helper functions
  const mapStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Pending';
    }
  };

  const getProgressByStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 100;
      case 'in_progress': return Math.floor(Math.random() * 70) + 20;
      case 'pending': return 0;
      default: return 0;
    }
  };

  const getPriorityByCategory = (category) => {
    const priorities = ['High', 'Medium', 'Low'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  };

  const formatCategoryName = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      const isAuth = await checkAuth();
      
      if (isAuth) {
        await fetchUserProjects();
      } else {
        setError('Please log in to view your dashboard');
      }
      
      setIsLoading(false);
    };

    initializeDashboard();
  }, []);

  const refreshProjects = async () => {
    setIsLoading(true);
    await fetchUserProjects();
    setIsLoading(false);
  };

  const addProject = () => {
    setShowAddProject(true);
  };

  const handleCloseAddProject = () => {
    setShowAddProject(false);
  };

  const handleProjectAdded = async () => {
    setShowAddProject(false);
    await refreshProjects();
  };

  const filteredProjects = projects.filter(project => {
  const title = project.projectTitle ?? '';
  const name = project.projectName ?? '';
  const search = searchTerm.toLowerCase();

  const matchesSearch = title.toLowerCase().includes(search) || name.toLowerCase().includes(search);
  const matchesFilter = filterStatus === 'all' || project.status === filterStatus;

  return matchesSearch && matchesFilter;
});

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'Pending': return <Clock size={16} className="text-yellow-600" />;
      case 'In Progress': return <AlertCircle size={16} className="text-blue-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setProjects([]);
    setStats({ total: 0, completed: 0, pending: 0, inProgress: 0 });
    navigate('/login')
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <ClientNavbar onLogout={handleLogout} user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1365ff] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#1365ff] mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="bg-[#1365ff] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show Add Project Form
  if (showAddProject) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <ClientNavbar onLogout={handleLogout} user={user} />
        <div className="w-full px-6 md:px-20 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#1365ff]">Add New Project</h2>
            <button
              onClick={handleCloseAddProject}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
          <ClientHireForm 
            onProjectAdded={handleProjectAdded}
            onCancel={handleCloseAddProject}
            user={user}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <ClientNavbar onLogout={handleLogout} user={user} />
      
      <div className="w-full px-6 md:px-20 py-12 text-[#333]">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#1365ff] mb-2">
              Welcome back, {user?.full_name}!
            </h2>
            <p className="text-gray-600">Track your projects and monitor progress</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={refreshProjects}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              onClick={addProject}
              className="flex items-center gap-2 bg-[#1365ff] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Plus size={16} />
              Add New Project
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1365ff]">Total Projects</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="text-[#1365ff]" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-600">Completed</h3>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
            <p className="text-sm text-gray-500 mt-1">Successfully delivered</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-600">In Progress</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
            <p className="text-sm text-gray-500 mt-1">Currently working</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-600">Pending</h3>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting start</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1365ff] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1365ff] focus:border-transparent bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Projects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#1365ff] mb-2">{project.projectTitle}</h4>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Project Name:</span>
                  <span className="font-medium">{project.projectName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{formatCategoryName(project.category)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium">${project.price}</span>
                </div>
                {project.deadline && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Deadline:</span>
                    <span className="font-medium">{project.deadline}</span>
                  </div>
                )}
              </div>

              {project.status === 'In Progress' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress:</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#1365ff] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  {project.status}
                </div>
                <button className="text-[#1365ff] hover:text-blue-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
            <p className="text-gray-500">
              {projects.length === 0 ? 
                "You haven't created any projects yet. Start by submitting a project request!" : 
                "Try adjusting your search or filter criteria"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;