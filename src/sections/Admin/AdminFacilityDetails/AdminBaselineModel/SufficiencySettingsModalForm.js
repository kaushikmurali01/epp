import React, { useState } from "react";
import InputField from "components/FormBuilder/InputField";
import { Field, Form, Formik } from "formik";
import {
  Button,
  Grid,
  Tab,
  Tabs,
  Typography,
  Slider,
  Box,
} from "@mui/material";

const SufficiencySettingsModalForm = ({
  handleSufficiencySettingsFormSubmit,
}) => {
  const [sufficiencySettingsTabValue, setSufficiencySettingsTabValue] =
    useState("data_sufficiency_setting");

  const handleSufficiencySettingsTabChange = (event, newValue) => {
    setSufficiencySettingsTabValue(newValue);
  };

  const initialValues = {
    dailyCoverageThreshold: 0,
    hourlyCoverageThreshold: 0,
    monthlyCoverageThreshold: 0,
    nmbe_threshold: "",
    rmse_threshold: "",
  };

  const getInitialValues = () => {
    return sufficiencySettingsTabValue === "data_sufficiency_setting"
      ? {
          dailyCoverageThreshold: initialValues.dailyCoverageThreshold,
          hourlyCoverageThreshold: initialValues.hourlyCoverageThreshold,
          monthlyCoverageThreshold: initialValues.monthlyCoverageThreshold,
        }
      : {
          nmbe_threshold: initialValues.nmbe_threshold,
          rmse_threshold: initialValues.rmse_threshold,
        };
  };

  return (
    <Grid container flexDirection={"column"} gap={"2rem"}>
      <Grid item xs={12} md={12}>
        <Tabs
          className="theme-tabs-list"
          value={sufficiencySettingsTabValue}
          onChange={handleSufficiencySettingsTabChange}
          sx={{ display: "inline-flex" }}
        >
          <Tab
            value="data_sufficiency_setting"
            label="Data sufficiency setting"
            sx={{ minWidth: "10rem", textTransform: "initial" }}
          />
          <Tab
            value="model_setting"
            label="Model setting"
            sx={{ minWidth: "10rem", textTransform: "initial" }}
          />
        </Tabs>
      </Grid>
      <Formik
        initialValues={getInitialValues()}
        // validationSchema={validationSchema}
        onSubmit={handleSufficiencySettingsFormSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form>
              {sufficiencySettingsTabValue === "data_sufficiency_setting" && (
                <Grid
                  item
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                  }}
                >
                  <Box sx={{ margin: "0 auto", width: "90%" }}>
                    <Typography
                      variant="span"
                      sx={{
                        fontSize: "0.875rem !important",
                        lineHeight: "1 !important",
                        fontWeight: 400,
                      }}
                    >
                      Daily Coverage Threshold
                    </Typography>
                    <Slider
                      value={values.dailyCoverageThreshold}
                      onChange={(e, val) =>
                        setFieldValue("dailyCoverageThreshold", val)
                      }
                      aria-labelledby="Daily Coverage Threshold"
                      min={0}
                      max={100}
                      sx={{ marginBlockStart: "0.5rem" }}
                    />
                  </Box>
                  <Box sx={{ margin: "0 auto", width: "90%" }}>
                    <Typography
                      variant="span"
                      sx={{
                        fontSize: "0.875rem !important",
                        lineHeight: "1 !important",
                        fontWeight: 400,
                      }}
                    >
                      Hourly Coverage Threshold
                    </Typography>
                    <Slider
                      value={values.hourlyCoverageThreshold}
                      onChange={(e, val) =>
                        setFieldValue("hourlyCoverageThreshold", val)
                      }
                      aria-labelledby="Hourly Coverage Threshold"
                      min={0}
                      max={100}
                      sx={{ marginBlockStart: "0.5rem" }}
                    />
                  </Box>
                  <Box sx={{ margin: "0 auto", width: "90%" }}>
                    <Typography
                      variant="span"
                      sx={{
                        fontSize:
                          "0.8handleSufficiencySettingsModel75rem !important",
                        lineHeight: "1 !important",
                        fontWeight: 400,
                      }}
                    >
                      Monthly Coverage Threshold
                    </Typography>
                    <Slider
                      value={values.monthlyCoverageThreshold}
                      onChange={(e, val) =>
                        setFieldValue("monthlyCoverageThreshold", val)
                      }
                      aria-labelledby="Monthly Coverage Threshold"
                      min={0}
                      max={100}
                      sx={{ marginBlockStart: "0.5rem" }}
                    />
                  </Box>
                </Grid>
              )}
              {sufficiencySettingsTabValue === "model_setting" && (
                <Grid container sx={{ flexDirection: "column", gap: "2rem" }}>
                  <Grid item>
                    <Field
                      name="nmbe_threshold"
                      type="number"
                      as={InputField}
                      label="NMBE threshold *"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault()
                      }
                    />
                    {errors.nmbe_threshold && (
                      <div>{errors.nmbe_threshold}</div>
                    )}
                  </Grid>
                  <Grid item>
                    <Field
                      name="rmse_threshold"
                      type="number"
                      as={InputField}
                      label="CV(RMSE) threshold *"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault()
                      }
                    />
                    {errors.rmse_threshold && (
                      <div>{errors.rmse_threshold}</div>
                    )}
                  </Grid>
                </Grid>
              )}
              <Grid container justifyContent="center" gap={2} mt={"2rem"}>
                <Button type="submit" color="neutral" variant="contained">
                  Save
                </Button>
                <Button type="reset" color="neutral" variant="outlined">
                  Reset
                </Button>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Grid>
  );
};

export default SufficiencySettingsModalForm;
