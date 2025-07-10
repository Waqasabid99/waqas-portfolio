import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Select = ({ options, value, onChange, placeholder, isMulti = false }) => {
  const handleChange = (e) => {
    if (isMulti) {
      const selectedOptions = Array.from(e.target.selectedOptions, option =>
        options.find(opt => opt.value === option.value)
      );
      onChange(selectedOptions);
    } else {
      const selectedOption = options.find(opt => opt.value === e.target.value);
      onChange(selectedOption);
    }
  };

  return (
    <select
      multiple={isMulti}
      value={isMulti ? value?.map(v => v.value) || [] : value?.value || ''}
      onChange={handleChange}
      className="border px-4 py-2 rounded-md w-full"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const categoryOptions = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'seo', label: 'SEO' },
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'content-generation', label: 'Content Generation' },
  { value: 'app-development', label: 'App Development' },
];

// Web Development Options
const techOptions = [
  { value: 'wordpress', label: 'WordPress', price: 100 },
  { value: 'frontend', label: 'Frontend Only (HTML/CSS/JS/React)', price: 150 },
  { value: 'backend', label: 'Backend Only (MERN/MEAN)', price: 180 },
  { value: 'fullstack', label: 'Full Stack', price: 250 },
];

const webFeatures = [
  { value: 'payment-gateway', label: 'Payment Gateway', price: 80 },
  { value: 'social-login', label: 'Social Media Integration', price: 50 },
  { value: 'live-chat', label: 'Live Chat Support', price: 40 },
  { value: 'responsive-design', label: 'Responsive Design', price: 30 },
  { value: 'admin-panel', label: 'Admin Panel', price: 100 },
];

// SEO Options
const seoOptions = [
  { value: 'on-page', label: 'On-Page SEO', price: 60 },
  { value: 'off-page', label: 'Off-Page SEO', price: 70 },
  { value: 'white-hat', label: 'White Hat SEO', price: 90 },
];

// Digital Marketing Options
const digitalMarketingServices = [
  { value: 'social-media-management', label: 'Social Media Management', price: 200 },
  { value: 'ppc-campaigns', label: 'PPC Campaigns (Google/Facebook)', price: 300 },
  { value: 'email-marketing', label: 'Email Marketing', price: 150 },
  { value: 'influencer-marketing', label: 'Influencer Marketing', price: 250 },
  { value: 'affiliate-marketing', label: 'Affiliate Marketing Setup', price: 180 },
  { value: 'conversion-optimization', label: 'Conversion Rate Optimization', price: 220 },
];

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook', price: 50 },
  { value: 'instagram', label: 'Instagram', price: 50 },
  { value: 'twitter', label: 'Twitter', price: 40 },
  { value: 'linkedin', label: 'LinkedIn', price: 60 },
  { value: 'youtube', label: 'YouTube', price: 80 },
  { value: 'tiktok', label: 'TikTok', price: 70 },
];

const marketingDuration = [
  { value: '1-month', label: '1 Month', price: 0 },
  { value: '3-months', label: '3 Months', price: 50 },
  { value: '6-months', label: '6 Months', price: 120 },
  { value: '12-months', label: '12 Months', price: 200 },
];

// Content Generation Options
const contentTypes = [
  { value: 'blog-posts', label: 'Blog Posts', price: 25 },
  { value: 'product-descriptions', label: 'Product Descriptions', price: 15 },
  { value: 'social-media-content', label: 'Social Media Content', price: 20 },
  { value: 'email-newsletters', label: 'Email Newsletters', price: 30 },
  { value: 'website-copy', label: 'Website Copy', price: 40 },
  { value: 'press-releases', label: 'Press Releases', price: 50 },
  { value: 'whitepapers', label: 'Whitepapers', price: 100 },
  { value: 'case-studies', label: 'Case Studies', price: 80 },
];

const contentVolume = [
  { value: '1-10', label: '1-10 pieces', multiplier: 1 },
  { value: '11-25', label: '11-25 pieces', multiplier: 0.9 },
  { value: '26-50', label: '26-50 pieces', multiplier: 0.8 },
  { value: '51-100', label: '51-100 pieces', multiplier: 0.7 },
  { value: '100+', label: '100+ pieces', multiplier: 0.6 },
];

const contentLanguages = [
  { value: 'english', label: 'English', price: 0 },
  { value: 'spanish', label: 'Spanish', price: 10 },
  { value: 'french', label: 'French', price: 15 },
  { value: 'german', label: 'German', price: 15 },
  { value: 'arabic', label: 'Arabic', price: 20 },
  { value: 'chinese', label: 'Chinese', price: 25 },
];

// App Development Options
const appTypes = [
  { value: 'native-ios', label: 'Native iOS App', price: 500 },
  { value: 'native-android', label: 'Native Android App', price: 450 },
  { value: 'cross-platform', label: 'Cross-Platform (React Native/Flutter)', price: 600 },
  { value: 'web-app', label: 'Progressive Web App (PWA)', price: 350 },
  { value: 'hybrid', label: 'Hybrid App (Cordova/Ionic)', price: 400 },
];

const appFeatures = [
  { value: 'user-authentication', label: 'User Authentication', price: 80 },
  { value: 'push-notifications', label: 'Push Notifications', price: 60 },
  { value: 'in-app-purchases', label: 'In-App Purchases', price: 120 },
  { value: 'social-sharing', label: 'Social Media Sharing', price: 40 },
  { value: 'offline-functionality', label: 'Offline Functionality', price: 100 },
  { value: 'real-time-chat', label: 'Real-time Chat', price: 150 },
  { value: 'geolocation', label: 'GPS/Location Services', price: 90 },
  { value: 'camera-integration', label: 'Camera Integration', price: 70 },
  { value: 'file-upload', label: 'File Upload/Download', price: 50 },
  { value: 'analytics', label: 'Analytics Integration', price: 60 },
];

const appComplexity = [
  { value: 'simple', label: 'Simple (Basic functionality)', multiplier: 1 },
  { value: 'medium', label: 'Medium (Moderate features)', multiplier: 1.5 },
  { value: 'complex', label: 'Complex (Advanced features)', multiplier: 2 },
  { value: 'enterprise', label: 'Enterprise (Full-scale solution)', multiplier: 3 },
];

const ClientHireForm = ({ onProjectAdded, onCancel, user }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectTitle: '',
    category: null,

    // Web Development
    tech: null,
    webPages: '',
    webFeatures: [],

    // SEO
    seoType: [],

    // Digital Marketing
    digitalMarketingServices: [],
    socialPlatforms: [],
    marketingDuration: null,
    targetAudience: '',
    marketingBudget: '',

    // Content Generation
    contentTypes: [],
    contentVolume: null,
    contentLanguages: [],
    contentTone: '',
    targetKeywords: '',

    // App Development
    appType: null,
    appFeatures: [],
    appComplexity: null,
    targetPlatforms: '',
    expectedUsers: '',

    price: 0,
    deadline: '',
    details: '',
  });

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = 'https://waqas-portfolio-qlpx.onrender.com/';

  useEffect(() => {
    let base = 0;

    // Web Development Pricing
    if (formData.category?.value === 'web-development') {
      base += formData.tech?.price || 0;
      base += (parseInt(formData.webPages) || 0) * 10;
      formData.webFeatures.forEach((f) => {
        base += f.price;
      });
    }

    // SEO Pricing
    if (formData.category?.value === 'seo') {
      formData.seoType.forEach((s) => {
        base += s.price;
      });
    }

    // Digital Marketing Pricing
    if (formData.category?.value === 'digital-marketing') {
      formData.digitalMarketingServices.forEach((s) => {
        base += s.price;
      });
      formData.socialPlatforms.forEach((p) => {
        base += p.price;
      });
      base += formData.marketingDuration?.price || 0;

      // Add budget-based pricing
      const budget = parseInt(formData.marketingBudget) || 0;
      if (budget > 0) {
        base += Math.floor(budget * 0.15);
      }
    }

    // Content Generation Pricing
    if (formData.category?.value === 'content-generation') {
      let contentBase = 0;
      formData.contentTypes.forEach((c) => {
        contentBase += c.price;
      });

      // Apply volume multiplier
      const volumeMultiplier = formData.contentVolume?.multiplier || 1;
      contentBase *= volumeMultiplier;

      // Add language pricing
      formData.contentLanguages.forEach((l) => {
        contentBase += l.price;
      });

      base += contentBase;
    }

    // App Development Pricing
    if (formData.category?.value === 'app-development') {
      let appBase = formData.appType?.price || 0;

      formData.appFeatures.forEach((f) => {
        appBase += f.price;
      });

      // Apply complexity multiplier
      const complexityMultiplier = formData.appComplexity?.multiplier || 1;
      appBase *= complexityMultiplier;

      base += appBase;
    }

    setCalculatedPrice(base);
    setFormData((prev) => ({ ...prev, price: base }));
  }, [
    formData.tech, formData.webPages, formData.webFeatures, formData.seoType,
    formData.digitalMarketingServices, formData.socialPlatforms, formData.marketingDuration, formData.marketingBudget,
    formData.contentTypes, formData.contentVolume, formData.contentLanguages,
    formData.appType, formData.appFeatures, formData.appComplexity,
    formData.category
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData({
      ...formData,
      category: selectedOption,
      // Reset all category-specific fields
      tech: null,
      webPages: '',
      webFeatures: [],
      seoType: [],
      digitalMarketingServices: [],
      socialPlatforms: [],
      marketingDuration: null,
      targetAudience: '',
      marketingBudget: '',
      contentTypes: [],
      contentVolume: null,
      contentLanguages: [],
      contentTone: '',
      targetKeywords: '',
      appType: null,
      appFeatures: [],
      appComplexity: null,
      targetPlatforms: '',
      expectedUsers: '',
      price: 0,
    });
  };

  const validateForm = () => {
    const errors = [];

    // Basic validation
    if (!formData.projectName.trim()) errors.push('Project Name is required');
    if (!formData.projectTitle.trim()) errors.push('Project Title is required');
    if (!formData.category) errors.push('Project Category is required');

    // Category-specific validation
    if (formData.category?.value === 'web-development') {
      if (!formData.tech) errors.push('Technology selection is required for web development');
    }

    if (formData.category?.value === 'seo') {
      if (formData.seoType.length === 0) errors.push('At least one SEO type must be selected');
    }

    if (formData.category?.value === 'digital-marketing') {
      if (formData.digitalMarketingServices.length === 0) errors.push('At least one marketing service must be selected');
    }

    if (formData.category?.value === 'content-generation') {
      if (formData.contentTypes.length === 0) errors.push('At least one content type must be selected');
    }

    if (formData.category?.value === 'app-development') {
      if (!formData.appType) errors.push('App type selection is required');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      setLoading(false);
      return;
    }

    try {
      const payload = {
        projectName: formData.projectName,
        projectTitle: formData.projectTitle,
        category: formData.category?.value || '',
        price: formData.price,
        deadline: formData.deadline,
        details: formData.details,

        // Web Development
        ...(formData.category?.value === 'web-development' && {
          tech: formData.tech?.value || '',
          webPages: formData.webPages,
          webFeatures: formData.webFeatures.map((f) => f.value)
        }),

        // SEO
        ...(formData.category?.value === 'seo' && {
          seoType: formData.seoType.map((s) => s.value)
        }),

        // Digital Marketing
        ...(formData.category?.value === 'digital-marketing' && {
          digitalMarketingServices: formData.digitalMarketingServices.map((s) => s.value),
          socialPlatforms: formData.socialPlatforms.map((p) => p.value),
          marketingDuration: formData.marketingDuration?.value || '',
          targetAudience: formData.targetAudience,
          marketingBudget: formData.marketingBudget
        }),

        // Content Generation
        ...(formData.category?.value === 'content-generation' && {
          contentTypes: formData.contentTypes.map((c) => c.value),
          contentVolume: formData.contentVolume?.value || '',
          contentLanguages: formData.contentLanguages.map((l) => l.value),
          contentTone: formData.contentTone,
          targetKeywords: formData.targetKeywords
        }),

        // App Development
        ...(formData.category?.value === 'app-development' && {
          appType: formData.appType?.value || '',
          appFeatures: formData.appFeatures.map((f) => f.value),
          appComplexity: formData.appComplexity?.value || '',
          targetPlatforms: formData.targetPlatforms,
          expectedUsers: formData.expectedUsers
        })
      };

      console.log('Submitting payload:', payload);

      const response = await axios.post(`${API_BASE_URL}/add-project`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        setSuccess('Project added successfully!');
        
        // Call the callback to notify parent component
        if (onProjectAdded) {
          onProjectAdded(response.data.project);
        }

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            projectName: '',
            projectTitle: '',
            category: null,
            tech: null,
            webPages: '',
            webFeatures: [],
            seoType: [],
            digitalMarketingServices: [],
            socialPlatforms: [],
            marketingDuration: null,
            targetAudience: '',
            marketingBudget: '',
            contentTypes: [],
            contentVolume: null,
            contentLanguages: [],
            contentTone: '',
            targetKeywords: '',
            appType: null,
            appFeatures: [],
            appComplexity: null,
            targetPlatforms: '',
            expectedUsers: '',
            price: 0,
            deadline: '',
            details: '',
          });
          setSuccess('');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to add project. Please try again.');
      }

    } catch (error) {
      console.error('Add project error:', error);

      let errorMessage = 'An error occurred while adding the project. ';

      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = 'Please log in to add a project.';
        } else {
          errorMessage += `Server error: ${error.response.data?.message || error.response.statusText}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage += 'No response from server. Please check your connection and try again.';
      } else {
        // Something else happened
        errorMessage += error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6 md:px-20 py-10 bg-gray-50">
      <div className="max-w-screen-lg mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <div className='flex justify-between items-start'>
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Add New Project</h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-100 border border-red-400 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-md bg-green-100 border border-green-400 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="projectName"
              required
              onChange={handleChange}
              value={formData.projectName}
              placeholder="Project Name"
              className="border px-4 py-2 rounded-md"
            />
            <input
              name="projectTitle"
              required
              onChange={handleChange}
              value={formData.projectTitle}
              placeholder="Project Title"
              className="border px-4 py-2 rounded-md"
            />
            <Select
              options={categoryOptions}
              value={formData.category}
              onChange={handleCategoryChange}
              placeholder="Project Category"
            />
          </div>

          {formData.category?.value === 'web-development' && (
            <div className="space-y-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">Web Development Details</h3>
              <Select
                options={techOptions}
                value={formData.tech}
                onChange={(opt) => setFormData({ ...formData, tech: opt })}
                placeholder="Select Technology"
              />
              <input
                name="webPages"
                type="number"
                onChange={handleChange}
                value={formData.webPages}
                placeholder="Number of Pages"
                className="border px-4 py-2 rounded-md w-full"
              />
              <Select
                isMulti
                options={webFeatures}
                value={formData.webFeatures}
                onChange={(opt) => setFormData({ ...formData, webFeatures: opt })}
                placeholder="Additional Features"
              />
            </div>
          )}

          {formData.category?.value === 'seo' && (
            <div className="space-y-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">SEO Details</h3>
              <Select
                isMulti
                options={seoOptions}
                value={formData.seoType}
                onChange={(opt) => setFormData({ ...formData, seoType: opt })}
                placeholder="Select SEO Type"
              />
            </div>
          )}

          {formData.category?.value === 'digital-marketing' && (
            <div className="space-y-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">Digital Marketing Details</h3>
              <Select
                isMulti
                options={digitalMarketingServices}
                value={formData.digitalMarketingServices}
                onChange={(opt) => setFormData({ ...formData, digitalMarketingServices: opt })}
                placeholder="Select Marketing Services"
              />
              <Select
                isMulti
                options={socialPlatforms}
                value={formData.socialPlatforms}
                onChange={(opt) => setFormData({ ...formData, socialPlatforms: opt })}
                placeholder="Target Social Platforms"
              />
              <Select
                options={marketingDuration}
                value={formData.marketingDuration}
                onChange={(opt) => setFormData({ ...formData, marketingDuration: opt })}
                placeholder="Campaign Duration"
              />
              <input
                name="targetAudience"
                onChange={handleChange}
                value={formData.targetAudience}
                placeholder="Target Audience Description"
                className="border px-4 py-2 rounded-md w-full"
              />
              <input
                name="marketingBudget"
                type="number"
                onChange={handleChange}
                value={formData.marketingBudget}
                placeholder="Monthly Marketing Budget ($)"
                className="border px-4 py-2 rounded-md w-full"
              />
            </div>
          )}

          {formData.category?.value === 'content-generation' && (
            <div className="space-y-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">Content Generation Details</h3>
              <Select
                isMulti
                options={contentTypes}
                value={formData.contentTypes}
                onChange={(opt) => setFormData({ ...formData, contentTypes: opt })}
                placeholder="Select Content Types"
              />
              <Select
                options={contentVolume}
                value={formData.contentVolume}
                onChange={(opt) => setFormData({ ...formData, contentVolume: opt })}
                placeholder="Content Volume"
              />
              <Select
                isMulti
                options={contentLanguages}
                value={formData.contentLanguages}
                onChange={(opt) => setFormData({ ...formData, contentLanguages: opt })}
                placeholder="Content Languages"
              />
              <input
                name="contentTone"
                onChange={handleChange}
                value={formData.contentTone}
                placeholder="Content Tone (e.g., Professional, Casual, Technical)"
                className="border px-4 py-2 rounded-md w-full"
              />
              <input
                name="targetKeywords"
                onChange={handleChange}
                value={formData.targetKeywords}
                placeholder="Target Keywords (comma-separated)"
                className="border px-4 py-2 rounded-md w-full"
              />
            </div>
          )}

          {formData.category?.value === 'app-development' && (
            <div className="space-y-6 p-4 bg-red-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">App Development Details</h3>
              <Select
                options={appTypes}
                value={formData.appType}
                onChange={(opt) => setFormData({ ...formData, appType: opt })}
                placeholder="Select App Type"
              />
              <Select
                isMulti
                options={appFeatures}
                value={formData.appFeatures}
                onChange={(opt) => setFormData({ ...formData, appFeatures: opt })}
                placeholder="Select App Features"
              />
              <Select
                options={appComplexity}
                value={formData.appComplexity}
                onChange={(opt) => setFormData({ ...formData, appComplexity: opt })}
                placeholder="App Complexity Level"
              />
              <input
                name="targetPlatforms"
                onChange={handleChange}
                value={formData.targetPlatforms}
                placeholder="Target Platforms (if specific versions needed)"
                className="border px-4 py-2 rounded-md w-full"
              />
              <input
                name="expectedUsers"
                type="number"
                onChange={handleChange}
                value={formData.expectedUsers}
                placeholder="Expected Number of Users"
                className="border px-4 py-2 rounded-md w-full"
              />
            </div>
          )}

          <div className="space-y-6">
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md w-full"
            />
            <textarea
              name="details"
              rows="5"
              value={formData.details}
              onChange={handleChange}
              placeholder="Additional Project Details"
              className="border px-4 py-2 rounded-md w-full"
            />
          </div>

          <div className="text-right font-semibold text-lg text-blue-600 bg-gray-50 p-4 rounded-lg">
            Estimated Price: ${calculatedPrice}
            {formData.category?.value === 'digital-marketing' && formData.marketingBudget && (
              <div className="text-sm text-gray-600 mt-1">
                (Includes 15% management fee on ad budget)
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-full border transition ${loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-white hover:text-blue-600 border-blue-600'
              }`}
            >
              {loading ? 'Adding Project...' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientHireForm;