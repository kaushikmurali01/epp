import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { StyledButtonGroup } from "../BaselineModel/styles";
import { MiniTable } from "components/MiniTable";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDataExplorationSummaryList } from "../../../../redux/superAdmin/actions/baselineAction";
import { StyledButtonGroup } from "../AdminBaselineModel/styles";

const buttonStyle = {
  padding: "0.44rem 1.5rem",
  lineHeight: "1",
  height: "max-content",
  borderRadius: "50px",

  ".MuiButtonGroup-firstButton": {
    BorderRight: "10px",
  },
};
const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#2E813E",
  color: "#F7F7F5",
  "&:hover": {
    backgroundColor: "#2E813E",
  },
};

const inactiveButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#EBEBEB",
  color: "#696969",
};
const PerformancePeriodDataSummary = () => {
  const [activeButton, setActiveButton] = useState("observe_data");
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  useEffect(() => {
    if (activeButton === "missing_data" || activeButton === "outliers") {
      dispatch(fetchDataExplorationSummaryList(id, activeButton)); //right now we are fetching the data from baseline
    } else {
      dispatch(fetchDataExplorationSummaryList(id));
    }
  }, [dispatch, id, activeButton]);

  const summaryData = useSelector(
    (state) => state?.baselineReducer?.dataExplorationSummaryList
  );

    const observeDataColumn = [
      {
        Header: "ID",
        accessor: "meter_type",
      },
      {
        Header: "Parameter",
        accessor: (item) => (
          <Typography
            // onClick={() =>
            //   meterDetailsModal(item?.meter_type, item?.meter_name)
            // }
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
        Header: "ID",
        accessor: "meter_type",
      },
      {
        Header: "Parameter",
        accessor: (item) => (
          <Typography
            // onClick={() =>
            //   meterDetailsModal(item?.meter_type, item?.meter_name)
            // }
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
        Header: "ID",
        accessor: "meter_type",
      },
      {
        Header: "Parameter",
        accessor: (item) => (
          <Typography
            // onClick={() =>
            //   meterDetailsModal(
            //     item?.meter_type,
            //     item?.meter_name,
            //     item?.threshold_type
            //   )
            // }
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
        accessor: (item) => (
          <>
            {item?.threshold_type === "HIGHER" ? "Upper limit" : "Lower limit"}
          </>
        ),
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
    </Grid>
  );
};

export default PerformancePeriodDataSummary;
