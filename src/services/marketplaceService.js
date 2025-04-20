import axios from 'axios';

// Base API URL - replace with your actual API URL in production
const API_URL = 'https://api.farmersmarket.example.com';

// Mock data for development
const mockProducts = [
  {
    id: 1,
    name: 'Fresh Organic Tomatoes',
    description: 'Locally grown organic tomatoes, harvested at peak ripeness for maximum flavor.',
    price: 4.99,
    unit: 'lb',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1576181256399-834e3b3a49bf',
    stock: 45,
    isOrganic: true,
    sellerId: 'seller123',
    rating: 4.8,
    numReviews: 24,
    createdAt: '2023-06-15T08:30:00Z'
  },
  {
    id: 2,
    name: 'Free Range Eggs',
    description: 'Fresh eggs from free-range, pasture-raised chickens. No hormones or antibiotics.',
    price: 5.99,
    unit: 'dozen',
    category: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05',
    stock: 30,
    isOrganic: true,
    sellerId: 'seller123',
    rating: 4.9,
    numReviews: 32,
    createdAt: '2023-06-10T09:15:00Z'
  },
  {
    id: 3,
    name: 'Wildflower Honey',
    description: 'Raw, unfiltered honey collected from local wildflower meadows. Rich in flavor and nutrients.',
    price: 8.99,
    unit: 'jar',
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924',
    stock: 15,
    isOrganic: true,
    sellerId: 'seller456',
    rating: 4.7,
    numReviews: 18,
    createdAt: '2023-06-05T14:20:00Z'
  },
  {
    id: 4,
    name: 'Fresh Baked Sourdough Bread',
    description: 'Artisanal sourdough bread baked fresh daily with organic flour and a 100-year-old starter.',
    price: 6.49,
    unit: 'loaf',
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1585478259567-7ce3fddf4f98',
    stock: 20,
    isOrganic: false,
    sellerId: 'seller789',
    rating: 4.6,
    numReviews: 41,
    createdAt: '2023-06-18T07:00:00Z'
  },
  {
    id: 5,
    name: 'Grass-Fed Ground Beef',
    description: '100% grass-fed and finished beef from local pastures. Hormone and antibiotic free.',
    price: 9.99,
    unit: 'lb',
    category: 'Meat',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f',
    stock: 25,
    isOrganic: true,
    sellerId: 'seller345',
    rating: 4.9,
    numReviews: 27,
    createdAt: '2023-06-12T11:45:00Z'
  },
  {
    id: 6,
    name: 'Seasonal Fruit Basket',
    description: 'A selection of seasonal fruits from local orchards. Contents vary based on what\'s freshest.',
    price: 24.99,
    unit: 'basket',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
    stock: 10,
    isOrganic: true,
    sellerId: 'seller123',
    rating: 4.8,
    numReviews: 19,
    createdAt: '2023-06-14T10:30:00Z'
  }
];

const mockOrders = [
  {
    id: 'order-001',
    customerId: 'customer123',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    items: [
      { productId: 1, name: 'Fresh Organic Tomatoes', quantity: 2, price: 4.99, total: 9.98 },
      { productId: 2, name: 'Free Range Eggs', quantity: 1, price: 5.99, total: 5.99 }
    ],
    status: 'pending',
    total: 15.97,
    createdAt: '2023-07-01T13:45:00Z',
    address: '123 Main St, Farmington, TX 75442',
    paymentMethod: 'Credit Card',
    sellerId: 'seller123'
  },
  {
    id: 'order-002',
    customerId: 'customer456',
    customerName: 'Emily Johnson',
    customerEmail: 'emily.j@example.com',
    items: [
      { productId: 6, name: 'Seasonal Fruit Basket', quantity: 1, price: 24.99, total: 24.99 }
    ],
    status: 'processing',
    total: 24.99,
    createdAt: '2023-07-02T10:20:00Z',
    address: '456 Oak Ave, Farmington, TX 75442',
    paymentMethod: 'PayPal',
    sellerId: 'seller123'
  },
  {
    id: 'order-003',
    customerId: 'customer789',
    customerName: 'Michael Brown',
    customerEmail: 'michael.b@example.com',
    items: [
      { productId: 1, name: 'Fresh Organic Tomatoes', quantity: 3, price: 4.99, total: 14.97 },
      { productId: 5, name: 'Grass-Fed Ground Beef', quantity: 2, price: 9.99, total: 19.98 }
    ],
    status: 'shipped',
    total: 34.95,
    createdAt: '2023-06-29T16:30:00Z',
    address: '789 Pine St, Farmington, TX 75442',
    paymentMethod: 'Credit Card',
    sellerId: 'seller123'
  },
  {
    id: 'order-004',
    customerId: 'customer101',
    customerName: 'Sarah Davis',
    customerEmail: 'sarah.d@example.com',
    items: [
      { productId: 2, name: 'Free Range Eggs', quantity: 2, price: 5.99, total: 11.98 },
      { productId: 4, name: 'Fresh Baked Sourdough Bread', quantity: 1, price: 6.49, total: 6.49 }
    ],
    status: 'delivered',
    total: 18.47,
    createdAt: '2023-06-27T09:15:00Z',
    address: '101 Maple Rd, Farmington, TX 75442',
    paymentMethod: 'Credit Card',
    sellerId: 'seller123'
  },
  {
    id: 'order-005',
    customerId: 'customer202',
    customerName: 'Robert Wilson',
    customerEmail: 'robert.w@example.com',
    items: [
      { productId: 3, name: 'Wildflower Honey', quantity: 1, price: 8.99, total: 8.99 }
    ],
    status: 'cancelled',
    total: 8.99,
    createdAt: '2023-06-25T14:40:00Z',
    address: '202 Cedar Ln, Farmington, TX 75442',
    paymentMethod: 'PayPal',
    sellerId: 'seller123'
  }
];

const mockSellerProfile = {
  id: 'seller123',
  name: 'Green Valley Farms',
  email: 'contact@greenvalleyfarms.com',
  phone: '(555) 123-4567',
  description: 'Family-owned farm specializing in organic produce. We\'ve been farming sustainably for over 25 years.',
  location: 'Farmington, TX',
  avatar: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb9',
  coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
  rating: 4.8,
  numReviews: 92,
  isVerified: true,
  isOrganic: true,
  joinedAt: '2020-03-15T00:00:00Z',
  bankInfo: {
    accountName: 'Green Valley Farms LLC',
    accountType: 'Business',
    routingNumber: '******1234',
    accountNumber: '******7890'
  },
  taxId: '*****5678'
};

// Mock statistics for seller dashboard
const mockSellerStats = {
  revenue: {
    total: 12580.45,
    lastMonth: 3215.67,
    growth: 8.3
  },
  orders: {
    total: 246,
    pending: 12,
    processing: 8,
    shipped: 5,
    delivered: 218,
    cancelled: 3
  },
  products: {
    total: 28,
    outOfStock: 2,
    lowStock: 5
  },
  topProducts: [
    { name: 'Fresh Organic Tomatoes', sales: 189, revenue: 943.11 },
    { name: 'Free Range Eggs', sales: 156, revenue: 934.44 },
    { name: 'Seasonal Fruit Basket', sales: 32, revenue: 799.68 }
  ],
  recentSales: [
    { date: '2023-07-05', sales: 345.67 },
    { date: '2023-07-04', sales: 289.32 },
    { date: '2023-07-03', sales: 421.55 },
    { date: '2023-07-02', sales: 398.20 },
    { date: '2023-07-01', sales: 356.89 },
    { date: '2023-06-30', sales: 287.45 },
    { date: '2023-06-29', sales: 312.78 }
  ],
  categorySales: [
    { category: 'Vegetables', percentage: 35 },
    { category: 'Fruits', percentage: 25 },
    { category: 'Dairy & Eggs', percentage: 20 },
    { category: 'Meat', percentage: 10 },
    { category: 'Bakery', percentage: 5 },
    { category: 'Pantry', percentage: 5 }
  ]
};

class MarketplaceService {
  // General marketplace methods
  async getProducts() {
    try {
      // For production
      // const response = await axios.get(`${API_URL}/products`);
      // return response.data;
      
      // For development with mock data
      return Promise.resolve(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      // For production
      // const response = await axios.get(`${API_URL}/products/${productId}`);
      // return response.data;
      
      // For development with mock data
      const product = mockProducts.find(p => p.id === parseInt(productId));
      if (!product) {
        throw new Error('Product not found');
      }
      return Promise.resolve(product);
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  }

  async getProductsByCategory(category) {
    try {
      // For production
      // const response = await axios.get(`${API_URL}/products?category=${category}`);
      // return response.data;
      
      // For development with mock data
      const products = mockProducts.filter(p => p.category === category);
      return Promise.resolve(products);
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  }

  async searchProducts(query) {
    try {
      // For production
      // const response = await axios.get(`${API_URL}/products/search?q=${query}`);
      // return response.data;
      
      // For development with mock data
      const products = mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      return Promise.resolve(products);
    } catch (error) {
      console.error(`Error searching products with query ${query}:`, error);
      throw error;
    }
  }

  // Seller-specific methods
  async getSellerProfile(sellerId) {
    try {
      // For production
      // const response = await axios.get(`${API_URL}/sellers/${sellerId}`);
      // return response.data;
      
      // For development with mock data
      // Assuming we only have one seller profile for now
      return Promise.resolve(mockSellerProfile);
    } catch (error) {
      console.error(`Error fetching seller profile with ID ${sellerId}:`, error);
      throw error;
    }
  }

  async getSellerProducts(sellerId) {
    try {
      // For production
      // const response = await axios.get(`${API_URL}/sellers/${sellerId}/products`);
      // return response.data;
      
      // For development with mock data
      const products = mockProducts.filter(p => p.sellerId === sellerId);
      return Promise.resolve(products);
    } catch (error) {
      console.error(`Error fetching products for seller ID ${sellerId}:`, error);
      throw error;
    }
  }

  async getSellerOrders(sellerId) {
    try {
      // For production
      // const response = await axios.get(`${API_URL}/sellers/${sellerId}/orders`);
      // return response.data;
      
      // For development with mock data
      const orders = mockOrders.filter(o => o.sellerId === sellerId);
      return Promise.resolve(orders);
    } catch (error) {
      console.error(`Error fetching orders for seller ID ${sellerId}:`, error);
      throw error;
    }
  }

  async getSellerStats(sellerId) {
    try {
      // For production
      // const response = await axios.get(`${API_URL}/sellers/${sellerId}/stats`);
      // return response.data;
      
      // For development with mock data
      return Promise.resolve(mockSellerStats);
    } catch (error) {
      console.error(`Error fetching statistics for seller ID ${sellerId}:`, error);
      throw error;
    }
  }

  async addProduct(productData) {
    try {
      // For production
      // const response = await axios.post(`${API_URL}/products`, productData);
      // return response.data;
      
      // For development with mock data
      const newProduct = {
        id: mockProducts.length + 1,
        ...productData,
        rating: 0,
        numReviews: 0,
        createdAt: new Date().toISOString()
      };
      mockProducts.push(newProduct);
      return Promise.resolve(newProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  async updateProduct(productId, productData) {
    try {
      // For production
      // const response = await axios.put(`${API_URL}/products/${productId}`, productData);
      // return response.data;
      
      // For development with mock data
      const index = mockProducts.findIndex(p => p.id === parseInt(productId));
      if (index === -1) {
        throw new Error('Product not found');
      }
      mockProducts[index] = { ...mockProducts[index], ...productData };
      return Promise.resolve(mockProducts[index]);
    } catch (error) {
      console.error(`Error updating product with ID ${productId}:`, error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      // For production
      // await axios.delete(`${API_URL}/products/${productId}`);
      // return true;
      
      // For development with mock data
      const index = mockProducts.findIndex(p => p.id === parseInt(productId));
      if (index === -1) {
        throw new Error('Product not found');
      }
      mockProducts.splice(index, 1);
      return Promise.resolve(true);
    } catch (error) {
      console.error(`Error deleting product with ID ${productId}:`, error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      // For production
      // const response = await axios.patch(`${API_URL}/orders/${orderId}`, { status });
      // return response.data;
      
      // For development with mock data
      const index = mockOrders.findIndex(o => o.id === orderId);
      if (index === -1) {
        throw new Error('Order not found');
      }
      mockOrders[index].status = status;
      return Promise.resolve(mockOrders[index]);
    } catch (error) {
      console.error(`Error updating status for order ID ${orderId}:`, error);
      throw error;
    }
  }

  async updateSellerProfile(sellerId, profileData) {
    try {
      // For production
      // const response = await axios.put(`${API_URL}/sellers/${sellerId}`, profileData);
      // return response.data;
      
      // For development with mock data
      // Since we only have one seller profile, we'll just update the mock data
      const updatedProfile = { ...mockSellerProfile, ...profileData };
      return Promise.resolve(updatedProfile);
    } catch (error) {
      console.error(`Error updating profile for seller ID ${sellerId}:`, error);
      throw error;
    }
  }

  // Method to help sellers become verified
  async applyForVerification(sellerId, verificationData) {
    try {
      // For production
      // const response = await axios.post(`${API_URL}/sellers/${sellerId}/verification`, verificationData);
      // return response.data;
      
      // For development, just return a success message
      return Promise.resolve({ 
        success: true, 
        message: 'Verification application submitted successfully. Please allow 3-5 business days for review.' 
      });
    } catch (error) {
      console.error(`Error applying for verification for seller ID ${sellerId}:`, error);
      throw error;
    }
  }

  // Method to register as a seller (for users who want to become sellers)
  async registerAsSeller(userData) {
    try {
      // For production
      // const response = await axios.post(`${API_URL}/sellers`, userData);
      // return response.data;
      
      // For development, just return a mock seller ID
      return Promise.resolve({ 
        success: true, 
        sellerId: 'seller' + Math.floor(Math.random() * 1000),
        message: 'Seller account created successfully.' 
      });
    } catch (error) {
      console.error('Error registering as seller:', error);
      throw error;
    }
  }
}

export default new MarketplaceService(); 