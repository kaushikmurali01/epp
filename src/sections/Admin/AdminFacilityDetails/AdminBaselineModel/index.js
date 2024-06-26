import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EvModal from "utils/modal/EvModal";
import { useNavigate, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DataExplorationTab from "./DataExplorationTab";
import BaselineModelTab from "./BaselineModelTab";
import SufficiencySettingsModalForm from "./SufficiencySettingsModalForm";
import { useDispatch, useSelector } from "react-redux";
import Loader from "pages/Loader";
import { fetchAdminIndependentVariableList } from "../../../../redux/admin/actions/adminBaselineAction";
import SeeSufficiencyDetails from "./SeeSufficiencyDetails";

const AdminBaselineModel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [tabValue, setTabValue] = useState("dataExploration");

  const loadingState = useSelector(
    (state) => state?.adminBaselineReducer?.loading
  );

  const baselinePeriod = useSelector(
    (state) => state?.adminBaselineReducer?.baselinePeriod
  );

  useEffect(() => {
    dispatch(fetchAdminIndependentVariableList(id));
  }, [dispatch, id]);

  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
      headerTextStyle: { color: "rgba(84, 88, 90, 1)", textAlign: "center" },
      headerSubTextStyle: {
        marginTop: "1rem",
        color: "rgba(36, 36, 36, 1)",
        fontSize: { md: "1.125rem" },
        fontWeight: 600,
      },
      fotterActionStyle: "",
      modalBodyContentStyle: {
        color: "rgba(36, 36, 36, 1)",
        fontSize: { md: "0.875rem" },
        fontWeight: 400,
        lineHeight: "128.571%",
        paddingTop: "0 !important",
      },
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Send Request",
      cancelButtonName: "Cancel",
      successButtonStyle: {},
      cancelButtonStyle: {},
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "",
    headerSubText: "",
    modalBodyContent: "",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const isAgreementSigned = true;

  const submitFacilityModalBodyContent = !isAgreementSigned ? (
    "We have received your enrollment request and will review it shortly. Our team will check the facility eligibility and other criteria to approve your request. Please note that this process may take some time. We appreciate your patience and understanding. Once your request is approved, you will receive a Notice of Approval. Thank you for choosing our program!"
  ) : (
    <>
      In order to submit your facility, signing Participant Agreement is
      required.
      <Button
        sx={{ marginTop: "1rem" }}
        variant="contained"
        onClick={() => navigate("/participant-agreement")}
      >
        Go to Participant Agreement
      </Button>
    </>
  );

  const handleSubmitFacility = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      buttonsUI: {
        ...prevState.buttonsUI,
        saveButton: false,
        cancelButton: false,
      },
      headerText: <img src="images/new_user_popup_icon.svg" alt="popup" />,
      headerSubText: "Thank you for your interest!",
      modalBodyContent: submitFacilityModalBodyContent,
    }));
  };

  const handleSufficiencySettingsModel = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      buttonsUI: {
        ...prevState.buttonsUI,
        saveButton: false,
        cancelButton: false,
      },
      headerText: null,
      headerSubText: null,
      modalBodyContent: (
        <SufficiencySettingsModalForm
          handleSufficiencySettingsFormSubmit={
            handleSufficiencySettingsFormSubmit
          }
        />
      ),
    }));
  };

  const handleSufficiencySettingsFormSubmit = (values) => {
    console.log(values);
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigate("/facility-list");
      }}
    >
      Facilities
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigate("/");
      }}
    >
      Wallmart 3
    </Link>,
    <Typography
      key="3"
      sx={{
        color: "rgba(84, 88, 90, 1)",
        fontSize: "0.875rem !important",
        fontWeight: 600,
      }}
    >
      Baseline modeling
    </Typography>,
  ];

  return (
    <Grid
      container
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: { md: "2rem" },
        display: "flex",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <Stack spacing={2}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            color: "rgba(84, 88, 90, 1)",
            fontSize: "0.875rem !important",
            fontWeight: 400,
          }}
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Grid
        container
        sx={{
          width: "100%",
          display: "flex",
          gap: "2rem",
          flexDirection: "column",
        }}
      >
        <Grid container justifyContent={"space-between"}>
          <Grid item xs={12} md={6}>
            <Tabs
              className="theme-tabs-list"
              value={tabValue}
              onChange={handleTabChange}
              sx={{ display: "inline-flex" }}
            >
              <Tab
                value="dataExploration"
                label="Data exploration"
                sx={{ minWidth: "10rem", textTransform: "initial" }}
              />
              <Tab
                value="baselineModel"
                label="Baseline model"
                sx={{ minWidth: "10rem", textTransform: "initial" }}
              />
            </Tabs>
          </Grid>
          {tabValue === "baselineModel" && (
            <Grid container xs={12} md={6} justifyContent="space-between">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  label={
                    <Typography sx={{ fontSize: "14px!important" }}>
                      Baseline model accepted
                    </Typography>
                  }
                />
              </FormGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitFacility}
              >
                Submit facility
              </Button>
            </Grid>
          )}
        </Grid>

        {tabValue === "dataExploration" && <DataExplorationTab />}
        {tabValue === "baselineModel" && (
          <BaselineModelTab
            handleSufficiencySettings={handleSufficiencySettingsModel}
          />
        )}

        <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
      </Grid>
      {/* <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState}
        loaderPosition="fixed"
      /> */}
    </Grid>
  );
};

export default AdminBaselineModel;
