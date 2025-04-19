import React, { useState, useEffect, useRef } from 'react';
import { knowledgeService } from '../services/api';
import '../styles/KnowledgePortal.css';

const KnowledgePortal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Fetch recommended content on component mount
    fetchRecommendations();

    // Load search history from localStorage if available
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const fetchRecommendations = async () => {
    try {
      // Dummy user interests for demo
      const userInterests = ['organic farming', 'water conservation', 'pest management'];
      const data = await knowledgeService.getRecommendations(userInterests);
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    performSearch(searchQuery);
  };

  const performSearch = async (query) => {
    setLoading(true);
    try {
      const results = await knowledgeService.searchKnowledge(query);
      setSearchResults(results);
      
      // Add to search history if not already present
      if (!searchHistory.includes(query)) {
        const updatedHistory = [query, ...searchHistory].slice(0, 5);
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error('Error searching knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceSearch = async () => {
    setVoiceSearchActive(true);
    
    // In a real application, this would activate the device microphone
    // and stream audio data to a speech-to-text service
    
    // For this demo, we'll simulate the voice recognition process
    setTimeout(async () => {
      try {
        // Simulated voice processing
        const response = await knowledgeService.processVoiceSearch({});
        setSearchQuery(response.recognizedText);
        performSearch(response.recognizedText);
      } catch (error) {
        console.error('Error processing voice search:', error);
      } finally {
        setVoiceSearchActive(false);
      }
    }, 2000);
  };

  const handleHistoryItemClick = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'article':
        return '📄';
      case 'video':
        return '🎬';
      case 'guide':
        return '📚';
      default:
        return '📄';
    }
  };

  return (
    <div className="knowledge-portal">
      <div className="container">
        <div className="page-header">
          <h1>Farming Knowledge Portal</h1>
          <p>Access a wealth of agricultural information and best practices</p>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <input 
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for farming topics, techniques, or questions..."
                className="search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>
            <button type="submit" className="search-btn">Search</button>
            <button 
              type="button" 
              className={`voice-search-btn ${voiceSearchActive ? 'active' : ''}`}
              onClick={startVoiceSearch}
              disabled={voiceSearchActive}
            >
              {voiceSearchActive ? '🎙️ Listening...' : '🎙️'}
            </button>
          </form>

          {searchHistory.length > 0 && (
            <div className="search-history">
              <h3>Recent Searches:</h3>
              <div className="history-items">
                {searchHistory.map((query, index) => (
                  <button 
                    key={index} 
                    className="history-item"
                    onClick={() => handleHistoryItemClick(query)}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">Searching knowledge base...</div>
        ) : searchResults.length > 0 ? (
          <div className="search-results">
            <h2>Search Results for "{searchQuery}"</h2>
            <div className="results-list">
              {searchResults.map(result => (
                <div className="result-item" key={result.id}>
                  <div className="result-icon">{getContentIcon(result.type)}</div>
                  <div className="result-content">
                    <h3 className="result-title">{result.title}</h3>
                    <div className="result-meta">
                      <span className="result-type">{result.type}</span>
                      <span className="result-date">{formatDate(result.date)}</span>
                      {result.duration && (
                        <span className="result-duration">{result.duration}</span>
                      )}
                    </div>
                    <p className="result-summary">{result.summary}</p>
                    <a href={result.url} className="result-link">View Content</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="recommendations-section">
            <h2>Recommended For You</h2>
            <div className="recommendations-grid">
              {recommendations.map(recommendation => (
                <div className="recommendation-card" key={recommendation.id}>
                  <div className="card-header">
                    <span className="content-type">{recommendation.type}</span>
                    <span className="content-icon">{getContentIcon(recommendation.type)}</span>
                  </div>
                  <h3 className="recommendation-title">{recommendation.title}</h3>
                  <p className="recommendation-summary">{recommendation.summary}</p>
                  <div className="card-footer">
                    <span className="recommendation-date">{formatDate(recommendation.date)}</span>
                    <a href={recommendation.url} className="recommendation-link">Read More</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="knowledge-categories">
              <h2>Browse By Category</h2>
              <div className="categories-grid">
                <div className="category-card">
                  <div className="category-icon">🌱</div>
                  <h3>Crop Production</h3>
                  <p>Cultivation techniques, crop rotation, planting guides</p>
                </div>
                <div className="category-card">
                  <div className="category-icon">🐛</div>
                  <h3>Pest Management</h3>
                  <p>Identification, prevention, and organic control methods</p>
                </div>
                <div className="category-card">
                  <div className="category-icon">💧</div>
                  <h3>Water Management</h3>
                  <p>Conservation, irrigation methods, water quality</p>
                </div>
                <div className="category-card">
                  <div className="category-icon">🌿</div>
                  <h3>Soil Health</h3>
                  <p>Fertilization, composting, soil analysis</p>
                </div>
                <div className="category-card">
                  <div className="category-icon">🚜</div>
                  <h3>Farm Equipment</h3>
                  <p>Machinery guides, maintenance, modern technology</p>
                </div>
                <div className="category-card">
                  <div className="category-icon">💰</div>
                  <h3>Farm Business</h3>
                  <p>Marketing, finance, regulations, certifications</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgePortal;