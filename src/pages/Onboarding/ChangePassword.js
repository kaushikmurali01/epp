import { Container, Grid, Typography, Button } from "@mui/material";
import { Formik, Form } from "formik";
import React from "react";
import InputFieldPassword from "components/FormBuilder/InputFieldPassword";
import { changePasswordValidationSchema } from "utils/validations/formValidation";

// Form Initial state
const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = () => {
  const handleSubmit = (values) => {
    console.log("Submitted values:", values);
  };

  return (
    <Container>
      <Typography variant="h4" fontWeight={700}>
        Change Password
      </Typography>
      <Typography variant="h6" fontSize="1rem !important" fontWeight={400}>
        Enter your new password
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={changePasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, isValid, dirty }) => (
          <Form>
            <Grid
              container
              spacing={4}
              sx={{ marginTop: "10px", flexDirection: "column" }}
            >
              <Grid item xs={12} sm={8} md={5} lg={4}>
                <InputFieldPassword
                  name="newPassword"
                  label="Enter New Password"
                  isLabelBlack={true}
                  showeyeicon={true}
                  showpasswordHints={false}
                  isRequiredField={true}
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={8} md={5} lg={4}>
                <InputFieldPassword
                  name="confirmPassword"
                  label="Confirm Password"
                  isLabelBlack={true}
                  showeyeicon={true}
                  showpasswordHints={false}
                  isRequiredField={true}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid item xs={6} justifyContent="center" sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    !isValid ||
                    !dirty ||
                    values.newPassword !== values.confirmPassword
                  }
                  sx={{
                    backgroundColor:
                      !isValid ||
                      !dirty ||
                      values.newPassword !== values.confirmPassword
                        ? "grey"
                        : "primary.main",
                  }}
                >
                  Reset Password
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ChangePassword;
