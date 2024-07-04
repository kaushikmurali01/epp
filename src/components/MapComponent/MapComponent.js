import React from "react";
import {
  AzureMapsProvider,
  AzureMap,
  AzureMapHtmlMarker,
} from "react-azure-maps";
import { AuthenticationType } from "azure-maps-control";
import { Grid } from "@mui/material";

const MapComponent = () => {
  const option = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: process.env.REACT_APP_AZURE_MAPS_SECRET_KEY,
    },
    center: [-67.83, 47.16], // longitude, latitude
    zoom: 12,
    showLogo: false
  };

  const markerOptions = {
    position: [-67.83, 47.16], // longitude, latitude
    text: "My Marker",
  };

  return (
    <AzureMapsProvider>
      {/* <Grid item xs={12} md={12}> */}
        <div style={{ height: "360px", position: "relative", width: '80%', overflow: "hidden"}}>
          <AzureMap options={option}>
            <AzureMapHtmlMarker options={markerOptions} />
          </AzureMap>
        </div>
      {/* </Grid> */}
    </AzureMapsProvider>
  );
};

export default MapComponent;
