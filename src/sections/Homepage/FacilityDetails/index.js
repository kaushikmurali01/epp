import { Container } from "@mui/material";
import React from "react";
import FacilityTimeline from "./FacilityTimeline";
import FacilitySidebar from "./FacilitySidebar";

const FacilityDetails = () => {
  return (
    <Container sx={{ mt: 20 }}>
      <FacilityTimeline />
      <FacilitySidebar />
    </Container>
  );
};

export default FacilityDetails;
