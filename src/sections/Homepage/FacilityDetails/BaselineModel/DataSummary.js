import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  StyledButtonGroup,
  activeButtonStyle,
  inactiveButtonStyle,
} from "./styles";
import { MiniTable } from "components/MiniTable";
import EvModal from "utils/modal/EvModal";
import DetailsAndSetting from "./DetailsAndSetting";
import MeterDetailsModal from "./MeterDetailsModal";
import { fetchDataExplorationSummaryList } from "../../../../redux/superAdmin/actions/baselineAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const DataSummary = () => {
  const [activeButton, setActiveButton] = useState("observe_data");
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  useEffect(() => {
    if (activeButton === "missing_data" || activeButton === "outliers") {
      dispatch(fetchDataExplorationSummaryList(id, activeButton));
    } else {
      dispatch(fetchDataExplorationSummaryList(id));
    }
  }, [dispatch, id, activeButton]);

  const summaryData = useSelector(
    (state) => state?.baselineReducer?.dataExplorationSummaryList
  );

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
      evModalStyle: {
        paperMaxWidth: "720px", // Set the desired max-width
      },
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

  const meterDetailsModal = (
    meterType,
    meterName,
    meterId,
    count,
    min_date,
    max_date,
    bound
  ) => {
    setMeterDetailsModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <MeterDetailsModal
          setMeterDetailsModalConfig={setMeterDetailsModalConfig}
          meterType={meterType}
          meterName={meterName}
          meterId={meterId}
          summary_type={activeButton}
          count={count}
          min_date={min_date && format(new Date(min_date), "yyyy-MM-dd")}
          max_date={max_date && format(new Date(max_date), "yyyy-MM-dd")}
          bound={bound}
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
        evModalStyle: {
          paperMaxWidth: "720px", // Set the desired max-width
        },
      },
      buttonsUI: {
        saveButton: false,
        cancelButton: false,
        saveButtonName: "Yes",
        cancelButtonName: "No",
        saveButtonClass: "",
        cancelButtonClass: "",
      },
      headerText: "Details & settings",
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
      Header: "Index",
      accessor: (item, index) => (
        <Typography
          sx={{
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
            cursor: "pointer",
          }}
        >
          {index + 1}
        </Typography>
      ),
    },
    {
      Header: "Parameter",
      accessor: (item) => (
        <Typography
          onClick={() =>
            meterDetailsModal(
              item?.meter_type,
              item?.meter_name,
              item?.meter_id,
              item?.total_records,
              item?.time_stamp_start,
              item?.time_stamp_end
            )
          }
          variant="span"
          sx={{
            color: "primary.main",
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
            cursor: "pointer",
          }}
        >
          {item?.meter_name}
          {item.m_id && item?.meter_type !== 104 ? `, ${item?.m_id}` : ""}
        </Typography>
      ),
    },
    {
      Header: "Timestamp start",
      accessor: "time_stamp_start",
    },
    {
      Header: "Timestamp end",
      accessor: "time_stamp_end",
    },
    {
      Header: "Count",
      accessor: "total_records",
    },
  ];

  const missingDataColumn = [
    {
      Header: "Index",
      accessor: (item, index) => (
        <Typography
          sx={{
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
            cursor: "pointer",
          }}
        >
          {index + 1}
        </Typography>
      ),
    },
    {
      Header: "Parameter",
      accessor: (item) => (
        <Typography
          onClick={() =>
            item?.missing_type === 0
              ? meterDetailsModal(
                  item?.meter_type,
                  item?.meter_name,
                  item?.meter_id,
                  item?.total_records,
                  item?.time_stamp_start,
                  item?.time_stamp_end
                )
              : null
          }
          variant="span"
          sx={{
            color: item?.missing_type === 0 ? "primary.main" : "#2E813E90",
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
            cursor: item?.missing_type === 0 && "pointer",
          }}
        >
          {item.meter_name}
          {item.m_id && item?.meter_type !== 104 ? `, ${item?.m_id}` : ""}
        </Typography>
      ),
    },
    {
      Header: "Timestamp start",
      accessor: "time_stamp_start",
    },
    {
      Header: "Timestamp end",
      accessor: "time_stamp_end",
    },
    {
      Header: "Count",
      accessor: "total_records",
    },
  ];

  const outliersDataColumn = [
    {
      Header: "Index",
      accessor: (item, index) => (
        <Typography
          sx={{
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
            cursor: "pointer",
          }}
        >
          {index + 1}
        </Typography>
      ),
    },
    {
      Header: "Parameter",
      accessor: (item) => (
        <Typography
          onClick={() =>
            meterDetailsModal(
              item?.meter_type,
              item?.meter_name,
              item?.meter_id,
              item?.total_records,
              item?.time_stamp_start,
              item?.time_stamp_end,
              item?.bound_type
            )
          }
          variant="span"
          sx={{
            color: "primary.main",
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
            cursor: "pointer",
          }}
        >
          {item.meter_name}
          {item.m_id && item?.meter_type !== 104 ? `, ${item?.m_id}` : ""}
        </Typography>
      ),
    },
    {
      Header: "Timestamp start",
      accessor: "time_stamp_start",
    },
    {
      Header: "Timestamp end",
      accessor: "time_stamp_end",
    },
    {
      Header: "Count",
      accessor: "total_records",
    },
    {
      Header: "Threshold",
      accessor: "bound_type",
    },
    {
      Header: "Type",
      accessor: (item, index) => (
        <Typography
          sx={{
            fontSize: "0.875rem !important",
            fontWeight: 400,
          }}
        >
          local
        </Typography>
      ),
    },
  ];

  const getTableData = () => {
    if (!summaryData) return [];
    return Array.isArray(summaryData) ? summaryData : [];
  };

  const renderTable = () => {
    const tableData = getTableData();

    switch (activeButton) {
      case "observe_data":
        return <MiniTable columns={observeDataColumn} data={tableData} />;
      case "missing_data":
        return <MiniTable columns={missingDataColumn} data={tableData} />;
      case "outliers":
        return <MiniTable columns={outliersDataColumn} data={tableData} />;
      default:
        return null;
    }
  };

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
              Details
            </Button>
          </Box>
        )}
      </Grid>
      <Grid container>{renderTable()}</Grid>
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
