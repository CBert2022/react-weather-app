import React, { useRef, useState } from "react";
import axios from "axios";

function GeoLo() {
  const ausgabeRef = useRef(null); // useRef um DDOM Elemente zu manipulieren
  let lat = "";
  let lon = "";
  const [error, setError] = useState("");

  function ermittlePosition() {
    const ausgabe = ausgabeRef.current; // current = aktueller wert
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(zeigePosition, showError);
    } else {
      ausgabe.innerHTML = "Ihr Browser unterstützt keine Geolocation.";
    }
  }

  function zeigePosition(position) {
    const ausgabe = ausgabeRef.current; // current = aktueller wert
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    const apiURL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=95e1808808fc4f2e2fac242dc555bb96`;

    axios
      .get(apiURL)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setError("Invalid City Name");
        } else {
          setError("");
        }
        console.log(err);
      });

    ausgabe.innerHTML =
      "Ihre Koordinaten sind:<br> Breite: " +
      position.coords.latitude +
      "<br>Länge: " +
      position.coords.longitude;
    console.log(lat, lon);
  }

  function showError(error) {
    const ausgabe = ausgabeRef.current;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        ausgabe.innerHTML = "Benutzer hat die Geolocation-Anfrage abgelehnt.";
        break;
      case error.POSITION_UNAVAILABLE:
        ausgabe.innerHTML = "Standortinformationen sind nicht verfügbar.";
        break;
      case error.TIMEOUT:
        ausgabe.innerHTML = "Die Anfrage an die Geolocation ist abgelaufen.";
        break;
      case error.UNKNOWN_ERROR:
        ausgabe.innerHTML = "Ein unbekannter Fehler ist aufgetreten.";
        break;
      default:
        ausgabe.innerHTML = "Ein unbekannter Fehler ist aufgetreten.";
    }
  }

  return (
    <div>
      <p>
        Sobald Sie auf den Button klicken, werden Ihre Koordinaten ermittelt.
      </p>
      <button onClick={ermittlePosition} id="los">
        Los!
      </button>
      <p ref={ausgabeRef} id="ausgabe"></p>
      <p>{error}</p>
    </div>
  );
}

export default GeoLo;
