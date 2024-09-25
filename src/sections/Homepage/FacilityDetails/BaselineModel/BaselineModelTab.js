import React, { useEffect, useState } from "react";
import ModelConstructorForm from "./ModelConstructorForm";
import CustomAccordion from "components/CustomAccordion";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import BaselineSummary from "./BaselineSummary";
import BaselineVisualization from "./BaselineVisualization";
import {
  StyledButtonGroup,
  activeButtonStyle,
  inactiveButtonStyle,
} from "./styles";

import SeeSufficiencyDetails from "./SeeSufficiencyDetails";
import EvModal from "utils/modal/EvModal";
import HelpRequestModal from "./HelpRequestModal";
import BaselineSuccessModal from "./BaselineSuccessModal";
import EnrollmentModal from "./EnrollmentModal";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addBaselineToDb,
  clearBaselineStateAction,
  fetchBaselineDetailsFromDb,
  fetchIndependentVariableList,
  submitRejectedBaselineDB,
} from "../../../../redux/superAdmin/actions/baselineAction";
import { format } from "date-fns";
import { getSummaryDataByMeterType } from ".";
import ModelConstructorView from "./ModelConstructorView";
import { fetchFacilityStatus } from "../../../../redux/superAdmin/actions/facilityActions";

const BaselineModelTab = ({ openEnrollmentModal }) => {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState(1);
  const { id } = useParams();
  const [renderViewOnlyComp, setRenderViewOnlyComp] = useState(false);
  const [baselineDetails, setBaselineDetails] = useState(null);
  const [expanded, setExpanded] = useState("modelConstructor");

  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  useEffect(() => {
    dispatch(fetchBaselineDetailsFromDb(id));
  }, [dispatch, id]);

  const baselineListData = useSelector(
    (state) => state?.baselineReducer?.baselineDetailsDb?.data
  );
  const facilityDetails = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );

  useEffect(() => {
    handleBaselineDetails();
    const baselineDataStoredInDB = getSummaryDataByMeterType(
      baselineListData,
      activeButton
    );
    if (
      baselineDataStoredInDB?.user_type === 1 &&
      (baselineDataStoredInDB?.status === "USER_SUBMITTED" ||
        baselineDataStoredInDB?.status === "SUBMITTED" ||
        baselineDataStoredInDB?.status === "REQUESTED")
    ) {
      setRenderViewOnlyComp(true);
    } else {
      setRenderViewOnlyComp(false);
    }
  }, [id, activeButton, baselineListData]);

  const handleBaselineDetails = () => {
    const meter = getSummaryDataByMeterType(baselineListData, activeButton);
    setBaselineDetails(meter);
  };

  const [seeDetailsModalConfig, setSeeDetailsModalConfig] = useState({
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
    headerText: "Details",
    headerSubText: "",
    modalBodyContent: "",
    saveButtonAction: "",
  });

  const openSeeDetailsModal = (
    sufficiency_Data,
    baseline_start_date,
    baseline_end_date
  ) => {
    setSeeDetailsModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <SeeSufficiencyDetails
          meterType={activeButton}
          sufficiency_Data={sufficiency_Data}
          baselineStartDate={baseline_start_date}
          baselineEndDate={baseline_end_date}
        />
      ),
    }));
  };

  const [sendHelpModalConfig, setSendHelpModalConfig] = useState({
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

  const openSendHelpRequestModal = (help_sent) => {
    setSendHelpModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <HelpRequestModal
          meterType={activeButton}
          setSendHelpModalConfig={setSendHelpModalConfig}
          helpSent={help_sent}
        />
      ),
    }));
  };

  const [baselineSuccessModalConfig, setBaselineSuccessModalConfig] = useState({
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

  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const openBaselineSuccessModal = (content_status) => {
    setBaselineSuccessModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <BaselineSuccessModal
          setBaselineSuccessModalConfig={setBaselineSuccessModalConfig}
          contentStatus={content_status}
        />
      ),
    }));
  };
  const handleCheckboxChange = (e) => {
    setShowSubmitButton(e);
  };

  const handleSubmitFacilityStatus = (baselineStatus) => {
    if (!facilityDetails?.is_signed && baselineStatus === "USER_SUBMITTED") {
      openBaselineSuccessModal(true);
      return;
    }
    if (activeButton) {
      const data = getSummaryDataByMeterType(baselineListData, activeButton);
      const body = { status: baselineStatus };
      console.log(data.id, body);
      
      dispatch(submitRejectedBaselineDB(data?.id, body))
        .then(() => {
          if (baselineStatus === "USER_SUBMITTED") {
            openEnrollmentModal();
          } else {
            openSendHelpRequestModal(true);
          }
          dispatch(fetchBaselineDetailsFromDb(id));
        })
        .then(() => {
          dispatch(fetchFacilityStatus(id));
        });
    }
  };

  return (
    <>
      <Grid container justifyContent="space-between">
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={activeButton === 1 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(1)}
          >
            Electricity
          </Button>
          <Button
            sx={activeButton === 3 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(3)}
          >
            Natural gas
          </Button>
        </StyledButtonGroup>
        {baselineDetails?.status === "REVIEWED" ? (
          <Grid container xs={12} md={6} justifyContent="flex-end" gap={4}>
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

            {showSubmitButton ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmitFacilityStatus("USER_SUBMITTED")}
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
        ) : baselineDetails?.status === "CALCULATED" ? (
          <Grid container xs={12} md={6} justifyContent="flex-end" gap={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmitFacilityStatus("USER_SUBMITTED")}
              sx={{ alignItems: "flex-end" }}
            >
              Submit facility
            </Button>
          </Grid>
        ) : (
          <></>
        )}

        {(baselineDetails?.status === "USER_SUBMITTED" ||
          baselineDetails?.status === "SUBMITTED" ||
          baselineDetails?.status === "CALCULATED") && (
          <Typography
            variant="h6"
            sx={{
              padding: "0.375rem 1rem",
              borderRadius: "1.8125rem",
              background: "#CFEEFF",
              color: "#1976AA",
              fontSize: "0.875rem",
              fontStyle: "italic",
              fontWeight: 400,
              mt: { xs: 2, lg: 0 },
            }}
          >
            {baselineDetails?.meter_type === 1 && "Electricity"}
            {baselineDetails?.meter_type === 3 && "Natural gas"}
            {baselineDetails?.meter_type === 2 && "Water"} baseline has been
            successfully{" "}
            {baselineDetails?.status === "CALCULATED" && "calculated"}
            {baselineDetails?.status === "USER_SUBMITTED" && "submitted"}
            {baselineDetails?.status === "SUBMITTED" &&
              "submitted and verified"}{" "}
            on :{format(baselineDetails?.updated_at, "yyyy-MM-dd HH:mm:ss")}
          </Typography>
        )}
      </Grid>

      <Box>
        <CustomAccordion
          summary="Model constructor"
          details={
            renderViewOnlyComp ? (
              <ModelConstructorView
                openSeeDetails={openSeeDetailsModal}
                meterType={activeButton}
              />
            ) : (
              <ModelConstructorForm
                openSeeDetails={openSeeDetailsModal}
                openSendHelpRequestModal={openSendHelpRequestModal}
                meterType={activeButton}
                openBaselineSuccessModal={openBaselineSuccessModal}
              />
            )
          }
          panelId="modelConstructor"
          expanded={expanded}
          onChange={handleAccordionChange}
        />

        <CustomAccordion
          summary="Summary"
          details={
            <BaselineSummary
              summaryData={baselineListData}
              meterType={activeButton}
            />
          }
          panelId="summary"
          expanded={expanded}
          onChange={handleAccordionChange}
        />

        <CustomAccordion
          summary="Visualization"
          // details={<BaselineVisualization />}
          panelId="visualization"
          expanded={expanded}
          onChange={handleAccordionChange}
        />
      </Box>
      <EvModal
        modalConfig={seeDetailsModalConfig}
        setModalConfig={setSeeDetailsModalConfig}
      />
      <EvModal
        modalConfig={sendHelpModalConfig}
        setModalConfig={setSendHelpModalConfig}
      />
      <EvModal
        modalConfig={baselineSuccessModalConfig}
        setModalConfig={setBaselineSuccessModalConfig}
      />
    </>
  );
};

export default BaselineModelTab;
