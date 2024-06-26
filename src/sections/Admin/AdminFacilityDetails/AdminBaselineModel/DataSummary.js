import { Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import {
  StyledButtonGroup,
  activeButtonStyle,
  inactiveButtonStyle,
} from "./styles";

const DataSummary = () => {
  const [activeButton, setActiveButton] = useState("observe_data");

  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };
  return (
    <Grid
      sx={{
        display: "flex",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={
              activeButton === "observe_data"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("observe_data")}
          >
            Observe data
          </Button>
          <Button
            sx={
              activeButton === "missing_data"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("missing_data")}
          >
            Missing Data
          </Button>
          <Button
            sx={
              activeButton === "outliers"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("outliers")}
          >
            Outliers
          </Button>
        </StyledButtonGroup>
        <Box textAlign={"end"}>
          <Button
            variant="text"
            sx={{
              color: "blue.main",
              padding: 0,
              lineHeight: 1,
              minWidth: "max-content !important",
            }}
          >
            Details & Setting
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DataSummary;
