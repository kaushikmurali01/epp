import styled from "@emotion/styled";
import { Box, Button, ButtonGroup, Grid, Typography, useMediaQuery } from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Form, Formik } from "formik";
import React, { useState } from "react";

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  "& .MuiButtonGroup-firstButton": {
    borderRadius: "20.8125rem 0rem 0rem 20.8125rem",
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-middleButton": {
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-lastButton": {
    borderRadius: "0 20.8125rem 20.8125rem 0",
  },
  "& .MuiButton-root": {
    "&:hover": {
      color: "#F7F7F5",
    },
  },
}));

const Performance = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [activeButton, setActiveButton] = useState(0);
  const initialValues = {};

  const buttonStyle = {
    padding: "0.44rem 1.5rem",
    lineHeight: "1",
    height: "max-content",

    ".MuiButtonGroup-firstButton": {
      BorderRight: "10px"
    }
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2E813E",
    color: "#F7F7F5",
  };

  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#EBEBEB",
    color: "#696969",
  };

  const baselineStyleInAccordion = {
    color: "#242424",
    padding: "0.375rem 1rem",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
  };

  const handleSubmit = (values) => { };

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  const baselineStyleInAccordionDetails = (
    <Grid container display={"grid"}>
      <Grid item>
        <Typography sx={{ color: '#2C77E9', fontSize: '14px !important', fontWeight: '500', padding: "0.375rem 1rem", }}>
          Baseline Energy Model
        </Typography>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            Baseline Periods
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            Baseline Energy Consumption (kWh)
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            Baseline Peak Demand (kW)
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            Pre-Project Incentive ($)
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Grid container
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
        display: "flex",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <Grid item display={"flex"} justifyContent={"space-between"} gap={"1rem"}>
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={activeButton === 0 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(0)}
          >
            Electricity
          </Button>
          <Button
            sx={activeButton === 1 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(1)}
          >
            Natural gas
          </Button>
        </StyledButtonGroup>
        <Typography
          variant="h6"
          sx={{
            color: "#2C77E9",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          Setting
        </Typography>
      </Grid>

      <Grid item>
        <CustomAccordion
          summary="Baseline summary"
          details={baselineStyleInAccordionDetails}
          panelId="baselineSummary"
        />

        <CustomAccordion
          summary="Performance period data summary"
          details={""}
          panelId="performancePeriodDataSummary" />

        <CustomAccordion
          summary="Performance period reporting Information "
          details={""}
          panelId="performancePeriodReportingInformation "
        />

        <CustomAccordion
          summary="Performance period data visualization  "
          details={""}
          panelId="performancePeriodDataVisualization  "
        />
      </Grid>

    </Grid>
  );
};

export default Performance;
