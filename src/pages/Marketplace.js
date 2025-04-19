import React, { useState, useEffect } from 'react';
import { marketplaceService } from '../services/api';
import '../styles/Marketplace.css';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    organic: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Only apply non-empty filters
      const appliedFilters = {};
      for (const key in filters) {
        if (filters[key] !== '' && filters[key] !== false) {
          appliedFilters[key] = filters[key];
        }
      }
      
      const data = await marketplaceService.getProducts(appliedFilters);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      organic: false
    });
    fetchProducts();
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    
    try {
      setLoading(true);
      
      // Simulate checkout process
      const orderData = {
        items: cart,
        shippingAddress: '123 Farm Lane, Agricultural District'
      };
      
      const confirmation = await marketplaceService.placeOrder(orderData);
      
      alert(`Order placed successfully! Order ID: ${confirmation.orderId}`);
      setCart([]);
      setShowCart(false);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marketplace-page">
      <div className="container">
        <div className="page-header">
          <h1>Farmer Marketplace</h1>
          <p>Buy and sell agricultural products directly from farmers</p>
        </div>

        <div className="marketplace-container">
          <aside className="marketplace-sidebar">
            <div className="filter-container">
              <h3>Filters</h3>
              <form onSubmit={applyFilters}>
                <div className="filter-group">
                  <label>Category</label>
                  <select 
                    name="category" 
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="filter-input"
                  >
                    <option value="">All Categories</option>
                    <option value="Vegetable">Vegetables</option>
                    <option value="Grain">Grains</option>
                    <option value="Specialty">Specialty Items</option>
                    <option value="Supplies">Farm Supplies</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Price Range</label>
                  <div className="price-range">
                    <input 
                      type="number" 
                      name="minPrice" 
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min" 
                      className="filter-input price-input"
                    />
                    <span>to</span>
                    <input 
                      type="number" 
                      name="maxPrice" 
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max" 
                      className="filter-input price-input"
                    />
                  </div>
                </div>
                
                <div className="filter-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="organic" 
                      checked={filters.organic}
                      onChange={handleFilterChange}
                    />
                    <span>Organic Products Only</span>
                  </label>
                </div>
                
                <div className="filter-actions">
                  <button type="submit" className="btn filter-btn">Apply Filters</button>
                  <button type="button" className="btn-outline reset-btn" onClick={resetFilters}>Reset</button>
                </div>
              </form>
            </div>
            
            <div className="sell-info">
              <h3>Want to Sell?</h3>
              <p>Register as a seller to list your farm products.</p>
              <button className="btn sell-btn">Become a Seller</button>
            </div>
          </aside>

          <main className="products-container">
            <div className="products-header">
              <h2>Available Products</h2>
              <div className="cart-indicator" onClick={() => setShowCart(true)}>
                <span className="cart-icon">🛒</span>
                <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <p>No products match your current filters.</p>
                <button className="btn-outline" onClick={resetFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image">
                      <img src={`/assets/images/${product.image}`} alt={product.name} />
                      {product.organic && <span className="organic-badge">Organic</span>}
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-meta">
                        <span className="product-price">${product.price.toFixed(2)}/{product.unit}</span>
                        <span className="product-seller">{product.seller}</span>
                      </div>
                      <p className="product-description">{product.description}</p>
                      <div className="product-footer">
                        <span className="product-availability">
                          {product.available} {product.unit}s available
                        </span>
                        <button 
                          className="btn add-to-cart-btn"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Shopping Cart Overlay */}
      {showCart && (
        <div className="cart-overlay">
          <div className="cart-container">
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
            </div>
            
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty.</p>
                <button className="btn" onClick={() => setShowCart(false)}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <span className="item-price">${item.price.toFixed(2)}/{item.unit}</span>
                      </div>
                      <div className="item-quantity">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <div className="item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        className="remove-item" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <button 
                    className="btn checkout-btn"
                    onClick={checkout}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace; 