import { Container, Grid, Typography } from '@mui/material';
import ButtonWrapper from 'components/FormBuilder/Button';
import InputField from 'components/FormBuilder/InputField';
import InputFieldPassword from 'components/FormBuilder/InputFieldPassword';
import { Form, Formik } from 'formik';
import React from 'react'
import { changePasswordValidationSchema } from 'utils/validations/formValidation';

// Form Initial state
const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = () => {
  const handleSubmit = () => {
    console.log("on submit function");
  };


  return (
    <Container>
      <Typography variant="h4" fontWeight={700}>
        Change Password
      </Typography>
      <Typography variant="h6" fontSize={"1rem !important"} fontWeight={400}>
        Enter your new password
      </Typography>
      <Formik
        initialValues={{
          ...initialValues,
        }}
        validationSchema={changePasswordValidationSchema}
        onSubmit={handleSubmit}
      >
          <Form>
            <Grid
              container
              spacing={2}
              sx={{ marginTop: "10px", flexDirection: "column" }}
            >
              <Grid item xs={12} sm={8} md={5} lg={4}>
                <InputFieldPassword
                  name="Enter New Password"
                  type="password"
                  label="Enter New Password"
                  isLabelBlack="true"
                  showeyeicon="true"
                  showpasswordHints="false"
                  isRequiredField={true}
                />
              </Grid>

              <Grid item xs={12} sm={8} md={5} lg={4}>
                <InputFieldPassword
                  name="Confirm Password"
                  type="password"
                  label="Confirm Password"
                  isLabelBlack="true"
                  showeyeicon="true"
                  showpasswordHints="false"
                  isRequiredField={true}
                />
              </Grid>

              <Grid item xs={6} justifyContent="center" sx={{ mt: 3 }}>
                <ButtonWrapper
                  type="submit"
                  color="neutral"
                  width="165px"
                  height="48px"
                >
                  Reset Password
                </ButtonWrapper>
              </Grid>
            </Grid>
          </Form>
      </Formik>
    </Container>
  );
}

export default ChangePassword