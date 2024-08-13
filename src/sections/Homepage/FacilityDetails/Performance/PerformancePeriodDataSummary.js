import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MiniTable } from "components/MiniTable";
import EvModal from "utils/modal/EvModal";
import { fetchDataExplorationSummaryList } from "../../../../redux/superAdmin/actions/baselineAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  activeButtonStyle,
  inactiveButtonStyle,
  StyledButtonGroup,
} from "../BaselineModel/styles";
import {
  getPerformanceDataMinMaxDate,
  scorePerformanceData,
} from "../../../../redux/superAdmin/actions/performanceAction";
import { format } from "date-fns";
import Loader from "pages/Loader";
import PerformanceDataMeterDetailsModal from "./PerformanceDataMeterDetailsModal";

const PerformancePeriodDataSummary = ({ meter_type }) => {
  const [activeButton, setActiveButton] = useState("observe_data");
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  const { performanceDataMinMaxDate, loading } =
    useSelector((state) => state?.performanceReducer);

  useEffect(() => {
    if (activeButton === "missing_data" || activeButton === "outliers") {
      dispatch(fetchDataExplorationSummaryList(id, activeButton))
        .then()
        .catch((error) => console.error(error));
    } else {
      dispatch(fetchDataExplorationSummaryList(id));
    }
  }, [dispatch, id, activeButton, meter_type]);

  useEffect(() => {
    dispatch(getPerformanceDataMinMaxDate(id, meter_type))
      .then()
      .catch((error) => {
        console.error(error);
      });
  }, [dispatch, id, meter_type]);

  useEffect(() => {
    if (
      performanceDataMinMaxDate &&
      performanceDataMinMaxDate.min_date &&
      performanceDataMinMaxDate.max_date
    ) {
      const payload = {
        facility_id: Number(id),
        meter_type: meter_type,
        start_date: format(
          new Date(performanceDataMinMaxDate.min_date),
          "yyyy-MM-dd"
        ),
        end_date: format(
          new Date(performanceDataMinMaxDate.max_date),
          "yyyy-MM-dd"
        ),
      };
      dispatch(scorePerformanceData(payload))
        .then()
        .catch((err) => console.error(err));
    }
  }, [dispatch, id, meter_type, performanceDataMinMaxDate]);

  const summaryData = useSelector(
    (state) => state?.baselineReducer?.dataExplorationSummaryList
  );

  const [
    performanceDataMeterDetailsModalConfig,
    setPerformanceDataMeterDetailsModalConfig,
  ] = useState({
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

  const openPerformanceDataMeterDetailsModal = (
    meterType,
    meterName,
    meterId,
    count,
    bound
  ) => {
    setPerformanceDataMeterDetailsModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <PerformanceDataMeterDetailsModal
          setPerformanceDataMeterDetailsModalConfig={
            setPerformanceDataMeterDetailsModalConfig
          }
          meterType={meterType}
          meterName={meterName}
          meterId={meterId}
          summary_type={activeButton}
          count={count}
          bound={bound}
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
            openPerformanceDataMeterDetailsModal(
              item?.meter_type,
              item?.meter_name,
              item?.meter_id,
              item?.total_records
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
          {item.m_id && item?.meter_id !== 0 ? `, ${item?.m_id}` : ""}
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
            openPerformanceDataMeterDetailsModal(
              item?.meter_type,
              item?.meter_name,
              item?.meter_id,
              item?.total_records
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
          {item.m_id && item?.meter_id !== 0 ? `, ${item?.m_id}` : ""}
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
            openPerformanceDataMeterDetailsModal(
              item?.meter_type,
              item?.meter_name,
              item?.meter_id,
              item?.total_records,
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
          {item.m_id && item?.meter_id !== 0 ? `, ${item?.m_id}` : ""}
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
      accessor: "type",
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
      </Grid>
      <Grid container>{renderTable()}</Grid>
      <EvModal
        modalConfig={performanceDataMeterDetailsModalConfig}
        setModalConfig={setPerformanceDataMeterDetailsModalConfig}
      />
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />
    </Grid>
  );
};

export default PerformancePeriodDataSummary;
