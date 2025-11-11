import React, { useState } from "react";
import Map from "../components/Map";
import styles from "./homePage.module.css";

function HomePage() {
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
    <main style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      <div className={styles.circle}>
        <h5 style={{ color: "#595959", paddingLeft: "38px",marginTop: "4.5px" }}>AnalyzingReady</h5>
      </div>
      
      <div className={styles.mapContainer}>
        <Map
          points={points}
          onPointsChange={setPoints}
          flyToCoords={flyToCoords}
          userLocation={userLocation}
        />
      </div>
      <div>
        <button onClick={handleAnalyze} className={styles.analyzeButton}>
        Analyze Area
        </button>
        <button onClick={handleClear} className={styles.clearButton}>
        Clear All
        </button>
      </div>
    </main>
  );
}

export default HomePage;
