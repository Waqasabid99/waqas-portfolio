import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Image, Globe, Github, Star, Tag, FileText, Link, Eye } from 'lucide-react';
import axios from 'axios';

const AdminPortfolioForm = ({ onClose, onProjectCreated, editProject = null }) => {
  const [formData, setFormData] = useState({
    title: editProject?.title || '',
    category: editProject?.category || '',
    image: editProject?.image || '',
    description: editProject?.description || '',
    technologies: editProject?.technologies || [],
    liveUrl: editProject?.liveUrl || '',
    githubUrl: editProject?.githubUrl || '',
    featured: editProject?.featured || false,
    status: editProject?.status || 'active'
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = 'https://routes.waqasabidwork.online';

  // Available categories
  const categoryOptions = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'web-design', label: 'Web Design' },
    { value: 'ui-ux', label: 'UI/UX Design' },
    { value: 'seo', label: 'SEO Projects' },
    { value: 'mobile-app', label: 'Mobile App' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'content-generation', label: 'Content Generation' }
  ];

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' }
  ];

  // Common technologies for quick selection
  const commonTechnologies = [
    'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'HTML5', 'CSS3',
    'Tailwind CSS', 'MongoDB', 'MySQL', 'PostgreSQL', 'Express.js', 'Next.js',
    'Vue.js', 'Angular', 'PHP', 'Laravel', 'WordPress', 'Figma', 'Adobe XD',
    'Photoshop', 'Illustrator', 'Bootstrap', 'jQuery', 'Firebase', 'AWS',
    'Docker', 'Git', 'GitHub', 'Stripe', 'PayPal'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addTechnology = (tech) => {
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleAddCustomTechnology = () => {
    if (newTechnology.trim()) {
      addTechnology(newTechnology.trim());
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.liveUrl.trim()) newErrors.liveUrl = 'Live URL is required';
    if (formData.technologies.length === 0) newErrors.technologies = 'At least one technology is required';

    // URL validation
    const urlRegex = /^https?:\/\/.+/;
    if (formData.image && !urlRegex.test(formData.image)) {
      newErrors.image = 'Please enter a valid image URL (starting with http:// or https://)';
    }
    if (formData.liveUrl && !urlRegex.test(formData.liveUrl)) {
      newErrors.liveUrl = 'Please enter a valid live URL (starting with http:// or https://)';
    }
    if (formData.githubUrl && formData.githubUrl.trim() && !urlRegex.test(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = editProject 
        ? `${API_BASE_URL}/admin/portfolio-projects/${editProject.id}`
        : `${API_BASE_URL}/admin/portfolio-projects`;
      
      const method = editProject ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: formData,
        withCredentials: true
      });

      if (response.data.success) {
        alert(editProject ? 'Portfolio project updated successfully!' : 'Portfolio project created successfully!');
        onProjectCreated();
        onClose();
      }
    } catch (error) {
      console.error('Portfolio project error:', error);
      alert(error.response?.data?.message || `Failed to ${editProject ? 'update' : 'create'} portfolio project`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1365ff]">
              {editProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter project title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project description..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* URLs and Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Link className="w-5 h-5 mr-2" />
              URLs and Media
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => window.open(formData.image, '_blank')}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Live URL *
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.liveUrl ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://project-demo.com"
                  />
                  {errors.liveUrl && <p className="text-red-500 text-xs mt-1">{errors.liveUrl}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.githubUrl ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://github.com/username/repo"
                  />
                  {errors.githubUrl && <p className="text-red-500 text-xs mt-1">{errors.githubUrl}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Technologies Used *
            </h3>
            
            {/* Selected Technologies */}
            {formData.technologies.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Technologies:
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-[#1365ff] text-white text-sm rounded-full"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-2 text-white hover:text-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add Custom Technology */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Custom Technology:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTechnology())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter technology name"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTechnology}
                  className="px-4 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Common Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Add (Common Technologies):
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {commonTechnologies.map(tech => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => addTechnology(tech)}
                    disabled={formData.technologies.includes(tech)}
                    className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                      formData.technologies.includes(tech)
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-[#1365ff] border-[#1365ff] hover:bg-[#1365ff] hover:text-white'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
            
            {errors.technologies && <p className="text-red-500 text-xs mt-1">{errors.technologies}</p>}
          </div>

          {/* Project Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Project Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Featured Project
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#1365ff] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editProject ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editProject ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPortfolioForm;