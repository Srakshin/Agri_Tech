import React, { useState, useEffect } from 'react';
import '../styles/WeatherWidget.css';

const WeatherWidget = ({ location = "Default Location" }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with dummy data
    const fetchWeatherData = async () => {
      setLoading(true);
      
      // In a real application, this would be an API call
      // Something like: const response = await api.getWeather(location);
      
      // Dummy data for demonstration
      setTimeout(() => {
        const dummyData = {
          location,
          temperature: Math.floor(Math.random() * 15) + 15, // Random temp between 15-30°C
          condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Rainy"][Math.floor(Math.random() * 5)],
          humidity: Math.floor(Math.random() * 30) + 50, // Random humidity between 50-80%
          windSpeed: Math.floor(Math.random() * 15) + 5, // Random wind speed between 5-20 km/h
          forecast: [
            { day: "Mon", temp: Math.floor(Math.random() * 10) + 15 },
            { day: "Tue", temp: Math.floor(Math.random() * 10) + 15 },
            { day: "Wed", temp: Math.floor(Math.random() * 10) + 15 },
            { day: "Thu", temp: Math.floor(Math.random() * 10) + 15 },
            { day: "Fri", temp: Math.floor(Math.random() * 10) + 15 }
          ]
        };
        
        setWeatherData(dummyData);
        setLoading(false);
      }, 1000);
    };

    fetchWeatherData();
  }, [location]);

  if (loading) {
    return <div className="weather-widget-loading">Loading weather data...</div>;
  }

  return (
    <div className="weather-widget">
      <div className="weather-current">
        <h3>{weatherData.location}</h3>
        <div className="weather-main">
          <div className="weather-temp">{weatherData.temperature}°C</div>
          <div className="weather-condition">{weatherData.condition}</div>
        </div>
        <div className="weather-details">
          <div className="weather-detail">
            <span className="label">Humidity:</span>
            <span className="value">{weatherData.humidity}%</span>
          </div>
          <div className="weather-detail">
            <span className="label">Wind:</span>
            <span className="value">{weatherData.windSpeed} km/h</span>
          </div>
        </div>
      </div>
      <div className="weather-forecast">
        {weatherData.forecast.map((day, index) => (
          <div key={index} className="forecast-day">
            <div className="day-name">{day.day}</div>
            <div className="day-temp">{day.temp}°C</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget; 