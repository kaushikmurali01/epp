import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, useFormikContext } from "formik";
import { Container, FormLabel, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import EvModal from "utils/modal/EvModal";
import EmailAutoCompleteWithChip from "./EmailAutoCompleteWithChip";
import CKEditorComponent from "components/CKEditorComponent";
import { emailFormValidationSchema } from "utils/validations/formValidation";
import {
  getEmailTemplate,
  sendEmail,
  getDynamicEmailTemplate,
} from "../../../../redux/admin/actions/adminPerformanceActions";
import parse from "html-react-parser";
import { Height } from "@mui/icons-material";
import NotificationsToast from "utils/notification/NotificationsToast";

const ComposeEmailMicroComponent = () => {
  const dispatch = useDispatch();
  const { emailTemplateList = [] } = useSelector(
    (state) => state?.adminPerformanceReducer
  );
  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );

  const [selectedToContact, setSelectedToContact] = useState(null);
  const [isEditableEditor, setIsEditableEditor] = useState(true);
  const [isEmailSystemGenerated, setIsEmailSystemGenerated] = useState(false);

  const [initialValues, setInitialValues] = useState({
    select_template: "",
    to: "",
    cc: [],
    subject: "",
    body: "",
  });

  const templateOptions = emailTemplateList?.map((template) => ({
    id: template?.id || template?.name,
    name: template?.name,
    label: template?.name,
    value: template?.id || template?.name,
  }));

  const [previewModalConfig, setPreviewModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "emailArchiveModal preview-email",
      headerTextStyle: { color: "rgba(84, 88, 90, 1)", margin: "0 0 1rem 0" },
      headerSubTextStyle: {
        marginBottom: "1rem",
        color: "rgba(84, 88, 90, 1)",
        fontSize: { xs: "1.125rem !important", sm: "1.5rem !important" },
        fontWeight: "600",
      },
      fotterActionStyle: "",
      modalBodyContentStyle: "",
      evModalStyle: {
        paperMaxWidth: "720px",
      },
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Sent Request",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerSubText: "Preview",
    modalBodyContent: "",
  });

  const handleTemplateChange = async (templateId, setFieldValue) => {
    const selectedTemplate = emailTemplateList?.find(
      (template) => template?.id === templateId || template?.name === templateId
    );

    if (selectedTemplate) {
      setFieldValue("select_template", templateId);

      if (selectedTemplate.id === null) {
        // Fetch dynamic template
        dispatch(getDynamicEmailTemplate(facility_id, selectedTemplate.temp_name)).then((res) => {
          if (res && Object.keys(res).length > 0) {
            setFieldValue("to", res.to || "");
            setFieldValue("cc", res.cc || []);
            setFieldValue("subject", res.subject || "");
            setFieldValue("body", res.body || "");
            setIsEmailSystemGenerated(true);
          } else {
            setIsEmailSystemGenerated(false);
            console.warn(
              "Received empty or invalid response from getDynamicEmailTemplate"
            );
            NotificationsToast({
              message:
                "Received empty or invalid response for selected template.",
              type: "warning",
            });
            // Set default values or clear the fields
            setFieldValue("select_template", "");
            setFieldValue("to", "");
            setFieldValue("cc", []);
            setFieldValue("subject", "");
            setFieldValue("body", "");
          }
        }).catch((error) => {
          console.error("Error fetching dynamic template:", error);
        });
      } else {
        // Use existing template
        setFieldValue("subject", selectedTemplate?.subject);
        setFieldValue("body", selectedTemplate?.body);
        setIsEmailSystemGenerated(false);
      }
    }
  };

  const openPreviewModal = (currentValues) => {
    setPreviewModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <PreviewEmail values={currentValues} />,
    }));
  };

  const PreviewEmail = ({ values }) => (
    <Container sx={previewModalDesign}>
      {/* <Typography> */}
        {parse(values?.body)}
      {/* </Typography> */}
    </Container>
  );

  const toggleEditable = () => setIsEditableEditor(!isEditableEditor);

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
    paddingLeft: "10px !important",
    paddingRight: "10px !important",
    borderRadius: "10px",
    color: "#242424",
    height: "100%",
  };

  const CCFieldHandler = () => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
      if (values.to && values.cc) {
        const filteredCC = values.cc.filter((email) => email !== values.to);
        if (filteredCC.length !== values.cc.length) {
          setFieldValue("cc", filteredCC);
        }
      }
    }, [values.to, values.cc]);

    return null;
  };

   const handleSendEmail = (values, { resetForm }) => {
     const { to, cc, subject, body } = values;
     const ccString = Array.isArray(cc) ? cc.join(",") : cc;
     const wrappedBody = `<div style="max-width: 600px; margin: 0 auto;">${body}</div>`;
     let emailPayload = {
       to,
       cc: ccString,
       subject,
       body: wrappedBody,
       is_system_generated: isEmailSystemGenerated,
     };

     dispatch(sendEmail(emailPayload, facility_id))
       .then(() => {
         console.log("Email sent successfully");
         resetForm();
         setIsEmailSystemGenerated(false);
         dispatch(getEmailTemplate(facility_id));
       })
       .catch((error) => {
         console.log(error);
         setIsEmailSystemGenerated(false);
       });
   };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={emailFormValidationSchema}
        enableReinitialize={true}
        onSubmit={handleSendEmail}
      >
        {({
          setFieldValue,
          values,
          isValid,
          dirty,
          touched,
          errors,
          resetForm,
        }) => (
          <Form style={{ width: "100%" }}>
            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid item xs={12}>
                <SelectBox
                  name="select_template"
                  label="Select Template"
                  options={templateOptions}
                  onChange={(e) =>
                    handleTemplateChange(e.target.value, setFieldValue)
                  }
                />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: "10px" }}>
                <CCFieldHandler />
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
                <Typography variant="caption" color="primary">
                  Hit enter to add the email in CC
                </Typography>
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
                  color="primary"
                >
                  {isEditableEditor ? <EditOffIcon /> : <EditIcon />}
                </IconButton>
                <CKEditorComponent name="body" isReadOnly={isEditableEditor} />
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
        )}
      </Formik>

      <EvModal
        modalConfig={previewModalConfig}
        setModalConfig={setPreviewModalConfig}
      />
    </>
  );
};

export default ComposeEmailMicroComponent;