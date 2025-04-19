import React, { useState, useEffect } from 'react';
import { advisoryService } from '../services/api';
import WeatherWidget from '../components/WeatherWidget';
import '../styles/Advisory.css';

const Advisory = () => {
  const [activeTab, setActiveTab] = useState('crop');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [pestWarnings, setPestWarnings] = useState([]);
  const [diseaseResults, setDiseaseResults] = useState([]);
  const [soilData, setSoilData] = useState({
    type: 'Loam',
    ph: 6.5,
    nitrogen: 'Medium',
    phosphorus: 'Medium',
    potassium: 'High',
    organic: 'Medium'
  });
  const [location, setLocation] = useState('Farm Location');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (activeTab === 'crop') {
      fetchCropRecommendations();
    } else if (activeTab === 'pest') {
      fetchPestWarnings();
    }
  }, [activeTab]);

  const fetchCropRecommendations = async () => {
    setLoading(true);
    try {
      const data = await advisoryService.getCropRecommendations(soilData, location);
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPestWarnings = async () => {
    setLoading(true);
    try {
      const data = await advisoryService.getPestWarnings(location, ['Wheat', 'Corn', 'Rice']);
      setPestWarnings(data);
    } catch (error) {
      console.error('Error fetching pest warnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    try {
      // In a real app, we would send the actual image data
      // Here we're just simulating the API call
      const results = await advisoryService.detectDisease({ imageUrl: imagePreview });
      setDiseaseResults(results);
    } catch (error) {
      console.error('Error detecting disease:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoilDataChange = (e) => {
    const { name, value } = e.target;
    setSoilData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="advisory-page">
      <div className="container">
        <div className="page-header">
          <h1>Smart Crop Advisory</h1>
          <p>Get personalized recommendations for your farm based on soil data and conditions.</p>
        </div>

        <div className="advisory-container">
          <div className="advisory-sidebar">
            <div className="sidebar-widget">
              <WeatherWidget location={location} />
            </div>
            
            <div className="sidebar-widget soil-data-form">
              <h3>Your Farm Data</h3>
              <div className="form-group">
                <label>Farm Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="input-field" 
                />
              </div>
              <div className="form-group">
                <label>Soil Type</label>
                <select 
                  name="type" 
                  value={soilData.type} 
                  onChange={handleSoilDataChange}
                  className="input-field"
                >
                  <option value="Clay">Clay</option>
                  <option value="Loam">Loam</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Silt">Silt</option>
                </select>
              </div>
              <div className="form-group">
                <label>Soil pH</label>
                <input 
                  type="range" 
                  name="ph" 
                  min="4" 
                  max="9" 
                  step="0.1"
                  value={soilData.ph} 
                  onChange={handleSoilDataChange} 
                />
                <span>{soilData.ph}</span>
              </div>
              <button className="btn update-btn" onClick={fetchCropRecommendations}>
                Update Recommendations
              </button>
            </div>
          </div>

          <div className="advisory-content">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'crop' ? 'active' : ''}`}
                onClick={() => setActiveTab('crop')}
              >
                Crop Recommendations
              </button>
              <button 
                className={`tab ${activeTab === 'disease' ? 'active' : ''}`}
                onClick={() => setActiveTab('disease')}
              >
                Disease Detection
              </button>
              <button 
                className={`tab ${activeTab === 'pest' ? 'active' : ''}`}
                onClick={() => setActiveTab('pest')}
              >
                Pest Warnings
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'crop' && (
                <div className="crop-recommendations">
                  {loading ? (
                    <div className="loading">Loading recommendations...</div>
                  ) : (
                    <>
                      <div className="recommendations-header">
                        <h3>Recommended Crops for Your Farm</h3>
                        <p>Based on your soil data and location conditions</p>
                      </div>
                      <div className="recommendations-grid">
                        {recommendations.map((crop, index) => (
                          <div className="crop-card" key={index}>
                            <div className="crop-confidence">
                              <div className="confidence-bar" style={{ width: `${crop.confidence}%` }}></div>
                              <span>{crop.confidence}% match</span>
                            </div>
                            <h3 className="crop-name">{crop.crop}</h3>
                            <div className="crop-details">
                              <div className="crop-detail">
                                <span className="label">Expected Yield:</span>
                                <span className="value">{crop.expectedYield}</span>
                              </div>
                              <div className="crop-detail">
                                <span className="label">Season:</span>
                                <span className="value">{crop.growingSeason}</span>
                              </div>
                              <div className="crop-detail">
                                <span className="label">Water Needs:</span>
                                <span className="value">{crop.waterRequirements}</span>
                              </div>
                              <p className="crop-tips">{crop.tips}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'disease' && (
                <div className="disease-detection">
                  <div className="disease-upload">
                    <h3>Upload Plant Image for Disease Detection</h3>
                    <p>Take a clear photo of the affected plant parts (leaves, stems, fruits)</p>
                    
                    <div className="upload-container">
                      <div className="upload-area">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Plant preview" className="image-preview" />
                        ) : (
                          <div className="upload-placeholder">
                            <span className="upload-icon">📷</span>
                            <span>Click to select or drag an image here</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="file-input" 
                        />
                      </div>
                      <button 
                        className="btn analyze-btn"
                        onClick={handleImageUpload}
                        disabled={!selectedImage || loading}
                      >
                        {loading ? 'Analyzing...' : 'Analyze Image'}
                      </button>
                    </div>
                  </div>

                  {diseaseResults.length > 0 && (
                    <div className="disease-results">
                      <h3>Detection Results</h3>
                      {diseaseResults.map((result, index) => (
                        <div className="disease-result" key={index}>
                          <div className="disease-info">
                            <h4>{result.name}</h4>
                            <div className="confidence">
                              <div className="confidence-bar" style={{ width: `${result.confidence}%` }}></div>
                              <span>{result.confidence}% confidence</span>
                            </div>
                          </div>
                          <div className="treatment">
                            <h4>Recommended Treatment:</h4>
                            <p>{result.treatment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pest' && (
                <div className="pest-warnings">
                  {loading ? (
                    <div className="loading">Loading pest warnings...</div>
                  ) : (
                    <>
                      <div className="warnings-header">
                        <h3>Pest & Disease Warnings for Your Region</h3>
                        <p>Based on current climate conditions and historical data</p>
                      </div>
                      <div className="warnings-list">
                        {pestWarnings.map((warning, index) => (
                          <div className="warning-card" key={index}>
                            <div className={`risk-indicator ${warning.riskLevel.toLowerCase()}`}>
                              {warning.riskLevel} Risk
                            </div>
                            <h3 className="pest-name">{warning.pest}</h3>
                            <div className="affected-crops">
                              <strong>Affects:</strong> {warning.crops.join(', ')}
                            </div>
                            <div className="prevention">
                              <strong>Prevention:</strong>
                              <p>{warning.prevention}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advisory; 