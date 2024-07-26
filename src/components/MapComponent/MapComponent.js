import React, { useEffect, useRef, useState } from 'react';
import {
  AzureMapsProvider,
  AzureMap,
  AzureMapHtmlMarker,
} from "react-azure-maps";
import { AuthenticationType } from "azure-maps-control";
import { Grid } from "@mui/material";
import "./map.css"

const CustomHtmlMarker = ({ longitude, latitude, imageUrl, name, isWeatherStation }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const markerContent = isWeatherStation ? (
    <div className="custom-marker weather-station-marker">
      <span>{name}</span>
    </div>
  ) : (
    <div className="custom-marker facility-marker">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={name} 
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      )}
      {(!imageUrl || !imageLoaded) && (
        <div className="image-placeholder">{name.charAt(0)}</div>
      )}
      <span>{name}</span>
    </div>
  );

  return (
    <AzureMapHtmlMarker
      options={{
        position: [parseFloat(longitude), parseFloat(latitude)],
        htmlContent: markerContent,
        pixelOffset: [0, -20],
      }}
    />
  );
};

const MapComponent = (props) => {
  const { facilityData, weatherStations } = props;
  const mapRef = useRef(null);

  const option = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: process.env.REACT_APP_AZURE_MAPS_SECRET_KEY,
    },
    center: [parseFloat(facilityData?.longitude), parseFloat(facilityData?.latitude)],
    zoom: 5,
    showLogo: false,
  };

  return (
    <AzureMapsProvider>
      <div style={{ height: "360px", position: "relative", width: '80%', overflow: "hidden", borderRadius: '0.5rem'}}>
        {facilityData?.latitude && (
          <AzureMap options={option} ref={mapRef}>
            <CustomHtmlMarker
              longitude={facilityData.longitude}
              latitude={facilityData.latitude}
              imageUrl={facilityData.display_pic_url}
              name={facilityData.name || 'Facility'}
              isWeatherStation={false}
            />
            {weatherStations.map((station) => (
              <CustomHtmlMarker
                key={station.station_id}
                longitude={station.longitude}
                latitude={station.latitude}
                name={station.station_name}
                isWeatherStation={true}
              />
            ))}
          </AzureMap>
        )}
      </div>
    </AzureMapsProvider>
  );
};

export default MapComponent;