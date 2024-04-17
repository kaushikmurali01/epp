import React from "react";
import { Formik, Form, Field } from "formik";
import InputField from "../FormBuilder/InputField";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import InputFieldPassword from "../FormBuilder/InputFieldPassword";
import SelectBox from "../FormBuilder/Select";

const SignUpFormFields = ({
  initialValues,
  validationSchema,
  handleSubmit,
  activeStep,
  steps,
  handlePrev,
  handleNext,
}) => {
  return (
    <>
      <Formik
        initialValues={{ ...initialValues }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <>
            {activeStep === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="firstName"
                    label="First Name"
                    type="text"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="lastName"
                    label="Last Name"
                    type="text"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="businessLandline"
                    label="Business Landline"
                    type="phone"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="businessMobile"
                    label="Business Mobile"
                    type="phone"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="address"
                    label="Address"
                    type="text"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputFieldPassword
                    name="password"
                    label="Create Password"
                    type="password"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputFieldPassword
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            )}
            {activeStep === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="howDidYouHear"
                    label="How did you hear about us?"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="companyType"
                    label="Company Type"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="companyName"
                    label="Company Name"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="website"
                    label="Website"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    name="addressLine1"
                    label="Address Line 1"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    name="addressLine2"
                    label="Address Line 2"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="city"
                    label="City"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="province"
                    label="Province/State"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InputField
                    name="postalCode"
                    label="Postal Code"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <InputField
                    name="zipCode"
                    label="Zip Code"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <SelectBox
                    name="country"
                    label="Country"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <SelectBox
                    name="facilities"
                    label="How many facilities are planning to enrol with your company account?"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="radio-buttons-capitalProject">
                      Are capital projects or operational savings initiatives
                      being planned in the next two years?
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="radio-buttons-capitalProject"
                      name="capitalProject-buttons-group"
                      row={true}
                      sx={{ color: "text.secondary2" }}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />

                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    name="termsAgreement"
                    component={Checkbox}
                    color="primary"
                  >
                    {({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        sx={{ color: "text.secondary2" }}
                        label="I have read and agree to the provisions of the Portal Services Agreement, Which includes limitation on Enerva and IESO warranties and liabilities"
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Field name="agree" component={Checkbox} color="primary">
                    {({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        sx={{ color: "text.secondary2" }}
                        label="I have read and agree to the provisions of the Portal Services Agreement, Which includes limitation on Enerva and IESO warranties and liabilities"
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
            )}
            {activeStep === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
              </Grid>
            )}
          </>
          <Box mt={2} rowGap={4}>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
            {activeStep !== 0 && (
              <Button variant="outlined" onClick={handlePrev}>
                Back
              </Button>
            )}
          </Box>
        </Form>
      </Formik>
    </>
  );
};

export default SignUpFormFields;
