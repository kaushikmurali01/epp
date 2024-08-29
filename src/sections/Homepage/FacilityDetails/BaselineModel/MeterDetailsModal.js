import { Box, Button, Grid, Typography } from "@mui/material";
import CustomPagination from "components/CustomPagination";
import { MiniTable } from "components/MiniTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRawSummaryMeterList } from "../../../../redux/superAdmin/actions/baselineAction";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const MeterDetailsModal = ({
  setMeterDetailsModalConfig,
  meterType,
  meterName,
  meterId,
  summary_type,
  count,
  min_date,
  max_date,
  bound,
}) => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (summary_type === "outliers") {
      dispatch(
        fetchRawSummaryMeterList(
          id,
          summary_type,
          meterType,
          1,
          meterId,
          min_date,
          max_date,
          bound,
          pageInfo.page,
          pageInfo.pageSize
        )
      );
    } else {
      dispatch(
        fetchRawSummaryMeterList(
          id,
          summary_type,
          meterType,
          1,
          meterId,
          min_date,
          max_date,
          false,
          pageInfo.page,
          pageInfo.pageSize
        )
      );
    }
  }, [dispatch, id, meterType, pageInfo.page, pageInfo.pageSize]);

  const meterRawData = useSelector(
    (state) => state?.baselineReducer?.rawMeterSummaryList || []
  );

  // const count = useSelector(
  //   (state) => state?.baselineReducer?.rawMeterSummaryList?.count
  // );
  function convertDateFormat(inputDate) {
    // Split the string and extract the relevant parts
    const parts = inputDate.split(" ");
    const day = parts[1].padStart(2, "0");
    const month = (
      "0" +
      (new Date(parts[2] + " 1, 2012").getMonth() + 1)
    ).slice(-2);
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
            : item?.start_date && convertDateFormat(item?.start_date)}
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
              : item?.end_date && convertDateFormat(item?.end_date)}
          </>
        );
      },
    },
    {
      Header: "Meter Reading",
      accessor: "reading",
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
        <Typography
          disabled
          variant="h6"
          color="#2C77E9"
          sx={{ cursor: "pointer" }}
        >
          Download as Excel
        </Typography>
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

export default MeterDetailsModal;
