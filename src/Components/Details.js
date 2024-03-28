import React, { useState, useEffect } from "react";
import axios from "axios";
import Cloud from "./assets/cloud.png";
import Clear from "./assets/sun.png";
import Rain from "./assets/rainy-day.png";
import Storm from "./assets/storm.png";
import Fog from "./assets/fog.png";
import Snow from "./assets/snowy.png";
import Cloudy from "./assets/cloudy.png";

function Details({ cityName }) {
  // Zugriff auf die API-Schlüssel aus den Umgebungsvariablen
  const { REACT_APP_API_KEY } = process.env;

  // Ermitteln der Wochentage
  let daysOfWeek = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  // Index des heutigen Wochentags
  let today = new Date().getDay();

  // Objekt zum Sammeln der Mindest- und Maximaltemperaturen für jeden Tag
  let tempsByDay = {};

  // Zustände für die Wetterdaten der nächsten Tage
  const [nextDaysWeather, setNextDaysWeather] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${REACT_APP_API_KEY}&units=metric&lang=de`
        );
        const weatherData = response.data.list;
        // console.log("details API: " + cityName);

        // Durchlaufen der Wetterdaten und Sammeln nach Tag
        for (let i = 0; i < weatherData.length; i++) {
          let apiDate = new Date(weatherData[i].dt_txt).getDay();
          let minTempOfDay = weatherData[i].main.temp_min;
          let maxTempOfDay = weatherData[i].main.temp_max;
          let iconOfDay = weatherData[i].weather[0].main;

          // Vergleichen der Wochentage
          if (apiDate !== today) {
            let dayOfWeek = daysOfWeek[apiDate];
            // Überprüfen, ob bereits ein Eintrag für diesen Wochentag im Objekt existiert
            if (!tempsByDay[dayOfWeek]) {
              tempsByDay[dayOfWeek] = { min: [], max: [], icon: [] };
            }
            // Mindest- und Maximaltemperatur sowie das Icon zum entsprechenden Tag hinzufügen
            tempsByDay[dayOfWeek].min.push(minTempOfDay);
            tempsByDay[dayOfWeek].max.push(maxTempOfDay);
            tempsByDay[dayOfWeek].icon.push(iconOfDay);
          }
        }

        // Daten für die nächsten Tage zusammenstellen
        const nextDays = [];
        for (let day in tempsByDay) {
          let minTemp = tempsByDay[day].min[0];
          let maxTemp = tempsByDay[day].max[0];
          let icon = Cloudy; // Standardwert

          // Mindest- und Maximaltemperatur für den Tag berechnen
          for (let i = 0; i < tempsByDay[day].min.length; i++) {
            if (tempsByDay[day].min[i] < minTemp) {
              minTemp = tempsByDay[day].min[i];
            }
            if (tempsByDay[day].max[i] > maxTemp) {
              maxTemp = tempsByDay[day].max[i];
            }
          }

          // Icon auswählen basierend auf dem häufigsten Wetter
          let weatherCount = {};
          // Durchlaufen der Liste der Wettersymbole des Tages und Zählen der Häufigkeit jedes Wettersymbols
          tempsByDay[day].icon.forEach((weather) => {
            if (weatherCount[weather]) {
              weatherCount[weather] += 1; // erhöhe seinen Zähler um 1
            } else {
              weatherCount[weather] = 1; // oder wenn Symbol zu ersten mal -> setze seinen Zähler auf 1
            }
          });
          let maxCount = 0;
          //console.log(weatherCount);
          let mostCommonWeather = null;
          for (let weather in weatherCount) {
            if (weatherCount[weather] > maxCount) {
              maxCount = weatherCount[weather];
              mostCommonWeather = weather;
            }
          }
          icon = getWeatherIcon(mostCommonWeather);

          nextDays.push({
            name: day,
            minTemp: minTemp,
            maxTemp: maxTemp,
            icon: icon,
          });
        }

        // Setzen der Zustände für die Wetterdaten der nächsten Tage
        setNextDaysWeather(nextDays);
      } catch (error) {
        console.error("Fehler beim Abrufen der Wetterdaten:", error);
      }
    };

    fetchData();
  }, []);

  // Überprüfen Sie die Stadtänderung
  useEffect(() => {
    //console.log("Neuer Stadtnamen:", cityName);
  }, [cityName]);

  // Funktion zum Zuweisen des Icons basierend auf dem Wetter
  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "Clouds":
        return Cloud;
      case "Clear":
        return Clear;
      case "Rain":
        return Rain;
      case "Storm":
        return Storm;
      case "Fog":
        return Fog;
      case "Snow":
        return Snow;
      default:
        return Cloudy;
    }
  };

  if (cityName) {
    return (
      <>
        <div className="container_temp_infos">
          <h3>5-Tage-Vorhersage</h3>
          <div className="container_forecast">
            {nextDaysWeather.map((day, index) => (
              <div key={index}>
                <div className="forecast_row">
                  <p>{day.name}</p>
                  <img
                    className="forecast_icon"
                    src={day.icon}
                    alt="wetter icon"
                  />
                  <p className="minTemp">{Math.round(day.minTemp)}°C</p>
                  <p>{Math.round(day.maxTemp)}°C</p>
                </div>
                {index !== nextDaysWeather.length - 1 && (
                  <div className="devider_forcast"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </>
    );
  }
}

export default Details;
