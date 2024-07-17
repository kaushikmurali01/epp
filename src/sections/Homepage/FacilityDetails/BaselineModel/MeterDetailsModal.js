import { Button, Grid, Typography } from "@mui/material";
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
}) => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(
      fetchRawSummaryMeterList(
        24,
        meterType,
        true,
        pageInfo.page,
        pageInfo.pageSize
      )
    );
  }, [dispatch, id, meterType, pageInfo.page, pageInfo.pageSize]);

  const meterRawData = useSelector(
    (state) => state?.baselineReducer?.rawMeterSummaryList?.data || []
  );

  const count = useSelector(
    (state) => state?.baselineReducer?.rawMeterSummaryList?.count
  );

  const observeDataColumn = [
    {
      Header: "Start Date(Required)",
      accessor: (item) => (
        <>
          {item?.["Start Date (Required)"] &&
            format(
              new Date(item?.["Start Date (Required)"]),
              "yyyy-MM-dd HH:mm"
            )}
        </>
      ),
    },
    {
      Header: "End Date(Required)",
      accessor: (item) => {
        return (
          <>
            {item?.["End Date (Required)"] &&
              format(
                new Date(item?.["End Date (Required)"]),
                "yyyy-MM-dd HH:mm"
              )}
          </>
        );
      },
    },
    {
      Header: "Usage (Required)",
      accessor: "Usage (Required)",
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

export default MeterDetailsModal;
