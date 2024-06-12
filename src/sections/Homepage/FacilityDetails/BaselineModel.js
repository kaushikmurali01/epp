import { Breadcrumbs, Button, Grid, Link, Stack, Tab, Tabs, Typography, styled, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import EvModal from "utils/modal/EvModal";
import { useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DataExplorationTab from "components/BaselineModel/DataExplorationTab";
import BaselineModelTab from "components/BaselineModel/BaselineModelTab";

const BaselineModel = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("dataExploration");
  const [sufficiencySettingsTabValue, setSufficiencySettingsTabValue] =
    useState("data_sufficiency_setting");
  ;
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
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

  
  const handleSufficiencySettingsTabChange = (event, newValue) => {
    setSufficiencySettingsTabValue(newValue);
  };

  const isAgreementSigned = true;

const submitFacilityModalBodycontent = !isAgreementSigned ? (
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
      modalBodyContent: submitFacilityModalBodycontent,
    }));
  };

  const sufficiencySettingsInModel = (
    <>
      <Grid item xs={12} md={6}>
        <Tabs
          className="theme-tabs-list"
          value={sufficiencySettingsTabValue}
          onChange={handleSufficiencySettingsTabChange}
          sx={{ display: "inline-flex" }}
        >
          <Tab
            value="data_sufficiency_setting"
            label="Data sufficiency setting"
            sx={{ minWidth: "10rem", textTransform: "initial" }}
          />
          <Tab
            value="model_setting"
            label="Model setting"
            sx={{ minWidth: "10rem", textTransform: "initial" }}
          />
        </Tabs>
      </Grid>
      <Grid></Grid>
    </>
  );

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
      modalBodyContent: sufficiencySettingsInModel,
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
        marginTop: isSmallScreen && "2rem",
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
        <Grid
          item
          display={"flex"}
          justifyContent={"space-between"}
          gap={"1rem"}
        >
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
            <Grid item>
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
    </Grid>
  );
};

export default BaselineModel;
