import { Box, useMediaQuery } from "@mui/material";
import { useState } from "react";
import AdminMeterListing from "./AdminMeterListing";
import AdminAddMeter from "./AdminAddMeter";
import AdminEntriesListing from "./AdminEntriesListing";

const AdminEnergyAndWater = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const [activeTab, setActiveTab] = useState("meterListing");
  const [meterId, setMeterId] = useState();
  const [facilityMeterDetailId, setFacilityMeterDetailId] = useState();
  const [meterId2, setMeterId2] = useState();

  const handleAddButtonClick = () => {
    setActiveTab("addMeter");
  };

  const handleEditButtonClick = (id) => {
    setMeterId2(id);
    setActiveTab("addMeter");
  };

  const handleEntriesListClick = (id, meter_id) => {
    console.log(id, meter_id)
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
          <AdminMeterListing
            onAddButtonClick={handleAddButtonClick}
            onEntriesListClick={handleEntriesListClick}
            OnEditMeterButton={handleEditButtonClick}
          />
        );
      case "addMeter":
        return (
          <AdminAddMeter
            onAddMeterSuccess={handleAddMeterSuccess}
            meterId2={meterId2}
          />
        );
      case "entriesListing":
        return <AdminEntriesListing
          onAddMeterSuccess={handleAddMeterSuccess}
          OnEditMeterButton={handleEditButtonClick}
          facilityMeterDetailId={facilityMeterDetailId}
          meterId={meterId} />;
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

export default AdminEnergyAndWater;
