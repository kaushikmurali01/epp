import { Box, Button, Grid,Tab, Tabs, Typography } from "@mui/material";
import ComposeEmailMicroComponent from "./ComposeEmailMicroComponent";
import ContactsMicroComponent from "./ContactsMicroComponent";
import EmailTemplateMicroComponent from "./EmailTemplateMicroComponent";
import IncentiveSettingsMicroComponent from "./IncentiveSettingsMicroComponent";
import EvModal from "utils/modal/EvModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContacts, getEmailTemplate } from "../../../../redux/admin/actions/adminPerformanceActions";
import { USER_MANAGEMENT } from "constants/apiEndPoints";
import { GET_REQUEST } from "utils/HTTPRequests";
import ArchivedEmailListsModal from "./ArchivedEmailListsModal";
import AddEditContactModalForm from "./AddEditContactModalForm";
import AddEmailTemplateModalForm from "./AddEmailTemplateModalForm";

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

  const { contactList, loading } = useSelector(
    (state) => state.adminPerformanceReducer
  );

  const [addEmailTemplateModalConfig, setAddEmailTemplateModalConfig] =
    useState({
      modalVisible: false,
      modalUI: {
        showHeader: false,
        crossIcon: false,
        modalClass: "add-edit-email-template-modal",
        headerTextStyle: "",
        headerSubTextStyle: "",
        fotterActionStyle: "",
        modalBodyContentStyle: "",
        evModalStyle: {
          paperMaxWidth: "720px", // Set the desired max-width
        },
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

  const openAddEmailTemplateModal = () => {
    if (facility_id) {
      setAddEmailTemplateModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: (
          <AddEmailTemplateModalForm
            facility_id={facility_id}
            handleCloseAddEmailTemplateModal={handleCloseAddEmailTemplateModal}
          />
        ),
      }));
    } else {
      console.error("Facility ID is not available");
    }
  };

  const handleCloseAddEmailTemplateModal = () => { 
    setAddEmailTemplateModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  };

  const getEmailTemplates = () => {
    if (facility_id) {
      dispatch(getEmailTemplate(facility_id));
    } else {
      console.error("Facility ID is not available");
    }
  };

  const [getAllCompanyList, setAllCompanyList] = useState([]);

  const getAllCompanyListData = () => {
    const apiURL = USER_MANAGEMENT.GET_COMPANY_LIST + "/" + "0/100";
    GET_REQUEST(apiURL)
      .then((res) => {
        setAllCompanyList(res.data?.data?.rows);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getContactList = () => {
    if (facility_id) {
      dispatch(getContacts(facility_id));
    } else {
      console.error("Facility ID is not available");
    }
  };

  useEffect(() => {
    getEmailTemplates();
    getAllCompanyListData();
    getContactList();
  }, [dispatch]);

  const buttonConfig = {
    compose_email: {
      label: "Facility email archive",
      onClick: () => {
        openEmailArchiveModal();
      },
    },
    contacts: {
      label: "Add Contact",
      onClick: () => {
        openAddContactModal();
      },
    },
    email_template: {
      label: "Add template",
      onClick: () => {
        openAddEmailTemplateModal();
      },
    },
  };

  const [addContactModalConfig, setAddContactModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "add-edit-contact-modal",
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

  const [editingContactId, setEditingContactId] = useState(null);

  const openAddContactModal = (contactId = null) => {
    setEditingContactId(contactId);
    setAddContactModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: contactId ? "Edit contact" : "Add contact",
      modalBodyContent: (
        <AddEditContactModalForm
          contactId={contactId}
          getAllCompanyList={getAllCompanyList}
          contactList={contactList}
          facility_id={facility_id}
          handleCloseAddContactModal={handleCloseAddContactModal}
        />
      ),
    }));
  };

  const handleCloseAddContactModal = () => { 
    setAddContactModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  };

  const openEmailArchiveModal = () => {
    setEmailArchiveModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "Facility email archive",
      modalBodyContent: <ArchivedEmailListsModal facility_id={facility_id} />,
    }));
  };

  const [emailArchiveModalConfig, setEmailArchiveModalConfig] = useState({
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
        width={"100%"}
      >
        <Tabs
          className="theme-tabs-list"
          value={tabValue}
          onChange={handleTabChange}
          sx={{ display: "inline-flex" }}
          variant="scrollable"
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
      {tabValue === "contacts" && (
        <ContactsMicroComponent handleEditContact={openAddContactModal} />
      )}
      {tabValue === "email_template" && <EmailTemplateMicroComponent />}
      <EvModal
        modalConfig={addEmailTemplateModalConfig}
        setModalConfig={setAddEmailTemplateModalConfig}
      />
      <EvModal
        modalConfig={emailArchiveModalConfig}
        setModalConfig={setEmailArchiveModalConfig}
      />
      <EvModal
        modalConfig={addContactModalConfig}
        setModalConfig={setAddContactModalConfig}
      />
    </Grid>
  );
};

export default PerformanceSettingComponent;