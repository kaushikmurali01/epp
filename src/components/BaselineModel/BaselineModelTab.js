import React, { useState } from "react";
import ModelConstructorForm from "./ModelConstructorForm";
import CustomAccordion from "components/CustomAccordion";
import {
  Box,
  Button,
  Grid,
  Typography,
  styled,
  ButtonGroup,
} from "@mui/material";
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

const BaselineModelTab = ({ handleSufficiencySettings }) => {
  const [activeButton, setActiveButton] = useState("electricity");

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

  const handleFormSubmit = (formData) => {
    console.log("Form Data Submitted: ", formData);
    // Handle form data here, e.g., send it to an API or process it further
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

  const summaryAccordionContentStyle = {
    color: "#242424",
    padding: "0.375rem 1rem",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
  };

  const summaryAccordionContent = (
    <Grid container display={"grid"}>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            Number of observations
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            Coefficient of Determination, R2
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            Adjusted R2
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            Root-mean-square error, RMSE R2
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            Coefficient of variation of R 0.00%
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            Auto correlation function
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            Durbin- Watson (P &gt; 0)
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={summaryAccordionContentStyle}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <>
      <Grid item display={"flex"} justifyContent={"space-between"} gap={"1rem"}>
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={
              activeButton === "electricity"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("electricity")}
          >
            Electricity
          </Button>
          <Button
            sx={
              activeButton === "natural_gas"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("natural_gas")}
          >
            Natural gas
          </Button>
        </StyledButtonGroup>
        <Typography
          variant="h6"
          sx={{
            padding: "0.375rem 0.5rem",
            borderRadius: "20.8125rem",
            background: "#CFEEFF",
            color: "#1976AA",
            fontSize: "0.875rem",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          Electricity baseline has been successfully created on : 2020/03/05
          13:35:01
        </Typography>
      </Grid>

      <Grid item>
        <CustomAccordion
          summary="Model constructor"
          details={
            <ModelConstructorForm
              onSubmit={handleFormSubmit}
              handleSufficiencySettings={handleSufficiencySettings}
            />
          }
          panelId="modelConstructor"
        />

        <CustomAccordion
          summary="Summary"
          details={summaryAccordionContent}
          panelId="summary"
        />

        <CustomAccordion
          summary="Visualization"
          details={visualizationAccordionContent}
          panelId="visualization"
        />
      </Grid>
    </>
  );
};

export default BaselineModelTab;
