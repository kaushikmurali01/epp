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
import RadioWrapper from "components/FormBuilder/Radio";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import validationSchemaAddMeter from "utils/validations/formValidation";

const AddMeter = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [showPurchasedFromGrid, setShowPurchasedFromGrid] = useState(true);
  const [alignment, setAlignment] = useState("electricty");

  const initialValues = {
    meter_name: "",
    meter_type: "",
    purchased_from_grid: true,
    meter_id: "",
    meter_active: "",
    meter_inactive: "",
    stil_in_use: false,
    is_rg_meter: "",
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFile(URL.createObjectURL(selectedFile));
    const formData = new FormData();
    formData.append("file", selectedFile);
    axios
      .post(
        "https://ams-enerva-dev.azure-api.net/company-facility/v1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(({ data }) => console.log(data));
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const deletePicture = () => {
    setSelectedFile("");
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  const handleMeterTypeChange = (event, newAlignment) => {
    // setAlignment(newAlignment);
    setShowPurchasedFromGrid(event.target.value === "electricty");
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
      >
        <Form>
          <Grid container rowGap={4} sx={{ marginTop: "2rem" }}>
            <Grid container spacing={4}>
              <Grid item>
                <InputLabel htmlFor="meter_type">Meter Type*</InputLabel>
                <FormControl>
                  <Field name="meter_type">
                    {({ field }) => (
                      <ToggleButtonGroup
                        id="meter_type"
                        // value={alignment}
                        {...field}
                        onChange={handleMeterTypeChange}
                      >
                        <ToggleButton value="electricty">
                          Electricty
                        </ToggleButton>
                        <ToggleButton value="naturalGas">
                          Natural Gas
                        </ToggleButton>
                        <ToggleButton value="water">Water</ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>
            </Grid>
            {showPurchasedFromGrid && (
              <Grid item spacing={4}>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="purchased_from_grid"
                    name="purchased_from_grid"
                    row={true}
                    sx={{ color: "text.secondary2" }}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label="Purchased from the Grid"
                    />

                    <FormControlLabel
                      control={<Radio />}
                      label="Behind-the-Meter Generation"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField name="meter_name" label="Meter name*" type="text" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField name="meter_id" label="Meter ID" type="text" />
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
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="stil_in_use"
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
                    {({ field }) => (
                      <ToggleButtonGroup id="is_rg_meter" {...field}>
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
