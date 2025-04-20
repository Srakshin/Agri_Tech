import React, { useState, useEffect } from 'react';
import { 
  Tab, Tabs, Container, Row, Col, Card, Button, 
  Table, Badge, Form, Alert, Spinner 
} from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { FaBox, FaShoppingCart, FaChartLine, FaUser, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import marketplaceService from '../services/marketplaceService';
import '../styles/SellerDashboard.css';

// Register Chart.js components
ChartJS.register(...registerables);

const SellerDashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerStats, setSellerStats] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    category: '',
    image: '',
    stock: '',
    isOrganic: false
  });
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Mock seller ID - In a real app, this would come from authentication
  const sellerId = 'seller123'; 

  // Fetch seller data
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        
        // Fetch seller profile
        const profile = await marketplaceService.getSellerProfile(sellerId);
        setSellerProfile(profile);
        setEditedProfile(profile);
        
        // Fetch seller products
        const products = await marketplaceService.getSellerProducts(sellerId);
        setSellerProducts(products);
        
        // Fetch seller orders
        const orders = await marketplaceService.getSellerOrders(sellerId);
        setSellerOrders(orders);
        
        // Fetch seller statistics
        const stats = await marketplaceService.getSellerStats(sellerId);
        setSellerStats(stats);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching seller data:', err);
        setError('Failed to load seller data. Please try again later.');
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset forms when changing tabs
    setShowAddProductForm(false);
    setShowEditProfileForm(false);
    setSuccessMessage('');
  };

  // Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!newProduct.name) errors.name = 'Product name is required';
    if (!newProduct.description) errors.description = 'Description is required';
    if (!newProduct.price || isNaN(newProduct.price)) errors.price = 'Valid price is required';
    if (!newProduct.unit) errors.unit = 'Unit is required';
    if (!newProduct.category) errors.category = 'Category is required';
    if (!newProduct.stock || isNaN(newProduct.stock)) errors.stock = 'Valid stock quantity is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      
      // Add sellerId to the product data
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        sellerId
      };
      
      // Add the product
      const addedProduct = await marketplaceService.addProduct(productData);
      
      // Update the product list
      setSellerProducts([...sellerProducts, addedProduct]);
      
      // Reset the form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        unit: '',
        category: '',
        image: '',
        stock: '',
        isOrganic: false
      });
      
      setFormErrors({});
      setShowAddProductForm(false);
      setSuccessMessage('Product added successfully!');
      setLoading(false);
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Please try again.');
      setLoading(false);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        
        // Delete the product
        await marketplaceService.deleteProduct(productId);
        
        // Update the product list
        setSellerProducts(sellerProducts.filter(p => p.id !== productId));
        
        setSuccessMessage('Product deleted successfully!');
        setLoading(false);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product. Please try again.');
        setLoading(false);
      }
    }
  };

  // Handle updating order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      // Update the order status
      const updatedOrder = await marketplaceService.updateOrderStatus(orderId, newStatus);
      
      // Update the order list
      setSellerOrders(sellerOrders.map(o => o.id === orderId ? updatedOrder : o));
      
      setSuccessMessage('Order status updated successfully!');
      setLoading(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
      setLoading(false);
    }
  };

  // Handle updating seller profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!editedProfile.name) errors.name = 'Business name is required';
    if (!editedProfile.email) errors.email = 'Email is required';
    if (!editedProfile.phone) errors.phone = 'Phone number is required';
    if (!editedProfile.description) errors.description = 'Description is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      
      // Update the profile
      const updatedProfile = await marketplaceService.updateSellerProfile(sellerId, editedProfile);
      
      // Update the state
      setSellerProfile(updatedProfile);
      
      setFormErrors({});
      setShowEditProfileForm(false);
      setSuccessMessage('Profile updated successfully!');
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  // Handle applying for verification
  const handleApplyForVerification = async () => {
    if (window.confirm('Do you want to apply for seller verification?')) {
      try {
        setLoading(true);
        
        // Mock verification data
        const verificationData = {
          businessLicense: true,
          taxDocuments: true,
          identityVerification: true
        };
        
        // Apply for verification
        const result = await marketplaceService.applyForVerification(sellerId, verificationData);
        
        setSuccessMessage(result.message);
        setLoading(false);
      } catch (err) {
        console.error('Error applying for verification:', err);
        setError('Failed to apply for verification. Please try again.');
        setLoading(false);
      }
    }
  };

  // Prepare chart data for sales by category
  const categoryChartData = {
    labels: sellerStats?.categorySales.map(c => c.category) || [],
    datasets: [
      {
        label: 'Sales by Category (%)',
        data: sellerStats?.categorySales.map(c => c.percentage) || [],
        backgroundColor: [
          '#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0', '#795548'
        ]
      }
    ]
  };

  // Prepare chart data for recent sales
  const salesChartData = {
    labels: sellerStats?.recentSales.map(s => s.date) || [],
    datasets: [
      {
        label: 'Daily Sales ($)',
        data: sellerStats?.recentSales.map(s => s.sales) || [],
        backgroundColor: '#4CAF50',
        borderColor: '#2E7D32',
        borderWidth: 1
      }
    ]
  };

  // Options for the charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  // Loading state
  if (loading && !sellerProfile) {
    return (
      <div className="seller-dashboard loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading seller dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error && !sellerProfile) {
    return (
      <div className="seller-dashboard error-container">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <Container>
          <Row>
            <Col>
              <h1>Seller Dashboard</h1>
              <p>
                Welcome back, {sellerProfile?.name}
                {sellerProfile?.isVerified && (
                  <Badge bg="success" className="verified-badge">Verified Seller</Badge>
                )}
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="dashboard-container">
        {/* Success Message */}
        {successMessage && (
          <Alert 
            variant="success" 
            dismissible 
            onClose={() => setSuccessMessage('')}
            className="mb-4"
          >
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert 
            variant="danger" 
            dismissible 
            onClose={() => setError(null)}
            className="mb-4"
          >
            {error}
          </Alert>
        )}

        {/* Dashboard Tabs */}
        <Tabs
          id="seller-dashboard-tabs"
          activeKey={activeTab}
          onSelect={handleTabChange}
          className="dashboard-tabs mb-4"
        >
          <Tab 
            eventKey="dashboard" 
            title={<><FaChartLine /> Dashboard</>} 
            className="dashboard-tab"
          >
            {/* Dashboard Overview */}
            <div className="dashboard-content">
              <h2>Sales Overview</h2>
              
              {/* Statistics Cards */}
              <Row className="stats-cards mb-4">
                <Col md={4}>
                  <Card className="stats-card">
                    <Card.Body>
                      <h3>${sellerStats?.revenue.total.toFixed(2)}</h3>
                      <p>Total Revenue</p>
                      <div className="stats-growth">
                        <span className={sellerStats?.revenue.growth >= 0 ? "positive" : "negative"}>
                          {sellerStats?.revenue.growth >= 0 ? "+" : ""}{sellerStats?.revenue.growth}%
                        </span>
                        <span>from last month</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="stats-card">
                    <Card.Body>
                      <h3>{sellerStats?.orders.total}</h3>
                      <p>Total Orders</p>
                      <div className="stats-detail">
                        <span>{sellerStats?.orders.pending} pending</span>
                        <span>{sellerStats?.orders.processing} processing</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="stats-card">
                    <Card.Body>
                      <h3>{sellerStats?.products.total}</h3>
                      <p>Total Products</p>
                      <div className="stats-detail">
                        <span>{sellerStats?.products.outOfStock} out of stock</span>
                        <span>{sellerStats?.products.lowStock} low stock</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              {/* Charts Row */}
              <Row className="charts-row mb-4">
                <Col md={8}>
                  <Card className="chart-card">
                    <Card.Header>Recent Sales</Card.Header>
                    <Card.Body>
                      <div className="chart-container bar-chart">
                        <Bar data={salesChartData} options={chartOptions} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="chart-card">
                    <Card.Header>Sales by Category</Card.Header>
                    <Card.Body>
                      <div className="chart-container pie-chart">
                        <Pie data={categoryChartData} options={chartOptions} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              {/* Top Products Table */}
              <Card className="mb-4">
                <Card.Header>Top Selling Products</Card.Header>
                <Card.Body>
                  <Table responsive className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Units Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerStats?.topProducts.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>{product.sales}</td>
                          <td>${product.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          </Tab>

          <Tab 
            eventKey="products" 
            title={<><FaBox /> Products</>} 
            className="dashboard-tab"
          >
            <div className="dashboard-content">
              <div className="section-header">
                <h2>Your Products</h2>
                <Button 
                  variant="primary" 
                  className="action-button"
                  onClick={() => setShowAddProductForm(!showAddProductForm)}
                >
                  <FaPlus /> {showAddProductForm ? 'Cancel' : 'Add Product'}
                </Button>
              </div>
              
              {/* Add Product Form */}
              {showAddProductForm && (
                <Card className="form-card mb-4">
                  <Card.Header>Add New Product</Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleAddProduct}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Product Name*</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                              isInvalid={!!formErrors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Price*</Form.Label>
                            <Form.Control 
                              type="number" 
                              step="0.01"
                              min="0"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                              isInvalid={!!formErrors.price}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.price}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Unit*</Form.Label>
                            <Form.Control 
                              type="text" 
                              placeholder="lb, dozen, jar, etc."
                              value={newProduct.unit}
                              onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                              isInvalid={!!formErrors.unit}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.unit}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Description*</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          isInvalid={!!formErrors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Category*</Form.Label>
                            <Form.Select 
                              value={newProduct.category}
                              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                              isInvalid={!!formErrors.category}
                            >
                              <option value="">Select a category</option>
                              <option value="Vegetables">Vegetables</option>
                              <option value="Fruits">Fruits</option>
                              <option value="Dairy & Eggs">Dairy & Eggs</option>
                              <option value="Meat">Meat</option>
                              <option value="Bakery">Bakery</option>
                              <option value="Pantry">Pantry</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {formErrors.category}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Stock Quantity*</Form.Label>
                            <Form.Control 
                              type="number" 
                              min="0"
                              value={newProduct.stock}
                              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                              isInvalid={!!formErrors.stock}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.stock}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={newProduct.image}
                              onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Check 
                          type="checkbox" 
                          label="This product is organic" 
                          checked={newProduct.isOrganic}
                          onChange={(e) => setNewProduct({...newProduct, isOrganic: e.target.checked})}
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button variant="secondary" className="me-2" onClick={() => setShowAddProductForm(false)}>
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                          {loading ? <Spinner animation="border" size="sm" /> : 'Add Product'}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}
              
              {/* Products Table */}
              <Card>
                <Card.Body>
                  <Table responsive className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerProducts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No products found. Add your first product!
                          </td>
                        </tr>
                      ) : (
                        sellerProducts.map((product) => (
                          <tr key={product.id}>
                            <td>
                              <div className="product-cell">
                                {product.image && (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="product-thumbnail"
                                  />
                                )}
                                <div>
                                  <div className="product-name">{product.name}</div>
                                  <div className="product-id">ID: {product.id}</div>
                                </div>
                              </div>
                            </td>
                            <td>{product.category}</td>
                            <td>${product.price.toFixed(2)}/{product.unit}</td>
                            <td>
                              {product.stock === 0 ? (
                                <Badge bg="danger">Out of Stock</Badge>
                              ) : product.stock < 10 ? (
                                <Badge bg="warning" text="dark">Low Stock: {product.stock}</Badge>
                              ) : (
                                product.stock
                              )}
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="action-btn me-2"
                              >
                                <FaEdit /> Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="action-btn"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <FaTrash /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          </Tab>

          <Tab 
            eventKey="orders" 
            title={<><FaShoppingCart /> Orders</>} 
            className="dashboard-tab"
          >
            <div className="dashboard-content">
              <h2>Manage Orders</h2>
              
              {/* Orders Table */}
              <Card>
                <Card.Body>
                  <Table responsive className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        sellerOrders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>${order.total.toFixed(2)}</td>
                            <td>
                              <Badge 
                                bg={
                                  order.status === 'delivered' ? 'success' :
                                  order.status === 'shipped' ? 'info' :
                                  order.status === 'processing' ? 'primary' :
                                  order.status === 'pending' ? 'warning' :
                                  'danger'
                                }
                                className="status-badge"
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </td>
                            <td>
                              {order.status === 'pending' && (
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="action-btn me-2"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                >
                                  Process
                                </Button>
                              )}
                              {order.status === 'processing' && (
                                <Button 
                                  variant="outline-info" 
                                  size="sm" 
                                  className="action-btn me-2"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                >
                                  Ship
                                </Button>
                              )}
                              {order.status === 'shipped' && (
                                <Button 
                                  variant="outline-success" 
                                  size="sm" 
                                  className="action-btn me-2"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                >
                                  Mark Delivered
                                </Button>
                              )}
                              <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                className="action-btn"
                                onClick={() => alert('Order details not implemented in this demo')}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          </Tab>

          <Tab 
            eventKey="profile" 
            title={<><FaUser /> Profile</>} 
            className="dashboard-tab"
          >
            <div className="dashboard-content">
              <div className="section-header">
                <h2>Seller Profile</h2>
                <Button 
                  variant="primary" 
                  className="action-button"
                  onClick={() => setShowEditProfileForm(!showEditProfileForm)}
                >
                  <FaEdit /> {showEditProfileForm ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
              
              {/* Seller Profile Display */}
              {!showEditProfileForm && (
                <Card className="profile-card">
                  <div className="profile-cover">
                    <img 
                      src={sellerProfile?.coverImage} 
                      alt="Cover"
                      className="cover-image"
                    />
                  </div>
                  <Card.Body>
                    <div className="profile-info">
                      <div className="profile-avatar">
                        <img 
                          src={sellerProfile?.avatar} 
                          alt={sellerProfile?.name}
                          className="avatar-image"
                        />
                      </div>
                      <div className="profile-details">
                        <h3>
                          {sellerProfile?.name}
                          {sellerProfile?.isVerified && (
                            <Badge bg="success" className="verified-badge">Verified</Badge>
                          )}
                          {sellerProfile?.isOrganic && (
                            <Badge bg="primary" className="organic-badge">Organic</Badge>
                          )}
                        </h3>
                        <p className="profile-location">{sellerProfile?.location}</p>
                        <p className="profile-date">Joined {new Date(sellerProfile?.joinedAt).toLocaleDateString()}</p>
                        <p className="profile-rating">
                          Rating: {sellerProfile?.rating} ({sellerProfile?.numReviews} reviews)
                        </p>
                      </div>
                    </div>
                    
                    <div className="profile-section">
                      <h4>About</h4>
                      <p>{sellerProfile?.description}</p>
                    </div>
                    
                    <div className="profile-section">
                      <h4>Contact Information</h4>
                      <p><strong>Email:</strong> {sellerProfile?.email}</p>
                      <p><strong>Phone:</strong> {sellerProfile?.phone}</p>
                    </div>
                    
                    {!sellerProfile?.isVerified && (
                      <div className="profile-section">
                        <h4>Verification</h4>
                        <p>Get verified to build trust with customers and increase your sales.</p>
                        <Button 
                          variant="success" 
                          onClick={handleApplyForVerification}
                        >
                          Apply for Verification
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}
              
              {/* Edit Profile Form */}
              {showEditProfileForm && editedProfile && (
                <Card className="form-card">
                  <Card.Header>Edit Profile</Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleUpdateProfile}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Business Name*</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={editedProfile.name}
                              onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                              isInvalid={!!formErrors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={editedProfile.location}
                              onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email*</Form.Label>
                            <Form.Control 
                              type="email" 
                              value={editedProfile.email}
                              onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                              isInvalid={!!formErrors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone*</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={editedProfile.phone}
                              onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                              isInvalid={!!formErrors.phone}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.phone}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Business Description*</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4}
                          value={editedProfile.description}
                          onChange={(e) => setEditedProfile({...editedProfile, description: e.target.value})}
                          isInvalid={!!formErrors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Profile Image URL</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={editedProfile.avatar}
                              onChange={(e) => setEditedProfile({...editedProfile, avatar: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Cover Image URL</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={editedProfile.coverImage}
                              onChange={(e) => setEditedProfile({...editedProfile, coverImage: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Check 
                          type="checkbox" 
                          label="I am an organic producer" 
                          checked={editedProfile.isOrganic}
                          onChange={(e) => setEditedProfile({...editedProfile, isOrganic: e.target.checked})}
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button variant="secondary" className="me-2" onClick={() => setShowEditProfileForm(false)}>
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                          {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </div>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default SellerDashboard; 