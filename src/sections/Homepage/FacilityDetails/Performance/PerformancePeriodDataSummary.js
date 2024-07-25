import { Button, Grid } from "@mui/material";
import React, { useState } from "react";
import { StyledButtonGroup } from "../BaselineModel/styles";

const buttonStyle = {
  padding: "0.44rem 1.5rem",
  lineHeight: "1",
  height: "max-content",
  borderRadius: "50px",

  ".MuiButtonGroup-firstButton": {
    BorderRight: "10px",
  },
};
const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#2E813E",
  color: "#F7F7F5",
  "&:hover": {
    backgroundColor: "#2E813E",
  },
};

const inactiveButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#EBEBEB",
  color: "#696969",
};
const PerformancePeriodDataSummary = () => {
  const [activeButtonPerformancePeriod, setActiveButtonPerformancePeriod] =
    useState(0);
  const handlePerformancePeriodButtonClick = (index) => {
    setActiveButtonPerformancePeriod(index);
  };
  return (
    <Grid item xs={12} md={activeButtonPerformancePeriod === 2 ? 12 : 9}>
      <StyledButtonGroup
        disableElevation
        variant="contained"
        color="primary"
        sx={{ marginBottom: "20px" }}
      >
        <Button
          sx={
            activeButtonPerformancePeriod === 0
              ? activeButtonStyle
              : inactiveButtonStyle
          }
          onClick={() => handlePerformancePeriodButtonClick(0)}
        >
          Observe data
        </Button>
        <Button
          sx={
            activeButtonPerformancePeriod === 1
              ? activeButtonStyle
              : inactiveButtonStyle
          }
          onClick={() => handlePerformancePeriodButtonClick(1)}
        >
          Missing Data
        </Button>
        <Button
          sx={
            activeButtonPerformancePeriod === 2
              ? activeButtonStyle
              : inactiveButtonStyle
          }
          onClick={() => handlePerformancePeriodButtonClick(2)}
        >
          Outliers
        </Button>
      </StyledButtonGroup>
    </Grid>
  );
};

export default PerformancePeriodDataSummary;
