import React, { useState } from "react";
import { Container, Typography, Grid, Tabs, Tab, Button } from "@mui/material";
import FacilityOverview from "./facilityOverview";
import FacilityApproved from "./facilityApproved";
import FacilityReview from "./facilityReview";
import FacilityRejected from "./facilityRejected";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import FacilityCreated from "./facilityCreated";

const FacilityPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("overview");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case "overview":
        return <FacilityOverview />;
      case "created_facilities":
        return <FacilityCreated />;
      case "approved":
        return <FacilityApproved />;
      case "underreview":
        return <FacilityReview />;
      case "rejected":
        return <FacilityRejected />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h2"
            sx={{
              color: "#242424",
              fontWeight: "500",
              fontSize: "1.25rem !important",
              fontStyle: "italic",
              lineHeight: "106.815%",
              letterSpacing: "-0.01125rem",
            }}
          >
            Facilities Management
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "200",
              fontSize: ".725rem",
            }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          display="flex"
          alignItems="center"
          justifyContent="right"
        >
          <Button
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            disableRipple
            endIcon={
              <AddCircleIcon
                style={{
                  color: "text.primary",
                  fontSize: "2rem",
                }}
              />
            }
            onClick={() => navigate("/admin/add-facility")}
          >
            Add Facility
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8}>
        <Tabs
          className="theme-tabs-list"
          value={tabValue}
          onChange={handleChange}
          sx={{ display: "inline-flex" }}
        >
          <Tab value="overview" label="Overview" sx={{ minWidth: "10rem" }} />
          <Tab
            value="created_facilities"
            label="Created facilities"
            sx={{ minWidth: "10rem" }}
          />

          <Tab value="approved" label="Approved" sx={{ minWidth: "10rem" }} />
          <Tab
            value="underreview"
            label="Under Review"
            sx={{ minWidth: "10rem" }}
          />
          <Tab value="rejected" label="Rejected" sx={{ minWidth: "10rem" }} />
        </Tabs>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderTabContent()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityPage;
