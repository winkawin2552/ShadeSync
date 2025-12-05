import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import MapEvents from "./MapEvents";
import styles from "./map.module.css";
import locationIcon from "../assets/location.png";  

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 17);
  }, [center, zoom, map]);

  return null;
}

function LocationButton({ onGoToLocation }) {
  const map = useMap();

  useEffect(() => {
    const button = L.control({ position: "topleft" });

    button.onAdd = function () {
      const div = L.DomUtil.create("div", styles.locationControl);
      div.innerHTML = `
        <button class="${styles.locationBtn}" title="Go to my location">
          <img src="${locationIcon}" style="width:20px;height:20px;" />
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

function Map_nav({ userLocation, destination, setDestination, flyToCoords, onGoToLocation }) {
  const defaultCenter = [13.7563, 100.5018];

  const handleMapClick = (latlng) => {
    setDestination([latlng.lat, latlng.lng]);   // บันทึกปลายทาง
  };

  return (
    <MapContainer center={defaultCenter} zoom={13} className={styles.map} zoomControl={false}>

      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      <ZoomControl position="topleft" />

      <LocationButton onGoToLocation={onGoToLocation} />

      <ChangeView center={flyToCoords} />

      <MapEvents onMapClick={handleMapClick} />

      {/* ตำแหน่งผู้ใช้ */}
      {userLocation && (
        <Marker position={userLocation} title="Your Location" />
      )}

      {/* ปลายทาง */}
      {destination && (
        <Marker position={destination} title="Destination" />
      )}
    </MapContainer>
  );
}

export default Map_nav;
    