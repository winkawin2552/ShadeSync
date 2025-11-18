import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
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

function LocationButton({ onGoToLocation }) {
  const map = useMap();

  useEffect(() => {
    const button = L.control({ position: "topleft" });
    button.onAdd = function (map) {
      const div = L.DomUtil.create("div", styles.locationControl);
      div.innerHTML = `
        <button class="${styles.locationBtn}" title="Go to my location">
          ⨁
        </button>
      `;
      div.onclick = (e) => {
        e.stopPropagation();
        onGoToLocation();
      };
      return div;
    };
    button.addTo(map);

    return () => button.remove();
  }, [map, onGoToLocation]);

  return null;
}

function Map({ points, onPointsChange, flyToCoords, userLocation, onGoToLocation }) {
  const initialPosition = [13.7563, 100.5018];

  const handleMapClick = (latlng) => {
    const newPoint = [latlng.lat, latlng.lng];
    onPointsChange([...points, newPoint]);
  };

  return (
    <MapContainer center={initialPosition} zoom={13} className={styles.map} zoomControl={false}>
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

      <ZoomControl position="topleft" />
      {onGoToLocation && <LocationButton onGoToLocation={onGoToLocation} />}

      <ChangeView center={flyToCoords} />

      <MapEvents onMapClick={handleMapClick} />

      {points.map((pos, idx) => (
        <Marker key={idx} position={pos} />
      ))}

      {userLocation && (
        <Marker position={userLocation} title="Your Location" />
      )}

      {points.length > 1 && <Polygon positions={points} color="purple" />}
    </MapContainer>
  );
}

export default Map;
