import { Box, Button, ButtonGroup, Grid, styled, Tab, Tabs, Typography } from "@mui/material";
import ComposeEmailMicroComponent from "./ComposeEmailMicroComponent";
import ContactsMicroComponent from "./ContactsMicroComponent";
import EmailTemplateMicroComponent from "./EmailTemplateMicroComponent";
import IncentiveSettingsMicroComponent from "./IncentiveSettingsMicroComponent";
import EvModal from "utils/modal/EvModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import InputField from "components/FormBuilder/InputField";
import ReactQuill from "react-quill";
import { createEmailTemplate, getEmailTemplate } from "../../../../redux/admin/actions/adminPerformanceActions";
import Loader from "pages/Loader";

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  "& .MuiButtonGroup-firstButton": {
    borderRadius: "20.8125rem 0rem 0rem 20.8125rem",
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-middleButton": {
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-lastButton": {
    borderRadius: "0 20.8125rem 20.8125rem 0",
  },
  "& .MuiButton-root": {
    "&:hover": {
      color: "#F7F7F5",
    },
  },
}));

const PerformanceSettingComponent = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState("setting");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const facilityDetails = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data
  );

  const facility_id = facilityDetails?.id;

  const { loading} = useSelector(
    (state) => state.adminPerformanceReducer
  );

  const [addEmailTemplateModalConfig, setAddEmailTemplateModalConfig] =
    useState({
      modalVisible: false,
      modalUI: {
        showHeader: false,
        crossIcon: false,
        modalClass: "",
        headerTextStyle: "",
        headerSubTextStyle: "",
        fotterActionStyle: "",
        modalBodyContentStyle: "",
      },
      buttonsUI: {
        saveButton: false,
        cancelButton: false,
        saveButtonName: "",
        cancelButtonName: "",
        saveButtonClass: "",
        cancelButtonClass: "",
      },
      modalBodyContent: "",
    });

  const AddEmailTemplateForm = ({ facility_id }) => {
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
      console.log("emailData", emailData);
      if (emailData && Object?.keys(emailData)?.length > 0) {
        dispatch(createEmailTemplate({ ...emailData, facility_id }))
          .then(() => {
            dispatch(getEmailTemplate(facility_id));
            setAddEmailTemplateModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
            }));
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
                  onClick={() => {
                    setAddEmailTemplateModalConfig((prevState) => ({
                      ...prevState,
                      modalVisible: false,
                    }));
                  }}
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

  const openAddEmailTemplateModal = () => {
    if (facility_id) {
      setAddEmailTemplateModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <AddEmailTemplateForm facility_id={facility_id} />,
      }));
    } else {
      console.error("Facility ID is not available");
    }
  };

  const getEmailTemplates = () => {
    if (facility_id) {
      dispatch(getEmailTemplate(facility_id));
    } else {
      console.error("Facility ID is not available");
    }
  };

  useEffect(() => {
    getEmailTemplates();
  }, []);

  const buttonConfig = {
    compose_email: {
      label: "Facility email archive",
      onClick: () => {
        openEmailArchiveModal();
      },
    },
    // contacts: {
    //   label: "Add Contact",
    //   onClick: () => {
    //     // Handle click for Add Contact
    //   },
    // },
    email_template: {
      label: "Add template",
      onClick: () => {
        openAddEmailTemplateModal();
      },
    },
  };

  const openEmailArchiveModal = () => {
    setEmailArchiveModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "Facility email archive",
      modalBodyContent: "",
    }));
    setTimeout(() => {
      setEmailArchiveModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <ArchiveEmail />,
      }));
    }, 10);
  };

   const buttonStyle = {
     padding: "0.44rem 1.5rem",
     lineHeight: "1",
     height: "max-content",
     borderRadius: "50px",

     ".MuiButtonGroup-firstButton": {
       BorderRight: "10px",
     },
   };

   const activeButtonStyle = {
     ...buttonStyle,
     backgroundColor: "#2E813E",
     color: "#F7F7F5",
     "&:hover": {
       backgroundColor: "#2E813E",
     },
   };

   const inactiveButtonStyle = {
     ...buttonStyle,
     backgroundColor: "#EBEBEB",
     color: "#696969",
   };

   const emailArchiveBoxStyle = {
     display: "block",
     backgroundColor: "#EBFFEF",
     padding: "10px",
     borderRadius: "5px",
     marginTop: "10px",
   };
  
  const [emailArchiveModalConfig, setEmailArchiveModalConfig] = useState({
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

  const ArchiveEmail = () => {
    const [activeButtonEmailArchive, setActiveButtonEmailArchive] = useState(0);

    const handleEmailArchiveButtonClick = (index) => {
      setActiveButtonEmailArchive(index);
    };

    return (
      <>
        <Grid container>
          <input
            type="search"
            style={{ width: "100%", height: "40px", borderRadius: "10px" }}
          />

          <StyledButtonGroup
            disableElevation
            variant="contained"
            color="primary"
            sx={{ marginTop: "15px", marginBottom: "10px" }}
          >
            <Button
              sx={
                activeButtonEmailArchive === 0
                  ? activeButtonStyle
                  : inactiveButtonStyle
              }
              onClick={() => handleEmailArchiveButtonClick(0)}
            >
              All
            </Button>
            <Button
              sx={
                activeButtonEmailArchive === 1
                  ? activeButtonStyle
                  : inactiveButtonStyle
              }
              onClick={() => handleEmailArchiveButtonClick(1)}
            >
              User send
            </Button>
            <Button
              sx={
                activeButtonEmailArchive === 2
                  ? activeButtonStyle
                  : inactiveButtonStyle
              }
              onClick={() => handleEmailArchiveButtonClick(2)}
            >
              System generated
            </Button>
          </StyledButtonGroup>

          {activeButtonEmailArchive === 0 ||
          activeButtonEmailArchive === 1 ||
          activeButtonEmailArchive === 2 ? (
            <>
              <Grid container sx={emailArchiveBoxStyle}>
                <Typography
                  sx={{
                    color: "#54585A",
                    fontSize: "12px !important",
                    fontWeight: "400",
                  }}
                >
                  Email Subject
                </Typography>
                <Typography
                  sx={{
                    color: "#242424",
                    fontSize: "18px !important",
                    fontWeight: "600",
                  }}
                >
                  Recipient’s email Address
                </Typography>
                <Typography
                  sx={{
                    color: "#54585A",
                    fontSize: "12px !important",
                    fontWeight: "400",
                  }}
                >
                  Date sent
                </Typography>
                <Typography
                  sx={{
                    color: "#242424",
                    fontSize: "14px !important",
                    fontWeight: "500",
                  }}
                >
                  6/14/2023
                </Typography>
              </Grid>

              <Grid container sx={emailArchiveBoxStyle}>
                <Typography
                  sx={{
                    color: "#54585A",
                    fontSize: "12px !important",
                    fontWeight: "400",
                  }}
                >
                  Email Subject
                </Typography>
                <Typography
                  sx={{
                    color: "#242424",
                    fontSize: "18px !important",
                    fontWeight: "600",
                  }}
                >
                  Recipient’s email Address
                </Typography>
                <Typography
                  sx={{
                    color: "#54585A",
                    fontSize: "12px !important",
                    fontWeight: "400",
                  }}
                >
                  Date sent
                </Typography>
                <Typography
                  sx={{
                    color: "#242424",
                    fontSize: "14px !important",
                    fontWeight: "500",
                  }}
                >
                  6/14/2023
                </Typography>
              </Grid>

              <Grid container sx={emailArchiveBoxStyle}>
                <Typography
                  sx={{
                    color: "#54585A",
                    fontSize: "12px !important",
                    fontWeight: "400",
                  }}
                >
                  Email Subject
                </Typography>
                <Typography
                  sx={{
                    color: "#242424",
                    fontSize: "18px !important",
                    fontWeight: "600",
                  }}
                >
                  Recipient’s email Address
                </Typography>
                <Typography
                  sx={{
                    color: "#54585A",
                    fontSize: "12px !important",
                    fontWeight: "400",
                  }}
                >
                  Date sent
                </Typography>
                <Typography
                  sx={{
                    color: "#242424",
                    fontSize: "14px !important",
                    fontWeight: "500",
                  }}
                >
                  6/14/2023
                </Typography>
              </Grid>
            </>
          ) : null}
        </Grid>
      </>
    );
  };

  return (
    <Grid
      container
      sx={{
        width: "100%",
        display: "flex",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <Grid
        item
        display={"flex"}
        flexWrap={"wrap"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={"1rem"}
      >
        <Grid item>
          <Tabs
            className="theme-tabs-list"
            value={tabValue}
            onChange={handleTabChange}
            sx={{ display: "inline-flex" }}
          >
            <Tab
              value="setting"
              label="Setting"
              sx={{ minWidth: "10rem", textTransform: "initial" }}
            />
            <Tab
              value="compose_email"
              label="Compose email"
              sx={{ minWidth: "10rem", textTransform: "initial" }}
            />
            <Tab
              value="contacts"
              label="Contacts"
              sx={{ minWidth: "10rem", textTransform: "initial" }}
            />
            <Tab
              value="email_template"
              label="Email template"
              sx={{ minWidth: "10rem", textTransform: "initial" }}
            />
          </Tabs>
        </Grid>
        {buttonConfig[tabValue] && (
          <Grid item>
            <Typography
              variant="contained"
              color="blue.main"
              sx={{
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 400,
              }}
              onClick={buttonConfig[tabValue].onClick}
            >
              {buttonConfig[tabValue].label}
            </Typography>
          </Grid>
        )}
      </Grid>
      {/* Additional Grid or other components can be added here */}
      {tabValue === "setting" && <IncentiveSettingsMicroComponent />}
      {tabValue === "compose_email" && <ComposeEmailMicroComponent />}
      {tabValue === "contacts" && <ContactsMicroComponent />}
      {tabValue === "email_template" && <EmailTemplateMicroComponent />}
      <EvModal
        modalConfig={addEmailTemplateModalConfig}
        setModalConfig={setAddEmailTemplateModalConfig}
      />
      <EvModal
        modalConfig={emailArchiveModalConfig}
        setModalConfig={setEmailArchiveModalConfig}
      />
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />
    </Grid>
  );
};

export default PerformanceSettingComponent;