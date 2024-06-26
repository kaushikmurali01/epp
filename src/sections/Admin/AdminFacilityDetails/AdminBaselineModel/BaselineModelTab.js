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
  fetchAdminBaselinePeriod,
  fetchAdminStationsDetails,
} from "../../../../redux/admin/actions/adminBaselineAction";
import EvModal from "utils/modal/EvModal";
import SeeSufficiencyDetails from "./SeeSufficiencyDetails";

const BaselineModelTab = ({ handleSufficiencySettings, openSeeDetails }) => {
  const [activeButton, setActiveButton] = useState(1);
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };
  const facilityCreatedBy = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data?.created_by
  );

  useEffect(() => {
    dispatch(fetchAdminBaselinePeriod(id, facilityCreatedBy));
    dispatch(fetchAdminStationsDetails(id));
  }, [dispatch, id, facilityCreatedBy]);

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

  const openSeeDetailsModal = (company_id) => {
    setSeeDetailsModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <SeeSufficiencyDetails companyId={company_id} />,
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
    </>
  );
};

export default BaselineModelTab;
