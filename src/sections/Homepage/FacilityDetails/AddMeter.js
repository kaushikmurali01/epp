import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import ButtonWrapper from "components/FormBuilder/Button";
import InputField from "components/FormBuilder/InputField";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addMeter,
  fetchMeterDetails,
  updateMeter,
} from "./../../../redux/actions/metersActions";
import validationSchemaAddMeter from "utils/validations/formValidation";
import { format } from "date-fns";
import { fileUploadAction } from "../../../redux/actions/fileUploadAction";

const AddMeter = ({ onAddMeterSuccess, meterId2 }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [meterAlignment, setMeterAlignment] = useState(1);
  const [revenueAlignment, setRevenueAlignment] = useState("no");
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (meterId2) {
      dispatch(fetchMeterDetails(meterId2))
        .then((response) => {
          const meterDetails = response?.data;
          setInitialValues({
            ...initialValues,
            ...meterDetails,
            meter_active: meterDetails?.meter_active
              ? format(new Date(meterDetails.meter_active), "yyyy-MM-dd")
              : "",
            meter_inactive: meterDetails?.meter_inactive
              ? format(new Date(meterDetails.meter_inactive), "yyyy-MM-dd")
              : "",
          });
          setMeterAlignment(meterDetails?.meter_type);
          setRevenueAlignment(meterDetails?.is_rg_meter ? "yes" : "no");
          setSelectedFile(meterDetails?.meter_specification_url);
        })
        .catch((error) => {
          console.error("Error fetching meter details:", error);
        });
    }
  }, [dispatch]);

  const [initialValues, setInitialValues] = useState({
    meter_name: "",
    meter_type: 1,
    purchased_from_the_grid: true,
    meter_id: "",
    meter_active: "",
    meter_inactive: "",
    stil_in_use: false,
    is_rg_meter: "",
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile))
      .then(({ data }) => setImgUrl(data?.sasTokenUrl))
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const deletePicture = () => {
    setSelectedFile("");
  };

  const handleSubmit = (values) => {
    console.log(values);
    const newValues = {
      ...values,
      meter_specification_url: imgUrl,
      facility_id: +id,
      is_rg_meter: values?.is_rg_meter === "yes" ? true : false,
    };
    if (values.meter_type === 2) {
      delete newValues.purchased_from_the_grid;
    }
    if (meterId2) {
      dispatch(updateMeter(meterId2, newValues))
        .then(() => {
          onAddMeterSuccess();
        })
        .catch((error) => {
          console.error("Error updating meter:", error);
        });
    } else {
      dispatch(addMeter(newValues))
        .then(() => {
          onAddMeterSuccess();
        })
        .catch((error) => {
          console.error("Error adding meter:", error);
        });
    }
  };

  const handleMeterTypeChange = (event, newAlignment, form) => {
    setMeterAlignment(newAlignment);
    form.setFieldValue("meter_type", newAlignment);
  };

  const handleRevenueTypeChange = (event, newAlignment, form) => {
    setRevenueAlignment(newAlignment);
    form.setFieldValue("is_rg_meter", newAlignment);
  };

  return (
    <Box
      sx={{
        width: "100%",
        marginTop: isSmallScreen && "2rem",
      }}
    >
      <Typography variant="h4">Add Meter</Typography>
      <Formik
        initialValues={{ ...initialValues }}
        validationSchema={validationSchemaAddMeter}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        <Form>
          <Grid container rowGap={4} sx={{ marginTop: "2rem" }}>
            <Grid container spacing={4}>
              <Grid item>
                <InputLabel htmlFor="meter_type">Meter Type*</InputLabel>
                <Field name="meter_type">
                  {({ field, form }) => (
                    <ToggleButtonGroup
                      name="meter_type"
                      value={meterAlignment}
                      exclusive
                      onChange={(event, newAlignment) => {
                        handleMeterTypeChange(event, newAlignment, form);
                      }}
                    >
                      <ToggleButton value={1}>Electricty</ToggleButton>
                      <ToggleButton value={2}>Natural Gas</ToggleButton>
                      <ToggleButton value={3}>Water</ToggleButton>
                    </ToggleButtonGroup>
                  )}
                </Field>
              </Grid>
            </Grid>
            {meterAlignment === 1 && (
              <Grid item spacing={4}>
                <Field name="purchased_from_the_grid">
                  {({ field, form }) => (
                    <RadioGroup
                      row={true}
                      sx={{ color: "text.secondary2" }}
                      value={field.value ? "true" : "false"}
                      onChange={(event) => {
                        form.setFieldValue(
                          "purchased_from_the_grid",
                          event.target.value === "true"
                        );
                      }}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Purchased from the Grid"
                        name="purchased_from_the_grid"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="Behind-the-Meter Generation"
                        name="purchased_from_the_grid"
                      />
                    </RadioGroup>
                  )}
                </Field>
              </Grid>
            )}
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField name="meter_name" label="Meter name*" type="text" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField name="meter_id" label="Meter ID" type="number" />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="meter_active"
                  type="date"
                  label="Date meter became active*"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="meter_inactive"
                  type="date"
                  label=" Date meter became inactive"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Field name="stil_in_use">
                      {({ field }) => (
                        <Checkbox
                          {...field}
                          ye
                          sx={{ color: "text.secondary2" }}
                          name="stil_in_use"
                          checked={field.value}
                          label="Still in use"
                        />
                      )}
                    </Field>
                  }
                  label="Still in use"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputLabel htmlFor="is_rg_meter">
                  Is this an revenue-grade meter
                </InputLabel>
                <FormControl>
                  <Field name="is_rg_meter">
                    {({ field, form }) => (
                      <ToggleButtonGroup
                        id="is_rg_meter"
                        value={revenueAlignment}
                        exclusive
                        onChange={(event, newAlignment) => {
                          handleRevenueTypeChange(event, newAlignment, form);
                        }}
                      >
                        <ToggleButton value="yes" sx={{ fontSize: "0.875rem" }}>
                          Yes
                        </ToggleButton>
                        <ToggleButton value="no" sx={{ fontSize: "0.875rem" }}>
                          No
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={5} sx={{ marginTop: "10px" }}>
                <InputLabel>
                  Meter specification as per Measurement Canada S-E-04
                </InputLabel>
                {!selectedFile ? (
                  <>
                    <Typography
                      my={1}
                      sx={{
                        color: "#696969",
                        fontWeight: "500",
                        fontSize: "18px",
                        border: "1px solid #D0D0D0",
                        backgroundColor: "#D1FFDA",
                        padding: "6px 34px",
                        borderRadius: "8px",
                        width: "140px",
                        height: "40px",
                      }}
                      onClick={handleButtonClick}
                    >
                      Upload
                    </Typography>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </>
                ) : (
                  <div style={{ display: "flex" }}>
                    <div>
                      <img
                        src={selectedFile}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </div>
                    <div style={{ marginLeft: "20px" }}>
                      <Typography
                        my={1}
                        sx={{
                          color: "#2C77E9",
                          fontWeight: "500",
                          fontSize: "16px !important",
                        }}
                        onClick={handleButtonClick}
                      >
                        Change Picture
                      </Typography>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <Typography
                        my={1}
                        sx={{
                          color: "#FF5858",
                          fontWeight: "500",
                          fontSize: "16px !important",
                        }}
                        onClick={deletePicture}
                      >
                        Delete Picture
                      </Typography>
                    </div>
                  </div>
                )}
              </Grid>

              <Grid item xs={12} sm={5}>
                <Box mt={4} rowGap={4}>
                  <ButtonWrapper
                    type="submit"
                    color="neutral"
                    width="165px"
                    height="48px"
                    onClick={handleSubmit}
                  >
                    Add Meter
                  </ButtonWrapper>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default AddMeter;
