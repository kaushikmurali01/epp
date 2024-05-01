import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import CustomTab from "../../../components/FormBuilder/CustomTab";
import { Box, Container, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CustomBox from "../../../components/CustomBox";
import AccountRegistration from "../../../assets/images/account-registration.svg";
import SubmitFacility from "../../../assets/images/submit-facility.svg";
import CreateFacility from "../../../assets/images/create-facility.svg";
import "../UserManagementSection/styles.css";

const DashboardSection = (props) => {
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setActiveStep(0);
  };

  return (
    <Container>
      <Box>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          Welcome Ben
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "400",
            fontSize: "1.125rem",
          }}
        >
          You are a few steps away from enrolling your facilities in the
          program. For all facilities, you have to do the following steps:
        </Typography>

        <Grid
          container
          sx={{
            alignItems: "center",
            gap: "0.69rem",
            padding: "1.16rem 1.29rem",
            marginTop: "1.88rem",
            borderRadius: "0.75rem",
            background: "#EBFFEF",
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%232E813EB3' stroke-width='5' stroke-dasharray='6%2c 14' stroke-dashoffset='30' stroke-linecap='square'/%3e%3c/svg%3e")`,
          }}
        >
          <CustomBox heading1="Create" heading2="facility" count="1" />
          <figure>
            <img src="images/dashboard-arrow.svg" alt="" />
          </figure>
          <CustomBox heading1="Add facility" heading2="information" count="2" />
          <figure>
            <img src="images/dashboard-arrow.svg" alt="" />
          </figure>
          <CustomBox
            heading1="Submit facility"
            heading2="for baseline model"
            count="3"
          />
          <figure>
            <img src="images/dashboard-arrow.svg" alt="" />
          </figure>
          <CustomBox
            heading1="Review and accept"
            heading2="baseline model"
            count="4"
          />
          <figure>
            <img src="images/dashboard-arrow.svg" alt="" />
          </figure>
          <CustomBox heading1="Enrol your" heading2="facility" count="5" />
          <figure>
            <img src="images/dashboard-arrow.svg" alt="" />
          </figure>
          <CustomBox
            heading1="Start saving energy and"
            heading2="earn incentives for the facility"
            count="6"
          />
        </Grid>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "400",
            fontSize: "0.75rem",
            fontStyle: "italic",
            marginTop: "0.5rem",
          }}
        >
          Please note that signing{" "}
          <span className="participant-text">Participant Agreement</span> is
          mandatory before you enrol your facility. All facilities in the
          Facility List are included under the signed Participant Agreement.
        </Typography>
      </Box>
      <Grid
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="1.44rem"
        marginTop="6.9rem"
      >
        <Typography variant="h4">
          Add facility details and start saving
        </Typography>
        <Button
          color="primary"
          variant="contained"
          component="a"
          href="/add-facility"
        >
          Add Facility
        </Button>
      </Grid>
    </Container>
  );
};

export default DashboardSection;
