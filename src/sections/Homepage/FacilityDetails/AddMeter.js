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
import InputField from "components/FormBuilder/InputField";
import RadioWrapper from "components/FormBuilder/Radio";
import { Field, Form, Formik } from "formik";
import React from "react";

const AddMeter = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const initialValues = {};

  const handleSubmit = (values) => {};
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
        // validationSchema={validationSchemaAddMeter}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid container rowGap={4} sx={{ marginTop: "2rem" }}>
            <Grid container spacing={4}>
              <Grid item>
                <InputLabel htmlFor="meterType">Meter Type*</InputLabel>
                <FormControl>
                  <Field name="meterType">
                    {({ field }) => (
                      <ToggleButtonGroup id="meterType" {...field}>
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
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <RadioWrapper
                  label="Purchased from the Grid"
                  name="purchasedFromTheGrid"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <RadioWrapper
                  label="behindtheMeterGeneration"
                  name="Behind-the-Meter Generation"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField name="meterName" label="Meter name*" type="text" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField name="meterId" label="Meter ID" type="text" />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="date"
                  type="date"
                  label="Date meter became active*"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="date"
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
                  name="stillInUse"
                  label="Still in use"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputLabel htmlFor="isThisAnRevenueGradeMeter">
                  Is this an revenue-grade meter
                </InputLabel>
                <FormControl>
                  <Field name="isThisAnRevenueGradeMeter">
                    {({ field }) => (
                      <ToggleButtonGroup
                        id="isThisAnRevenueGradeMeter"
                        {...field}
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
              <Grid item xs={12} sm={5}>
                <Typography>Upload the most recent utility bill</Typography>
                <Button variant="contained">Upload</Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default AddMeter;
