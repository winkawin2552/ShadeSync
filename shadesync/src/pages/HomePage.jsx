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
          onGoToLocation={handleGoToLocation}
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
      <h1 style = {{color: "#595959" , fontFamily: 'agdasima bold,monospace',fontSize:"1.5rem" ,paddingLeft: "20px",paddingTop: "30px"}}>Coverage area analysis</h1>
      <div className={styles.box1and2container}>
        <div className={styles.box1}>
          <h1 style={{width: 174, height: 19, left: 10, top: 588, position: 'absolute', textAlign: 'center', color: '#0077FF', fontSize: 12, fontWeight: '500', letterSpacing: 1.20, wordWrap: 'break-word'}}>Total coverage area</h1>
          <h1 style={{width: 96, height: 19, left: 30, top: 555, position: 'absolute', textAlign: 'center', color: '#0077FF', fontSize: 24, fontWeight: '700', letterSpacing: 2.40, wordWrap: 'break-word'}}>3.2 Km</h1>
          <h1 style={{width: 14, height: 19, left: 120, top: 550, position: 'absolute', textAlign: 'center', color: '#0077FF', fontSize: 16, fontWeight: '700', letterSpacing: 1.60, wordWrap: 'break-word'}}>2</h1>
        </div>
        <div className={styles.box2}>
          <div style={{width: 174, height: 19, left: 180, top: 596, position: 'absolute', textAlign: 'center', color: '#D16506', fontSize: 12, fontWeight: '500', letterSpacing: 1.20, wordWrap: 'break-word'}}>Shadow area</div>
          <div style={{width: 60, height: 19, left: 225, top: 571, position: 'absolute', textAlign: 'center', color: '#D16506', fontSize: 24, fontWeight: '700', letterSpacing: 2.40, wordWrap: 'break-word'}}>40%</div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
