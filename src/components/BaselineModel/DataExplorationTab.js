import { Button, Grid, styled, ButtonGroup, Typography, Box } from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import React, { useState } from "react";
import { headingStyleInAccordion } from "styles/commonStyles";

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

const DataExplorationTab = () => {
  const [activeButton, setActiveButton] = useState("observe_data");

  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  const buttonStyle = {
    padding: "0.44rem 1.5rem",
    lineHeight: "1",
    height: "max-content",

    ".MuiButtonGroup-firstButton": {
      BorderRight: "10px",
    },
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

  const visualizationFilterCategory = ["Time series", "Heatmaps", "Category 1"];

  const visualizationAccordionContent = (
    <Grid
      sx={{
        display: "flex",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <Grid display={"flex"} gap={"1rem"} flexWrap={"wrap"}>
        {visualizationFilterCategory.map((category) => (
          <Typography
            key={category}
            variant="h6"
            sx={headingStyleInAccordion}
            mb={"0 !important"}
          >
            {category}
          </Typography>
        ))}
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
        sx={{ minHeight: "200px" }}
      >
        graph container
      </Grid>
    </Grid>
  );

  const summaryAccordionContent = (
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

  return (
    <Grid item>
      <CustomAccordion
        summary="Visualization"
        details={visualizationAccordionContent}
        panelId="visualization"
      />
      <CustomAccordion
        summary="Summary"
        details={summaryAccordionContent}
        panelId="summary"
      />
    </Grid>
  );
};

export default DataExplorationTab;
