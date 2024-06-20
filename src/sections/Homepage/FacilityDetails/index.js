import { Box, Container, Grid, IconButton, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import FacilityTimeline from "./FacilityTimeline";
import FacilitySidebar from "./FacilitySidebar";
import FacilityHeader from "./FacilityHeader";
import Summary from "./Summary";
import BaselineModel from "./BaselineModel";
import Details from "./Details";
import EnergyAndWater from "./EnergyAndWater";
import Performance from "./Performance";
import ReportsAndStudies from "./ReportsAndStudies/index";
import Weather from "./Weather";
import { fetchFacilityDetails } from "../../../redux/superAdmin/actions/facilityActions";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FacilityDetails = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchFacilityDetails(id));
  }, [dispatch, id]);
  const renderComponent = (componentName) => {
    switch (componentName) {
      case 0:
        return <Summary />;
      case 1:
        return <Details setTab={setSelectedTab} />;
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
    <Container sx={{ mt: 8 }}>
      {/* <Grid container sx={{ mb: 12 }}> */}
      <Grid container>
        <IconButton
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.main",
            },
            marginRight: "1rem",
          }}
          onClick={() => navigate("/facility-list")}
        >
          <ArrowBackIcon
            sx={{
              color: "#fff",
              fontSize: "1.25rem",
            }}
          />
        </IconButton>
        {/* <Typography variant="h4">Facility management</Typography> */}
      </Grid>

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
