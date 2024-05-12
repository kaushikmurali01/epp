import { Box, Container, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchFacilityDetails } from "../../../redux/superAdmin/actions/facilityActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AdminFacilityHeader from "./AdminFacilityHeader";
import AdminFacilityTimeline from "./AdminFacilityTimeline";
import AdminFacilitySidebar from "./AdminFacilitySidebar";
import AdminSummary from "./AdminSummary";
import AdminDetails from "./AdminDetails";
import AdminEnergyAndWater from "./AdminEnergyAndWater";

const AdminFacilityDetails = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchFacilityDetails(id));
  }, [dispatch, id]);
  const renderComponent = (componentName) => {
    switch (componentName) {
      case 0:
        return <AdminSummary />;
      case 1:
        return <AdminDetails />;
    //   case 2:
    //     return <AdminEnergyAndWater />;
    //   case 3:
    //     return <Weather />;
    //   case 4:
    //     return <ReportsAndStudies />;
    //   case 5:
    //     return <BaselineModel />;
    //   case 6:
    //     return <Performance />;
      default:
        return null;
    }
  };
  return (
    <Container sx={{ mt: 12 }}>
      <AdminFacilityTimeline />
      <AdminFacilityHeader />
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          marginTop: "2rem",
        }}
      >
        <AdminFacilitySidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {renderComponent(selectedTab)}
      </Box>
    </Container>
  );
};

export default AdminFacilityDetails;
