import React, { useEffect } from "react";
import weatherstyles from "./weatherapp.module.css";
import { BsSearch } from "react-icons/bs";
import { BsWater } from "react-icons/bs";
import { FaWind } from "react-icons/fa6";
import { FaTemperatureFull } from "react-icons/fa6";
import { GiSunset } from "react-icons/gi";
import { GiSunrise } from "react-icons/gi";
import axios from "axios";

const WeatherApp = () => {
  const api_key = "09dcfea109f4acf4a75dce05ccb4a88f";
  const [weatherData, setWeatherData] = React.useState(null);
  const [imgUrl, setImgUrl] = React.useState(null);
  const [sunset, setSunset] = React.useState(null);
  const [sunrise, setSunrise] = React.useState(null);
  const [skyDescr, setSkyDescr] = React.useState(null);
  const [errorFlag, setErrorFlag] = React.useState(false);

  // Capitalize first letter of a word
  const firstLetterUpper = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  // Convert Unix timestamp to time
  const getTime = (time) => {
    const unixTimestamp = time * 1000; // Convert to milliseconds
    const timeZone = "Israel"; // Replace with your desired timezone

    const date = new Date(unixTimestamp);
    const options = {
      timeZone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedTime;
  };

  // Get weather data for city
  const getWeather = async (e) => {
    try {
      e.preventDefault();
      setErrorFlag(false);
      // Get city from form input
      const city = e.target.elements.city.value;
      // Fetch weather data for city
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
      );
      const response = res.data;
      // Update state with weather data
      setWeatherData(response);
      // Update state with weather icon
      setImgUrl(
        `http://openweathermap.org/img/w/${response.weather[0].icon}.png`
      );
      // Update state with sunset and sunrise times
      let dset = getTime(response.sys.sunset);
      let drise = getTime(response.sys.sunrise);
      setSunset(dset);
      setSunrise(drise);
      // Update state with sky description
      setSkyDescr(firstLetterUpper(response.weather[0].description));
    } catch (error) {
      // If city not found, display error message
      setErrorFlag(true);
    }
  };

  useEffect(() => {
    // Use Geolocation API to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Fetch weather data for user's location
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`
          )
          .then((res) => {
            const city = res.data.name;
            axios
              .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
              )
              .then((res) => {
                const response = res.data;
                setWeatherData(response);
                setImgUrl(
                  `http://openweathermap.org/img/w/${response.weather[0].icon}.png`
                );
                let dset = getTime(response.sys.sunset);
                let drise = getTime(response.sys.sunrise);
                setSunset(dset);
                setSunrise(drise);
                setSkyDescr(firstLetterUpper(response.weather[0].description));
              });
          })
          .catch((error) => {
            // If city not found, display error message
            console.error("Error fetching weather data:", error);
          });
      });
    }
  }, []);

  return (
    <div className={weatherstyles.main}>
      <form className={weatherstyles.topBar} onSubmit={getWeather}>
        <input
          type="text"
          name="city"
          className={weatherstyles.city}
          placeholder="Search..."
        />
        <button className={weatherstyles.searchBtn} type="submit">
          <BsSearch />
        </button>
        {errorFlag && (
          <div className={weatherstyles.error}>
            <span>City not found</span>
          </div>
        )}
      </form>
      {weatherData && (
        <div className={weatherstyles.weatherData}>
          <div className={weatherstyles.leftDiv}>
            <div className={weatherstyles.citystyle}>{weatherData.name}</div>
            <span>{skyDescr}</span>
            <div className={weatherstyles.skyAndTemp}>
              <figure className={weatherstyles.iconWeather}>
                <img src={imgUrl} alt="Weather icon" />
              </figure>

              <div className={weatherstyles.temperature}>
                <p>
                  <FaTemperatureFull /> {weatherData.main.temp} °C
                </p>
                <p>Feels like: {weatherData.main.feels_like} °C</p>
              </div>
            </div>
          </div>
          {/* right div  */}
          <div className={weatherstyles.rightDiv}>
            <div className={weatherstyles.sunSet}>
              <span>
                <GiSunset /> Sunset: {sunset}
              </span>
            </div>
            <div className={weatherstyles.sunSet}>
              <span>
                <GiSunrise /> Sunrise: {sunrise}
              </span>
            </div>

            <div className={weatherstyles.wind}>
              <span>
                <FaWind /> Wind: {weatherData.wind.speed} m/s
              </span>
            </div>
            <div className={weatherstyles.humidity}>
              <span>
                <BsWater /> Humidity: {weatherData.main.humidity} %
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
