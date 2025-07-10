function getFeaturePrice(feature, type) {
  const prices = {
    "web": {
      "payment-gateway": 80,
      "social-login": 50,
      "live-chat": 40,
      "responsive-design": 30,
      "admin-panel": 100
    },
    "seo": {
      "on-page": 60,
      "off-page": 70,
      "white-hat": 90
    },
    "digital-marketing": {
      "social-media-management": 200,
      "ppc-campaigns": 300,
      "email-marketing": 150,
      "influencer-marketing": 250,
      "affiliate-marketing": 180,
      "conversion-optimization": 220
    },
    "social-platform": {
      "facebook": 50,
      "instagram": 50,
      "twitter": 40,
      "linkedin": 60,
      "youtube": 80,
      "tiktok": 70
    },
    "content-type": {
      "blog-posts": 25,
      "product-descriptions": 15,
      "social-media-content": 20,
      "email-newsletters": 30,
      "website-copy": 40,
      "press-releases": 50,
      "whitepapers": 100,
      "case-studies": 80
    },
    "content-language": {
      "english": 0,
      "spanish": 10,
      "french": 15,
      "german": 15,
      "arabic": 20,
      "chinese": 25
    },
    "app-feature": {
      "user-authentication": 80,
      "push-notifications": 60,
      "in-app-purchases": 120,
      "social-sharing": 40,
      "offline-functionality": 100,
      "real-time-chat": 150,
      "geolocation": 90,
      "camera-integration": 70,
      "file-upload": 50,
      "analytics": 60
    }
  };

  return prices[type]?.[feature] || 0;
}

module.exports = getFeaturePrice;

