import React from 'react';
import { AzureMapsProvider, AzureMap, AzureMapHtmlMarker } from 'react-azure-maps';
import { AuthenticationType } from 'azure-maps-control';

const MapComponent = () => {
  const option = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: process.env.REACT_APP_AZURE_MAPS_SECRET_KEY
    },
    center: [-122.33, 47.6], // longitude, latitude
    zoom: 12
  };

  const markerOptions = {
    position: [-122.33, 47.6], // longitude, latitude
    text: "My Marker"
  };

  return (
    <AzureMapsProvider>
      <div style={{ height: "500px" }}>
        <AzureMap options={option}>
          <AzureMapHtmlMarker options={markerOptions} />
          </AzureMap>
      </div>
    </AzureMapsProvider>
  );
};

export default MapComponent;