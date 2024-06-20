import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Radio,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import DateRangeSlider from "components/DateRangeSlider";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import ButtonWrapper from "components/FormBuilder/Button";
import { headingStyleInAccordion } from "styles/commonStyles";
import { MiniTable } from "components/MiniTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const ModelConstructorForm = ({ onSubmit, handleSufficiencySettings }) => {
  const initialValues = {
    Weekday_hours: false,
    Variable1: false,
    Variable2: false,
    Variable3: false,
    Variable4: false,
    granularity: "daily", // manage ToggleButtonGroup state
    modelingApproach: "",
  };

  const handleSubmit = (values) => {
    onSubmit(values);
  };

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

  const sufficiencyVerificationStatus = true;

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.375rem 0.5rem",
    borderRadius: "15rem",
    fontWeight: "400",
    fontSize: { sm: "0.875rem" },
    cursor: "pointer",
  };

  const sufficiencyVerificationStatusButton = sufficiencyVerificationStatus ? (
    <Typography
      variant="span"
      sx={{
        ...buttonStyle,
        border: "0.5px solid #2e813e",
        color: "primary.main",
      }}
    >
      <CheckCircleIcon /> Verify
    </Typography>
  ) : (
    <Typography
      variant="span"
      sx={{
        ...buttonStyle,
        border: "0.5px solid #FF5858",
        color: "danger.main",
      }}
    >
      <CancelIcon /> Failed
    </Typography>
  );

  const userColumn = [
    {
      Header: "",
      accessor: "id",
    },
    {
      Header: "hourly",
      accessor: "hourly",
    },
    {
      Header: "Monthly",
      accessor: "monthly",
    },
    {
      Header: "Daily",
      accessor: "daily",
    },
    {
      Header: "",
      accessor: "sufficiency_setting",
    },
    {
      Header: "",
      accessor: "see_details",
    },
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

              <Grid item>
                <MiniTable
                  columns={userColumn}
                  data={[
                    {
                      id: (
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
                      hourly: sufficiencyVerificationStatusButton,
                      monthly: sufficiencyVerificationStatusButton,
                      daily: sufficiencyVerificationStatusButton,
                      sufficiency_setting: (
                        <Typography
                          variant="span"
                          sx={{
                            cursor: "pointer",
                            color: "primary.main",
                            fontSize: "0.875rem !important",
                            fontStyle: "italic",
                            fontWeight: 400,
                          }}
                          onClick={handleSufficiencySettings}
                        >
                          Sufficiency setting
                        </Typography>
                      ),
                      see_details: (
                        <Typography
                          variant="span"
                          sx={{
                            cursor: "pointer",
                            color: "primary.main",
                            fontSize: "0.875rem !important",
                            fontStyle: "italic",
                            fontWeight: 400,
                          }}
                        >
                          See details
                        </Typography>
                      ),
                    },
                  ]}
                />
              </Grid>
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
