import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import '../App.css';

const center = [20.5937, 78.9629]; // Default to India

//This custom component updates the map's center when coords (latitude & longitude) change.
const ChangeView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, 13);
  return null;
};

const Map = () => {
  const [position, setPosition] = useState(center);
  const [search, setSearch] = useState("");

  //Uses the Nominatim API (OpenStreetMap's geolocation service) to search for locations based on user input.
  const searchLocation = async () => {
    if (!search.trim()) {
      alert("Please enter a valid location!");
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Location not found!");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  return (
    <div>
      {/* Title */}
      <h1>🌍 Simple Map</h1>
      {/* Search Input & Button */}
      <div className="search">
        <input
          type="text"
          placeholder="Search for a location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchLocation()} // Press Enter to Search
          className="search-bar"
        />
        <button
          onClick={searchLocation}
          className="search-btn"
        >
          🔍 Search
        </button>
      </div>

      {/* Map Container */}
      <div className="map">
        <MapContainer center={position} zoom={13} className="map-container">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeView coords={position} />
          <Marker position={position} />
        </MapContainer>
      </div>
      </div>
  );
};

export default Map;
