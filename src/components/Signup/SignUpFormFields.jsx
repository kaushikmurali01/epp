import React from "react";
import { Formik, Form } from "formik";
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
import CustomPhoneInput from "../FormBuilder/CustomPhoneInput";
import ButtonWrapper from "../FormBuilder/Button";

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
                  <InputField name="firstName" label="First Name" type="text" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField name="lastName" label="Last Name" type="text" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomPhoneInput
                    name="businessLandline"
                    label="Business Landline"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomPhoneInput
                    name="businessMobile"
                    label="Business Mobile"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField name="address" label="Address" type="text" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputFieldPassword
                    name="password"
                    label="Create Password"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputFieldPassword
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField name="companyType" label="Company Type" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField name="companyName" label="Company Name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField name="website" label="Website" />
                </Grid>
                <Grid item xs={12}>
                  <InputField name="addressLine1" label="Address Line 1" />
                </Grid>
                <Grid item xs={12}>
                  <InputField name="addressLine2" label="Address Line 2" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField name="city" label="City" fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField name="province" label="Province/State" />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <InputField name="postalCode" label="Postal Code" />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <InputField name="zipCode" label="Zip Code" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <SelectBox name="country" label="Country" />
                </Grid>

                <Grid item xs={12}>
                  <SelectBox
                    name="facilities"
                    label="How many facilities are planning to enrol with your company account?"
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
                  <FormControlLabel
                    control={<Checkbox />}
                    sx={{ color: "text.secondary2" }}
                    name="termsAgreement"
                    label="I have read and agree to the provisions of the Portal Services Agreement, Which includes limitation on Enerva and IESO warranties and liabilities"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox />}
                    sx={{ color: "text.secondary2" }}
                    name="agree"
                    label="I have read and agree to the provisions of the Portal Services Agreement, Which includes limitation on Enerva and IESO warranties and liabilities"
                  />
                </Grid>
              </Grid>
            )}
            {activeStep === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputField name="email" label="Email" type="email" />
                </Grid>
              </Grid>
            )}
          </>
          <Box mt={4} rowGap={4}>
            {activeStep === 0 && (
              <>
                {/* <Button variant="contained" color="primary" onClick={handleNext}>
                  Next
                </Button> */}
                <ButtonWrapper type="submit" color='neutral' width='165px' height='48px' onClick={handleNext}>
                  Next
                </ButtonWrapper>
              </>
            )}
            {activeStep === 1 && (
              <>
                {/* <Button variant="outlined" onClick={handleNext} sx={{ mr: 4 }}>
                  Sign up
                </Button> */}
                <ButtonWrapper type="submit" color='neutral' width='165px' height='48px' onClick={handleNext}>
                  Sign up
                </ButtonWrapper>
              </>
            )}
            {activeStep !== 0 && (
              <>
                {/* <Button variant="outlined" onClick={handlePrev}>
                  Back
                </Button> */}
                <ButtonWrapper type="submit" color='neutral' width='165px' height='48px' onClick={handlePrev}>
                  Verify
                </ButtonWrapper>
              </>
            )}
          </Box>
        </Form>
      </Formik>
    </>
  );
};

export default SignUpFormFields;
