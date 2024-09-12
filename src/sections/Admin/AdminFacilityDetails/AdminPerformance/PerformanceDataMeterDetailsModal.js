import { Button, Grid, Typography } from "@mui/material";
import CustomPagination from "components/CustomPagination";
import { MiniTable } from "components/MiniTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { fetchAdminPerformanceDataRawSummaryMeterList } from "../../../../redux/admin/actions/adminPerformanceActions";
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

  const { adminPerformanceDataMinMaxDate } = useSelector(
    (state) => state?.adminPerformanceReducer
  );

  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (
      adminPerformanceDataMinMaxDate &&
      adminPerformanceDataMinMaxDate.min_date &&
      adminPerformanceDataMinMaxDate.max_date
    ) {
      let min_date = format(
        new Date(adminPerformanceDataMinMaxDate.min_date),
        "yyyy-MM-dd"
      );
      let max_date = format(
        new Date(adminPerformanceDataMinMaxDate.max_date),
        "yyyy-MM-dd"
      );
      if (summary_type === "outliers") {
        dispatch(
          fetchAdminPerformanceDataRawSummaryMeterList(
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
          fetchAdminPerformanceDataRawSummaryMeterList(
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
    adminPerformanceDataMinMaxDate,
  ]);

  const meterRawData = useSelector(
    (state) =>
      state?.adminPerformanceReducer?.adminPerformanceDataRawMeterSummaryList ||
      []
  );

  const observeDataColumn = [
    {
      Header: "Start Date",
      accessor: (item) => (
        <Typography variant="small" sx={{ fontWeight: 400, color: "#54585A" }}>
          {item?.start_date &&
            format(new Date(item?.start_date), "yyyy-MM-dd HH:mm")}
        </Typography>
      ),
    },
    {
      Header: "End Date",
      accessor: (item) => {
        return (
          <>
            {item?.end_date &&
              format(new Date(item?.end_date), "yyyy-MM-dd HH:mm")}
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
  return (
    <Grid container rowGap={4}>
      <Grid container justifyContent="space-between">
        <Typography variant="h5">{meterName}</Typography>
        {/* <Typography variant="h6" color="#2C77E9" sx={{ cursor: "pointer" }} disabled>
          Download as Excel
        </Typography> */}
      </Grid>
      <Grid container>
        <MiniTable columns={observeDataColumn} data={meterRawData} />
        <CustomPagination
          count={count}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          incomingRowPerPageArr={[10, 20, 50, 75, 100]}
        />
      </Grid>
    </Grid>
  );
};

export default PerformanceDataMeterDetailsModal;
