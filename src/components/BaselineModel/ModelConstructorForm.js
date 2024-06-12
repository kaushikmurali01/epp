import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, Radio, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import DateRangeSlider from "components/DateRangeSlider";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import BaselineModelingTable from "./BaselineModelingTable";
import ButtonWrapper from "components/FormBuilder/Button";
import { headingStyleInAccordion } from "styles/commonStyles";

const ModelConstructorForm = ({onSubmit}) => {
  const initialValues = {
    Weekday_hours: false,
    Variable1: false,
    Variable2: false,
    Variable3: false,
    Variable4: false,
    granularity: "daily", // manage ToggleButtonGroup state
    modelingApproach: ""
  };
 
  const handleSubmit = (values) => { onSubmit(values) };

  const marksForEnergyTarget = [
    {
      value: 0,
      label: "0 %",
    },
    {
      value: 100,
      label: "100 %",
    },
  ];

  const AcceptRejectBtn = () => {
    return <Button>accept</Button>;
  };

  const headers = ["", "Hourly", "Daily", "Monthly", ""];

  const rows = [
    [
      "Sufficiency verification",
      <AcceptRejectBtn label="Accept" />,
      <AcceptRejectBtn label="Accept" />,
      <AcceptRejectBtn label="Accept" />,
      <Button>See detail</Button>,
    ],
    // Add more rows as needed
  ];

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchemaFacilityDetails}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <Grid container display={"grid"} gap={"2rem"}>
            <Grid item>
              <Typography variant="h6" sx={headingStyleInAccordion}>
                Baseline period
              </Typography>
              <Box
                sx={{
                  marginInline: "auto",
                  maxWidth: "33rem",
                }}
              >
                <DateRangeSlider />
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={headingStyleInAccordion}>
                Sufficiency verification
              </Typography>

              <BaselineModelingTable headers={headers} rows={rows} />
              {/* <SufficiencyVerificationTable /> */}
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                sx={headingStyleInAccordion}
                mb={"1rem !important"}
              >
                Baseline independent variable
              </Typography>
              <Box display={"flex"} flexWrap={"wrap"} gap={"1rem"}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Field
                        name="Weekday_hours"
                        type="checkbox"
                        as={Checkbox}
                        checked={values.Weekday_hours}
                        onChange={handleChange}
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
                        name="Variable1"
                        type="checkbox"
                        as={Checkbox}
                        checked={values.Variable1}
                        onChange={handleChange}
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
                        name="Variable2"
                        type="checkbox"
                        as={Checkbox}
                        checked={values.Variable2}
                        onChange={handleChange}
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
                        name="Variable3"
                        type="checkbox"
                        as={Checkbox}
                        checked={values.Variable3}
                        onChange={handleChange}
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
                        name="Variable4"
                        type="checkbox"
                        as={Checkbox}
                        checked={values.Variable4}
                        onChange={handleChange}
                        disabled={true}
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
              <ToggleButtonGroup
                value={values.granularity}
                exclusive
                onChange={(e, value) => {
                  if (value !== null) {
                    setFieldValue("granularity", value);
                  }
                }}
                aria-label="text alignment"
              >
                <ToggleButton
                  className="theme-toggle-yes"
                  value="hourly"
                  sx={{
                    fontSize: "0.875rem",
                    padding: "2px",
                    textTransform: "capitalize",
                  }}
                >
                  Hourly
                </ToggleButton>
                <ToggleButton
                  className="theme-toggle-yes"
                  value="daily"
                  sx={{
                    fontSize: "0.875rem",
                    padding: "2px",
                    textTransform: "capitalize",
                  }}
                >
                  Daily
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item>
              <Typography variant="h6" sx={headingStyleInAccordion}>
                Modeling approach
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                flexWrap="wrap"
                gap="0.5rem"
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Field
                        name="modelingApproach"
                        type="radio"
                        as={Radio}
                        value="Weekday_hours"
                        checked={values.modelingApproach === "Weekday_hours"}
                        onChange={handleChange}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
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
                        name="modelingApproach"
                        type="radio"
                        as={Radio}
                        value="Variable1"
                        checked={values.modelingApproach === "Variable1"}
                        onChange={handleChange}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
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
                        name="modelingApproach"
                        type="radio"
                        as={Radio}
                        value="Variable2"
                        checked={values.modelingApproach === "Variable2"}
                        onChange={handleChange}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
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
                        name="modelingApproach"
                        type="radio"
                        as={Radio}
                        value="Variable3"
                        checked={values.modelingApproach === "Variable3"}
                        onChange={handleChange}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
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
                        name="modelingApproach"
                        type="radio"
                        as={Radio}
                        value="Variable4"
                        checked={values.modelingApproach === "Variable4"}
                        onChange={handleChange}
                        disabled={true}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        Variable-4
                      </Typography>
                    }
                  />
                </FormGroup>
              </Box>
            </Grid>

            <Grid>
              <ButtonWrapper
                type="submit"
                color="neutral"
                onClick={handleSubmit}
              >
                Calculate baseline
              </ButtonWrapper>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ModelConstructorForm;
