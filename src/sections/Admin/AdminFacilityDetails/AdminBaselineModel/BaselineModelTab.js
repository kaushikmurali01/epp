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
import { fetchAdminStationsDetails } from "../../../../redux/admin/actions/adminBaselineAction";
import EvModal from "utils/modal/EvModal";
import SeeSufficiencyDetails from "./SeeSufficiencyDetails";
import HelpRequestModal from "./HelpRequestModal";

const BaselineModelTab = ({ handleSufficiencySettings }) => {
  const [activeButton, setActiveButton] = useState(1);
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  useEffect(() => {
    dispatch(fetchAdminStationsDetails(id));
  }, [dispatch, id, activeButton]);

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

  const openSeeDetailsModal = (baseline_start_date, baseline_end_date) => {
    setSeeDetailsModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <SeeSufficiencyDetails
          meterType={activeButton}
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
          Electricity baseline has been successfully created on : 2020/03/05
          13:35:01
        </Typography>
      </Grid>

      <Box>
        <CustomAccordion
          summary="Model constructor"
          details={
            <ModelConstructorForm
              handleSufficiencySettings={handleSufficiencySettings}
              openSeeDetails={openSeeDetailsModal}
              openSendHelpRequestModal={openSendHelpRequestModal}
              meterType={activeButton}
            />
          }
          panelId="modelConstructor"
        />

        <CustomAccordion
          summary="Summary"
          details={<BaselineSummary />}
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
    </>
  );
};

export default BaselineModelTab;
