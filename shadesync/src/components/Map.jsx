import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMap,
} from "react-leaflet";
import MapEvents from "./MapEvents";
import styles from "./map.module.css";

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 15);
    }
  }, [center, zoom, map]);
  return null;
}

function Map({ points, onPointsChange, flyToCoords }) {
  const initialPosition = [13.7563, 100.5018];

  const handleMapClick = (latlng) => {
    const newPoint = [latlng.lat, latlng.lng];
    onPointsChange([...points, newPoint]);
  };

  return (
    <MapContainer center={initialPosition} zoom={13} className={styles.map}>
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

      {/* This component will handle flying to the user's location */}
      <ChangeView center={flyToCoords} />

      <MapEvents onMapClick={handleMapClick} />

      {points.map((pos, idx) => (
        <Marker key={idx} position={pos} />
      ))}
      {points.length > 1 && <Polygon positions={points} color="purple" />}
    </MapContainer>
  );
}

export default Map;
