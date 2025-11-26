import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const DisplayNearByPharmacy = () => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [mapLocation, setMapLocation] = useState({ lat: 0, lng: 0 });
  const [selectedPlace, setSelectedPlace] = useState(null); // For InfoWindow

    
     useEffect(() => {
       navigator.geolocation.getCurrentPosition(
         (position) => {
           const { latitude, longitude } = position.coords;
           setMapLocation({ lat: latitude, lng: longitude });
           fetchNearbyPlaces(latitude, longitude);
         },
         (error) => {
           console.error("Error getting location", error);
           toast.error("Please allow location access to find nearby places.");
         }
       );
     }, []);
      const fetchNearbyPlaces = async (lat, lng) => {
        try {
          const { data } = await axios.get(
            "https://medifypro-backend.onrender.com/api/user/nearby-places",
            { params: { latitude: lat, longitude: lng } }
          );
          setNearbyPlaces(data.places);
        } catch (error) {
          console.error("Error fetching nearby places:", error);
          toast.error("Could not fetch nearby places.");
        }
      };
    
    return (
      <div className="p-4 mt-14">
        <h2 className="text-xl font-semibold mb-4">Nearby Locations</h2>
        <LoadScript googleMapsApiKey="">
          <GoogleMap
            mapContainerStyle={{ height: "400px", width: "100%" }}
            center={mapLocation}
            zoom={12}
          >
            {/* Marker for Current Location */}
            <Marker position={mapLocation} title="Your Location" />

            {/* Markers for Nearby Places */}
            {nearbyPlaces.map((place, index) => (
              <Marker
                key={index}
                position={{
                  lat: place.geometry.location.lat,
                  lng: place.geometry.location.lng,
                }}
                icon={{
                  url: place.icon, // Use the icon from the API response
                  scaledSize: new window.google.maps.Size(30, 30), // Scale the icon
                }}
                title={place.name}
                onClick={() => setSelectedPlace(place)} // Show InfoWindow on click
              />
            ))}
            {/* InfoWindow for Selected Place */}
            {selectedPlace && (
              <InfoWindow
                position={{
                  lat: selectedPlace.geometry.location.lat,
                  lng: selectedPlace.geometry.location.lng,
                }}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div>
                  <h3 className="font-semibold">{selectedPlace.name}</h3>
                  <p>{selectedPlace.vicinity}</p>
                  <p>Rating: {selectedPlace.rating || "N/A"}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    );
};

export default DisplayNearByPharmacy;
