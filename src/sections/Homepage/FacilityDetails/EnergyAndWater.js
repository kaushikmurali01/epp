import { Box, useMediaQuery } from "@mui/material";
import MeterListing from "./MeterListing";
import AddMeter from "./AddMeter";
import { useState } from "react";
import EntriesListing from "./EntriesListing";

const EnergyAndWater = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const [activeTab, setActiveTab] = useState("meterListing");
  const [meterId, setMeterId] = useState();

  const handleAddButtonClick = () => {
    setActiveTab("addMeter");
  };

  const handleEntriesListClick = (id) => {
    console.log(id)
    setMeterId(id);
    setActiveTab("entriesListing");
  };

  const handleAddMeterSuccess = () => {
    setActiveTab("meterListing");
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "meterListing":
        return <MeterListing onAddButtonClick={handleAddButtonClick} onEntriesListClick={handleEntriesListClick} />;
      case "addMeter":
        return <AddMeter onAddMeterSuccess={handleAddMeterSuccess} />;
        case "entriesListing":
          return <EntriesListing meterId={meterId} />;
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
