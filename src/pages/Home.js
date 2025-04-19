import React from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';
import '../styles/Home.css';

const Home = () => {
  const features = [
    {
      id: 1,
      title: 'Smart Crop Advisory',
      description: 'Get personalized crop recommendations based on your soil, climate, and farming goals.',
      path: '/advisory',
      icon: '🌱'
    },
    {
      id: 2,
      title: 'Pest & Disease Alerts',
      description: 'Early warning system for potential pest and disease outbreaks in your area.',
      path: '/advisory',
      icon: '🐛'
    },
    {
      id: 3,
      title: 'Farmer Marketplace',
      description: 'Buy, sell, and trade agricultural products directly with other farmers and buyers.',
      path: '/marketplace',
      icon: '🛒'
    },
    {
      id: 4,
      title: 'Smart Irrigation Planning',
      description: 'Optimize your water usage with AI-driven irrigation scheduling.',
      path: '/irrigation',
      icon: '💧'
    },
    {
      id: 5,
      title: 'Knowledge Portal',
      description: 'Access to farming best practices, research, and community wisdom.',
      path: '/knowledge',
      icon: '📚'
    }
  ];

  return (
    <div className="home">
      <div className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Modern Farming Solutions</h1>
            <p>Using technology to enhance productivity, sustainability, and profitability for farmers of all sizes.</p>
            <div className="hero-buttons">
              <Link to="/advisory" className="btn">Get Started</Link>
              <Link to="/knowledge" className="btn btn-outline">Learn More</Link>
            </div>
          </div>
          <div className="hero-weather">
            <WeatherWidget location="Your Farm" />
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Our Features</h2>
          <div className="features-grid">
            {features.map(feature => (
              <div className="feature-card" key={feature.id}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.path} className="feature-link">Explore</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Farmers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"FarmerTech's crop advisory has increased my yield by 30% while reducing water usage."</p>
              </div>
              <div className="testimonial-author">- Michael Johnson, Wheat Farmer</div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The marketplace feature helped me find direct buyers for my organic produce at better prices."</p>
              </div>
              <div className="testimonial-author">- Sarah Williams, Organic Farmer</div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The pest early warning system saved my crops this season. I received an alert three days before an infestation hit our area."</p>
              </div>
              <div className="testimonial-author">- Robert Chen, Rice Grower</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 