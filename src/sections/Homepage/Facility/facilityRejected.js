import React, { useState } from "react";
import { Container, Typography, Grid } from "@mui/material";
import FacilityRejectedTable from "components/FacilityRejected";

const FacilityRejected = () => {
  // Sample data for Table 1
  const data1 = [
    {
      facilityId: "Facility-1",
      submittedBy:'Wade Warren',
      companyName:"Wallmant",
      businessEmail:'wade.warren@dummy.com',
      status:'Rejected',
      submittedOn:" 11-April",
    },
    // Add more data objects as needed
  ];

  // Sample data for Table 2
  const data2 = [
    {
      facilityId: "Facility-2",
      submittedBy:'Wade Warren',
      companyName:"Wallmant",
      businessEmail:'wade.warren@dummy.com',
      status:'Rejected',
      submittedOn:" 11-April",
    },
  ];

  // Merge data1 and data2 into one array
  const mergedData = [...data1, ...data2];

  // Define handleAction function
  const handleAction = (id) => {
    // Your action logic here
    console.log("View details for row with id:", id);
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h2"
            sx={{
              marginTop: "2rem",
              marginBottom: "2rem",
              color: "#242424",
              fontWeight: "500",
              fontSize: "20px !important",
              fontStyle: "italic",
              lineHeight: "27.5px",
              letterSpacing: "-0.01125rem",
              fontStyle: "italic",
            }}
          >
            List of Rejected Facilities
          </Typography>
          <FacilityRejectedTable
            data={mergedData}
            handleAction={handleAction}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityRejected;
