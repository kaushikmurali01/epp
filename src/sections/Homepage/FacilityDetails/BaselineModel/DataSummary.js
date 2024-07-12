import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  StyledButtonGroup,
  activeButtonStyle,
  inactiveButtonStyle,
} from "./styles";
import { MiniTable } from "components/MiniTable";
import EvModal from "utils/modal/EvModal";
import DetailsAndSetting from "./DetailsAndSetting";
import MeterDetailsModal from "./MeterDetailsModal";

const DataSummary = () => {
  const [activeButton, setActiveButton] = useState("observe_data");

  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  const [meterDetailsModalConfig, setMeterDetailsModalConfig] = useState({
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

  const meterDetailsModal = () => {
    setMeterDetailsModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <MeterDetailsModal
          setMeterDetailsModalConfig={setMeterDetailsModalConfig}
        />
      ),
    }));
  };

  const [detailsAndSettingModalConfig, setDetailsAndSettingModalConfig] =
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
      headerText: "Details & sitting",
      headerSubText: "",
      modalBodyContent: "",
      saveButtonAction: "",
    });

  const detailsAndSettingModal = () => {
    setDetailsAndSettingModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <DetailsAndSetting
          setDetailsAndSettingModalConfig={setDetailsAndSettingModalConfig}
        />
      ),
    }));
  };

  const observeDataColumn = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Parameter",
      accessor: (item) => (
        <Typography
          onClick={meterDetailsModal}
          variant="span"
          sx={{
            color: "primary.main",
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          {item.meter_type}
        </Typography>
      ),
    },
    {
      Header: "Timestamp start",
      accessor: "",
    },
    {
      Header: "Timestamp end",
      accessor: "",
    },
    {
      Header: "Count",
      accessor: "details",
    },
  ];

  const missingDataColumn = [
    {
      Header: "ID",
      accessor: "",
    },
    {
      Header: "Parameter",
      accessor: "",
    },
    {
      Header: "Timestamp start",
      accessor: "",
    },
    {
      Header: "Timestamp end",
      accessor: "",
    },
    {
      Header: "Count",
      accessor: "details",
    },
  ];

  const outliersDataColumn = [
    {
      Header: "ID",
      accessor: "",
    },
    {
      Header: "Parameter",
      accessor: "",
    },
    {
      Header: "Timestamp start",
      accessor: "",
    },
    {
      Header: "Timestamp end",
      accessor: "",
    },
    {
      Header: "Count",
      accessor: "details",
    },
    {
      Header: "Threshold",
      accessor: "Threshold",
    },
    {
      Header: "Type",
      accessor: "Type",
    },
  ];
  const data = [
    { meter_type: "electricity", id: 1 },
    { meter_type: "NG", id: 2 },
  ];

  return (
    <Grid
      sx={{
        display: "flex",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={
              activeButton === "observe_data"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("observe_data")}
          >
            Observe data
          </Button>
          <Button
            sx={
              activeButton === "missing_data"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("missing_data")}
          >
            Missing Data
          </Button>
          <Button
            sx={
              activeButton === "outliers"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("outliers")}
          >
            Outliers
          </Button>
        </StyledButtonGroup>
        {activeButton === "outliers" && (
          <Box textAlign={"end"}>
            <Button
              variant="text"
              sx={{
                color: "blue.main",
                padding: 0,
                lineHeight: 1,
                minWidth: "max-content !important",
              }}
              onClick={detailsAndSettingModal}
            >
              Details & Setting
            </Button>
          </Box>
        )}
      </Grid>
      <Grid container>
        {activeButton === "observe_data" && (
          <MiniTable columns={observeDataColumn} data={data} />
        )}
        {activeButton === "missing_data" && (
          <MiniTable columns={missingDataColumn} data={[{}]} />
        )}
        {activeButton === "outliers" && (
          <MiniTable columns={outliersDataColumn} data={[{}]} />
        )}
      </Grid>
      <EvModal
        modalConfig={meterDetailsModalConfig}
        setModalConfig={setMeterDetailsModalConfig}
      />
      <EvModal
        modalConfig={detailsAndSettingModalConfig}
        setModalConfig={setDetailsAndSettingModalConfig}
      />
    </Grid>
  );
};

export default DataSummary;
