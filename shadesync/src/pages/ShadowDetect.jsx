import React, { useState } from "react";
import Map from "../components/Map";
import styles from "./shadowDetect.module.css";

function ShadowDetect() {
  const [points, setPoints] = useState([]);
  const [flyToCoords, setFlyToCoords] = useState(null);

  const [userLocation, setUserLocation] = useState(null);

  const handleClear = () => {
    setPoints([]); // Clears the drawn polygon points
    setUserLocation(null); // Also clears the user location marker
  };

  const handleAnalyze = () => {
    if (points.length < 3) {
      alert("Please select at least 3 points to form an area.");
      return;
    }
    console.log("Analyzing these coordinates:", points);
    // This is where you will eventually send the points to your backend
  };

  const handleGoToLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = [latitude, longitude];

          // Set the coordinates for the map to fly to
          setFlyToCoords(newCoords);
          // 2. Set the coordinates for the new marker to be displayed
          setUserLocation(newCoords);
        },
        (error) => {
          console.error("Error getting user location:", error);
          alert(
            "Could not get your location. Please enable location services in your browser settings."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.controls}>
        <h2>Shadow Analysis</h2>
        <p>Click on the map to define an area by placing at least 3 points.</p>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleGoToLocation}
            className={styles.locationButton}
          >
            Go to My Location
          </button>
          <button onClick={handleAnalyze} className={styles.analyzeButton}>
            Analyze Area
          </button>
          <button onClick={handleClear} className={styles.clearButton}>
            Clear Selection
          </button>
        </div>
      </div>

      <div className={styles.mapContainer}>
        {/* 3. Pass the new userLocation state down to the Map component */}
        <Map
          points={points}
          onPointsChange={setPoints}
          flyToCoords={flyToCoords}
          userLocation={userLocation}
        />
      </div>
    </main>
  );
}

export default ShadowDetect;
