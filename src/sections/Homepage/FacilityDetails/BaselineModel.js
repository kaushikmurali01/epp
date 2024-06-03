import { BorderAllRounded, BorderLeftRounded, BorderRight } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, Grid, Tab, Tabs, Typography, styled, useMediaQuery } from "@mui/material";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import CustomAccordion from "components/CustomAccordion";

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

const BaselineModel = () => {
  const [tabValue, setTabValue] = useState("dataExploration");
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const initialValues = {};
  const [checked, setChecked] = useState(true);

  const handleSubmit = (values) => { };
  
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCheckboxChange = (event) => { setChecked(event.target.checked);};

  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

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

  const headingStyleInAccordion = {
    borderRadius: "138.875rem",
    border: "1px solid #D0D0D0",
    background: " #EBEBEB",
    padding: "0.375rem 1rem",
    color: "#696969",
    fontSize: "0.875rem",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
    width: "max-content"
  };

  const modelConstructorAccordionDetails = (
    <Formik
      initialValues={{ ...initialValues }}
      // validationSchema={validationSchemaFacilityDetails}
      // onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      <Form>
        <Grid container display={"grid"} gap={"2rem"}>
          <Grid item>
            <Typography variant="h6" sx={headingStyleInAccordion}>
              Baseline period
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" sx={headingStyleInAccordion}>
              Sufficiency verification
            </Typography>
          </Grid>
          <Grid item display={"grid"} gap={"2rem"}>
            <Typography variant="h6" sx={headingStyleInAccordion}>
              Baseline independent variable
            </Typography>
            <Box display={"flex"}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Field
                      name=""
                      type="checkbox"
                      as={Checkbox}
                      checked={checked}
                      onChange={handleCheckboxChange}
                    />
                  }
                  sx={{ color: "text.secondary2" }}
                  name="commercial_kitchen"
                  label={
                    <Typography sx={{ fontSize: "14px!important" }}>
                      Weekday_hours
                    </Typography>
                  }
                />
              </FormGroup>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Field
                      name=""
                      type="checkbox"
                      as={Checkbox}
                      checked={checked}
                      onChange={handleCheckboxChange}
                    />
                  }
                  sx={{ color: "text.secondary2" }}
                  name="commercial_kitchen"
                  label={
                    <Typography sx={{ fontSize: "14px!important" }}>
                      Variable-1
                    </Typography>
                  }
                />
              </FormGroup>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Field
                      name=""
                      type="checkbox"
                      as={Checkbox}
                      checked={checked}
                      onChange={handleCheckboxChange}
                    />
                  }
                  sx={{ color: "text.secondary2" }}
                  name="commercial_kitchen"
                  label={
                    <Typography sx={{ fontSize: "14px!important" }}>
                      Variable-2
                    </Typography>
                  }
                />
              </FormGroup>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Field
                      name=""
                      type="checkbox"
                      as={Checkbox}
                      checked={checked}
                      onChange={handleCheckboxChange}
                    />
                  }
                  sx={{ color: "text.secondary2" }}
                  name="commercial_kitchen"
                  label={
                    <Typography sx={{ fontSize: "14px!important" }}>
                      Variable-3
                    </Typography>
                  }
                />
              </FormGroup>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Field
                      name=""
                      type="checkbox"
                      as={Checkbox}
                      checked={checked}
                      onChange={handleCheckboxChange}
                    />
                  }
                  sx={{ color: "text.secondary2" }}
                  name="commercial_kitchen"
                  label={
                    <Typography sx={{ fontSize: "14px!important" }}>
                      Variable-4
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="h6" sx={headingStyleInAccordion}>
              Model granularity
            </Typography>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
  ;

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
        <Grid item xs={12} md={6}>
          <Tabs
            className="theme-tabs-list"
            value={tabValue}
            onChange={handleChange}
            sx={{ display: "inline-flex" }}
          >
            <Tab
              value="dataExploration"
              label="Data exploration"
              sx={{ minWidth: "10rem", textTransform: "initial" }}
            />
            <Tab
              value="baselineModel"
              label="Baseline model"
              sx={{ minWidth: "10rem", textTransform: "initial" }}
            />
          </Tabs>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">
            Submit facility
          </Button>
        </Grid>
      </Grid>

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
          details={modelConstructorAccordionDetails}
          panelId="modelConstructor"
        />

        <CustomAccordion summary="Summary" details={""} panelId="summary" />

        <CustomAccordion
          summary="Visualization"
          details={""}
          panelId="visualization"
        />
      </Grid>
    </Grid>
  );
};

export default BaselineModel;
