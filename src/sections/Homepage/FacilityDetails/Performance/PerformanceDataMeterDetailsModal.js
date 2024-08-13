import { Button, Grid, Typography } from "@mui/material";
import CustomPagination from "components/CustomPagination";
import { MiniTable } from "components/MiniTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRawSummaryMeterList } from "../../../../redux/superAdmin/actions/baselineAction";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

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
  // );x

  const observeDataColumn = [
    {
      Header: "Start Date",
      accessor: (item) => (
        <Typography variant="small" sx={{fontWeight:400, color:"#54585A"}}>
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
      accessor: "reading",
    },
  ];
  return (
    <Grid container rowGap={4}>
      <Grid container justifyContent="space-between">
        <Typography variant="h5">{meterName}</Typography>
        <Typography variant="h6" color="#2C77E9" sx={{ cursor: "pointer" }}>
          Download as Excel
        </Typography>
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
