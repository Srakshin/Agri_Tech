import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          FarmerTech
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </div>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/advisory" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Crop Advisory
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/marketplace" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Marketplace
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/irrigation" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Irrigation Planner
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/knowledge" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Knowledge Portal
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 