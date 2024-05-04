import { Box, useMediaQuery } from "@mui/material";
import MeterListing from "./MeterListing";
import AddMeter from "./AddMeter";
import { useState } from "react";

const EnergyAndWater = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const [activeTab, setActiveTab] = useState("meterListing");

  const handleAddButtonClick = () => {
    setActiveTab("addMeter");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "meterListing":
        return <MeterListing onAddButtonClick={handleAddButtonClick} />;
      case "addMeter":
        return <AddMeter />;
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
