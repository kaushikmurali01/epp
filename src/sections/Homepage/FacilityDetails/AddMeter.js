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
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addMeter } from "./../../../redux/actions/metersActions";
import validationSchemaAddMeter from "utils/validations/formValidation";

const AddMeter = ({ onAddMeterSuccess }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [showPurchasedFromGrid, setShowPurchasedFromGrid] = useState(true);
  const [meterAlignment, setMeterAlignment] = useState(1);
  const [revenueAlignment, setRevenueAlignment] = useState("no");
  const [imgUrl, setImgUrl] = useState("");

  const initialValues = {
    meter_name: "",
    meter_type: 1,
    purchased_from_the_grid: true,
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
            Authorization:
              "Bearer " +
              "eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2VuZXJ2YWRldi5iMmNsb2dpbi5jb20vODM2Y2M2YjctMTQ1Zi00ZTlkLWE3MmEtODBmNTAzOWU4NmEzL3YyLjAvIiwic3ViIjoiZTNjZmM1ODQtNDFiYy00NzEyLThjOTctNTM2MWRlZDU5NzE1IiwiYXVkIjoiNmNlNzYzZjQtYTBhNi00NzRkLTk1MmItM2JjN2ViNTk4ZDI1IiwiZXhwIjoxNzE0OTg3MTQzLCJub25jZSI6ImRlZmF1bHROb25jZSIsImlhdCI6MTcxNDkwMDc0MywiYXV0aF90aW1lIjoxNzE0OTAwNzQzLCJvaWQiOiJlM2NmYzU4NC00MWJjLTQ3MTItOGM5Ny01MzYxZGVkNTk3MTUiLCJuYW1lIjoidW5rbm93biIsImdpdmVuX25hbWUiOiJUZXN0IE5hcmVzaCIsImVtYWlscyI6WyJuYXJlc2hAeW9wbWFpbC5jb20iXSwidGZwIjoiQjJDXzFfU2lnblVwU2lnbkluIiwibmJmIjoxNzE0OTAwNzQzfQ.c25wX7o4Kzeo7zOrmYmEwgcrP-dWyPsjO-VD8RCmVefkxU7-FdnmAIQz-hQGgYUhmgTprAvMwA12OPgwC5G6htA4uAxOz-_5gs7MxOMUgCUglni4L-CTSWcYnzkbgJfN78PUICLEy7E9aES3JyDI8He3cbAHueN5FG2EHJ_IMavo2u4RYVmkcp_HyyP9ynf1h7CF0STNveeOsl8_tcFx93_gnRKi76YZ2K8uR-fc_rwiziwRAV53jsmT1t8er2PkxdDUQLG9Mi0Vf9SeV2NGYqLIoPiMX-35Uj5cC9msmdVp0zmgs7I7Q9I1XC_4XEy9qhJuJxLvmrwT1oS_KVkLZw",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(({ data }) => setImgUrl(data?.sasTokenUrl));
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const deletePicture = () => {
    setSelectedFile("");
  };

  const handleSubmit = (values) => {
    const newValues = {
      ...values,
      meter_specification_url: imgUrl,
      facility_id: +id,
      is_rg_meter: values?.is_rg_meter === "yes" ? true : false,
    };
    if (values.meter_type === 2) {
      delete newValues.purchased_from_the_grid;
    }
    dispatch(addMeter(newValues))
      .then(() => {
        onAddMeterSuccess();
      })
      .catch((error) => {
        console.error("Error adding meter:", error);
      });
  };

  const handleMeterTypeChange = (event, newAlignment, form) => {
    setMeterAlignment(newAlignment);
    setShowPurchasedFromGrid(event.target.value === "electricty");
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
            {showPurchasedFromGrid && (
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
                          sx={{ color: "text.secondary2" }}
                          name="stil_in_use"
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
