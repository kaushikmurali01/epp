import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography,
  styled,
  useMediaQuery,
  Slider,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EvModal from "utils/modal/EvModal";
import { useNavigate, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DataExplorationTab from "sections/Homepage/FacilityDetails/BaselineModel/DataExplorationTab";
import BaselineModelTab from "sections/Homepage/FacilityDetails/BaselineModel/BaselineModelTab";
import SufficiencySettingsModalForm from "sections/Homepage/FacilityDetails/BaselineModel/SufficiencySettingsModalForm";
import { useDispatch, useSelector } from "react-redux";
import Loader from "pages/Loader";
import {
  clearBaselineStateAction,
  fetchBaselineDetailsFromDb,
  fetchIndependentVariableList,
  submitRejectedBaselineDB,
} from "../../../../redux/superAdmin/actions/baselineAction";
import BaselineSuccessModal from "./BaselineSuccessModal";
import EnrollmentModal from "./EnrollmentModal";

export const getSummaryDataByMeterType = (dataToGet, meterType) => {
  const meter = dataToGet?.find((item) => item?.meter_type === meterType);
  return meter;
};

const BaselineModel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [tabValue, setTabValue] = useState("dataExploration");
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const loadingState = useSelector((state) => state?.baselineReducer?.loading);
  const [meterType, setMeterType] = useState(null);
  const [baselineData, setBaselineData] = useState(null);


  const baselineDataSelector = useSelector(
    (state) => state?.baselineReducer?.baselineDetailsDb?.data
  );

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
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showAcceptCheckbox, setShowAcceptCheckbox] = useState(false);

  const showFieldsBasedOnStatus = (baseline_data, meter_type) => {
    const showSubmitData = baseline_data?.some(
      (item) => item?.meter_type === meter_type && item?.status === "CALCULATED"
    );
    if (showSubmitData) {
      setShowAcceptCheckbox(true);
    } else {
      setShowAcceptCheckbox(false);
    }
  };

  const handleSubmitFacilityStatus = (baselineStatus) => {
    if (meterType) {
      const data = getSummaryDataByMeterType(
        baselineData ? baselineData : baselineDataSelector,
        meterType
      );
      const body = { status: baselineStatus };
      dispatch(submitRejectedBaselineDB(data?.id, body)).then(() => {
        openEnrollmentModal();
        dispatch(fetchBaselineDetailsFromDb(id)).then((res) => {
          showFieldsBasedOnStatus(res?.data, meterType);
        });
      });
    }
  };

  const handleCheckboxChange = (e) => {
    setShowSubmitButton(e);
  };

  const [enrollmentModalConfig, setEnrollmentModalConfig] = useState({
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
      saveButtonName: "Yes",
      cancelButtonName: "No",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "",
    headerSubText: "",
    modalBodyContent: "",
    saveButtonAction: "",
  });

  const openEnrollmentModal = () => {
    setEnrollmentModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <EnrollmentModal setEnrollmentModalConfig={setEnrollmentModalConfig} />
      ),
    }));
  };

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
            <Grid container xs={12} md={6} justifyContent="flex-end" gap={4}>
              {showAcceptCheckbox && (
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    sx={{ color: "text.secondary2" }}
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        Baseline model accepted
                      </Typography>
                    }
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
                  />
                </FormGroup>
              )}
              {showSubmitButton ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmitFacilityStatus("SUBMITTED")}
                  sx={{ alignItems: "flex-end" }}
                >
                  Submit facility
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmitFacilityStatus("REQUESTED")}
                  sx={{ alignItems: "flex-end" }}
                >
                  Send help request
                </Button>
              )}
            </Grid>
          )}
        </Grid>

        {tabValue === "dataExploration" && <DataExplorationTab />}
        {tabValue === "baselineModel" && (
          <BaselineModelTab
            showFieldsBasedOnStatus={showFieldsBasedOnStatus}
            setMeterType={setMeterType}
            setBaselineData={setBaselineData}
          />
        )}

        <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
        <EvModal
          modalConfig={enrollmentModalConfig}
          setModalConfig={setEnrollmentModalConfig}
        />
      </Grid>
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState}
        loaderPosition="fixed"
      />
    </Grid>
  );
};

export default BaselineModel;
