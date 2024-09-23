import { useRef, useState } from "react";
import "./App.css";

function App() {
  let cityName = useRef("");
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const day = new Date().getDay();
  const forecastDays = weekDays
    .slice(day, weekDays.length)
    .concat(weekDays.slice(0, day));
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState(false);
  let weatherKey = "a4e1c3c80ef4e1924b46993f54690ed1";
  async function FindCity() {
    cityName = cityName.current.value;
    const cityURL = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=1000000&namePrefix=${cityName}&limit=1&sort=population`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "f2d3414274msh251bea4805ebe77p13297ajsn3832c15abd3f",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    };
    try {
      const response = await fetch(cityURL, options);
      const cityDetails = await response.json();
      let cityName = cityDetails.data[0].city;
      setCity(cityDetails.data[0].city);
      let lat = cityDetails.data[0].latitude;
      let lon = cityDetails.data[0].longitude;
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`;
      const weatherResponse = await fetch(weatherURL);
      const weatherResult = await weatherResponse.json();
      setWeatherData(weatherResult);
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`;
      const forecastResponse = await fetch(forecastURL);
      const forecastResult = await forecastResponse.json();
      const weekForecast = forecastResult.list.splice(1, 7);
      setForecastData(weekForecast);
      setError(false);
    } catch (error) {
      setError(true);
    }
  }
  if (error) {
    return (
      <div className="App">
        <input
          className="input"
          ref={cityName}
          placeholder="Search for city"
        ></input>
        <button onClick={FindCity}>Enter</button>
        <h1>An error has occurred</h1>
      </div>
    );
  }
  if (weatherData == null) {
    return (
      <div className="App">
        <input
          className="input"
          ref={cityName}
          placeholder="Search for city"
        ></input>
        <button onClick={FindCity}>Enter</button>
        <h2 className="main-heading black-text">Find the weather for a city</h2>
        <p className="black-text">
          Search for a city with a population of over 1 million and get the
          current weather and the forecast for the week.
        </p>
      </div>
    );
  } else if (forecastData !== null)
    return (
      <div className="App">
        <input
          className="input"
          ref={cityName}
          placeholder="Search for city"
        ></input>
        <button onClick={FindCity}>Enter</button>
        <div className="card">
          <h1 className="city">{city}</h1>
          <h4 className="weather-description">
            {weatherData.weather[0].description}
          </h4>
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
              <h4>Wind speed: {weatherData.wind.speed}m/s</h4>
              <h4>Humidity: {weatherData.main.humidity}%</h4>
            </div>
            <div className="right">
              <h4>Max: {Math.round(weatherData.main.temp_max)}°C </h4>
              <h4>Feels like: {weatherData.main.feels_like}°C</h4>
              <h4>Pressure: {weatherData.main.pressure}hPa</h4>
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

export default App;
