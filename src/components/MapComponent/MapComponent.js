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
  };

  const markerOptions = {
    position: [-67.83, 47.16], // longitude, latitude
    text: "My Marker",
  };

  return (
    <AzureMapsProvider>
      {/* <Grid md={10}> */}
        <div style={{ height: "500px", width: "80%" }}>
          <AzureMap options={option}>
            <AzureMapHtmlMarker options={markerOptions} />
          </AzureMap>
        </div>
      {/* </Grid> */}
    </AzureMapsProvider>
  );
};

export default MapComponent;
