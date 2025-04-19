import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';

// Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Advisory from './pages/Advisory';
import Irrigation from './pages/Irrigation';
import KnowledgePortal from './pages/KnowledgePortal';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/advisory" element={<Advisory />} />
          <Route path="/irrigation" element={<Irrigation />} />
          <Route path="/knowledge" element={<KnowledgePortal />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 