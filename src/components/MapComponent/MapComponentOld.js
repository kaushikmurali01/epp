import React, { useEffect, useRef } from 'react';
import {
  AzureMapsProvider,
  AzureMap,
  AzureMapHtmlMarker,
} from "react-azure-maps";
import { AuthenticationType } from "azure-maps-control";
import { Grid } from "@mui/material";
import "./map.css"

const MapComponent = (props) => {

  const {facilityData, weatherStations} = props
  console.log(weatherStations)
  const mapRef = useRef(null);

  const option = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: process.env.REACT_APP_AZURE_MAPS_SECRET_KEY,
    },
    center: [parseFloat(facilityData?.longitude) ,parseFloat(facilityData?.latitude)], // longitude, latitude
    zoom: 12,
    showLogo: false,
  };

  const markerOptions = {
    position: [parseFloat(facilityData?.longitude) ,parseFloat(facilityData?.latitude)], // longitude, latitude
    htmlContent: `
      <div class="custom-marker">
        <img src="${facilityData?.display_pic_url}" alt="${facilityData?.display_pic_url}" />
        <span>${facilityData?.display_pic_url}</span>
      </div>
    `,
    pixelOffset: [0, -20],
    color: "green"
  };

  return (
    <AzureMapsProvider>
        <div style={{ height: "360px", position: "relative", width: '80%', overflow: "hidden", borderRadius: '0.5rem'}}>
          {facilityData?.latitude ? <AzureMap options={option} ref={mapRef}>
            <AzureMapHtmlMarker options={markerOptions} />
          </AzureMap> : null}
        </div>
    </AzureMapsProvider>
  );
};

export default MapComponent;
