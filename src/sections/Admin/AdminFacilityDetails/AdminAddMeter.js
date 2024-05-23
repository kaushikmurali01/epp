import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ButtonWrapper from "components/FormBuilder/Button";
import InputField from "components/FormBuilder/InputField";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addAdminMeter,
  fetchAdminMeterDetails,
  updateAdminMeter,
} from "../../../redux/admin/actions/adminMeterActions";
import { validationSchemaAddMeter } from "utils/validations/formValidation";
import { format } from "date-fns";
import { fileUploadAction } from "../../../redux/global/actions/fileUploadAction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AdminAddMeter = ({ onAddMeterSuccess, meterId2 }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [utilityImgUrl, setUtilityImgUrl] = useState("");
  const [specImgUrl, setSpecImgUrl] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const utilityFileInputRef = useRef(null);
  const specFileInputRef = useRef(null);
  const [utilitySelectedFile, setUtilitySelectedFile] = useState();
  const [specSelectedFile, setSpecSelectedFile] = useState();
  const [meterAlignment, setMeterAlignment] = useState(1);
  const [revenueAlignment, setRevenueAlignment] = useState(false);

  useEffect(() => {
    if (meterId2) {
      dispatch(fetchAdminMeterDetails(meterId2))
        .then((response) => {
          const meterDetails = response?.data;
          setInitialValues({
            ...initialValues,
            ...meterDetails,
            meter_active: meterDetails?.meter_active
              ? format(new Date(meterDetails.meter_active), "yyyy-MM-dd")
              : "",
            meter_inactive:
              !meterDetails?.stil_in_Use && meterDetails?.meter_inactive
                ? format(new Date(meterDetails.meter_inactive), "yyyy-MM-dd")
                : "",
          });
          setMeterAlignment(meterDetails?.meter_type);
          setRevenueAlignment(meterDetails?.is_rg_meter);
          setUtilitySelectedFile(meterDetails?.meter_specification_url);
          setUtilityImgUrl(meterDetails?.meter_specification_url);
          setSpecImgUrl(meterDetails?.meter_spec_as_per_measurement);
          setSpecSelectedFile(meterDetails?.meter_spec_as_per_measurement);
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
    is_rg_meter: false,
  });

  const handleUtilityFileChange = (event) => {
    const acceptedDocTypes = [".pdf"];
    const selectedFile = event.target.files[0];
    const fileExtension = `.${selectedFile.name
      .split(".")
      .pop()
      .toLowerCase()}`;

    if (!acceptedDocTypes.includes(fileExtension)) {
      alert(`Selected file type is not supported. Please select a PDF file.`);
      event.target.value = "";
      return;
    }

    setUtilitySelectedFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile))
      .then((data) => {
        setUtilityImgUrl(data?.sasTokenUrl);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleUtilityButtonClick = () => {
    utilityFileInputRef.current.click();
  };

  const deleteUtilityPicture = () => {
    setUtilitySelectedFile("");
  };

  const handleSpecFileChange = (event) => {
    const acceptedDocTypes = [".pdf"];
    const selectedFile = event.target.files[0];
    const fileExtension = `.${selectedFile.name
      .split(".")
      .pop()
      .toLowerCase()}`;

    if (!acceptedDocTypes.includes(fileExtension)) {
      alert(`Selected file type is not supported. Please select a PDF file.`);
      event.target.value = "";
      return;
    }
    setSpecSelectedFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile))
      .then((data) => {
        setSpecImgUrl(data?.sasTokenUrl);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleSpecButtonClick = () => {
    specFileInputRef.current.click();
  };

  const deleteSpecPicture = () => {
    setSpecSelectedFile("");
  };

  const handleSubmit = (values) => {
    const updatedValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (typeof value === "string" && value.trim() === "") {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
    const newValues = {
      ...updatedValues,
      meter_specification_url: utilityImgUrl,
      meter_spec_as_per_measurement: specImgUrl,
      facility_id: +id,
      meter_inactive: values?.stil_in_use
        ? null
        : new Date(values?.meter_inactive),
      meter_active: new Date(values?.meter_active),
    };
    if (values.meter_type !== 1) {
      delete newValues.purchased_from_the_grid;
    }
    if (meterId2) {
      dispatch(updateAdminMeter(meterId2, newValues))
        .then(() => {
          onAddMeterSuccess();
        })
        .catch((error) => {
          console.error("Error updating meter:", error);
        });
    } else {
      dispatch(addAdminMeter(newValues))
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
      <Grid container alignItems="center">
        <IconButton
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.main",
            },
            marginRight: "1rem",
          }}
          onClick={onAddMeterSuccess}
        >
          <ArrowBackIcon
            sx={{
              color: "#fff",
              fontSize: "1.25rem",
            }}
          />
        </IconButton>
        <Typography variant="h4">
          {meterId2 ? "Edit Meter" : "Add Meter"}
        </Typography>
      </Grid>
      <Formik
        initialValues={{ ...initialValues }}
        validationSchema={validationSchemaAddMeter}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }) => (
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
                        <ToggleButton value={3} disabled>
                          Natural Gas
                        </ToggleButton>
                        <ToggleButton value={2} disabled>
                          Water
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </Field>
                </Grid>
              </Grid>
              {meterAlignment <= 1 && (
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
                          name="purchased_from_the_grid"
                          label={
                            <Typography sx={{ fontSize: "14px!important" }}>
                              Purchased from the Grid
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          name="purchased_from_the_grid"
                          label={
                            <Typography sx={{ fontSize: "14px!important" }}>
                              Behind-the-Meter Generation
                            </Typography>
                          }
                        />
                      </RadioGroup>
                    )}
                  </Field>
                </Grid>
              )}
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="meter_name"
                    label="Meter name*"
                    type="text"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputField name="meter_id" label="Meter ID*" type="number" />
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
                            label="Is meter still in use? *"
                          />
                        )}
                      </Field>
                    }
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        {values.meter_inactive && !values.stil_in_use
                          ? "Is meter still in use?"
                          : "Is meter still in use? *"}
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="meter_active"
                    type="date"
                    label="Date meter became active *"
                    inputProps={{
                      max: format(new Date(), "yyyy-MM-dd"),
                    }}
                  />
                </Grid>
                {!values.stil_in_use && (
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="meter_inactive"
                      type="date"
                      label="Date meter became inactive"
                      inputProps={{
                        max: format(new Date(), "yyyy-MM-dd"),
                        min:
                          values?.meter_active &&
                          format(values?.meter_active, "yyyy-MM-dd"),
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <InputLabel htmlFor="is_rg_meter">
                    Is this a revenue-grade meter? *
                  </InputLabel>
                  <FormControl>
                    <Field name="is_rg_meter">
                      {({ field, form }) => (
                        <ToggleButtonGroup
                          id="is_rg_meter"
                          value={values.is_rg_meter}
                          exclusive
                          onChange={(event, newAlignment) => {
                            handleRevenueTypeChange(event, newAlignment, form);
                          }}
                        >
                          <ToggleButton
                            value={true}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            Yes
                          </ToggleButton>
                          <ToggleButton
                            value={false}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            No
                          </ToggleButton>
                        </ToggleButtonGroup>
                      )}
                    </Field>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4} sx={{ marginTop: "10px" }}>
                  <InputLabel>Upload the most recent utility bill</InputLabel>
                  {!utilitySelectedFile ? (
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
                          cursor: "pointer",
                        }}
                        onClick={handleUtilityButtonClick}
                      >
                        Upload
                      </Typography>
                      <input
                        type="file"
                        ref={utilityFileInputRef}
                        style={{ display: "none" }}
                        onChange={handleUtilityFileChange}
                        accept={".pdf"}
                      />
                    </>
                  ) : (
                    <div style={{ display: "flex" }}>
                      <div>
                        <img
                          src={utilitySelectedFile}
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
                          onClick={handleUtilityButtonClick}
                        >
                          Change File
                        </Typography>
                        <input
                          type="file"
                          ref={utilityFileInputRef}
                          style={{ display: "none" }}
                          onChange={handleUtilityFileChange}
                          accept={".pdf"}
                        />
                        <Typography
                          my={1}
                          sx={{
                            color: "#FF5858",
                            fontWeight: "500",
                            fontSize: "16px !important",
                          }}
                          onClick={deleteUtilityPicture}
                        >
                          Delete File
                        </Typography>
                      </div>
                    </div>
                  )}
                  {!utilitySelectedFile && (
                    <Typography variant="small" color="primary">
                      The most recent electric utility bill is required for
                      submitting for baseline modelling
                    </Typography>
                  )}
                </Grid>
                {!values.is_rg_meter && (
                  <Grid item xs={12} sm={6} sx={{ marginTop: "10px" }}>
                    <InputLabel style={{ whiteSpace: "initial" }}>
                      Upload meter specification as per Measurement Canada
                      S-E-04
                    </InputLabel>
                    {!specSelectedFile ? (
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
                            cursor: "pointer",
                          }}
                          onClick={handleSpecButtonClick}
                        >
                          Upload
                        </Typography>
                        <input
                          type="file"
                          ref={specFileInputRef}
                          style={{ display: "none" }}
                          onChange={handleSpecFileChange}
                          accept={".pdf"}
                        />
                      </>
                    ) : (
                      <div style={{ display: "flex" }}>
                        <div>
                          <img
                            src={specSelectedFile}
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
                            onClick={handleSpecButtonClick}
                          >
                            Change File
                          </Typography>
                          <input
                            type="file"
                            ref={specFileInputRef}
                            style={{ display: "none" }}
                            onChange={handleSpecFileChange}
                            accept={".pdf"}
                          />
                          <Typography
                            my={1}
                            sx={{
                              color: "#FF5858",
                              fontWeight: "500",
                              fontSize: "16px !important",
                            }}
                            onClick={deleteSpecPicture}
                          >
                            Delete File
                          </Typography>
                        </div>
                      </div>
                    )}
                    {!specSelectedFile && (
                      <Typography variant="small" color="primary">
                        Meter specification as per Measurement Canada S-E-04 is
                        required
                      </Typography>
                    )}
                  </Grid>
                )}
              </Grid>

              <Grid container xs={12} sm={5}>
                <Box mt={4} rowGap={4}>
                  <ButtonWrapper
                    type="submit"
                    color="neutral"
                    width="165px"
                    height="48px"
                    onClick={handleSubmit}
                  >
                    {meterId2 ? "Save" : "Add Meter"}
                  </ButtonWrapper>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AdminAddMeter;
