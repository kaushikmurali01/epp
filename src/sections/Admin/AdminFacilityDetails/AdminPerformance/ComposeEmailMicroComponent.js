import { ButtonGroup, Container, FormLabel, Grid, Typography } from '@mui/material';
import InputField from 'components/FormBuilder/InputField';
import SelectBox from 'components/FormBuilder/Select';
import { Formik, Form, Field } from 'formik';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button'; // Importing Material-UI Button
import TextAreaField from 'components/FormBuilder/TextAreaField';
import EvModal from 'utils/modal/EvModal';
import styled from '@emotion/styled';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'pages/Loader';
import { getEmailTemplate, sendEmail } from '../../../../redux/admin/actions/adminPerformanceActions';
import parse from 'html-react-parser';
import EmailAutoCompleteWithChip from './EmailAutoCompleteWithChip';
import { GET_REQUEST } from 'utils/HTTPRequests';

const ComposeEmailMicroComponent = () => {
  const dispatch = useDispatch();
  const { emailTemplateList = [], loading, error } = useSelector(
    (state) => state?.adminPerformanceReducer
  );
  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );

const [initialValues, setInitialValues] = useState({
  select_template: "",
  to: "",
  cc: [],
  subject: "",
  body: "",
});

// Transform emailTemplateList for SelectBox
const templateOptions = Array.isArray(emailTemplateList) && emailTemplateList?.map((template) => ({
  id: template?.id,
  name: template?.name,
  label: template?.name,
  value: template?.id,
}));

  // const handleTemplateChange = (templateId) => {
  // const selectedTemplate = emailTemplateList?.find(
  //   (template) => template?.id === templateId
  // );
  //   if (selectedTemplate) {
  //   console.log(initialValues, "initial");
  //   setInitialValues((prevValues) => ({
  //     ...prevValues,
  //     select_template: templateId,
  //     subject: selectedTemplate?.subject,
  //     body: selectedTemplate?.body,
  //   }));
  // }
  // };
  
    console.log(initialValues, "initial outside");


// Validation function for email addresses
const validateEmails = (value) => {
  const emails = value?.split(",").map((email) => email.trim());
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const invalidEmails = emails?.filter((email) => !emailRegex.test(email));
  if (invalidEmails?.length > 0) {
    return `Invalid email(s): ${invalidEmails.join(", ")}`;
  }
  return undefined;
};
  

  const [previewModalConfig, setPreviewModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
      headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
      headerSubTextStyle: {
        marginTop: "1rem",
        color: "rgba(36, 36, 36, 1)",
        fontSize: { md: "0.875rem" },
      },
      fotterActionStyle: "",
      modalBodyContentStyle: "",
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Sent Request",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    modalBodyContent: "",
  });

  const previewButtonDesign = {
    marginLeft: "10px",
    backgroundColor: "#ffffff",
    color: "#2E813E",
    border: "1px solid #2E813E",
    "&:hover": {
      backgroundColor: "#ffffff",
      border: "1px solid #2E813E",
    },
  };

  const previewModalDesign = {
    border: "1px solid #2E813E",
    backgroundColor: "#EBFFEF",
    padding: "10px",
    borderRadius: "10px",
    color: "#242424",
  };

  const extractEmails = (data) => {
    return data.map((item) => item.email).filter(Boolean);
  };

  const handleSendEmail = (values) => {
    console.log("email values", values);
    const {to, cc, subject, body } = values;
    // let emailPayload = { to, cc, subject, body };
    const emailPayload = {
      to: extractEmails(to),
      cc: extractEmails(cc),
      subject,
      body,
    };
    console.log(emailPayload, "payload");
    // dispatch(sendEmail(emailPayload, facility_id))
    //   .then(() => { 
    //     setInitialValues((prevValues) => ({
    //       ...prevValues,
    //       select_template: "",
    //       to: "",
    //       cc: "",
    //       subject: "",
    //       body: "",
    //     }));
    //     dispatch(getEmailTemplate(facility_id));
    //   })
    //   .catch((error) => {
    //   console.log(error);
    // })
  };

  const openPreviewModal = (currentValues) => {
    setPreviewModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <PreviewEmail values={currentValues} />,
    }));
  };

  const extractNames = (data) => {
    console.log("extractNames input:", data);
    if (!Array.isArray(data)) return "";
    const result = data.map((item) => item.name || item.email).join(", ");
    console.log("extractNames output:", result);
    return result;
  };

  useEffect(() => {
    console.log("initialValues updated:", initialValues);
  }, [initialValues]);

  const PreviewEmail = (values) => {
    
    return (
      <>
        <Container sx={previewModalDesign}>
          <Typography sx={{ fontSize: "14px !important" }}>{ extractNames(values?.to)}<br />{parse(values?.body)}</Typography>
        </Container>
      </>
    );
  };

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

  return (
    <>
      <Formik
        initialValues={{ ...initialValues }}
        enableReinitialize={true}
        onSubmit={handleSendEmail}
      >
        {({ setFieldValue, values }) => {
          const handleTemplateChange = (templateId) => {
            const selectedTemplate = emailTemplateList?.find(
              (template) => template?.id === templateId
            );
            if (selectedTemplate) {
              console.log(values, "initial");
              setFieldValue("select_template", templateId);
              setFieldValue("subject", selectedTemplate?.subject);
              setFieldValue("body", selectedTemplate?.body);
            }
          };

          return (
            <Form>
              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={12}>
                  <SelectBox
                    name="select_template"
                    label="Select Template"
                    options={templateOptions}
                    onChange={(e) => {
                      setFieldValue("select_template", e.target.value);
                      handleTemplateChange(e.target.value);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sx={{ marginTop: "10px" }}>
                  <Field
                    name="to"
                    render={({ field }) => (
                      <EmailAutoCompleteWithChip
                        {...field}
                        value={values.to}
                        onChange={(newValue) => {
                          setFieldValue("to", newValue);
                        }}
                        label="To*"
                        isDisabled={false}
                        withoutChip={true}
                        facility_id={facility_id}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sx={{ marginTop: "10px" }}>
                  <Field
                    name="cc"
                    render={({ field }) => (
                      <EmailAutoCompleteWithChip
                        {...field}
                        value={values.cc}
                        onChange={(newValue) => {
                          setFieldValue("cc", newValue);
                        }}
                        label="CC*"
                        isDisabled={false}
                        facility_id={facility_id}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sx={{ marginTop: "10px" }}>
                  <InputField name="subject" label="Subject" type="text" />
                </Grid>

                <Grid item xs={12} sx={{ marginTop: "10px" }}>
                  <FormLabel>Email Content</FormLabel>
                  <ReactQuill
                    theme="snow"
                    value={values.body}
                    onChange={(content) => setFieldValue("body", content)}
                    modules={modules}
                    formats={formats}
                    placeholder="Compose your email..."
                    className="rc-quill-editor"
                    readOnly
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                <Grid item>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                  // onClick={() => openEmailArchiveModal()}
                  >
                    Send email
                  </Button>
                  <Button
                    type="button"
                    sx={previewButtonDesign}
                    variant="contained"
                    onClick={() => openPreviewModal(values)}
                  >
                    Preview
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )
        }}
      </Formik>

      <EvModal
        modalConfig={previewModalConfig}
        setModalConfig={setPreviewModalConfig}
      />
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />
    </>
  );
};

export default ComposeEmailMicroComponent;
