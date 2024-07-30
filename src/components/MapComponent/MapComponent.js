import React, { useMemo } from "react";
import {
  AzureMapsProvider,
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapLayerProvider,
  AzureMapFeature,
  AzureMapPopup,
} from "react-azure-maps";
import { AuthenticationType, data } from "azure-maps-control";
import "./map.css";

const MapComponent = (props) => {
  const { facilityData, weatherStations } = props;

  const [popupOptions, setPopupOptions] = React.useState({});
  const [popupProperties, setPopupProperties] = React.useState({});

  const option = useMemo(
    () => ({
      authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: process.env.REACT_APP_AZURE_MAPS_SECRET_KEY,
      },
      center: [
        parseFloat(facilityData?.longitude || 0),
        parseFloat(facilityData?.latitude || 0),
      ],
      zoom: 5,
      showLogo: false,
    }),
    [facilityData]
  );

  const handleMarkerClick = (e) => {
    if (e.shapes && e.shapes.length > 0) {
      const properties = e.shapes[0].data.properties;
      setPopupOptions({
        position: e.position,
        pixelOffset: [0, -30],
      });
      setPopupProperties(properties);
    }
  };

  if (!facilityData) {
    console.error("Facility data is missing");
    return <div>Error: Facility data is missing</div>;
  }

  if (!Array.isArray(weatherStations)) {
    console.error("Weather stations data is not an array", weatherStations);
    return <div>Error: Invalid weather stations data</div>;
  }

  return (
    <AzureMapsProvider>
      <div style={{ height: "360px", width: "80%", borderRadius: "0.5rem" }}>
        <AzureMap options={option}>
          <AzureMapDataSourceProvider id="markersSource">
            <AzureMapLayerProvider
              id="facilityLayer"
              options={{
                iconOptions: {
                  color: "green",
                },
                filter: ["==", ["get", "type"], "facility"],
              }}
              events={{
                click: handleMarkerClick,
              }}
              type="SymbolLayer"
            />
            <AzureMapLayerProvider
              id="weatherStationLayer"
              options={{
                iconOptions: {
                  image: "pin-blue",
                },
                filter: ["==", ["get", "type"], "weatherStation"],
              }}
              events={{
                click: handleMarkerClick,
              }}
              type="SymbolLayer"
            />
            <AzureMapFeature
              id="facility"
              type="Point"
              coordinate={[
                parseFloat(facilityData.longitude),
                parseFloat(facilityData.latitude),
              ]}
              properties={{
                type: "facility",
                name: facilityData.facility_name,
                display_pic_url: facilityData.display_pic_url,
              }}
            />
            {weatherStations.map((station) => (
              <AzureMapFeature
                key={station.station_id}
                type="Point"
                coordinate={[
                  parseFloat(station.longitude),
                  parseFloat(station.latitude),
                ]}
                properties={{
                  type: "weatherStation",
                  name: station.station_name,
                }}
              />
            ))}
          </AzureMapDataSourceProvider>
          <AzureMapPopup
            isVisible={popupProperties.name != null}
            options={popupOptions}
            popupContent={
              <div style={{ padding: "8px 16px" }}>
                <h3>{popupProperties.name}</h3>
                <p>
                  {popupProperties.type === "facility"
                    ? "Facility"
                    : "Weather Station"}
                </p>
                {popupProperties.type === "facility" &&
                  popupProperties.display_pic_url && (
                    <img
                      src={popupProperties.display_pic_url}
                      alt={popupProperties.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  )}
              </div>
            }
          />
        </AzureMap>
      </div>
    </AzureMapsProvider>
  );
};

export default MapComponent;
