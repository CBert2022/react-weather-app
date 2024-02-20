import "../style.css";
import Cloud from "./assets/cloud.png";
import Clear from "./assets/sun.png";
import Rain from "./assets/rainy-day.png";
import Storm from "./assets/storm.png";
import Fog from "./assets/fog.png";
import Snow from "./assets/snowy.png";
import Humidity from "./assets/weather.png";
import Wind from "./assets/wind.png";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const { REACT_APP_API_KEY } = process.env;

  const [data, setData] = useState({
    celsius: 10,
    name: "Suche Stadt",
    humidity: 10,
    speed: 2,
    image: Cloud,
    feel: 10,
  });

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // falls geolocation vom user erlaubt:
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(zeigePosition);
  }, []); // leeres array als abhängigkeit => Effekt wird nur einmalig nach dem ersten rendern ausgeführt

  // koordinaten speicher zur Abfrage der stadt
  function zeigePosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const apiURL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${REACT_APP_API_KEY}`;

    axios
      .get(apiURL)
      .then((res) => {
        const city = res.data[0].name;
        // übergabe der ermittelten stadt aus geolocation an fetchData
        fetchData(city);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setError("Invalid City Name");
        } else {
          setError("");
        }
        // console.log(err);
      });
  }

  // definition der fetchData fkt
  function fetchData(cityName) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${REACT_APP_API_KEY}&units=metric&lang=de`;

    axios
      .get(apiURL)
      .then((res) => {
        let imagePath = "";
        // console.log(res.data);

        if (res.data.weather[0].main === "Clouds") {
          imagePath = Cloud;
        } else if (res.data.weather[0].main === "Clear") {
          imagePath = Clear;
        } else if (res.data.weather[0].main === "Rain") {
          imagePath = Rain;
        } else if (res.data.weather[0].main === "Drizzle") {
          imagePath = Rain;
        } else if (res.data.weather[0].main === "Mist") {
          imagePath = Fog;
        } else if (res.data.weather[0].main === "Snow") {
          imagePath = Snow;
        } else if (res.data.weather[0].main === "Thunderstorm") {
          imagePath = Storm;
        } else {
          imagePath = Cloud;
        }

        setData({
          ...data, // kopiere vorhandene daten und aktualisiere
          celsius: res.data.main.temp,
          name: res.data.name,
          humidity: res.data.main.humidity,
          speed: res.data.wind.speed,
          image: imagePath,
          feel: res.data.main.feels_like,
        });
        setError("");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setError("Invalid City Name");
        } else {
          setError("");
        }
        console.log(err);
      });
  }

  const handleClick = () => {
    if (name !== "") {
      fetchData(name);
    }
  };

  return (
    <div className="container">
      <div className="current_lo"></div>
      <div className="weather">
        <div className="search">
          <input
            id="input"
            type="text"
            placeholder="Enter City Name"
            // update die stadt im name / setname usestate
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleClick}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <div className="winfo">
          <div className="error">
            <p>{error}</p>
          </div>
          <img src={data.image} alt="cloud" />
          <h1>{Math.round(data.celsius)}°C</h1>
          <h2>{data.name}</h2>
          <div className="details">
            <div className="col">
              <div>
                <img src={Humidity} alt="humidity" />
              </div>
              <div>
                <p>{Math.round(data.humidity)}%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className="col">
              <div>
                <img src={Wind} alt="wind" />
              </div>
              <div>
                <p>{Math.round(data.speed)}km/h</p>
                <p>Wind</p>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-mobil">
          <a
            href="https://www.flaticon.com/free-icons/weather"
            title="weather icons"
          >
            Weather icons created by iconixar - Flaticon
          </a>
        </div>
      </div>
      <div className="copyright">
        <a
          href="https://www.flaticon.com/free-icons/weather"
          title="weather icons"
        >
          Weather icons created by iconixar - Flaticon
        </a>
      </div>
    </div>
  );
}

export default Home;
