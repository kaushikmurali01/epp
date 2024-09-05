import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchFacilityThresholdData,
  updateFacilityThresholdData,
} from "../../../../redux/admin/actions/adminBaselineAction";

const SufficiencySettingsModalForm = ({ setModalConfig }) => {
  const [sufficiencySettingsTabValue, setSufficiencySettingsTabValue] =
    useState("data_sufficiency_setting");
  const { id } = useParams();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    daily_coverage_threshold: 0,
    hourly_coverage_threshold: 0,
    monthly_covergae_threshold: 0,
    nmbe: "",
    rmse: "",
  });

  useEffect(() => {
    dispatch(fetchFacilityThresholdData(id))
      .then((response) => {
        const thresholdData = response.data;
        if (thresholdData !== null) {
          setInitialValues({
            ...initialValues,
            ...thresholdData,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching threshold data:", error);
      });
  }, [dispatch, id]);

  const handleSufficiencySettingsTabChange = (event, newValue) => {
    setSufficiencySettingsTabValue(newValue);
  };

  const handleSufficiencySettingsFormSubmit = (values) => {
    dispatch(updateFacilityThresholdData(id, values));

    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
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
        initialValues={initialValues}
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
                      value={values.daily_coverage_threshold}
                      onChange={(e, val) =>
                        setFieldValue("daily_coverage_threshold", val)
                      }
                      aria-labelledby="Daily Coverage Threshold"
                      min={0}
                      max={100}
                      sx={{ marginBlockStart: "0.5rem" }}
                      valueLabelDisplay="auto"
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
                      value={values.hourly_coverage_threshold}
                      onChange={(e, val) =>
                        setFieldValue("hourly_coverage_threshold", val)
                      }
                      aria-labelledby="Hourly Coverage Threshold"
                      min={0}
                      max={100}
                      sx={{ marginBlockStart: "0.5rem" }}
                      valueLabelDisplay="auto"
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
                      value={values.monthly_covergae_threshold}
                      onChange={(e, val) =>
                        setFieldValue("monthly_covergae_threshold", val)
                      }
                      aria-labelledby="Monthly Coverage Threshold"
                      min={0}
                      max={100}
                      sx={{ marginBlockStart: "0.5rem" }}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
              )}
              {sufficiencySettingsTabValue === "model_setting" && (
                <Grid container sx={{ flexDirection: "column", gap: "2rem" }}>
                  <Grid item>
                    <Field
                      name="nmbe"
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
                      name="rmse"
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
