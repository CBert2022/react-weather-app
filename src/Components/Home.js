import "../style.css";
import Cloud from "./assets/cloud.png";
import Clear from "./assets/sun.png";
import Rain from "./assets/rainy-day.png";
import Storm from "./assets/storm.png";
import Fog from "./assets/fog.png";
import Snow from "./assets/snowy.png";
import Humidity from "./assets/weather.png";
import Wind from "./assets/wind.png";
import Stars from "./assets/moon.png";
import Cloudy from "./assets/cloudy.png";
import Feel from "./assets/thermometer.png";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Definition der Home-Komponente
function Home() {
  // Zugriff auf die API-Schlüssel aus den Umgebungsvariablen
  const { REACT_APP_API_KEY } = process.env;

  // Zustände für die Wetterdaten, die Eingabestadt und Fehlermeldungen
  const [data, setData] = useState({
    celsius: 10,
    name: "Suche Stadt...",
    humidity: 10,
    speed: 2,
    image: Cloud,
    feel: 10,
    sunrise: 0,
    sunset: 0,
    description: "",
  });
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  // Zustand, um zu überprüfen, ob es Nacht ist
  const [isNight, setIsNight] = useState(false);
  // Zustand, um zu überprüfen, ob bereits eine Stadt abgerufen wurde
  const [cityFetched, setCityFetched] = useState(false);

  // Effekt, um die Geolokalisierung auszuführen, wenn keine Stadt abgerufen wurde
  useEffect(() => {
    if (!cityFetched && name === "") {
      navigator.geolocation.getCurrentPosition(zeigePosition);
    }
  }, [name, cityFetched]);

  // // Effekt, um die Geolokalisierung basierend auf isNight zu aktualisieren
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(zeigePosition);
  //   fetchData(data.name); // Hier rufen wir die API für die Stadt an, die bereits abgerufen wurde
  // }, [isNight]);

  // Effekt, um die Geolokalisierung basierend auf isNight zu aktualisieren
  useEffect(() => {
    if (cityFetched) {
      fetchData(data.name); // Hier rufen wir die API für die Stadt an, die bereits abgerufen wurde
    }
  }, [isNight]);

  // Funktion zur Verarbeitung der Geolokalisierungsdaten
  function zeigePosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const apiURL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${REACT_APP_API_KEY}`;

    axios
      .get(apiURL)
      .then((res) => {
        const city = res.data[0].name;
        fetchData(city);
        setCityFetched(true);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setError("Invalid City Name");
        } else {
          setError("");
        }
      });
  }

  // Funktion zum Abrufen von Wetterdaten basierend auf dem Stadtnamen
  function fetchData(cityName) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${REACT_APP_API_KEY}&units=metric&lang=de`;

    axios
      .get(apiURL)
      .then((res) => {
        let imagePath = "";

        // Bestimmung von Tag oder Nacht

        const sunriseTime = res.data.sys.sunrise;
        const sunsetTime = res.data.sys.sunset;
        let currentTime = Math.floor(Date.now() / 1000);
        const night = currentTime >= sunsetTime || currentTime < sunriseTime;
        setIsNight(night);

        if (night) {
          document.querySelector(".weather").classList.add("night");
          if (res.data.weather[0].main === "Clouds") {
            imagePath = Cloud;
          } else if (res.data.weather[0].main === "Clear") {
            imagePath = Stars;
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
            imagePath = Cloudy;
          }
        } else {
          document.querySelector(".weather").classList.remove("night");
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
            imagePath = Cloudy;
          }
        }

        setData({
          ...data,
          celsius: res.data.main.temp,
          name: res.data.name,
          humidity: res.data.main.humidity,
          speed: res.data.wind.speed,
          image: imagePath,
          feel: res.data.main.feels_like,
          sunrise: res.data.sys.sunrise,
          sunset: res.data.sys.sunset,
          description: res.data.weather[0].description,
        });
        setError("");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setError("Invalid City Name");
        } else {
          setError("");
        }
      });
  }

  // Funktion zum Verarbeiten von Klickereignissen
  const handleClick = () => {
    setCityFetched(false); // Setzen des Zustands, um sicherzustellen, dass die Geolokalisierung erneut durchgeführt wird
    if (name !== "") {
      fetchData(name);
    }
  };

  // Rückgabe der JSX-Struktur der Home-Komponente
  return (
    <div className="container">
      <div className="current_lo"></div>
      <div id="night_shift" className="weather">
        <div className="search">
          <input
            id="input"
            type="text"
            placeholder="Enter City Name"
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
          <p className="description">{data.description}</p>
          <div className="details">
            <div className="col">
              <div>
                <img src={Feel} alt="humidity" />
              </div>
              <div>
                <p>{Math.round(data.feel)}°C</p>
                <p>Gefühlt wie</p>
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
          <div className="details">
            <div className="col">
              <div>
                <img src={Humidity} alt="feels like" />
              </div>
              <div>
                <p>{Math.round(data.humidity)}%</p>
                <p>Luftfeuchtigkeit</p>
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

// Export der Home-Komponente als Standard
export default Home;
