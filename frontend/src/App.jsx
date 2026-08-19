import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useState, useEffect } from 'react';

let DefaultIcon = L.icon ({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 42]
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = 'http://localhost:3000';

function ClickHandler({onMapClick}) {
  useMapEvents ({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

function App() {
  const [places, setPlaces] = useState([]);
  const [categoryFilter, setCategoryFileter]= useState('all');
  const [newPlacesLocation, setNewPlaceLocation] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [nearbyResults, setNearbyResults] = useState(null);
  const [radius, setRadius] = useState(5000);

  useEffect (() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = () => {
    axios.get(`${API_URL}/places`)
    .then((response) => {
      setPlaces(response.data);
    })
    .catch((error) => {
      console.log(`there was an error: ${error}`);
    });
  };

  const handleMapClick = (latlng) => {
    setNewPlaceLocation(latlng);
  };



  const handleAddPlace = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/places`, {
      name: name,
      category: category,
      lat: newPlacesLocation.lat,
      lng: newPlacesLocation.lng
    })
    .then(() => {
      fetchPlaces();
      setNewPlaceLocation(null);
      setName('');
      setCategory('')
    })
    .catch((err) => {
      console.log(`there was an error: ${err}`);
    });
  };

  const handleNearbySearch = () => {
    navigator.geolocation.getCurrentPosition (
      (position) => {
        axios.get(`${API_URL}/places/nearby`, {
      params: {lat: position.coords.latitude, lng: position.coords.longitude, radius: radius}
    })
    .then((response) => {
      setNearbyResults(response.data);
    })
    .catch((err) => {
      console.log(`there was an error: ${err}`);
    });
      }
    )
  };

  const clearNearby = () => {
    setNearbyResults(null);
  };

  const basePlaces = nearbyResults ? nearbyResults: places;
  const filterPlaces = categoryFilter === 'all'
  ? basePlaces
  : basePlaces.filter((place) => place.category === categoryFilter);

  const categories = [...new Set(places.map((place) => place.category))];

  return (
    <div>
      <div style={{position: 'absolute', zIndex: 1000, background: 'white', padding: '10px', margin: '10px', borderRadius: '5px'}}>
        <div>
          <label>Category: </label>
          <select value= {categoryFilter} onChange= {(e) =>
            setCategoryFileter(e.target.value)}>
              <option value="all">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}
                </option>
              ))}
            </select>
        </div>
        <div>
          <label>Radius (m): </label>
          <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          />
          <button onClick={handleNearbySearch}>Find Nearby</button>
          {nearbyResults && <button onClick= {clearNearby}>Clear</button>}
        </div>
      </div>

      <MapContainer center={[24.7136, 46.6753]} zoom={12} style={{height: '100vh', width: '100%'}}>
        <TileLayer

        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contribtors'
         />

        <ClickHandler onMapClick={handleMapClick} />

        {filterPlaces.map((place) =>{
          const position = place.location
          ? [place.location.coordinates[1], place.location.coordinates[0]]
          : [place.lat, place.lng];

          return (
            <Marker key={place.id} position={position}>
              <Popup>
                <strong>{place.name}</strong>
                <br />
                {place.category}
              </Popup>
            </Marker>
          );
        })}

        {newPlacesLocation && (
          <Marker position={[newPlacesLocation.lat, newPlacesLocation.lng]}>
            <Popup>
              <form onSubmit={handleAddPlace}>
                <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                 /><br />
                <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                 /><br />
                 <button type="submit">Add Place</button>
                 <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  setNewPlaceLocation(null)}}>Cancel</button>
              </form>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default  App;