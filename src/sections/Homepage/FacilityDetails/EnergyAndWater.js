import { Box, useMediaQuery } from "@mui/material";
import MeterListing from "./MeterListing";
import AddMeter from "./AddMeter";
import { useState } from "react";
import EntriesListing from "./EntriesListing";

const EnergyAndWater = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const [activeTab, setActiveTab] = useState("meterListing");
  const [meterId, setMeterId] = useState();
  const [facilityMeterDetailId, setFacilityMeterDetailId] = useState();
  const [meterId2, setMeterId2] = useState();

  const handleAddButtonClick = () => {
    setMeterId2("");
    setActiveTab("addMeter");
  };

  const handleEditButtonClick = (id) => {
    setMeterId2(id);
    setActiveTab("addMeter");
  };

  const handleEntriesListClick = (id, meter_id) => {
    setMeterId(meter_id);
    setFacilityMeterDetailId(id);
    setActiveTab("entriesListing");
  };

  const handleAddMeterSuccess = () => {
    setActiveTab("meterListing");
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "meterListing":
        return (
          <MeterListing
            onAddButtonClick={handleAddButtonClick}
            onEntriesListClick={handleEntriesListClick}
            OnEditMeterButton={handleEditButtonClick}
          />
        );
      case "addMeter":
        return (
          <AddMeter
            onAddMeterSuccess={handleAddMeterSuccess}
            meterId2={meterId2}
          />
        );
      case "entriesListing":
        return (
          <EntriesListing
            onAddMeterSuccess={handleAddMeterSuccess}
            OnEditMeterButton={handleEditButtonClick}
            facilityMeterDetailId={facilityMeterDetailId}
            meterId={meterId}
          />
        );
      default:
        return <div>Default Content</div>;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
      }}
    >
      {renderTabContent()}
    </Box>
  );
};

export default EnergyAndWater;
