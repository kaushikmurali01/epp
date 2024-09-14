import {
  Breadcrumbs,
  Grid,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EvModal from "utils/modal/EvModal";
import { useNavigate, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DataExplorationTab from "sections/Homepage/FacilityDetails/BaselineModel/DataExplorationTab";
import BaselineModelTab from "sections/Homepage/FacilityDetails/BaselineModel/BaselineModelTab";
import { useDispatch, useSelector } from "react-redux";
import Loader from "pages/Loader";

import EnrollmentModal from "./EnrollmentModal";
import {
  clearBaselineStateAction,
  fetchIndependentVariableList,
} from "../../../../redux/superAdmin/actions/baselineAction";

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
  const baselinePeriodLoading = useSelector(
    (state) => state?.baselineReducer?.baselinePeriodLoading
  );
  const sufficiencyCheckLoading = useSelector(
    (state) => state?.baselineReducer?.sufficiencyCheckLoading
  );
  const summaryLoading = useSelector(
    (state) => state?.baselineReducer?.summaryLoading
  );

  useEffect(() => {
    dispatch(fetchIndependentVariableList(id));
    return () => {
      dispatch(clearBaselineStateAction());
    };
  }, [id]);

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
      {/* <Stack spacing={2}>
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
      </Stack> */}
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
        </Grid>

        {tabValue === "dataExploration" && <DataExplorationTab />}
        {tabValue === "baselineModel" && (
          <BaselineModelTab openEnrollmentModal={openEnrollmentModal} />
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
        loadingState={
          loadingState ||
          baselinePeriodLoading ||
          sufficiencyCheckLoading ||
          summaryLoading
        }
        loaderPosition="fixed"
        loaderText={"Baseline calculation "}
      />
    </Grid>
  );
};

export default BaselineModel;
