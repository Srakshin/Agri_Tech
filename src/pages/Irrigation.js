import React, { useState, useEffect } from 'react';
import { irrigationService } from '../services/api';
import WeatherWidget from '../components/WeatherWidget';
import '../styles/Irrigation.css';

const Irrigation = () => {
  const [loading, setLoading] = useState(true);
  const [irrigationPlan, setIrrigationPlan] = useState(null);
  const [waterUsage, setWaterUsage] = useState(null);
  const [formData, setFormData] = useState({
    cropType: 'Corn',
    fieldSize: 10,
    soilType: 'Loam',
    region: 'Midwest',
    irrigationSystem: 'Drip'
  });

  useEffect(() => {
    // Fetch irrigation plan and water usage on component mount
    fetchIrrigationPlan();
    fetchWaterUsage();
  }, []);

  const fetchIrrigationPlan = async () => {
    setLoading(true);
    try {
      const cropData = {
        type: formData.cropType,
        fieldSize: formData.fieldSize,
        irrigationSystem: formData.irrigationSystem
      };
      
      const soilData = {
        type: formData.soilType
      };
      
      const data = await irrigationService.getIrrigationPlan(cropData, soilData, formData.region);
      setIrrigationPlan(data);
    } catch (error) {
      console.error('Error fetching irrigation plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterUsage = async () => {
    try {
      const data = await irrigationService.getWaterUsage('farm-001', 'monthly');
      setWaterUsage(data);
    } catch (error) {
      console.error('Error fetching water usage:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchIrrigationPlan();
  };

  // Render a bar chart for historical water usage
  const renderWaterUsageChart = () => {
    if (!waterUsage || !waterUsage.historicalData) return null;
    
    const maxUsage = Math.max(...waterUsage.historicalData.map(d => d.usage));
    
    return (
      <div className="water-usage-chart">
        <h3>Water Usage History</h3>
        <div className="chart-container">
          {waterUsage.historicalData.map((data, index) => (
            <div className="chart-bar-container" key={index}>
              <div 
                className="chart-bar" 
                style={{ height: `${(data.usage / maxUsage) * 100}%` }}
              >
                <span className="chart-value">{data.usage}</span>
              </div>
              <span className="chart-label">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="irrigation-page">
      <div className="container">
        <div className="page-header">
          <h1>Smart Irrigation Planner</h1>
          <p>Optimize your water usage with AI-driven irrigation scheduling</p>
        </div>

        <div className="irrigation-container">
          <div className="irrigation-sidebar">
            <div className="sidebar-widget">
              <WeatherWidget location={formData.region} />
            </div>
            
            <div className="sidebar-widget">
              <h3>Configure Irrigation Plan</h3>
              <form onSubmit={handleSubmit} className="irrigation-form">
                <div className="form-group">
                  <label>Crop Type</label>
                  <select 
                    name="cropType" 
                    value={formData.cropType}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Corn">Corn</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Soybeans">Soybeans</option>
                    <option value="Rice">Rice</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Field Size (acres)</label>
                  <input 
                    type="number" 
                    name="fieldSize" 
                    value={formData.fieldSize}
                    onChange={handleInputChange}
                    className="form-input"
                    min="1"
                    max="1000"
                  />
                </div>
                
                <div className="form-group">
                  <label>Soil Type</label>
                  <select 
                    name="soilType" 
                    value={formData.soilType}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Clay">Clay</option>
                    <option value="Loam">Loam</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Silt">Silt</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Region</label>
                  <input 
                    type="text" 
                    name="region" 
                    value={formData.region}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Irrigation System</label>
                  <select 
                    name="irrigationSystem" 
                    value={formData.irrigationSystem}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler System</option>
                    <option value="Flood">Flood Irrigation</option>
                    <option value="Center Pivot">Center Pivot</option>
                  </select>
                </div>
                
                <button type="submit" className="btn">Generate Irrigation Plan</button>
              </form>
            </div>
          </div>

          <div className="irrigation-content">
            {loading ? (
              <div className="loading">Generating your optimal irrigation plan...</div>
            ) : (
              <>
                {irrigationPlan && (
                  <div className="irrigation-plan">
                    <div className="plan-header">
                      <h2>Your Irrigation Schedule</h2>
                      <div className="plan-stats">
                        <div className="plan-stat">
                          <span className="stat-label">Est. Water Usage:</span>
                          <span className="stat-value">{irrigationPlan.waterUsageEstimate}</span>
                        </div>
                        <div className="plan-stat">
                          <span className="stat-label">Efficiency:</span>
                          <span className="stat-value">{irrigationPlan.efficiency}%</span>
                        </div>
                        <div className="plan-stat">
                          <span className="stat-label">Monthly Savings:</span>
                          <span className="stat-value">{irrigationPlan.monthlySavings}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="schedule-table-container">
                      <table className="schedule-table">
                        <thead>
                          <tr>
                            <th>Day</th>
                            <th>Start Time</th>
                            <th>Duration (mins)</th>
                            <th>Zones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {irrigationPlan.recommendedSchedule.map((schedule, index) => (
                            <tr key={index}>
                              <td>{schedule.day}</td>
                              <td>{schedule.startTime}</td>
                              <td>{schedule.duration}</td>
                              <td>{schedule.zones.join(', ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="plan-adjustments">
                      <h3>Weather-Based Adjustments</h3>
                      <ul className="adjustments-list">
                        {irrigationPlan.adjustments.map((adjustment, index) => (
                          <li key={index}>
                            <span className="condition">{adjustment.condition}:</span>
                            <span className="action">{adjustment.action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {waterUsage && (
                  <div className="water-usage">
                    <div className="usage-overview">
                      <h2>Water Usage Overview</h2>
                      <div className="usage-stats">
                        <div className="usage-card">
                          <h3>Current Period</h3>
                          <div className="usage-value">{waterUsage.currentPeriod}</div>
                          <div className="usage-unit">gallons</div>
                        </div>
                        <div className="usage-card">
                          <h3>Previous Period</h3>
                          <div className="usage-value">{waterUsage.previousPeriod}</div>
                          <div className="usage-unit">gallons</div>
                        </div>
                        <div className="usage-card savings">
                          <h3>Savings</h3>
                          <div className="usage-value">
                            {waterUsage.savingsPercentage > 0 ? (
                              <>
                                <span className="savings-icon">↓</span>
                                {waterUsage.savingsPercentage.toFixed(1)}%
                              </>
                            ) : (
                              <>
                                <span className="increase-icon">↑</span>
                                {Math.abs(waterUsage.savingsPercentage).toFixed(1)}%
                              </>
                            )}
                          </div>
                          <div className="usage-unit">{waterUsage.savings} gallons</div>
                        </div>
                      </div>
                    </div>
                    
                    {renderWaterUsageChart()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Irrigation; 