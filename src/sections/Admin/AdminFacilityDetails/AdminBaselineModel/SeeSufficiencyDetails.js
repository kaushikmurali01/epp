import { Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  StyledButtonGroup,
  activeButtonStyle,
  inactiveButtonStyle,
} from "./styles";
import { MiniTable } from "components/MiniTable";

const userColumn = [
  {
    Header: "Baseline period",
    headerVisibility: "hidden",
    accessor: (item) => (
      <Typography
        variant="span"
        sx={{
          color: "primary.main",
          fontSize: "0.875rem !important",
          fontStyle: "italic",
          fontWeight: 400,
        }}
      >
        Sufficiency verification
      </Typography>
    ),
  },
  {
    Header: "Coverage",
    headerVisibility: "hidden",
    accessor: (item) => (
      <Typography
        variant="span"
        sx={{
          color: "primary.main",
          fontSize: "0.875rem !important",
          fontStyle: "italic",
          fontWeight: 400,
        }}
      >
        Sufficiency verification
      </Typography>
    ),
  },
];
const SeeSufficiencyDetails = () => {
  const [activeButton, setActiveButton] = useState("hourly");
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };
  return (
    <Grid container>
      <Grid container>
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={
              activeButton === "hourly"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("hourly")}
          >
            Hourly
          </Button>
          <Button
            sx={
              activeButton === "daily" ? activeButtonStyle : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("daily")}
          >
            Daily
          </Button>
          <Button
            sx={
              activeButton === "monthly"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("monthly")}
          >
            Monthly
          </Button>
        </StyledButtonGroup>
      </Grid>
      <Grid
        spacing={5}
        columnGap={6}
        mt={3}
        sx={{
          display: "flex",
          width: "100%",
          background: "#CCFED5",
          alignItems: "center",
          borderRadius: "1rem ",
          padding: "1rem ",
        }}
      >
        <Grid item>
          <Typography variant="small" sx={{ fontSize: "1rem!important" }}>
            From 03/05/2020 to 03/05/2021
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="small">90% Data is available</Typography>
        </Grid>
      </Grid>
      <Grid container mt={3}>
        <MiniTable columns={userColumn} data={[{}]} />
      </Grid>
    </Grid>
  );
};

export default SeeSufficiencyDetails;
