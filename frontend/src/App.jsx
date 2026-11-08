import utensilsIcon from './assets/icons/utensils.svg';
import fuelIcon from './assets/icons/fuel.svg';
import mosqueIcon from './assets/icons/mosque.svg';
import coffeeIcon from './assets/icons/coffee.svg';
import storeIcon from './assets/icons/store.svg';
import shoppingcartIcon from './assets/icons/shopping-cart.svg';
import hospitalIcon from './assets/icons/hospital.svg';
import landmarkIcon from './assets/icons/landmark.svg';
import treesIcon from './assets/icons/trees.svg';
import flagIcon from './assets/icons/flag.svg';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';


import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, ZoomControl} from 'react-leaflet';
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

const categoryColors = {
  "Restaurants": "#E67E22",
  "Coffee Shops": "#8D6E63",
  "Mosques":  "#16A085",
  "Gas Stations": "#E74C3C",
  "Stores": "#9B59B6",
  "Grocery": "#27AE60",
  "Hospitals": "#D81B60",
  "Banks": "#34495E",
  "Parks": "#2E7D32",
  "park": "#2E7D32",
  "cafe": "#8D6E63",
  "restaurant": "#E67E22",
  "shop": "#9B59B6",
  "landmark": "#C0392B",
};


const categoryIconImages = {
  "Restaurants": utensilsIcon,
  "Coffee Shops": coffeeIcon,
  "Mosques": mosqueIcon,
  "Gas Stations": fuelIcon,
  "Stores": storeIcon,
  "Grocery": shoppingcartIcon,
  "Hospitals": hospitalIcon,
  "Banks": landmarkIcon,
  "Parks": treesIcon,
  "park": treesIcon,
  "cafe": coffeeIcon,
  "restaurant": utensilsIcon,
  "shop": storeIcon,
  "landmark": flagIcon,
};

function createBadgeIcon(iconUrl, color) {
  return L.divIcon({
    html: `<div style="background:${color}; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.35); border:2px solid white;">
      <img src="${iconUrl}" style="width:16px; height:16px; filter: brightness(0) invert(1);" />
      </div>`,
      className:'',
      iconSize:[32, 32],
      iconAnchor: [16, 16],
  });
}

const categoryIcons = {};
Object.keys(categoryIconImages).forEach((key) => {
  categoryIcons[key] = createBadgeIcon(categoryIconImages[key], categoryColors[key]);
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

function MapRefSetter({setMap}) {
  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
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
  const [mapInstance, setMapInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect (() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = () => {
    axios.get(`${API_URL}/places`)
    .then((response) => {
      setPlaces(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(`there was an error: ${error}`);
      setLoading(false);
    });
  };


  const handleMapClick = (latlng) => {
    setNewPlaceLocation(latlng);
  };


  const handleAddPlace = (e) => {
    e.preventDefault();
    if (!name || !category) {
      alert("Please fill in both name and category");
      return;
    }
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
    const center = mapInstance.getCenter();
    axios.get(`${API_URL}/places/nearby`, {
      params: {lat: center.lat, lng: center.lng, radius: radius}
    })
    .then((response) => {
      setNearbyResults(response.data);
    })
    .catch((err) => {
      console.log(`there was an error: ${err}`);
    });
  };

  const handleDeletePlace = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this place?");
    if (!confirmed) {
      return;
    }
    axios.delete(`${API_URL}/places/${id}`)
    .then(() => {
      fetchPlaces();
    })
    .catch((err) => {
      console.log(`there was an error: ${err}`);
    });
  };

  const handleStartEdit = (place) => {
    setEditingPlaceId(place.id);
    setEditName(place.name);
    setEditCategory(place.category);
  };

  const handleSaveEdit = (id) => {
    axios.put(`${API_URL}/places/${id}`, {
      name: editName,
      category: editCategory
    })
    .then(() => {
      fetchPlaces();
      setEditingPlaceId(null);
    })
    .catch((err) => {
      console.log(`there was an error: ${err}`);
    });
  };

  const handleCancelEdit = () => {
    setEditingPlaceId(null);
  };

  const clearNearby = () => {
    setNearbyResults(null);
  };

  const basePlaces = nearbyResults ? nearbyResults: places;
  const categoryFiltered = categoryFilter === 'all'
  ? basePlaces
  : basePlaces.filter((place) => categoryColors[place.category] === categoryColors[categoryFilter]);

  const filterPlaces = categoryFiltered.filter((place) => 
  
  place.name.toLowerCase().includes(searchQuery.toLowerCase())
);



  const categories = [...new Set(places.map((place) => place.category))];

  const filterCategories = [
    { label: "All", icon: null },
    { label: "Restaurants", icon: utensilsIcon },
    { label: "Coffee Shops", icon: coffeeIcon },
    { label: "Mosques", icon: mosqueIcon },
    { label: "Gas Stations", icon: fuelIcon },
    { label: "Stores", icon: storeIcon },
    { label: "Grocery", icon: shoppingcartIcon },
    { label: "Hospitals", icon: hospitalIcon },
    { label: "Banks", icon: landmarkIcon },
    { label: "Parks", icon: treesIcon },
  ];


  const categoryCounts = {};
  filterCategories.forEach((cat) => {
    if (cat.label === "All") return;
    categoryCounts[cat.label] = places.filter((place) => 
    categoryColors[place.category] ===
    categoryColors[cat.label]).length;
  });

  return (
    <div>
      {loading && (
        <div style={{
          position: 'absolute',
          top:0, left:0, right:0, bottom:0,
          background: 'white',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          fontSize: '18px',
          color:'#555'
        }}>
          Loading map...
        </div>
      )}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: 'calc(100% - 70px)',
        pointerEvents: 'none'
      }}>
        <div style={{display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px'}}>
          {filterCategories.map((cat) => (
            <button
            key={cat.label}
            onClick={() => setCategoryFileter(cat.label === "All" ? "all" : cat.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              background: categoryFilter === (cat.label === "All" ? "all" : cat.label) ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.6)',
              color: categoryFilter === (cat.label === "All" ? "all" : cat.label) ? '#fff' : '#333',
              pointerEvents: 'auto',
            }}
            >
              {cat.icon && <img src={cat.icon} alt={cat.label}
              style={{width: '16px', height: '16px'}} />}
              {cat.label}{cat.label !== "All" && `
              (${categoryCounts[cat.label]})`}
            </button>
          ))}
        </div>
        <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: '8px 14px',
          borderRadius: '20px',
          border: 'none',
          fontSize: '14px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.8)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          pointerEvents: 'auto',
          color: '#333',
          width: '200px'
        }}
        />
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <button onClick={handleNearbySearch}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            background: 'rgba(37,99,235,0.85)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            color: 'white',
            pointerEvents: 'auto'
          }}>
            Find Nearby
          </button>
          {nearbyResults && <button onClick={clearNearby}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            fontWidth: '500',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            background: 'rgba(60,60,60,0.85)',
            color: 'white',
            pointerEvents: 'auto'
          }}>
            Clear
            </button>}
            {nearbyResults && nearbyResults.length === 0 && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#555'
              }}>
                No places found nearby
                </div>
            )}
        </div>
      </div>

      <MapContainer center={[24.7136, 46.6753]} zoom={12} zoomControl={false} style={{height: '100vh', width: '100%'}}>
        <TileLayer
        

        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contribtors'
         />

        <ZoomControl position="bottomleft" /> 
        <MapRefSetter setMap={setMapInstance} />
        <ClickHandler onMapClick={handleMapClick} />

        <MarkerClusterGroup>

        {filterPlaces.map((place) =>{
          const position = place.location ? [place.location.coordinates[1], 
          place.location.coordinates[0]] : [place.lat, place.lng];

          return (
            <Marker key={place.id} position={position} icon =
            {categoryIcons[place.category] || DefaultIcon}>
              <Popup>
                <div style={{minWidth: '140px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px'}}>
                    <img src={categoryIconImages[place.category]} alt={place.category} style={{width: '18px', height: '18px'}} />
                    <strong style={{fontSize: '15px'}}>{place.name}</strong>

                  </div>
                  <div style={{fontSize: '13px', color: '#666', marginBottom: '8px'}}>
                    {place.category}
                  </div>
                  <div style={{display: 'flex', gap: '6px'}}>
                    <button onClick={() => handleStartEdit(place)}
                    style={{flex: 1, padding: '5px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '12px'}}>
                      Edit
                    </button>
                    <button onClick={() => handleDeletePlace(place.id)}
                     style={{flex: 1, padding: '5px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}>
                      Delete
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        </MarkerClusterGroup>

        {newPlacesLocation && (
          <Marker position={[newPlacesLocation.lat, newPlacesLocation.lng]}>
            <Popup>
              <form onSubmit={handleAddPlace} style={{display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px'}}>
                <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px'}}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                style={{padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px'}}>
                  <option value="">Select category</option>
                  {filterCategories.filter((cat) => cat.label !== "All").map((cat) => (
                    <option key={cat.label} value={cat.label}>{cat.label}
                    </option>
                  ))}
                </select>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button type="submit"
                  style={{flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: '500'}}>
                    Add Place
                  </button>
                  <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    setNewPlaceLocation(null)
                  }}
                  style={{flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', color: '#333', cursor: 'pointer'}}>
                    Cancel
                  </button>
                </div>
              </form>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      {editingPlaceId && (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 3000,
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '220px'
  }}>
    <h4 style={{margin: 0}}>Edit Place</h4>
    <input
    type="text"
    value={editName}
    onChange={(e) => setEditName(e.target.value)}
    style={{padding: '8px', borderRadius: '6px', border: '1px solid #ccc'}}
    />
    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}
    style={{padding: '8px', borderRadius: '6px', border: '1px solid #ccc'}}>
      {filterCategories.filter((cat) => cat.label !== "All").map((cat) => (
        <option key={cat.label} value={cat.label}>{cat.label}</option>
      ))}
    </select>
    <div style={{display: 'flex', gap: '8px'}}>
      <button onClick={() => handleSaveEdit(editingPlaceId)}
      style={{flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer'}}>
        Save
      </button>
      <button onClick={handleCancelEdit}
      style={{flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer'}}>
        Cancel
      </button>
    </div>
  </div>
)}
    </div>
  )
}

export default App;