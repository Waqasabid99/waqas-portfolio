import React, { useState } from 'react';
import { X, Plus, Trash2, Save, User, Mail, Lock, FileText, Calendar, DollarSign, Tag, Globe, Smartphone, Search, TrendingUp, PenTool } from 'lucide-react';
import axios from 'axios';

const AdminHireForm = ({ onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    // Basic Info
    username: '',
    email: '',
    password: '',
    projectName: '',
    projectTitle: '',
    category: '',
    price: '',
    deadline: '',
    details: '',
    
    // Web Development
    tech: '',
    webPages: '',
    webFeatures: [],
    
    // SEO
    seoType: [],
    
    // Digital Marketing
    digitalMarketingServices: [],
    socialPlatforms: [],
    marketingDuration: '',
    targetAudience: '',
    marketingBudget: '',
    
    // Content Generation
    contentTypes: [],
    contentVolume: '',
    contentLanguages: [],
    contentTone: '',
    targetKeywords: '',
    
    // App Development
    appType: '',
    appFeatures: [],
    appComplexity: '',
    targetPlatforms: '',
    expectedUsers: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = 'https://waqas-portfolio-qlpx.onrender.com/';

  // Available options for different categories
  const categoryOptions = [
    { value: 'web-development', label: 'Web Development', icon: Globe },
    { value: 'app-development', label: 'App Development', icon: Smartphone },
    { value: 'seo', label: 'SEO', icon: Search },
    { value: 'digital-marketing', label: 'Digital Marketing', icon: TrendingUp },
    { value: 'content-generation', label: 'Content Generation', icon: PenTool }
  ];

  const webFeatureOptions = [
    'responsive-design', 'cms-integration', 'e-commerce', 'user-authentication',
    'payment-gateway', 'api-integration', 'seo-optimization', 'analytics',
    'social-media-integration', 'multi-language'
  ];

  const seoTypeOptions = [
    'on-page-seo', 'off-page-seo', 'technical-seo', 'local-seo', 'e-commerce-seo', 'content-seo'
  ];

  const digitalMarketingServiceOptions = [
    'social-media-marketing', 'ppc-advertising', 'email-marketing',
    'content-marketing', 'influencer-marketing', 'affiliate-marketing'
  ];

  const socialPlatformOptions = [
    'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'pinterest'
  ];

  const contentTypeOptions = [
    'blog-posts', 'articles', 'product-descriptions', 'social-media-content',
    'email-content', 'website-copy', 'press-releases', 'whitepapers'
  ];

  const contentLanguageOptions = [
    'english', 'spanish', 'french', 'german', 'italian', 'portuguese',
    'chinese', 'japanese', 'korean', 'arabic'
  ];

  const appFeatureOptions = [
    'user-authentication', 'push-notifications', 'offline-mode', 'real-time-chat',
    'payment-integration', 'social-login', 'geolocation', 'camera-integration',
    'file-upload', 'analytics'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.projectTitle.trim()) newErrors.projectTitle = 'Project title is required';
    if (!formData.category) newErrors.category = 'Category is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Price validation
    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'Please enter a valid price';
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
      const response = await axios.post(`${API_BASE_URL}/admin/projects`, formData, {
        withCredentials: true
      });

      if (response.data.success) {
        alert('Project created successfully!');
        onProjectCreated();
        onClose();
      }
    } catch (error) {
      console.error('Create project error:', error);
      alert(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySpecificFields = () => {
    switch (formData.category) {
      case 'web-development':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Web Development Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technology Stack
                </label>
                <input
                  type="text"
                  name="tech"
                  value={formData.tech}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Pages
                </label>
                <input
                  type="number"
                  name="webPages"
                  value={formData.webPages}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {webFeatureOptions.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.webFeatures.includes(feature)}
                      onChange={() => handleArrayChange('webFeatures', feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {feature.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEO Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {seoTypeOptions.map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.seoType.includes(type)}
                      onChange={() => handleArrayChange('seoType', type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {type.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'digital-marketing':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Digital Marketing Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="e.g., Young professionals, 25-35"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marketing Budget ($)
                </label>
                <input
                  type="number"
                  name="marketingBudget"
                  value={formData.marketingBudget}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  name="marketingDuration"
                  value={formData.marketingDuration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select duration</option>
                  <option value="1-month">1 Month</option>
                  <option value="3-months">3 Months</option>
                  <option value="6-months">6 Months</option>
                  <option value="12-months">12 Months</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marketing Services
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {digitalMarketingServiceOptions.map(service => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.digitalMarketingServices.includes(service)}
                      onChange={() => handleArrayChange('digitalMarketingServices', service)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {service.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Platforms
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {socialPlatformOptions.map(platform => (
                  <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.socialPlatforms.includes(platform)}
                      onChange={() => handleArrayChange('socialPlatforms', platform)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {platform}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'content-generation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <PenTool className="w-5 h-5 mr-2" />
              Content Generation Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Volume
                </label>
                <select
                  name="contentVolume"
                  value={formData.contentVolume}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select volume</option>
                  <option value="low">Low (1-10 pieces)</option>
                  <option value="medium">Medium (11-50 pieces)</option>
                  <option value="high">High (51-100 pieces)</option>
                  <option value="bulk">Bulk (100+ pieces)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Tone
                </label>
                <select
                  name="contentTone"
                  value={formData.contentTone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tone</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="conversational">Conversational</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Keywords
                </label>
                <input
                  type="text"
                  name="targetKeywords"
                  value={formData.targetKeywords}
                  onChange={handleInputChange}
                  placeholder="e.g., digital marketing, SEO, content"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {contentTypeOptions.map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.contentTypes.includes(type)}
                      onChange={() => handleArrayChange('contentTypes', type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {type.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {contentLanguageOptions.map(language => (
                  <label key={language} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.contentLanguages.includes(language)}
                      onChange={() => handleArrayChange('contentLanguages', language)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {language}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'app-development':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              App Development Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  App Type
                </label>
                <select
                  name="appType"
                  value={formData.appType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select app type</option>
                  <option value="native-ios">Native iOS</option>
                  <option value="native-android">Native Android</option>
                  <option value="cross-platform">Cross Platform</option>
                  <option value="web-app">Web App</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complexity
                </label>
                <select
                  name="appComplexity"
                  value={formData.appComplexity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select complexity</option>
                  <option value="simple">Simple</option>
                  <option value="medium">Medium</option>
                  <option value="complex">Complex</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Platforms
                </label>
                <input
                  type="text"
                  name="targetPlatforms"
                  value={formData.targetPlatforms}
                  onChange={handleInputChange}
                  placeholder="e.g., iOS, Android, Web"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Users
                </label>
                <input
                  type="number"
                  name="expectedUsers"
                  value={formData.expectedUsers}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Number of expected users"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App Features
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {appFeatureOptions.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.appFeatures.includes(feature)}
                      onChange={() => handleArrayChange('appFeatures', feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {feature.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl max-h-[90vh] overflow-y-auto w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1365ff]">Create New Project</h2>
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
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter client name"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Project Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter project name"
                />
                {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter project title"
                />
                {errors.projectTitle && <p className="text-red-500 text-xs mt-1">{errors.projectTitle}</p>}
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter project price"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Details
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project details and requirements..."
              />
            </div>
          </div>

          {/* Category-specific fields */}
          {formData.category && renderCategorySpecificFields()}

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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHireForm;