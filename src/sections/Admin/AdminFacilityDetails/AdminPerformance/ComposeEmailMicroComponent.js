import { ButtonGroup, Container, FormLabel, Grid, Typography } from '@mui/material';
import InputField from 'components/FormBuilder/InputField';
import SelectBox from 'components/FormBuilder/Select';
import { Formik, Form, Field } from 'formik';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import EvModal from 'utils/modal/EvModal';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'pages/Loader';
import { getEmailTemplate, sendEmail } from '../../../../redux/admin/actions/adminPerformanceActions';
import parse from 'html-react-parser';
import EmailAutoCompleteWithChip from './EmailAutoCompleteWithChip';
import { emailFormValidationSchema } from 'utils/validations/formValidation';
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import IconButton from "@mui/material/IconButton";

const ComposeEmailMicroComponent = () => {
  const dispatch = useDispatch();
  const { emailTemplateList = [], loading, error } = useSelector(
    (state) => state?.adminPerformanceReducer
  );
  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );

const [selectedToContact, setSelectedToContact] = useState(null);

console.log(selectedToContact, "to contact");

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

    const [previewModalConfig, setPreviewModalConfig] = useState({
      modalVisible: false,
      modalUI: {
        showHeader: true,
        crossIcon: false,
        modalClass: "emailArchiveModal",
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
  
  const handleSendEmail = (values) => {
    console.log("email values", values);
    const { to, cc, subject, body } = values;
    const ccString = Array.isArray(cc) ? cc.join(",") : cc;
    let emailPayload = { to, cc: ccString, subject, body };
    console.log(emailPayload, "payload");
    dispatch(sendEmail(emailPayload, facility_id))
      .then(() => { 
        setInitialValues((prevValues) => ({
          ...prevValues,
          select_template: "",
          to: "",
          cc: "",
          subject: "",
          body: "",
        }));
        dispatch(getEmailTemplate(facility_id));
      })
      .catch((error) => {
      console.log(error);
    })
  };

  const openPreviewModal = (currentValues) => {
    setPreviewModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <PreviewEmail values={currentValues} />,
    }));
  };

  const PreviewEmail = (values) => {
    return (
      <Container sx={previewModalDesign}>
        <Typography sx={{ fontSize: "14px !important" }}>
          <b>
            Dear {selectedToContact?.name ? selectedToContact.name : selectedToContact?.email}
          </b>
          <br />
          {parse(values?.values?.body)}
        </Typography>
      </Container>
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
  ];

  const [isEditableEditor, setIsEditableEditor] = useState(true);
  const toggleEditable = () => {
    setIsEditableEditor(!isEditableEditor);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={emailFormValidationSchema}
        enableReinitialize={true}
        onSubmit={handleSendEmail}
      >
        {({ setFieldValue, values, isValid, dirty, touched, errors }) => {
          const handleTemplateChange = (templateId) => {
            const selectedTemplate = emailTemplateList?.find(
              (template) => template?.id === templateId
            );
            if (selectedTemplate) {
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
                  <EmailAutoCompleteWithChip
                    label="To*"
                    multiple={false}
                    value={values.to}
                    onChange={(newValue) => setFieldValue("to", newValue)}
                    onSelectContact={setSelectedToContact}
                    facility_id={facility_id}
                    error={touched.to && errors.to}
                    helperText={touched.to && errors.to}
                    excludeEmails={values.cc}
                    name="to"
                  />
                </Grid>

                <Grid item xs={12} sx={{ marginTop: "10px" }}>
                  <EmailAutoCompleteWithChip
                    label="CC"
                    multiple={true}
                    value={values.cc}
                    onChange={(newValue) => setFieldValue("cc", newValue)}
                    onSelectContact={() => {}}
                    facility_id={facility_id}
                    error={touched.cc && errors.cc}
                    helperText={touched.cc && errors.cc}
                    excludeEmails={[values.to]}
                    name="cc"
                  />
                </Grid>

                <Grid item xs={12} sx={{ marginTop: "10px" }}>
                  <InputField name="subject" label="Subject*" type="text" />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{ marginTop: "20px", position: "relative" }}
                >
                  <FormLabel>Email Content</FormLabel>
                  <IconButton
                    sx={{ position: "absolute", right: 0, top: 0 }}
                    onClick={toggleEditable}
                    size="small"
                  >
                    {isEditableEditor ? <EditOffIcon /> : <EditIcon />}
                  </IconButton>
                  <ReactQuill
                    theme="snow"
                    value={values.body}
                    onChange={(content) => setFieldValue("body", content)}
                    modules={modules}
                    formats={formats}
                    placeholder="Compose your email..."
                    className="rc-quill-editor"
                    readOnly={isEditableEditor}
                  />
                  {touched.body && errors.body && (
                    <Typography color="error" variant="caption">
                      {errors.body}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                <Grid item>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={!(isValid && dirty)}
                  >
                    Send email
                  </Button>
                  <Button
                    type="button"
                    sx={previewButtonDesign}
                    variant="contained"
                    disabled={!(isValid && dirty)}
                    onClick={() => openPreviewModal(values)}
                  >
                    Preview
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
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
