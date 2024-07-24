import { Box, Button } from '@mui/material';
import InputField from 'components/FormBuilder/InputField';
import { Form, Formik } from 'formik';
import React from 'react';
import ReactQuill from 'react-quill';
import { useDispatch } from 'react-redux';
import { createEmailTemplate, getEmailTemplate } from '../../../../redux/admin/actions/adminPerformanceActions';

const AddEmailTemplateModalForm = ({
  facility_id,
  handleCloseAddEmailTemplateModal,
}) => {
  const dispatch = useDispatch();
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, true] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
      ["table"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "table",
  ];

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
      onSubmit={(values) => handleEmailCompose(values)}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Box
            sx={{
              maxWidth: 600,
              margin: "auto",
              display: "grid",
              gap: "1rem",
            }}
          >
            <InputField
              type="text"
              fullWidth
              name="name"
              label="Name"
              required
            />
            <InputField
              type="text"
              fullWidth
              name="subject"
              label="Subject"
              required
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <ReactQuill
                theme="snow"
                value={values.body}
                onChange={(content) => setFieldValue("body", content)}
                modules={modules}
                formats={formats}
                placeholder="Compose your email..."
                className="rc-quill-editor"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <Button type="submit" variant="contained" color="primary">
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
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddEmailTemplateModalForm;