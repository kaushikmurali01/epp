import { Box, Button, Grid, Typography } from "@mui/material";
import CustomPagination from "components/CustomPagination";
import { MiniTable } from "components/MiniTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { fetchPerformanceDataRawSummaryMeterList } from "../../../../redux/superAdmin/actions/performanceAction";
import { formatNumber } from "utils/numberFormatter";

const PerformanceDataMeterDetailsModal = ({
  setPerformanceDataMeterDetailsModalConfig,
  meterType,
  meterName,
  meterId,
  summary_type,
  count,
  bound,
}) => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  const { performanceDataMinMaxDate } = useSelector(
    (state) => state?.performanceReducer
  );

  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (
      performanceDataMinMaxDate &&
      performanceDataMinMaxDate.min_date &&
      performanceDataMinMaxDate.max_date
    ) {
      let min_date = format(
        new Date(performanceDataMinMaxDate.min_date),
        "yyyy-MM-dd"
      );
      let max_date = format(
        new Date(performanceDataMinMaxDate.max_date),
        "yyyy-MM-dd"
      );
      if (summary_type === "outliers") {
        dispatch(
          fetchPerformanceDataRawSummaryMeterList(
            id,
            summary_type,
            meterType,
            1,
            meterId,
            bound,
            pageInfo.page,
            pageInfo.pageSize,
            min_date,
            max_date
          )
        );
      } else {
        dispatch(
          fetchPerformanceDataRawSummaryMeterList(
            id,
            summary_type,
            meterType,
            1,
            meterId,
            false,
            pageInfo.page,
            pageInfo.pageSize,
            min_date,
            max_date
          )
        );
      }
    }
  }, [
    dispatch,
    id,
    meterType,
    pageInfo.page,
    pageInfo.pageSize,
    performanceDataMinMaxDate,
  ]);

  const meterRawData = useSelector(
    (state) =>
      state?.performanceReducer?.performanceDataRawMeterSummaryList || []
  );

  // const count = useSelector(
  //   (state) => state?.baselineReducer?.rawMeterSummaryList?.count
  // );x
  
  function convertDateFormat(inputDate) {
    // Split the string and extract the relevant parts
    const parts = inputDate.split(" ");
    const day = parts[1].padStart(2, "0");
    const month = ("0" + (new Date(parts[2] + " 1, 2012").getMonth() + 1)).slice(
      -2
    );
    const year = parts[3];
    const time = parts[4].slice(0, 5);

    // Combine the parts in the desired format
    return `${year}-${month}-${day} ${time}`;
  }

  const observeDataColumn = [
    {
      Header: "Start Date",
      accessor: (item) => (
        <Typography variant="small" sx={{ fontWeight: 400, color: "#54585A" }}>
          {/* {item?.start_date &&
            format(new Date(item?.start_date), "yyyy-MM-dd HH:mm")} */}
          {item?.meter_type === 104
            ? item?.start_date &&
            format(new Date(item?.start_date), "yyyy-MM-dd HH:mm")
            : item?.start_date}
        </Typography>
      ),
    },
    {
      Header: "End Date",
      accessor: (item) => {
        return (
          <>
            {/* {item?.end_date &&
              format(new Date(item?.end_date), "yyyy-MM-dd HH:mm")} */}
            {item?.meter_type === 104
              ? item?.end_date &&
                format(new Date(item?.end_date), "yyyy-MM-dd HH:mm")
              : item?.end_date}
          </>
        );
      },
    },
    {
      Header: "Meter Reading",
      accessor: (item) =>
        item?.reading && formatNumber(item.reading),
    },
  ];

  const miniTableStyles = {
    overflowY: "auto",
    maxHeight: "420px",
  };
  
  return (
    <Grid container rowGap={4}>
      <Grid container justifyContent="space-between">
        <Typography variant="h5">{meterName}</Typography>
        {/* <Typography variant="h6" color="#2C77E9" sx={{ cursor: "pointer" }} disabled>
          Download as Excel
        </Typography> */}
      </Grid>
      <Grid container>
        <Box className="view-entries-table" sx={{ width: "100%" }}>
          <MiniTable
            columns={observeDataColumn}
            data={meterRawData}
            tableStyle={miniTableStyles}
          />
          <CustomPagination
            count={count}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
            incomingRowPerPageArr={[10, 20, 50, 75, 100]}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default PerformanceDataMeterDetailsModal;
