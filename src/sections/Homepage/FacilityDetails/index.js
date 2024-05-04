import { Box, Container, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import FacilityTimeline from "./FacilityTimeline";
import FacilitySidebar from "./FacilitySidebar";
import FacilityHeader from "./FacilityHeader";
import Summary from "./Summary";
import BaselineModel from "./BaselineModel";
import Details from "./Details";
import EnergyAndWater from "./EnergyAndWater";
import Performance from "./Performance";
import ReportsAndStudies from "./ReportsAndStudies";
import Weather from "./Weather";
import { fetchFacilityDetails } from "../../../redux/actions/facilityActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const FacilityDetails = () => {
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
        return <Summary />;
      case 1:
        return <Details />;
      case 2:
        return <EnergyAndWater />;
      case 3:
        return <Weather />;
      case 4:
        return <ReportsAndStudies />;
      case 5:
        return <BaselineModel />;
      case 6:
        return <Performance />;
      default:
        return null;
    }
  };
  return (
    <Container sx={{ mt: 20 }}>
      <FacilityTimeline />
      <FacilityHeader />
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          marginTop: "2rem",
        }}
      >
        <FacilitySidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {renderComponent(selectedTab)}
      </Box>
    </Container>
  );
};

export default FacilityDetails;
