import React, { useState } from "react";
import Map from "../components/Map";
import styles from "./navigate.module.css";
import glass from "../assets/glass.png";

function Navigate() {
  const [points, setPoints] = useState([]);
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchValue, setSearchValue] = useState("");

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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchValue);
    // Add search functionality here
  };

  return (
    <div style={{ width: "100%", minHeight: "1400px", backgroundColor: "#ffffffff" }}>
      <h1 style={{color: "#595959",textAlign: "center",fontFamily: "agdasima bold, monospace",}}>Shade Navigation </h1>
      <h5 style={{color: "#595959",textAlign: "center",fontWeight: "500",}}> Go everywhere with shade</h5>

      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search the location"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <img src={glass} className={styles.glass}/>
      </form>

      <div className={styles.mapContainer}>
        <Map
          points={points}
          onPointsChange={setPoints}
          flyToCoords={flyToCoords}
          userLocation={userLocation}
          onGoToLocation={handleGoToLocation}
        />
        <button className={styles.confirm}>
          <h4>Confirm Location</h4>
        </button>
      </div>
    
      <h1 style={{paddingTop: "100px",paddingLeft: "17px",fontFamily: 'agdasima bold, monospace', fontSize: "2rem", fontWeight: 600, color: "#595959", letterSpacing: "1px"}}>Result</h1>
      <div className={styles.resultcontainer}>
        <div className={styles.result1}>
          
        </div>
        <div className={styles.result1}>

        </div>
        <div className={styles.result1}>

        </div>
      </div>
    </div>
  );
}

export default Navigate;