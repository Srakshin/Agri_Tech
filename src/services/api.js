// This file contains simulated API services that will be replaced with actual API calls in production

// Helper function to simulate API delay
const apiDelay = (data, delay = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Crop Advisory API services
export const advisoryService = {
  // Get crop recommendations based on soil and climate data
  getCropRecommendations: async (soilData, location) => {
    console.log('API call: getCropRecommendations', { soilData, location });
    
    // Dummy data - will be replaced with actual API call
    const dummyRecommendations = [
      { 
        crop: 'Wheat', 
        confidence: 95,
        expectedYield: '3.8 tons/acre',
        growingSeason: 'October to April',
        waterRequirements: 'Medium',
        tips: 'Ensure proper drainage and watch for rust diseases'
      },
      { 
        crop: 'Corn', 
        confidence: 87,
        expectedYield: '4.2 tons/acre',
        growingSeason: 'April to September',
        waterRequirements: 'High',
        tips: 'Space plants appropriately for best results'
      },
      { 
        crop: 'Soybeans', 
        confidence: 82,
        expectedYield: '2.5 tons/acre',
        growingSeason: 'May to October',
        waterRequirements: 'Medium',
        tips: 'Good for nitrogen fixation in soil'
      },
      { 
        crop: 'Rice', 
        confidence: 75,
        expectedYield: '3.5 tons/acre',
        growingSeason: 'June to November',
        waterRequirements: 'Very High',
        tips: 'Maintain proper water levels in paddy'
      },
    ];
    
    return apiDelay(dummyRecommendations);
  },
  
  // Get disease detection results
  detectDisease: async (imageData) => {
    console.log('API call: detectDisease', { imageData });
    
    // Dummy data - will be replaced with actual API call that processes the image
    const diseases = [
      { name: 'Leaf Rust', confidence: 89, treatment: 'Apply fungicide containing propiconazole' },
      { name: 'Powdery Mildew', confidence: 45, treatment: 'Use sulfur-based fungicide' }
    ];
    
    return apiDelay(diseases);
  },
  
  // Get pest warnings based on location and current crops
  getPestWarnings: async (location, crops) => {
    console.log('API call: getPestWarnings', { location, crops });
    
    // Dummy data - will be replaced with actual API call
    const warnings = [
      { 
        pest: 'Fall Armyworm', 
        riskLevel: 'High',
        crops: ['Corn', 'Rice'],
        prevention: 'Apply neem oil or appropriate pesticide at early detection'
      },
      { 
        pest: 'Aphids', 
        riskLevel: 'Medium',
        crops: ['Wheat', 'Vegetables'],
        prevention: 'Introduce ladybugs as natural predators'
      },
      { 
        pest: 'Locusts', 
        riskLevel: 'Low',
        crops: ['All grain crops'],
        prevention: 'Monitor regional reports and use barriers if necessary'
      }
    ];
    
    return apiDelay(warnings);
  }
};

// Marketplace API services
export const marketplaceService = {
  // Get product listings with optional filters
  getProducts: async (filters = {}) => {
    console.log('API call: getProducts', { filters });
    
    // Dummy data - will be replaced with actual API call
    const products = [
      {
        id: 1,
        name: 'Organic Tomatoes',
        category: 'Vegetable',
        price: 2.99,
        unit: 'kg',
        seller: 'Green Valley Farm',
        sellerId: 101,
        location: 'Riverside County',
        image: 'tomatoes.jpg',
        organic: true,
        available: 250,
        description: 'Fresh organic tomatoes grown without pesticides'
      },
      {
        id: 2,
        name: 'Premium Rice',
        category: 'Grain',
        price: 3.50,
        unit: 'kg',
        seller: 'Rice Fields Co.',
        sellerId: 102,
        location: 'Delta Region',
        image: 'rice.jpg',
        organic: false,
        available: 1000,
        description: 'High-quality rice grain, perfect for any meal'
      },
      {
        id: 3,
        name: 'Raw Honey',
        category: 'Specialty',
        price: 8.75,
        unit: 'jar',
        seller: 'Bee Happy Apiary',
        sellerId: 103,
        location: 'Mountain View',
        image: 'honey.jpg',
        organic: true,
        available: 50,
        description: 'Unprocessed, raw honey direct from the hive'
      },
      {
        id: 4,
        name: 'Fertilizer - All Purpose',
        category: 'Supplies',
        price: 15.99,
        unit: 'bag',
        seller: 'Farm Supply Co.',
        sellerId: 104,
        location: 'Central District',
        image: 'fertilizer.jpg',
        organic: false,
        available: 200,
        description: 'Balanced NPK for all crops and garden plants'
      },
      {
        id: 5,
        name: 'Tractor Rental',
        category: 'Equipment',
        price: 75.00,
        unit: 'day',
        seller: 'Farm Equipment Inc.',
        sellerId: 105,
        location: 'West County',
        image: 'tractor.jpg',
        available: 3,
        description: 'Modern tractor available for daily or weekly rental'
      }
    ];
    
    // Apply filters if any
    let filteredProducts = [...products];
    
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.organic === true) {
      filteredProducts = filteredProducts.filter(p => p.organic === true);
    }
    
    if (filters.sellerId) {
      filteredProducts = filteredProducts.filter(p => p.sellerId === filters.sellerId);
    }
    
    return apiDelay(filteredProducts);
  },
  
  // Place an order
  placeOrder: async (orderData) => {
    console.log('API call: placeOrder', { orderData });
    
    // Simulating order processing
    const orderConfirmation = {
      orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
      status: 'confirmed',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: orderData.items,
      total: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shippingAddress: orderData.shippingAddress
    };
    
    return apiDelay(orderConfirmation);
  },
  
  // Seller APIs
  
  // Get a seller's products
  getSellerProducts: async (sellerId) => {
    console.log('API call: getSellerProducts', { sellerId });
    return await marketplaceService.getProducts({ sellerId });
  },
  
  // Add a new product (for sellers)
  addProduct: async (productData) => {
    console.log('API call: addProduct', { productData });
    
    // Simulate adding a product
    const newProduct = {
      id: Math.floor(Math.random() * 10000),
      ...productData,
      image: productData.image || 'placeholder.jpg',
      available: parseInt(productData.available) || 0,
      price: parseFloat(productData.price) || 0
    };
    
    return apiDelay(newProduct);
  },
  
  // Update an existing product
  updateProduct: async (productId, productData) => {
    console.log('API call: updateProduct', { productId, productData });
    
    // Simulate updating a product
    const updatedProduct = {
      id: productId,
      ...productData,
      available: parseInt(productData.available) || 0,
      price: parseFloat(productData.price) || 0
    };
    
    return apiDelay(updatedProduct);
  },
  
  // Delete a product
  deleteProduct: async (productId) => {
    console.log('API call: deleteProduct', { productId });
    return apiDelay({ success: true, message: 'Product deleted successfully' });
  },
  
  // Get seller orders
  getSellerOrders: async (sellerId) => {
    console.log('API call: getSellerOrders', { sellerId });
    
    // Dummy data for seller orders
    const orders = [
      {
        orderId: 'ORD-4721',
        date: '2023-05-15',
        status: 'delivered',
        customer: {
          name: 'John Smith',
          address: '123 Farm Road, Agricultural County',
          contact: 'john.smith@example.com'
        },
        items: [
          { id: 1, name: 'Organic Tomatoes', quantity: 5, price: 2.99, subtotal: 14.95 }
        ],
        total: 14.95
      },
      {
        orderId: 'ORD-5629',
        date: '2023-05-18',
        status: 'processing',
        customer: {
          name: 'Emily Johnson',
          address: '456 Harvest Lane, Rural District',
          contact: 'emily.j@example.com'
        },
        items: [
          { id: 1, name: 'Organic Tomatoes', quantity: 3, price: 2.99, subtotal: 8.97 },
          { id: 3, name: 'Raw Honey', quantity: 2, price: 8.75, subtotal: 17.50 }
        ],
        total: 26.47
      },
      {
        orderId: 'ORD-6182',
        date: '2023-05-20',
        status: 'pending',
        customer: {
          name: 'Michael Brown',
          address: '789 Field Avenue, Countryside',
          contact: 'michael.b@example.com'
        },
        items: [
          { id: 1, name: 'Organic Tomatoes', quantity: 10, price: 2.99, subtotal: 29.90 }
        ],
        total: 29.90
      }
    ];
    
    return apiDelay(orders);
  },
  
  // Update order status
  updateOrderStatus: async (orderId, status) => {
    console.log('API call: updateOrderStatus', { orderId, status });
    return apiDelay({ success: true, orderId, status });
  },
  
  // Get seller statistics
  getSellerStats: async (sellerId) => {
    console.log('API call: getSellerStats', { sellerId });
    
    // Dummy statistics for seller dashboard
    const stats = {
      totalSales: 4850.75,
      totalOrders: 134,
      pendingOrders: 12,
      totalProducts: 8,
      popularProducts: [
        { name: 'Organic Tomatoes', sales: 2150.25, percentage: 45 },
        { name: 'Raw Honey', sales: 1575.00, percentage: 32 },
        { name: 'Premium Rice', sales: 875.50, percentage: 18 },
        { name: 'Fertilizer', sales: 250.00, percentage: 5 }
      ],
      monthlySales: [
        { month: 'Jan', sales: 350.50 },
        { month: 'Feb', sales: 425.75 },
        { month: 'Mar', sales: 598.25 },
        { month: 'Apr', sales: 780.50 },
        { month: 'May', sales: 890.75 },
        { month: 'Jun', sales: 1005.25 }
      ]
    };
    
    return apiDelay(stats);
  },
  
  // Update seller profile
  updateSellerProfile: async (sellerId, profileData) => {
    console.log('API call: updateSellerProfile', { sellerId, profileData });
    return apiDelay({ success: true, ...profileData });
  },
  
  // Get seller profile
  getSellerProfile: async (sellerId) => {
    console.log('API call: getSellerProfile', { sellerId });
    
    // Dummy seller profile
    const profile = {
      id: sellerId,
      name: 'Green Valley Farm',
      description: 'We are a family-owned farm specializing in organic vegetables and fruits.',
      location: 'Riverside County',
      founded: '2010',
      email: 'contact@greenvalleyfarm.com',
      phone: '(555) 123-4567',
      website: 'www.greenvalleyfarm.com',
      image: 'farm-profile.jpg',
      verified: true,
      organic: true
    };
    
    return apiDelay(profile);
  },
  
  // Register as a seller
  registerAsSeller: async (userData) => {
    console.log('API call: registerAsSeller', { userData });
    
    // Simulate seller registration
    const newSeller = {
      id: 201, // Next available seller ID
      ...userData,
      verified: false // New sellers start unverified
    };
    
    return apiDelay(newSeller);
  }
};

// Irrigation API services
export const irrigationService = {
  // Get irrigation recommendations based on crop, soil, and weather
  getIrrigationPlan: async (cropData, soilData, location) => {
    console.log('API call: getIrrigationPlan', { cropData, soilData, location });
    
    // Dummy data - will be replaced with actual API call
    const irrigationPlan = {
      recommendedSchedule: [
        { day: 'Monday', duration: 45, startTime: '06:00', zones: [1, 2] },
        { day: 'Wednesday', duration: 30, startTime: '06:00', zones: [1, 2] },
        { day: 'Friday', duration: 45, startTime: '06:00', zones: [1, 2] },
      ],
      waterUsageEstimate: '750 gallons/week',
      adjustments: [
        { condition: 'If rainfall exceeds 1 inch', action: 'Skip next irrigation' },
        { condition: 'During heat waves (>95°F)', action: 'Increase duration by 15 minutes' }
      ],
      efficiency: 85, // percentage
      monthlySavings: '20% compared to standard watering'
    };
    
    return apiDelay(irrigationPlan);
  },
  
  // Get water usage statistics
  getWaterUsage: async (farmId, timeFrame) => {
    console.log('API call: getWaterUsage', { farmId, timeFrame });
    
    // Dummy data - will be replaced with actual API call
    const waterUsage = {
      currentPeriod: 2850, // gallons
      previousPeriod: 3200, // gallons
      savings: 350, // gallons
      savingsPercentage: 10.9,
      historicalData: [
        { month: 'January', usage: 3200 },
        { month: 'February', usage: 2900 },
        { month: 'March', usage: 2700 },
        { month: 'April', usage: 2850 },
        { month: 'May', usage: 3100 },
        { month: 'June', usage: 3600 }
      ]
    };
    
    return apiDelay(waterUsage);
  }
};

// Knowledge Portal API services
export const knowledgeService = {
  // Search the knowledge base
  searchKnowledge: async (query) => {
    console.log('API call: searchKnowledge', { query });
    
    // Dummy data - will be replaced with actual API call
    const searchResults = [
      {
        id: 1,
        title: 'Best Practices for Organic Farming',
        type: 'article',
        summary: 'Learn about crop rotation, natural pest control, and organic fertilizers',
        url: '/knowledge/articles/organic-farming-practices',
        date: '2023-03-15'
      },
      {
        id: 2,
        title: 'Understanding Soil pH and Its Impact on Crops',
        type: 'video',
        summary: 'How soil pH affects nutrient availability and ways to adjust it',
        url: '/knowledge/videos/soil-ph-impact',
        date: '2023-02-20',
        duration: '18:25'
      },
      {
        id: 3,
        title: 'Climate-Smart Agriculture Techniques',
        type: 'article',
        summary: 'Adapting farming practices to changing climate conditions',
        url: '/knowledge/articles/climate-smart-agriculture',
        date: '2023-04-05'
      },
      {
        id: 4,
        title: 'Water Conservation Methods for Farmers',
        type: 'guide',
        summary: 'Practical steps to reduce water usage while maintaining crop health',
        url: '/knowledge/guides/water-conservation',
        date: '2023-01-10'
      }
    ];
    
    // Filter based on search query
    const filteredResults = query 
      ? searchResults.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) || 
          item.summary.toLowerCase().includes(query.toLowerCase())
        )
      : searchResults;
    
    return apiDelay(filteredResults);
  },
  
  // Get recommended content based on user profile/interests
  getRecommendations: async (userInterests) => {
    console.log('API call: getRecommendations', { userInterests });
    
    // Dummy data - will be replaced with actual API call
    const recommendations = [
      {
        id: 5,
        title: 'Intercropping Benefits and Methods',
        type: 'article',
        summary: 'How combining complementary crops can improve yield and soil health',
        url: '/knowledge/articles/intercropping-benefits',
        date: '2023-05-01'
      },
      {
        id: 6,
        title: 'Pest Management without Chemicals',
        type: 'video',
        summary: 'Natural methods to keep pests away from your crops',
        url: '/knowledge/videos/natural-pest-management',
        date: '2023-04-22',
        duration: '24:10'
      },
      {
        id: 7,
        title: 'Modern Irrigation Technologies Comparison',
        type: 'guide',
        summary: 'Drip, sprinkler, and smart systems compared',
        url: '/knowledge/guides/irrigation-technologies',
        date: '2023-03-28'
      }
    ];
    
    return apiDelay(recommendations);
  },
  
  // Process voice search
  processVoiceSearch: async (audioData) => {
    console.log('API call: processVoiceSearch', { audioReceived: true });
    
    // Simulating voice-to-text processing
    // In a real app, this would send the audio data to a speech-to-text service
    
    // For demonstration, we'll just pretend the voice search was for "organic farming"
    const recognizedText = "organic farming";
    
    return apiDelay({ recognizedText });
  }
}; 