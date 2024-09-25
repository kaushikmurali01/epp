import React, { useEffect, useState } from "react";
import ModelConstructorForm from "./ModelConstructorForm";
import CustomAccordion from "components/CustomAccordion";
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from "@mui/material";
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
  submitAdminRejectedBaselineDB,
} from "../../../../redux/admin/actions/adminBaselineAction";
import EvModal from "utils/modal/EvModal";
import SeeSufficiencyDetails from "./SeeSufficiencyDetails";
import UserReviewBaselineModal from "./UserReviewBaselineModal";
import ModelConstructorView from "./ModelConstructorView";
import { getSummaryDataByMeterType } from ".";
import { format } from "date-fns";
import BaselineSuccessModal from "sections/Homepage/FacilityDetails/BaselineModel/BaselineSuccessModal";
import { fetchAdminFacilityStatus } from "../../../../redux/admin/actions/adminFacilityActions";

const BaselineModelTab = ({ handleSufficiencySettings }) => {
  const [activeButton, setActiveButton] = useState(1);
  const [renderFormComp, setRenderFormComp] = useState(true);
  const [baselineDetails, setBaselineDetails] = useState(null);
  const [expanded, setExpanded] = useState("modelConstructor");

  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };
  useEffect(() => {
    dispatch(fetchAdminBaselineDetailsFromDb(id));
  }, [dispatch, id]);

  const baselineListData = useSelector(
    (state) => state?.adminBaselineReducer?.baselineDetailsDb?.data
  );

  const handleBaselineDetails = () => {
    const meter = getSummaryDataByMeterType(baselineListData, activeButton);
    setBaselineDetails(meter);
  };

  const facilityDetails = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data
  );

  useEffect(() => {
    handleBaselineDetails();
    const baselineDataStoredInDB = getSummaryDataByMeterType(
      baselineListData,
      activeButton
    );
    if (
      baselineDataStoredInDB?.status === "SUBMITTED" ||
      baselineDataStoredInDB?.status === "REVIEWED" ||
      baselineDataStoredInDB?.status === "CALCULATED"
    ) {
      setRenderFormComp(false);
    } else {
      setRenderFormComp(true);
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

    const [baselineSuccessModalConfig, setBaselineSuccessModalConfig] =
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
    if (!facilityDetails?.is_signed && baselineStatus === "SUBMITTED") {
      openBaselineSuccessModal(true);
      return;
    }
    if (activeButton) {
      const data = getSummaryDataByMeterType(baselineListData, activeButton);
      const body = { status: baselineStatus };
      console.log(data.id, body);
      
      dispatch(submitAdminRejectedBaselineDB(data?.id, body))
        .then(() => {
          dispatch(fetchAdminBaselineDetailsFromDb(id));
        })
        .then(() => {
          dispatch(fetchAdminFacilityStatus(id));
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

        {baselineDetails?.status === "USER_SUBMITTED" ? (
          <Grid container xs={12} md={6} justifyContent="flex-end" gap={4}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                sx={{ color: "text.secondary2" }}
                label={
                  <Typography sx={{ fontSize: "14px!important" }}>
                    Accept baseline model
                  </Typography>
                }
                onChange={(e) => handleCheckboxChange(e.target.checked)}
              />
            </FormGroup>

            {showSubmitButton ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmitFacilityStatus("SUBMITTED")}
                sx={{ alignItems: "flex-end" }}
              >
                Accept baseline
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleSubmitFacilityStatus("REVIEWED")}
                sx={{ alignItems: "flex-end" }}
              >
                Reject baseline
              </Button>
            )}
          </Grid>
        ) : (
          <></>
        )}

        {(baselineDetails?.status === "SUBMITTED" ||
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
            {baselineDetails?.status === "SUBMITTED" && "verified"} on :
            {format(baselineDetails?.updated_at, "yyyy-MM-dd HH:mm:ss")}
          </Typography>
        )}
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
        modalConfig={userReviewBaselineModalConfig}
        setModalConfig={setUserReviewBaselineModalConfig}
      />
      <EvModal
        modalConfig={baselineSuccessModalConfig}
        setModalConfig={setBaselineSuccessModalConfig}
      />
    </>
  );
};

export default BaselineModelTab;
