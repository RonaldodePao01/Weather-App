import { useRef, useState } from "react";
import "./App.css";

function App() {
  // useRef to access the input value for the city name
  let cityName = useRef("");

  // Array of weekdays for the forecast
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Get current day of the week
  const day = new Date().getDay();

  // Create array of forecast days starting from current day
  const forecastDays = weekDays
    .slice(day, weekDays.length)
    .concat(weekDays.slice(0, day));

  // State to hold weather data, forecast data, city name, and error state
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState(false);

  let weatherKey = "a4e1c3c80ef4e1924b46993f54690ed1";

  // Function to fetch weather data based on city name
  async function FindCity() {
    // Get the city name from the input field
    const cityValue = cityName.current.value;

    // URL to get city details
    const cityURL = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=1000000&namePrefix=${cityValue}&limit=1&sort=population`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "f2d3414274msh251bea4805ebe77p13297ajsn3832c15abd3f",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    };

    try {
      // Fetch city details
      const response = await fetch(cityURL, options);
      const cityDetails = await response.json();

      // Check if the city was found
      if (!cityDetails.data.length) {
        throw new Error("City not found");
      }

      // Get city details
      const cityName = cityDetails.data[0].city;
      setCity(cityName);
      const lat = cityDetails.data[0].latitude;
      const lon = cityDetails.data[0].longitude;

      // Fetch current weather data
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`;
      const weatherResponse = await fetch(weatherURL);
      const weatherResult = await weatherResponse.json();
      setWeatherData(weatherResult);

      // Fetch forecast weather data
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`;
      const forecastResponse = await fetch(forecastURL);
      const forecastResult = await forecastResponse.json();
      // Get next 7 days forecast
      const weekForecast = forecastResult.list.splice(1, 7);
      setForecastData(weekForecast);
      // Reset error state
      setError(false);
    } catch (error) {
      // Set error state if something goes wrong
      setError(true);
    }
  }

  // Render different components based on the error state and data availability
  if (error === true) {
    return (
      <div className="App">
        <input className="input" ref={cityName} placeholder="Search for city" />
        <button onClick={FindCity}>Enter</button>
        <h1>City not found</h1>
      </div>
    );
  }

  if (weatherData == null) {
    return (
      <div className="App">
        <input className="input" ref={cityName} placeholder="Search for city" />
        <button onClick={FindCity}>Enter</button>
        <h2 className="main-heading black-text">Find the weather for a city</h2>
        <p className="black-text">
          Search for a city with a population of over 1 million and get the
          current weather and the forecast for the week.
        </p>
      </div>
    );
  } else if (forecastData !== null) {
    return (
      <div className="App">
        <input className="input" ref={cityName} placeholder="Search for city" />
        <button onClick={FindCity}>Enter</button>
        <div className="card">
          <h1 className="city">{city}</h1>
          <h4>{weatherData.weather[0].description}</h4>
          <div className="flex">
            <img
              alt="weather"
              className="weather-icon"
              src={`icons/${weatherData.weather[0].icon}.png`}
            />
            <h2 className="temp">{Math.round(weatherData.main.temp)}°C</h2>
          </div>
          <div className="bottom">
            <div className="left">
              <h4>Min: {Math.round(weatherData.main.temp_min)}°C </h4>
              <h4>Wind speed: {weatherData.wind.speed} m/s</h4>
              <h4>Humidity: {weatherData.main.humidity}%</h4>
            </div>
            <div className="right">
              <h4>Max: {Math.round(weatherData.main.temp_max)}°C </h4>
              <h4>Feels like: {weatherData.main.feels_like}°C</h4>
              <h4>Pressure: {weatherData.main.pressure} hPa</h4>
            </div>
          </div>
        </div>
        <h1 className="main-heading">Forecast</h1>
        <div className="forecast">
          {forecastData.map((item, index) => (
            <div className="small" key={index}>
              <h3>{forecastDays[index]}</h3>
              <img
                alt="weather"
                className="weather-icon"
                src={`icons/${item.weather[0].icon}.png`}
              />
              <h3>{item.main.temp}°C </h3>
              <h5 className="light">{item.weather[0].description}</h5>
              <div className="min-max">
                <h5 className="light">
                  Max: {Math.round(item.main.temp_max)}°C
                </h5>
                <h5 className="light">
                  Min: {Math.round(item.main.temp_min)}°C
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
