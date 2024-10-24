import { Box, Button, FormLabel, Grid, Typography } from "@mui/material";
import InputField from "components/FormBuilder/InputField";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import {
  createEmailTemplate,
  getEmailTemplate,
} from "../../../../redux/admin/actions/adminPerformanceActions";
import { addEmailTemplateValidationSchema } from "utils/validations/formValidation";
import CKEditorComponent from "components/CKEditorComponent";

const AddEmailTemplateModalForm = ({
  facility_id,
  handleCloseAddEmailTemplateModal,
}) => {
  const dispatch = useDispatch();

  const handleEmailCompose = (emailData) => {
    if (emailData && Object?.keys(emailData)?.length > 0) {
      dispatch(createEmailTemplate({ ...emailData, facility_id }))
        .then(() => {
          dispatch(getEmailTemplate(facility_id));
          handleCloseAddEmailTemplateModal();
        })
        .catch((error) => {
          console.error("error getting the email template data", error);
        });
    } else {
      console.error("No email data to save as template");
    }
  };

  return (
    <Formik
      initialValues={{ name: "", subject: "", body: "" }}
      validationSchema={addEmailTemplateValidationSchema}
      onSubmit={(values) => handleEmailCompose(values)}
    >
      {({ setFieldValue, values, isValid, dirty, touched, errors }) => (
        <Form style={{ width: "100%" }}>
          <Grid
            container
            sx={{
              maxWidth: 600,
              margin: "auto",
              display: "grid",
              gap: "1rem",
            }}
          >
            <Grid item xs={12}>
              <InputField
                type="text"
                fullWidth
                name="name"
                label="Name*"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                type="text"
                fullWidth
                name="subject"
                label="Subject*"
                required
              />
            </Grid>
            <Grid item xs={11.98} sx={{ mt: 2, mb: 2, width: "100%" }}>
              <FormLabel>
                Email Content
                <span style={{ color: "red", fontSize: "1rem" }}>*</span>
              </FormLabel>
              <CKEditorComponent name="body" />
              {touched.body && errors.body && (
                <Typography color="error" variant="caption">
                  {errors.body}
                </Typography>
              )}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <Button
                disabled={!(isValid && dirty)}
                type="submit"
                variant="contained"
                color="primary"
              >
                Add email template
              </Button>
              <Button
                type="button"
                variant="contained"
                color="danger"
                sx={{ color: "#FFF" }}
                onClick={handleCloseAddEmailTemplateModal}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default AddEmailTemplateModalForm;