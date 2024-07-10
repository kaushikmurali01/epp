import React, { useEffect, useState } from "react";
import ModelConstructorForm from "./ModelConstructorForm";
import CustomAccordion from "components/CustomAccordion";
import { Box, Button, Grid, Typography } from "@mui/material";
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
} from "../../../../redux/superAdmin/actions/baselineAction";
import { format } from "date-fns";
import { getSummaryDataByMeterType } from ".";
import ModelConstructorView from "./ModelConstructorView";

const BaselineModelTab = ({
  showFieldsBasedOnStatus,
  setMeterType,
  setBaselineData,
}) => {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState(1);
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };
  const { id } = useParams();
  const [renderViewOnlyComp, setRenderViewOnlyComp] = useState(false);

  const baselineListData = useSelector(
    (state) => state?.baselineReducer?.baselineDetailsDb?.data
  );

  useEffect(() => {
    dispatch(fetchIndependentVariableList(id));
    return () => {
      dispatch(clearBaselineStateAction());
    };
  }, [dispatch, id]);
  useEffect(() => {
    setMeterType(activeButton);
    dispatch(fetchBaselineDetailsFromDb(id)).then((res) => {
      showFieldsBasedOnStatus(res?.data, activeButton);
      setBaselineData();
      handleBaselineDetails(res?.data);
      const baselineDataStoredInDB = getSummaryDataByMeterType(
        res?.data,
        activeButton
      );
      if (
        baselineDataStoredInDB?.user_type === 1 &&
        baselineDataStoredInDB?.status === "REVIEWED"
      ) {
        setRenderViewOnlyComp(true);
      }
    });
  }, [id, activeButton]);

  const [showBaselineText, setShowBaselineText] = useState(false);
  const [baselineDetails, setBaselineDetails] = useState(null);

  const handleBaselineDetails = (baseData) => {
    const meter = getSummaryDataByMeterType(baseData, activeButton);
    if (
      meter &&
      (meter.status === "SUBMITTED" || meter.status === "CALCULATED")
    ) {
      setShowBaselineText(true);
    } else {
      setShowBaselineText(false);
    }
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

  const openSendHelpRequestModal = () => {
    setSendHelpModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <HelpRequestModal
          meterType={activeButton}
          setSendHelpModalConfig={setSendHelpModalConfig}
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

  const openBaselineSuccessModal = () => {
    setBaselineSuccessModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <BaselineSuccessModal
          setBaselineSuccessModalConfig={setBaselineSuccessModalConfig}
        />
      ),
    }));
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
            sx={activeButton === 2 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(2)}
          >
            Natural gas
          </Button>
        </StyledButtonGroup>
        {showBaselineText && (
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
            {baselineDetails?.meter_type === 2 && "Natural gas"}
            {baselineDetails?.meter_type === 3 && "Water"} baseline has been
            successfully {baselineDetails?.status === "CALCULATED" && "created"}
            {baselineDetails?.status === "SUBMITTED" && "submitted"} on :
            {format(baselineDetails?.updated_at, "yyyy-MM-dd HH:mm:ss")}
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
                showFieldsBasedOnStatus={showFieldsBasedOnStatus}
              />
            ) : (
              <ModelConstructorForm
                openSeeDetails={openSeeDetailsModal}
                openSendHelpRequestModal={openSendHelpRequestModal}
                meterType={activeButton}
                openBaselineSuccessModal={openBaselineSuccessModal}
                showFieldsBasedOnStatus={showFieldsBasedOnStatus}
              />
            )
          }
          panelId="modelConstructor"
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
        />

        <CustomAccordion
          summary="Visualization"
          details={<BaselineVisualization />}
          panelId="visualization"
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
