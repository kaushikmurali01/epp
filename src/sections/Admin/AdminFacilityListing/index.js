import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  TextField,
} from "@mui/material";
import FacilityOverview from "./facilityOverview";
import FacilityApproved from "./facilityApproved";
import FacilityReview from "./facilityReview";
import FacilityRejected from "./facilityRejected";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import FacilityCreated from "./facilityCreated";

const AdminFacilityListing = () => {
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
            variant="h4"
            sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
          >
            Facilities Management
          </Typography>
          <Typography variant="small2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            name="search"
            label="Search by Facility name & ID"
            type="text"
            fullWidth
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                height: "3rem",
                borderRadius: "6px",
              },
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sm={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
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
            onClick={() => navigate("/facility-list/add-facility")}
          >
            Add Facility
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8} mt={4}>
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

export default AdminFacilityListing;
