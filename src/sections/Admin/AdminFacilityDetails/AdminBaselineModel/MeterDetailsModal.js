import { Button, Grid, Typography } from "@mui/material";
import CustomPagination from "components/CustomPagination";
import { MiniTable } from "components/MiniTable";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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

  useEffect(() => {}, [meterType]);
  const observeDataColumn = [
    {
      Header: "Start Date(Required)",
      accessor: "meter_type",
    },
    {
      Header: "End Date(Required)",
      accessor: "meter_value",
    },
    {
      Header: "Usage (Required)",
      accessor: "time_stamp_start",
    },
  ];
  const data = [];
  return (
    <Grid container rowGap={4}>
      <Grid container justifyContent="space-between">
        <Typography variant="h5">{meterName}</Typography>
        <Typography variant="h6" color="#2C77E9" sx={{ cursor: "pointer" }}>
          Download as Excel
        </Typography>
      </Grid>
      <Grid container>
        <MiniTable columns={observeDataColumn} data={data} />
        <CustomPagination
          count={30}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          incomingRowPerPageArr={[10, 20, 50, 75, 100]}
        />
      </Grid>
    </Grid>
  );
};

export default MeterDetailsModal;
