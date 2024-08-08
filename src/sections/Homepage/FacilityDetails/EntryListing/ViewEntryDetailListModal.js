import { Button, Grid, Typography } from "@mui/material";
import CustomPagination from "components/CustomPagination";
import { MiniTable } from "components/MiniTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRawSummaryMeterList } from "../../../../redux/superAdmin/actions/baselineAction";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { POST_REQUEST } from "utils/HTTPRequests";
import { adminHourlyEndPoints } from "constants/apiEndPoints";

const ViewEntryDetailListModal = ({
  meterId,
  meterType,
  facilityId,
  independentVariableId,
  ivName
}) => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  const [viewEntryList, setViewEntryList] = useState([]);
  const [count, setPageCount] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();

  const formatDateToLocal = (dateString) => {
    const date = parseISO(dateString);
    const localDate = new Date(date.getTime() + (new Date().getTimezoneOffset() * 60000));
    return format(localDate, 'yyyy-MM-dd HH:mm');
  };

  const observeDataColumn = [
    {
      Header: "Start Date",
      accessor: (item) => (
        <Typography variant="small" sx={{fontWeight: '400', color:"#54585A"}}>
          {item?.["start_date"] &&
            formatDateToLocal(item?.["start_date"])}
        </Typography>
      ),
    },
    {
      Header: "End Date",
      accessor: (item) => (
        <>
          {item?.["end_date"] &&
            formatDateToLocal(item?.["end_date"])}
        </>
      ),
    },
    {
      Header: "Usage ",
      accessor: "reading",
    },
  ];

  const getHourlyEntriesData = (pageInfoData) => {
    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    let apiURL = `${adminHourlyEndPoints.GET_HOURLY_ENTRIES}`;
    let payload = {
      "facility_id": facilityId,
      "limit": pageInfoData.pageSize,
      "offset": (pageInfoData.page - 1) * pageInfoData.pageSize,
    }

    if (independentVariableId) {
      payload.independent_variable_id = independentVariableId;
    } else {
      payload.meter_id = meterId;
      payload.meter_type = meterType;
    }

    POST_REQUEST(apiURL, payload)
      .then((res) => {
        if (res.data?.data?.rows instanceof Array) {
          setViewEntryList(res.data?.data?.rows);
          setPageCount(res.data?.data?.count);
        }
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      }).catch((error) => {
        console.log(error);
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      });
  };

  useEffect(() => {
    getHourlyEntriesData(pageInfo);
  }, [pageInfo]);

  return (
    <Grid container rowGap={4}>
      <Grid container justifyContent="space-between">
        <Typography variant="h5" sx={{ textTransform: 'capitalize'}}>
          {meterType == 1
                ? "Electricity"
                : meterType == 3
                ? "Natural Gas"
                : meterType == 2
                ? "Water"
                : ivName || ""}
        </Typography>
        <Typography disabled variant="h6" color="#2C77E9" sx={{ cursor: "pointer" }}>
          Download as Excel
        </Typography>
      </Grid>
      <Grid container>
        <MiniTable columns={observeDataColumn} data={viewEntryList} />
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

export default ViewEntryDetailListModal;
