import React, { useState } from "react";
import Map from "../components/Map";
import styles from "./navigate.module.css";
import glass from "../assets/glass.png";
import start from "../assets/start.png";

function Navigate() {
  const [points, setPoints] = useState([]);
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [results, setResults] = useState([
    { id: 1, time: "19 min",dis: "(3km)", shade: "35%" },
    { id: 2, time: "15 min",dis: "(2.5km)", shade: "10%" },
    { id: 3, time: "20 min",dis: "(3.2km)", shade: "30%" },
  ]);

  const handleClear = () => {
    setPoints([]);
    setUserLocation(null);
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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchValue);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#ffffffff" ,paddingBottom:"80px"}}>
      <h1 style={{ color: "#595959", textAlign: "center", fontFamily: "agdasima bold, monospace" }}>
        Shade Navigation
      </h1>
      <h5 style={{ color: "#595959", textAlign: "center", fontWeight: "500" }}>
        Go everywhere with shade
      </h5>

      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search the location"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <img src={glass} className={styles.glass} />
      </form>

      <div className={styles.mapContainer}>
        <Map
          points={points}
          onPointsChange={setPoints}
          flyToCoords={flyToCoords}
          userLocation={userLocation}
          onGoToLocation={handleGoToLocation}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button className={styles.confirm}>
            <h4>Confirm Location</h4>
          </button>

          <button onClick={handleClear} className={styles.clearButton}>
            X
          </button>
        </div>
      </div>

      <h1
        style={{
          paddingTop: "100px",
          paddingLeft: "17px",
          fontFamily: "agdasima bold, monospace",
          fontSize: "2rem",
          fontWeight: 600,
          color: "#595959",
          letterSpacing: "1px",
        }}
      >
        Result
      </h1>
      <div className={styles.resultcontainer}>
        {results.map((item) => (
          <div key={item.id} className={styles.result1}>
            <div className={styles.timeContainer}>
              <h2 style={{paddingLeft: "17px",fontFamily: "agdasima bold, monospace",color:'#2BBB4A'}}>{item.time}</h2>
              <h2 style={{paddingLeft: "10px",fontFamily: "agdasima bold, monospace",color:'#000000ff'}}>{item.dis}</h2>
              
            </div>
            <div className={styles.shadeContainer}>
              <h2 style={{paddingLeft: "17px",fontFamily: "agdasima bold, monospace",color:'#2BBB4A'}}>Shade</h2>
              <h2 style={{paddingLeft: "10px",fontFamily: "agdasima bold, monospace",color:'#000000ff'}}>{item.shade}</h2>
            </div>
            <button className={styles.delete}>
                X
            </button>
            <button class={styles.startbut}>
              <img src={start} className={styles.start}/>
              <span style={{fontFamily: "agdasima bold, monospace",color:'#ffffffff',fontWeight:700}}>Start</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navigate;
