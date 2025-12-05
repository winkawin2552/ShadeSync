import React, { useState } from "react";
import Map_nav from "../components/Map_Nav";
import styles from "./navigate.module.css";
import glass from "../assets/glass.png";
import start from "../assets/start.png";

function Navigate() {
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // ⭐ เพิ่ม state ใหม่
  const [showDropdown, setShowDropdown] = useState(false);

  const [results, setResults] = useState([
    { id: 1, time: "19 min", dis: "(3km)", shade: "35%" },
    { id: 2, time: "15 min", dis: "(2.5km)", shade: "10%" },
    { id: 3, time: "20 min", dis: "(3.2km)", shade: "30%" },
  ]);

  // CLEAR USER + DEST
  const handleClear = () => {
    setUserLocation(null);
    setDestination(null);
  };

  // GET CURRENT USER LOCATION
  const handleGoToLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = [latitude, longitude];
          setFlyToCoords(coords);
        },
        () => alert("Enable location services first!")
      );
    }
  };

  // CONFIRM
const handleConfirm = () => {
  if (!destination) return alert("Please select a destination first.");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const userCoords = [latitude, longitude];

      setUserLocation(userCoords);     // ⭐ ให้ map ใช้ได้จริง
      setConfirmTrigger(Date.now());   // ⭐ ยิงสัญญาณไป Map_nav ให้ fetchRoute

      alert(
        `Confirmed!\nUser: ${userCoords}\nDestination: ${destination}`
      );
    },
    () => alert("Enable location services")
  );
};


  // SEARCH (FREE) — Nominatim API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsSearching(true);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchValue
    )}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      setSearchResults(
        data.map((place) => ({
          id: place.place_id,
          name: place.display_name,
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
        }))
      );

      setShowDropdown(true); // ⭐ แสดง dropdown หลังค้นหา
    } catch (err) {
      console.log(err);
    }

    setIsSearching(false);
  };

  // SELECT PLACE
  const handleSelectPlace = (place) => {
    setDestination([place.lat, place.lon]);
    setFlyToCoords([place.lat, place.lon]);
    setSearchValue(place.name);
    setSearchResults([]);
    setShowDropdown(false); // ⭐ ปิด dropdown หลังเลือก
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#ffffffff",
        paddingBottom: "80px",
      }}
    >
      <h1
        style={{
          color: "#595959",
          textAlign: "center",
          fontFamily: "agdasima bold, monospace",
        }}
      >
        Shade Navigation
      </h1>

      <h5 style={{ color: "#595959", textAlign: "center", fontWeight: "500" }}>
        Go everywhere with shade
      </h5>

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search the location"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowDropdown(true)} // ⭐ เปิด dropdown เมื่อ focus
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // ⭐ ปิดตอน blur (ดีเลย์เพื่อกันกดไม่ติด)
        />
        <img src={glass} className={styles.glass} alt="search" />
      </form>

      {/* SEARCH RESULT DROPDOWN */}
      {showDropdown && searchResults.length > 0 && (
        <div className={styles.searchDropdown}>
          {searchResults.map((p) => (
            <div
              key={p.id}
              className={styles.searchItem}
              onClick={() => handleSelectPlace(p)}
            >
              {p.name}
            </div>
          ))}
        </div>
      )}

      {/* MAP + BUTTONS */}
      <div className={styles.mapContainer}>
        <Map_nav
  userLocation={userLocation}
  destination={destination}
  setDestination={setDestination}
  flyToCoords={flyToCoords}
  onGoToLocation={handleGoToLocation}
  onClick={handleConfirm}   // ⭐ ส่ง trigger ให้ map
/>


        <div style={{ display: "flex", gap: "10px" }}>
          <button className={styles.confirm} onClick={handleConfirm}>
            <h4>Confirm Location</h4>
          </button>

          <button onClick={handleClear} className={styles.clearButton}>
            X
          </button>
        </div>
      </div>

      {/* RESULT SECTION */}
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
              <h2
                style={{
                  paddingLeft: "17px",
                  fontFamily: "agdasima bold, monospace",
                  color: "#2BBB4A",
                }}
              >
                {item.time}
              </h2>
              <h2
                style={{
                  paddingLeft: "10px",
                  fontFamily: "agdasima bold, monospace",
                  color: "#000",
                }}
              >
                {item.dis}
              </h2>
            </div>

            <div className={styles.shadeContainer}>
              <h2
                style={{
                  paddingLeft: "17px",
                  fontFamily: "agdasima bold, monospace",
                  color: "#2BBB4A",
                }}
              >
                Shade
              </h2>
              <h2
                style={{
                  paddingLeft: "10px",
                  fontFamily: "agdasima bold, monospace",
                  color: "#000",
                }}
              >
                {item.shade}
              </h2>
            </div>

            <button className={styles.delete}>X</button>

            <button className={styles.startbut}>
              <img src={start} className={styles.start} alt="start icon" />
              <span
                style={{
                  fontFamily: "agdasima bold, monospace",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Start
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navigate;