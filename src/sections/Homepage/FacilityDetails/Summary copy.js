import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Form, Formik } from "formik";
import React from "react";
import { validationSchemaFacilitySummary } from "utils/validations/formValidation";

const Summary = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const initialValues = {
    yearOfConstruction: "",
    grossFloorArea: "",
    numberOfStoreys: "",
    occupancy: "",
    numberOfBuildings: "",
    company: "",
    facilityName: "",
    unitNumber: "",
    streetNumber: "",
    streetName: "",
    city: "",
    province: "",
    postalCode: "",
    facilityCategory: "",
    facilityType: "",
    naicCode: "",
  };

  const handleSubmit = (values) => {};

  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
      }}
    >
      <Formik
        initialValues={{ ...initialValues }}
        validationSchema={validationSchemaFacilitySummary}
        onSubmit={handleSubmit}
      >
        <Form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isSmallScreen ? "column" : "row",
            }}
          >
            <Box
              sx={{
                cursor: "default",
                borderRadius: "2rem",
                background: "#EBEBEB",
                border: "1px solid #D0D0D0",
                textWrap: "nowrap",
                padding: "0.375rem 1rem",
              }}
            >
              <Typography variant="small">Performance Summary</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: isSmallScreen && "1.5rem",
              }}
            >
              <Box
                sx={{
                  cursor: "default",
                  borderRadius: "2rem",
                  background: "#D8FFDC",
                  textWrap: "nowrap",
                  padding: "0.375rem 1rem",
                }}
              >
                <Typography variant="small">
                  status:{" "}
                  <Typography variant="span" sx={{ color: "text.primary" }}>
                    Completed
                  </Typography>
                </Typography>
              </Box>
              <Button variant="contained" sx={{ marginLeft: "2rem" }}>
                Save
              </Button>
            </Box>
          </Box>
          <Grid container rowGap={4} sx={{ marginTop: "2rem" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="yearOfConstruction"
                  label="Year of construction"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="grossFloorArea"
                  label="Gross floor area"
                  type="text"
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox name="numberOfStoreys" label="Number of storeys" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox name="occupancy" label="Occupancy" />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={8}>
                <SelectBox
                  label="How many physical buildings do you consider part of your property?"
                  name="numberOfBuildings"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox name="company" label="Company" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="facilityName"
                  label="Facility Name/Nick Name"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={3}>
                <InputField name="unitNumber" label="Unit Number" type="text" />
              </Grid>
              <Grid item xs={12} sm={3}>
                <InputField
                  name="streetNumber"
                  label="Street Number"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField name="streetName" label="Street Name" type="text" />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField name="city" label="City" type="text" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField name="province" label="Province" type="text" />
              </Grid>
              <Grid item xs={12} sm={3}>
                <InputField name="postalCode" label="Postal Code" type="text" />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox name="facilityCategory" label="Facility Category" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox name="facilityType" label="Facility Type" />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox name="naicsCode" label="NAIC's Code" />
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default Summary;
