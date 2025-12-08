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
  const [showDropdown, setShowDropdown] = useState(false);

  // API states
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Routes from backend
  const [results, setResults] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null); // ✅ เส้นทางที่ Start

  /* ===============================
     Clear
  =============================== */
  const handleClear = () => {
    setUserLocation(null);
    setDestination(null);
    setResults([]);
    setFlyToCoords(null);
    setSearchValue("");
    setActiveRoute(null); // ✅ เคลียร์เส้นทางที่เลือก
  };

  /* ===============================
     User Location
  =============================== */
  const handleGoToLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser doesn't support geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = [latitude, longitude];
        setFlyToCoords(coords);
        setUserLocation(coords);
      },
      () => alert("Enable location service")
    );
  };

  /* ===============================
     Confirm → Call Backend
  =============================== */
  const handleConfirm = () => {
    if (!destination) {
      alert("Please select destination first");
      return;
    }

    setResults([]);
    setApiError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const userCoords = [latitude, longitude];
        setUserLocation(userCoords);

        try {
          setLoadingRoute(true);

          const res = await fetch("http://127.0.0.1:8000/route/shadow-score", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              start: userCoords,
              end: destination,
            }),
          });

          const data = await res.json();

          if (data.routes) {
            const formatted = data.routes.map((r, index) => ({
              id: index + 1,
              time: r.duration_text,
              dis: `${(r.distance_m / 1000).toFixed(1)} km`,
              shade: `${r.shadow_score}%`,
              polyline: r.polyline,
            }));

            setResults(formatted);
            setActiveRoute(null); // ✅ เคลียร์เส้นทางเดิมเมื่อ Confirm ใหม่
          }
        } catch (err) {
          console.error(err);
          setApiError("Failed to fetch routes from backend");
        } finally {
          setLoadingRoute(false);
        }
      },
      () => alert("Enable location service")
    );
  };

  /* ===============================
     Search - Nominatim
  =============================== */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsSearching(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchValue
        )}`
      );

      const data = await res.json();

      setSearchResults(
        data.map((p) => ({
          id: p.place_id,
          name: p.display_name,
          lat: parseFloat(p.lat),
          lon: parseFloat(p.lon),
        }))
      );

      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  /* ===============================
     Select Location
  =============================== */
  const handleSelectPlace = (place) => {
    setDestination([place.lat, place.lon]);
    setFlyToCoords([place.lat, place.lon]);
    setSearchValue(place.name);
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#fff",
        paddingBottom: "80px",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#595959" }}>
        Shade Navigation
      </h1>

      <h5 style={{ textAlign: "center", color: "#595959" }}>
        Go everywhere with shade
      </h5>

      {/* Search */}
      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search the location"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        <img src={glass} className={styles.glass} alt="search" />
      </form>

      {/* Dropdown */}
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

      {/* Map */}
      <div className={styles.mapContainer}>
        <Map_nav
          userLocation={userLocation}
          destination={destination}
          setDestination={setDestination}
          flyToCoords={flyToCoords}
          onGoToLocation={handleGoToLocation}
          routes={activeRoute ? [activeRoute] : results.map((r) => r.polyline)}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button className={styles.confirm} onClick={handleConfirm}>
            Confirm Location
          </button>
          <button onClick={handleClear} className={styles.clearButton}>
            X
          </button>
        </div>
      </div>

      {/* Results */}
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

      {loadingRoute && (
        <p
          style={{
            paddingLeft: "17px",
            fontFamily: "agdasima bold, monospace",
            color: "#398ceb",
          }}
        >
          Loading routes...
        </p>
      )}
      {apiError && <p style={{ paddingLeft: "16px", color: "red" }}>{apiError}</p>}

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
              <h2 style={{ paddingLeft: "17px" }}>{item.dis}</h2>
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
              <h2 style={{ paddingLeft: "17px" }}>{item.shade}</h2>
            </div>


            {/* ปุ่ม Start */}
            <button
              className={styles.startbut}
              onClick={() => setActiveRoute(item.polyline)}
            >
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
