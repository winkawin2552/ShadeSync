import React, { useState } from "react";
import Map from "../components/Map";
import styles from "./homePage.module.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function HomePage() {
  const [points, setPoints] = useState([]);
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const handleClear = () => {
    setPoints([]);
    setUserLocation(null);
  };

  const handleAnalyze = () => {
    if (points.length < 3) {
      alert("Please select at least 3 points to form an area.");
      return;
    }
    console.log("Analyzing these coordinates:", points);
  };

  const handleGoToLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = [latitude, longitude];
          setFlyToCoords(newCoords);
          setUserLocation(newCoords);
        },
        (error) => {
          console.error("Error getting user location:", error);
          alert("Could not get your location. Enable location services.");
        }
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  // Chart data
  const data = {
    labels: ["Total Area", "Shade Area"],
    datasets: [
      {
        label: "Area %",
        data: [100, 40],
        backgroundColor: ["#0077FF", "#D16506"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#ffffffff" }}>
      <div className={styles.circle}>
        <h5 style={{ color: "#595959", paddingLeft: "38px", marginTop: "4.5px" }}>AnalyzingReady</h5>
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

      <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
        <button onClick={handleAnalyze} className={styles.analyzeButton}>Analyze Area</button>
        <button onClick={handleClear} className={styles.clearButton}>Clear All</button>
      </div>

      <h1 style={{ color: "#595959", fontFamily: 'agdasima bold, monospace', fontSize: "1.5rem", paddingLeft: "20px", paddingTop: "20px" }}>
        Coverage area analysis
      </h1>

      <div className={styles.box1and2container}>
        <div className={styles.box1}>
          <h1 style={{width: 14, height: 19, position: 'absolute',paddingLeft: '110px', fontSize: 16, fontWeight: '700', letterSpacing: 1.60}}>2</h1>
          <h1 style={{width: 96, height: 19, position: 'static',paddingLeft: '20px', fontSize: 24, fontWeight: '700', letterSpacing: 2.40}}>3.2 Km</h1>
          <h1 style={{width: 174, height: 19, position: 'static', fontSize: 12, fontWeight: '500', letterSpacing: 1.20}}>Total coverage area</h1>
          </div>
        <div className={styles.box2}>
          <h1 style={{width: 60, height: 19,paddingLeft: '20px' , textAlign: 'center', fontSize: 24, fontWeight: '700', letterSpacing: 2.40, wordWrap: 'break-word'}}>40%</h1>  
          <h1 style={{width: 174, height: 19,paddingLeft: '23px', textAlign: 'left', fontSize: 12, fontWeight: '500', letterSpacing: 1.20, wordWrap: 'break-word'}}>Shadow area</h1>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <Bar data={data} options={options} />
      </div>
      <div className={styles.happyContainer}>
        <div style={{width: 400, height: 32, top: 530, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 24, fontWeight: '700', lineHeight: 32, wordWrap: 'break-word'}}>Shadow Happiness Index</div>
        <div style={{width: 400, height: 40, top: 940, position: 'absolute', textAlign: 'center', color: '#DCFCE7', fontSize: 14, fontWeight: '400', wordWrap: 'break-word'}}>Discover livability through shade, temperature, and green spaces</div>
        <div style={{width: 358, height: 88, left: 17, top: 1000, position: 'absolute', background: 'rgba(255, 255, 255, 0.20)', borderRadius: 12}}>
          <div style={{width: 66, height: 36, left: 150, top: 18, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 30, fontWeight: '700', wordWrap: 'break-word'}}>87.2</div>
          <div style={{width: 124, height: 20, left: 120, top: 55, position: 'absolute', textAlign: 'center', color: '#DCFCE7', fontSize: 14, fontWeight: '400', wordWrap: 'break-word'}}>Current Area Score</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
