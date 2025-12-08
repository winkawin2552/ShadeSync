import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapEvents from "./MapEvents";
import styles from "./map.module.css";
import locationIcon from "../assets/location.png";

// --------------------
// Fly to location
// --------------------
function ChangeView({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 17);
    }
  }, [center, zoom, map]);

  return null;
}

// --------------------
// Location button
// --------------------
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

// --------------------
// Draw multiple polylines from API
// --------------------
function RoutesFromApi({ routes }) {
  const map = useMap();

  useEffect(() => {
    // ลบ polyline เก่า
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    if (!routes || routes.length === 0) return;

    const bounds = L.latLngBounds([]);

    routes.forEach((routeObj, index) => {
      const { polyline, color } = routeObj;
      if (polyline && polyline.length > 0) {
        const polylineLayer = L.polyline(polyline, {
          color: color || "#FD4747",
          weight: 5,
        }).addTo(map);

        bounds.extend(polylineLayer.getBounds());
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds);
    }
  }, [routes, map]);

  return null;
}

// --------------------
// Main Map Component
// --------------------
function Map_nav({
  userLocation,
  destination,
  setDestination,
  flyToCoords,
  onGoToLocation,
  routes, // array ของ object { polyline, color }
}) {
  const defaultCenter = [13.7563, 100.5018];

  const handleMapClick = (latlng) => {
    setDestination([latlng.lat, latlng.lng]);
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      className={styles.map}
      zoomControl={false}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

      <ZoomControl position="topleft" />

      <LocationButton onGoToLocation={onGoToLocation} />

      <ChangeView center={flyToCoords} />

      <MapEvents onMapClick={handleMapClick} />

      {/* Marker ปลายทาง */}
      {destination && <Marker position={destination} />}

      {/* วาดเส้นจาก Backend */}
      <RoutesFromApi routes={routes} />
    </MapContainer>
  );
}

export default Map_nav;
