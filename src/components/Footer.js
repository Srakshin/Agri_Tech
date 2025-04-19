import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3 className="footer-title">FarmerTech</h3>
          <p className="footer-description">
            Empowering farmers with technology solutions for sustainable and efficient farming.
          </p>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/advisory">Crop Advisory</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/irrigation">Irrigation Planner</Link></li>
            <li><Link to="/knowledge">Knowledge Portal</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-contact">
            <li>Email: support@farmertech.com</li>
            <li>Phone: +1 (123) 456-7890</li>
            <li>Address: 123 Farm Way, Agriville</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} FarmerTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 