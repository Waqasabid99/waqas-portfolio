const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const app = express();
const port = 3001;
const prisma = new PrismaClient();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL, 
  legacyMode: true
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://waqasabidwork.online',
  credentials: true
}));

// Session configuration
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'None',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
} ));

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

app.get('/', (req, res) => {
  res.json({ message: "Backend server is running!" });
});

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        full_name,
        email,
        password: hashedPassword
      }
    });

    // Create session
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.full_name;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create session
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.full_name;

    res.status(200).json({
      success: true,
      message: 'Login successful, redirecting to dashboard',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not log out'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Check session endpoint
app.get('/check-session', (req, res) => {
  if (req.session.userId) {
    res.json({
      success: true,
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        email: req.session.userEmail,
        full_name: req.session.userName
      }
    });
  } else {
    res.json({
      success: false,
      isAuthenticated: false
    });
  }
});

// Forget password endpoint
app.post('/forget-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email not found'
      });
    }

    // In a real application, you would send a reset token via email
    // For now, we'll just confirm the email exists
    res.status(200).json({
      success: true,
      message: 'Email verified, you can now change your password'
    });

  } catch (error) {
    console.error('Forget password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Reset password endpoint
app.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create contact form entry
    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        subject,
        message,
        userId: req.session.userId || null // Link to user if logged in
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contactForm: {
        id: contactForm.id,
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Hire form endpoint
app.post('/hire', async (req, res) => {
  try {
    const {
      username, email, password, projectName, projectTitle, category,
      price, deadline, details,
      // Web Development
      tech, webPages, webFeatures,
      // SEO
      seoType,
      // Digital Marketing
      digitalMarketingServices, socialPlatforms, marketingDuration,
      targetAudience, marketingBudget,
      // Content Generation
      contentTypes, contentVolume, contentLanguages,
      contentTone, targetKeywords,
      // App Development
      appType, appFeatures, appComplexity,
      targetPlatforms, expectedUsers
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !projectName || !projectTitle || !category) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Check if user exists or create new user
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user
      const hashedPassword = await hashPassword(password);
      user = await prisma.user.create({
        data: {
          full_name: username,
          email,
          password: hashedPassword
        }
      });
    }

    const project = await prisma.project.create({
      data: {
        username,
        email,
        password: await hashPassword(password),
        projectName,
        projectTitle,
        category,
        price: parseFloat(price) || 0,
        deadline: deadline || null,
        details: details || null,
        userId: user.id
      }
    });

    // Handle category-specific details
    if (category === 'web-development') {
      const webDevDetail = await prisma.webDevelopmentDetail.create({
        data: {
          projectId: project.id,
          tech: tech || '',
          webPages: parseInt(webPages) || 0
        }
      });

      // Add web features
      if (webFeatures && webFeatures.length > 0) {
        const webFeatureData = webFeatures.map(feature => ({
          webDevDetailId: webDevDetail.id,
          feature,
          price: getFeaturePrice(feature, 'web')
        }));

        await prisma.webDevelopmentFeature.createMany({
          data: webFeatureData
        });
      }
    }

    if (category === 'seo') {
      const seoDetail = await prisma.seoDetail.create({
        data: {
          projectId: project.id
        }
      });

      if (seoType && seoType.length > 0) {
        const seoTypeData = seoType.map(type => ({
          seoDetailId: seoDetail.id,
          seoType: type,
          price: getFeaturePrice(type, 'seo')
        }));

        await prisma.seoType.createMany({
          data: seoTypeData
        });
      }
    }

    if (category === 'digital-marketing') {
      const digitalMarketingDetail = await prisma.digitalMarketingDetail.create({
        data: {
          projectId: project.id,
          targetAudience: targetAudience || null,
          marketingBudget: parseFloat(marketingBudget) || null,
          duration: marketingDuration || null
        }
      });

      if (digitalMarketingServices && digitalMarketingServices.length > 0) {
        const serviceData = digitalMarketingServices.map(service => ({
          digitalMarketingDetailId: digitalMarketingDetail.id,
          service,
          price: getFeaturePrice(service, 'digital-marketing')
        }));

        await prisma.digitalMarketingService.createMany({
          data: serviceData
        });
      }

      if (socialPlatforms && socialPlatforms.length > 0) {
        const platformData = socialPlatforms.map(platform => ({
          digitalMarketingDetailId: digitalMarketingDetail.id,
          platform,
          price: getFeaturePrice(platform, 'social-platform')
        }));

        await prisma.socialPlatform.createMany({
          data: platformData
        });
      }
    }

    if (category === 'content-generation') {
      const contentDetail = await prisma.contentGenerationDetail.create({
        data: {
          projectId: project.id,
          volume: contentVolume || null,
          contentTone: contentTone || null,
          targetKeywords: targetKeywords || null
        }
      });

      if (contentTypes && contentTypes.length > 0) {
        const contentTypeData = contentTypes.map(type => ({
          contentGenerationDetailId: contentDetail.id,
          contentType: type,
          price: getFeaturePrice(type, 'content-type')
        }));

        await prisma.contentType.createMany({
          data: contentTypeData
        });
      }

      if (contentLanguages && contentLanguages.length > 0) {
        const languageData = contentLanguages.map(language => ({
          contentGenerationDetailId: contentDetail.id,
          language,
          price: getFeaturePrice(language, 'content-language')
        }));

        await prisma.contentLanguage.createMany({
          data: languageData
        });
      }
    }

    if (category === 'app-development') {
      const appDetail = await prisma.appDevelopmentDetail.create({
        data: {
          projectId: project.id,
          appType: appType || null,
          complexity: appComplexity || null,
          targetPlatforms: targetPlatforms || null,
          expectedUsers: parseInt(expectedUsers) || null
        }
      });

      if (appFeatures && appFeatures.length > 0) {
        const featureData = appFeatures.map(feature => ({
          appDevelopmentDetailId: appDetail.id,
          feature,
          price: getFeaturePrice(feature, 'app-feature')
        }));

        await prisma.appFeature.createMany({
          data: featureData
        });
      }
    }

    // Create session for the user
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.full_name;

    res.status(201).json({
      success: true,
      message: 'Project request submitted successfully',
      project: {
        id: project.id,
        projectName: project.projectName,
        projectTitle: project.projectTitle,
        category: project.category,
        price: project.price
      }
    });

  } catch (error) {
    console.error('Hire form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while processing your request'
    });
  }
});

// Helper function to get feature prices
function getFeaturePrice(feature, type) {
  const prices = {
    // Web features
    'web': {
      'payment-gateway': 80,
      'social-login': 50,
      'live-chat': 40,
      'responsive-design': 30,
      'admin-panel': 100
    },
    // SEO types
    'seo': {
      'on-page': 60,
      'off-page': 70,
      'white-hat': 90
    },
    // Digital marketing services
    'digital-marketing': {
      'social-media-management': 200,
      'ppc-campaigns': 300,
      'email-marketing': 150,
      'influencer-marketing': 250,
      'affiliate-marketing': 180,
      'conversion-optimization': 220
    },
    // Social platforms
    'social-platform': {
      'facebook': 50,
      'instagram': 50,
      'twitter': 40,
      'linkedin': 60,
      'youtube': 80,
      'tiktok': 70
    },
    // Content types
    'content-type': {
      'blog-posts': 25,
      'product-descriptions': 15,
      'social-media-content': 20,
      'email-newsletters': 30,
      'website-copy': 40,
      'press-releases': 50,
      'whitepapers': 100,
      'case-studies': 80
    },
    // Content languages
    'content-language': {
      'english': 0,
      'spanish': 10,
      'french': 15,
      'german': 15,
      'arabic': 20,
      'chinese': 25
    },
    // App features
    'app-feature': {
      'user-authentication': 80,
      'push-notifications': 60,
      'in-app-purchases': 120,
      'social-sharing': 40,
      'offline-functionality': 100,
      'real-time-chat': 150,
      'geolocation': 90,
      'camera-integration': 70,
      'file-upload': 50,
      'analytics': 60
    }
  };

  return prices[type]?.[feature] || 0;
}

app.post('/add-project', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to add a project'
      });
    }

    const {
      projectName, projectTitle, category, price, deadline, details,
      // Web Development
      tech, webPages, webFeatures,
      // SEO
      seoType,
      // Digital Marketing
      digitalMarketingServices, socialPlatforms, marketingDuration,
      targetAudience, marketingBudget,
      // Content Generation
      contentTypes, contentVolume, contentLanguages,
      contentTone, targetKeywords,
      // App Development
      appType, appFeatures, appComplexity,
      targetPlatforms, expectedUsers
    } = req.body;

    // Validate required fields
    if (!projectName || !projectTitle || !category) {
      return res.status(400).json({
        success: false,
        message: 'Project name, title, and category are required'
      });
    }

    // Get user information from session
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        username: user.full_name,
        email: user.email,
        password: user.password, // Use existing password
        projectName,
        projectTitle,
        category,
        price: parseFloat(price) || 0,
        deadline: deadline || null,
        details: details || null,
        userId: user.id,
        status: 'pending'
      }
    });

    // Handle category-specific details (same logic as the hire endpoint)
    if (category === 'web-development') {
      const webDevDetail = await prisma.webDevelopmentDetail.create({
        data: {
          projectId: project.id,
          tech: tech || '',
          webPages: parseInt(webPages) || 0
        }
      });

      // Add web features
      if (webFeatures && webFeatures.length > 0) {
        const webFeatureData = webFeatures.map(feature => ({
          webDevDetailId: webDevDetail.id,
          feature,
          price: getFeaturePrice(feature, 'web')
        }));

        await prisma.webDevelopmentFeature.createMany({
          data: webFeatureData
        });
      }
    }

    if (category === 'seo') {
      const seoDetail = await prisma.seoDetail.create({
        data: {
          projectId: project.id
        }
      });

      if (seoType && seoType.length > 0) {
        const seoTypeData = seoType.map(type => ({
          seoDetailId: seoDetail.id,
          seoType: type,
          price: getFeaturePrice(type, 'seo')
        }));

        await prisma.seoType.createMany({
          data: seoTypeData
        });
      }
    }

    if (category === 'digital-marketing') {
      const digitalMarketingDetail = await prisma.digitalMarketingDetail.create({
        data: {
          projectId: project.id,
          targetAudience: targetAudience || null,
          marketingBudget: parseFloat(marketingBudget) || null,
          duration: marketingDuration || null
        }
      });

      if (digitalMarketingServices && digitalMarketingServices.length > 0) {
        const serviceData = digitalMarketingServices.map(service => ({
          digitalMarketingDetailId: digitalMarketingDetail.id,
          service,
          price: getFeaturePrice(service, 'digital-marketing')
        }));

        await prisma.digitalMarketingService.createMany({
          data: serviceData
        });
      }

      if (socialPlatforms && socialPlatforms.length > 0) {
        const platformData = socialPlatforms.map(platform => ({
          digitalMarketingDetailId: digitalMarketingDetail.id,
          platform,
          price: getFeaturePrice(platform, 'social-platform')
        }));

        await prisma.socialPlatform.createMany({
          data: platformData
        });
      }
    }

    if (category === 'content-generation') {
      const contentDetail = await prisma.contentGenerationDetail.create({
        data: {
          projectId: project.id,
          volume: contentVolume || null,
          contentTone: contentTone || null,
          targetKeywords: targetKeywords || null
        }
      });

      if (contentTypes && contentTypes.length > 0) {
        const contentTypeData = contentTypes.map(type => ({
          contentGenerationDetailId: contentDetail.id,
          contentType: type,
          price: getFeaturePrice(type, 'content-type')
        }));

        await prisma.contentType.createMany({
          data: contentTypeData
        });
      }

      if (contentLanguages && contentLanguages.length > 0) {
        const languageData = contentLanguages.map(language => ({
          contentGenerationDetailId: contentDetail.id,
          language,
          price: getFeaturePrice(language, 'content-language')
        }));

        await prisma.contentLanguage.createMany({
          data: languageData
        });
      }
    }

    if (category === 'app-development') {
      const appDetail = await prisma.appDevelopmentDetail.create({
        data: {
          projectId: project.id,
          appType: appType || null,
          complexity: appComplexity || null,
          targetPlatforms: targetPlatforms || null,
          expectedUsers: parseInt(expectedUsers) || null
        }
      });

      if (appFeatures && appFeatures.length > 0) {
        const featureData = appFeatures.map(feature => ({
          appDevelopmentDetailId: appDetail.id,
          feature,
          price: getFeaturePrice(feature, 'app-feature')
        }));

        await prisma.appFeature.createMany({
          data: featureData
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      project: {
        id: project.id,
        projectName: project.projectName,
        projectTitle: project.projectTitle,
        category: project.category,
        price: project.price,
        status: project.status
      }
    });

  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while adding the project'
    });
  }
});

// Get user projects endpoint
app.get('/user-projects', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to view your projects'
      });
    }

    const projects = await prisma.project.findMany({
      where: { userId: req.session.userId },
      include: {
        webDevelopmentDetails: {
          include: {
            webFeatures: true
          }
        },
        seoDetails: {
          include: {
            seoTypes: true
          }
        },
        digitalMarketingDetails: {
          include: {
            marketingServices: true,
            socialPlatforms: true
          }
        },
        contentGenerationDetails: {
          include: {
            contentTypes: true,
            contentLanguages: true
          }
        },
        appDevelopmentDetails: {
          include: {
            appFeatures: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      projects
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Admin Registration endpoint
app.post('/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin email already registered'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin with default role
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin' // Default role as specified
      }
    });

    // Create admin session
    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;
    req.session.adminName = admin.name;
    req.session.adminRole = admin.role;

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Admin Login endpoint
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create admin session
    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;
    req.session.adminName = admin.name;
    req.session.adminRole = admin.role;

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Admin Logout endpoint
app.post('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not log out'
      });
    }
    res.json({
      success: true,
      message: 'Admin logged out successfully'
    });
  });
});

// Check admin session endpoint
app.get('/admin/check-session', (req, res) => {
  if (req.session.adminId) {
    res.json({
      success: true,
      isAuthenticated: true,
      admin: {
        id: req.session.adminId,
        email: req.session.adminEmail,
        name: req.session.adminName,
        role: req.session.adminRole
      }
    });
  } else {
    res.json({
      success: false,
      isAuthenticated: false
    });
  }
});

app.get('/admin/projects', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        webDevelopmentDetails: {
          include: {
            webFeatures: true
          }
        },
        seoDetails: {
          include: {
            seoTypes: true
          }
        },
        digitalMarketingDetails: {
          include: {
            marketingServices: true,
            socialPlatforms: true
          }
        },
        contentGenerationDetails: {
          include: {
            contentTypes: true,
            contentLanguages: true
          }
        },
        appDevelopmentDetails: {
          include: {
            appFeatures: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      projects
    });

  } catch (error) {
    console.error('Get admin projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Get admin dashboard stats
app.get('/admin/stats', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const [userCount, projectCount, contactCount, revenueData] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.contactForm.count(),
      prisma.project.aggregate({
        _sum: {
          price: true
        },
        where: {
          status: 'completed'
        }
      })
    ]);

    const stats = {
      users: userCount,
      projects: projectCount,
      contacts: contactCount,
      revenue: revenueData._sum.price || 0
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Update project status
app.put('/admin/projects/:id/status', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Get current project to track status change
    const currentProject = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update project status
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    // Create status history record
    await prisma.projectStatusHistory.create({
      data: {
        projectId: parseInt(id),
        oldStatus: currentProject.status,
        newStatus: status,
        changedBy: req.session.adminName || 'Admin',
        notes: `Status changed from ${currentProject.status} to ${status}`
      }
    });

    res.json({
      success: true,
      message: 'Project status updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Delete project
app.delete('/admin/projects/:id', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const { id } = req.params;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete project (cascade will handle related records)
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Get single project details
app.get('/admin/projects/:id', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        webDevelopmentDetails: {
          include: {
            webFeatures: true
          }
        },
        seoDetails: {
          include: {
            seoTypes: true
          }
        },
        digitalMarketingDetails: {
          include: {
            marketingServices: true,
            socialPlatforms: true
          }
        },
        contentGenerationDetails: {
          include: {
            contentTypes: true,
            contentLanguages: true
          }
        },
        appDevelopmentDetails: {
          include: {
            appFeatures: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Get project details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Admin create project endpoint (similar to hire but for admin)
app.post('/admin/projects', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const {
      username, email, password, projectName, projectTitle, category,
      price, deadline, details,
      // Web Development
      tech, webPages, webFeatures,
      // SEO
      seoType,
      // Digital Marketing
      digitalMarketingServices, socialPlatforms, marketingDuration,
      targetAudience, marketingBudget,
      // Content Generation
      contentTypes, contentVolume, contentLanguages,
      contentTone, targetKeywords,
      // App Development
      appType, appFeatures, appComplexity,
      targetPlatforms, expectedUsers
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !projectName || !projectTitle || !category) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Check if user exists or create new user
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user
      const hashedPassword = await hashPassword(password);
      user = await prisma.user.create({
        data: {
          full_name: username,
          email,
          password: hashedPassword
        }
      });
    }

    const project = await prisma.project.create({
      data: {
        username,
        email,
        password: await hashPassword(password),
        projectName,
        projectTitle,
        category,
        price: parseFloat(price) || 0,
        deadline: deadline || null,
        details: details || null,
        userId: user.id,
        status: 'pending'
      }
    });

    // Handle category-specific details (same logic as hire endpoint)
    if (category === 'web-development') {
      const webDevDetail = await prisma.webDevelopmentDetail.create({
        data: {
          projectId: project.id,
          tech: tech || '',
          webPages: parseInt(webPages) || 0
        }
      });

      if (webFeatures && webFeatures.length > 0) {
        const webFeatureData = webFeatures.map(feature => ({
          webDevDetailId: webDevDetail.id,
          feature,
          price: getFeaturePrice(feature, 'web')
        }));

        await prisma.webDevelopmentFeature.createMany({
          data: webFeatureData
        });
      }
    }

    if (category === 'seo') {
      const seoDetail = await prisma.seoDetail.create({
        data: {
          projectId: project.id
        }
      });

      if (seoType && seoType.length > 0) {
        const seoTypeData = seoType.map(type => ({
          seoDetailId: seoDetail.id,
          seoType: type,
          price: getFeaturePrice(type, 'seo')
        }));

        await prisma.seoType.createMany({
          data: seoTypeData
        });
      }
    }

    if (category === 'digital-marketing') {
      const digitalMarketingDetail = await prisma.digitalMarketingDetail.create({
        data: {
          projectId: project.id,
          targetAudience: targetAudience || null,
          marketingBudget: parseFloat(marketingBudget) || null,
          duration: marketingDuration || null
        }
      });

      if (digitalMarketingServices && digitalMarketingServices.length > 0) {
        const serviceData = digitalMarketingServices.map(service => ({
          digitalMarketingDetailId: digitalMarketingDetail.id,
          service,
          price: getFeaturePrice(service, 'digital-marketing')
        }));

        await prisma.digitalMarketingService.createMany({
          data: serviceData
        });
      }

      if (socialPlatforms && socialPlatforms.length > 0) {
        const platformData = socialPlatforms.map(platform => ({
          digitalMarketingDetailId: digitalMarketingDetail.id,
          platform,
          price: getFeaturePrice(platform, 'social-platform')
        }));

        await prisma.socialPlatform.createMany({
          data: platformData
        });
      }
    }

    if (category === 'content-generation') {
      const contentDetail = await prisma.contentGenerationDetail.create({
        data: {
          projectId: project.id,
          volume: contentVolume || null,
          contentTone: contentTone || null,
          targetKeywords: targetKeywords || null
        }
      });

      if (contentTypes && contentTypes.length > 0) {
        const contentTypeData = contentTypes.map(type => ({
          contentGenerationDetailId: contentDetail.id,
          contentType: type,
          price: getFeaturePrice(type, 'content-type')
        }));

        await prisma.contentType.createMany({
          data: contentTypeData
        });
      }

      if (contentLanguages && contentLanguages.length > 0) {
        const languageData = contentLanguages.map(language => ({
          contentGenerationDetailId: contentDetail.id,
          language,
          price: getFeaturePrice(language, 'content-language')
        }));

        await prisma.contentLanguage.createMany({
          data: languageData
        });
      }
    }

    if (category === 'app-development') {
      const appDetail = await prisma.appDevelopmentDetail.create({
        data: {
          projectId: project.id,
          appType: appType || null,
          complexity: appComplexity || null,
          targetPlatforms: targetPlatforms || null,
          expectedUsers: parseInt(expectedUsers) || null
        }
      });

      if (appFeatures && appFeatures.length > 0) {
        const featureData = appFeatures.map(feature => ({
          appDevelopmentDetailId: appDetail.id,
          feature,
          price: getFeaturePrice(feature, 'app-feature')
        }));

        await prisma.appFeature.createMany({
          data: featureData
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: {
        id: project.id,
        projectName: project.projectName,
        projectTitle: project.projectTitle,
        category: project.category,
        price: project.price,
        status: project.status
      }
    });

  } catch (error) {
    console.error('Admin create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while creating the project'
    });
  }
});

app.get('/portfolio-projects', async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    let whereClause = {
      status: 'active'
    };
    
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    if (featured === 'true') {
      whereClause.featured = true;
    }

    const portfolioProjects = await prisma.portfolioProject.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse technologies JSON string back to array for each project
    const projectsWithParsedTechnologies = portfolioProjects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies || '[]')
    }));

    res.json({
      success: true,
      projects: projectsWithParsedTechnologies
    });

  } catch (error) {
    console.error('Get portfolio projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Get all portfolio projects for admin (includes all statuses)
app.get('/admin/portfolio-projects', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const portfolioProjects = await prisma.portfolioProject.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse technologies JSON string back to array for each project
    const projectsWithParsedTechnologies = portfolioProjects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies || '[]')
    }));

    res.json({
      success: true,
      projects: projectsWithParsedTechnologies
    });

  } catch (error) {
    console.error('Get admin portfolio projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Create new portfolio project (admin only)
app.post('/admin/portfolio-projects', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const {
      title,
      category,
      image,
      description,
      technologies,
      liveUrl,
      githubUrl,
      featured,
      status
    } = req.body;

    // Validate required fields
    if (!title || !category || !image || !description || !technologies || !liveUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, image, description, technologies, and live URL are required'
      });
    }

    // Validate technologies is an array
    if (!Array.isArray(technologies)) {
      return res.status(400).json({
        success: false,
        message: 'Technologies must be an array'
      });
    }

    // Create portfolio project
    const portfolioProject = await prisma.portfolioProject.create({
      data: {
        title,
        category,
        image,
        description,
        technologies: JSON.stringify(technologies), // Store as JSON string
        liveUrl,
        githubUrl: githubUrl || null,
        featured: featured || false,
        status: status || 'active'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio project created successfully',
      project: {
        ...portfolioProject,
        technologies: JSON.parse(portfolioProject.technologies)
      }
    });

  } catch (error) {
    console.error('Create portfolio project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while creating the portfolio project'
    });
  }
});

// Update portfolio project (admin only)
app.put('/admin/portfolio-projects/:id', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const { id } = req.params;
    const {
      title,
      category,
      image,
      description,
      technologies,
      liveUrl,
      githubUrl,
      featured,
      status
    } = req.body;

    // Check if project exists
    const existingProject = await prisma.portfolioProject.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio project not found'
      });
    }

    // Validate technologies is an array if provided
    if (technologies && !Array.isArray(technologies)) {
      return res.status(400).json({
        success: false,
        message: 'Technologies must be an array'
      });
    }

    // Update portfolio project
    const updatedProject = await prisma.portfolioProject.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(image && { image }),
        ...(description && { description }),
        ...(technologies && { technologies: JSON.stringify(technologies) }),
        ...(liveUrl && { liveUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(featured !== undefined && { featured }),
        ...(status && { status })
      }
    });

    res.json({
      success: true,
      message: 'Portfolio project updated successfully',
      project: {
        ...updatedProject,
        technologies: JSON.parse(updatedProject.technologies)
      }
    });

  } catch (error) {
    console.error('Update portfolio project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while updating the portfolio project'
    });
  }
});

// Delete portfolio project (admin only)
app.delete('/admin/portfolio-projects/:id', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const { id } = req.params;

    // Check if project exists
    const existingProject = await prisma.portfolioProject.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio project not found'
      });
    }

    // Delete portfolio project
    await prisma.portfolioProject.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Portfolio project deleted successfully'
    });

  } catch (error) {
    console.error('Delete portfolio project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while deleting the portfolio project'
    });
  }
});

// Get single portfolio project (public)
app.get('/portfolio-projects/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const portfolioProject = await prisma.portfolioProject.findUnique({
      where: { 
        id: parseInt(id),
        status: 'active'
      }
    });

    if (!portfolioProject) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio project not found'
      });
    }

    res.json({
      success: true,
      project: {
        ...portfolioProject,
        technologies: JSON.parse(portfolioProject.technologies)
      }
    });

  } catch (error) {
    console.error('Get portfolio project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Get portfolio stats (admin only)
app.get('/admin/portfolio-stats', async (req, res) => {
  try {
    // Check if admin is authenticated
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    const [totalProjects, activeProjects, featuredProjects, categoryStats] = await Promise.all([
      prisma.portfolioProject.count(),
      prisma.portfolioProject.count({
        where: { status: 'active' }
      }),
      prisma.portfolioProject.count({
        where: { featured: true }
      }),
      prisma.portfolioProject.groupBy({
        by: ['category'],
        _count: {
          category: true
        }
      })
    ]);

    const stats = {
      total: totalProjects,
      active: activeProjects,
      featured: featuredProjects,
      byCategory: categoryStats.reduce((acc, item) => {
        acc[item.category] = item._count.category;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});