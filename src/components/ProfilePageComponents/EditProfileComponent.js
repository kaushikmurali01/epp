import React from 'react';
import InputField from "components/FormBuilder/InputField";
import { Form, Formik } from "formik";
import ButtonWrapper from "components/FormBuilder/Button";
import { validationSchemaUserProfile, validationSchemaPUserCompanyrofileDetails } from "utils/validations/formValidation";
import { Box, Grid, Typography } from '@mui/material';

const EditProfileComponent = ({tabStyle, handleSubmit, initialValues, userProfileData}) => {
  const isCompanyProfileEditPermission = (initialValues?.type == 2 && initialValues.rolename == "SuperAdmin") || ((userProfileData?.permissions?.some(obj => obj["permission"] == "edit-profile")))

  return (
    <Grid marginBlockStart={"3.25rem"} gap={"3.25rem"}>
      <Formik
        initialValues={{ ...initialValues }}
        validationSchema={isCompanyProfileEditPermission ? validationSchemaPUserCompanyrofileDetails : validationSchemaUserProfile}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid mb={"3.25rem"}>
            <Typography variant="h6" sx={tabStyle} mb={"1.25rem"}>
              Contact information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <InputField name="first_name" label="First name*" type="text" />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputField name="last_name" label="Last name*" type="text" />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="phonenumber"
                  label="Business Mobile*"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputField isDisabled={true} name="email" label="Email Address*" type="text" />
              </Grid>
            </Grid>
          </Grid>

          {isCompanyProfileEditPermission ? <Grid>
            <Typography variant="h6" sx={tabStyle} mb={"1.25rem"}>
              Company details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="company_name"
                  label="Company name*"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputField name="website" label="Website URL" type="text" />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="unit_number"
                  label="Unit number"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputField
                  name="street_number"
                  label="Street number*"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputField
                  name="street_name"
                  label="Street name*"
                  type="text"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} sm={3}>
                <InputField name="city" label="City*" type="text" />
              </Grid>

              <Grid item xs={12} sm={3}>
                <InputField
                  name="province"
                  label="Province/State*"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <InputField name="country" label="Country*" type="text" />
              </Grid>

              <Grid item xs={12} sm={3}>
                <InputField
                  name="postal_code"
                  label="Zip code/Postal code*"
                  type="text"
                />
              </Grid>
            </Grid>
          </Grid> : null}
          <Box mt={6} rowGap={4}>
            <ButtonWrapper
              type="submit"
              color="neutral"
              width="165px"
              height="48px"
              onClick={handleSubmit}
            >
              Save
            </ButtonWrapper>
          </Box>
        </Form>
      </Formik>
    </Grid>
  );
}

export default EditProfileComponent;