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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearAdminBaselineStateAction,
  fetchAdminBaselineDetailsFromDb,
  fetchAdminIndependentVariableList,
  fetchAdminStationsDetails,
} from "../../../../redux/admin/actions/adminBaselineAction";
import EvModal from "utils/modal/EvModal";
import SeeSufficiencyDetails from "./SeeSufficiencyDetails";
import UserReviewBaselineModal from "./UserReviewBaselineModal";
import ModelConstructorView from "./ModelConstructorView";
import { getSummaryDataByMeterType } from ".";

const BaselineModelTab = ({ handleSufficiencySettings }) => {
  const [activeButton, setActiveButton] = useState(1);
  const [renderFormComp, setRenderFormComp] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };
  const baselineListData = useSelector(
    (state) => state?.adminBaselineReducer?.baselineDetailsDb?.data
  );

  useEffect(() => {
    const baselineDataStoredInDB = getSummaryDataByMeterType(
      baselineListData,
      activeButton
    );
    if (baselineDataStoredInDB?.status !== "ACCEPTED") {
      setRenderFormComp(true);
    } else {
      setRenderFormComp(false);
    }
  }, [id, activeButton, baselineListData]);

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

  const [userReviewBaselineModalConfig, setUserReviewBaselineModalConfig] =
    useState({
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

  const openUserReviewBaselineModal = (baseline_id, updatedBaselineData) => {
    setUserReviewBaselineModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <UserReviewBaselineModal
          setUserReviewBaselineModalConfig={setUserReviewBaselineModalConfig}
          baseline_id={baseline_id}
          updatedBaselineData={updatedBaselineData}
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
            sx={activeButton === 3 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(3)}
          >
            Natural gas
          </Button>
        </StyledButtonGroup>
      </Grid>

      <Box>
        <CustomAccordion
          summary="Model constructor"
          details={
            renderFormComp ? (
              <ModelConstructorForm
                handleSufficiencySettings={handleSufficiencySettings}
                openSeeDetails={openSeeDetailsModal}
                meterType={activeButton}
                openUserReviewBaselineModal={openUserReviewBaselineModal}
              />
            ) : (
              <ModelConstructorView
                handleSufficiencySettings={handleSufficiencySettings}
                openSeeDetails={openSeeDetailsModal}
                meterType={activeButton}
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
        modalConfig={userReviewBaselineModalConfig}
        setModalConfig={setUserReviewBaselineModalConfig}
      />
    </>
  );
};

export default BaselineModelTab;
