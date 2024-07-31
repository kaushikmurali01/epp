import { Button, Grid, Typography } from "@mui/material";
import CustomPagination from "components/CustomPagination";
import { MiniTable } from "components/MiniTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRawSummaryMeterList } from "../../../../redux/superAdmin/actions/baselineAction";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { POST_REQUEST } from "utils/HTTPRequests";
import { adminHourlyEndPoints } from "constants/apiEndPoints";

const ViewEntryDetailListModal = ({
  meterId,
  meterType,
  facilityId
}) => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  const [meterRawData, setMeterRowData] = useState([]);
  const [count, setPageCount] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();

  const observeDataColumn = [
    {
      Header: "Start Date",
      accessor: (item) => (
        <>
          {item?.["start_date"] &&
            format(
              new Date(item?.["start_date"]),
              "yyyy-MM-dd HH:mm"
            )}
        </>
      ),
    },
    {
      Header: "End Date",
      accessor: (item) => {
        return (
          <>
            {item?.["end_date"] &&
              format(
                new Date(item?.["end_date"]),
                "yyyy-MM-dd HH:mm"
              )}
          </>
        );
      },
    },
    {
      Header: "Useage ",
      accessor: "reading",
    },
  ];


  const getHourlyEntriesData = (pageInfo) => {
    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    let apiURL = `${adminHourlyEndPoints.GET_HOURLY_ENTRIES}`;
    let payload = {
      "meter_id": meterId,
      "facility_id": facilityId,
      "meter_type": meterType,
      "limit": 10,
      "offset": (pageInfo.page - 1) * pageInfo.pageSize,
      // "start_date": "2021-07-26",
      // "end_date": "2021-07-27",
      
    }
  
    
    // return;
    POST_REQUEST(apiURL,payload)
      .then((res) => {
        if(res.data?.data?.rows instanceof Array){
          setMeterRowData(res.data?.data?.rows)
          setPageCount(res.data?.data?.count)
        }
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      }).catch((error) => {
        console.log(error)
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      });
  }

  useEffect(() => {
    getHourlyEntriesData(pageInfo)
  }, [pageInfo]);

  
  return (
    <Grid container rowGap={4}>
      <Grid container justifyContent="space-between">
        <Typography variant="h5">
          {meterType == 1
                ? "Electricity"
                : meterType == 3
                ? "Natural Gas"
                : meterType == 2
                ? "Water"
                : ""}
        </Typography>
        <Typography disabled variant="h6" color="#2C77E9" sx={{ cursor: "pointer" }}>
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

export default ViewEntryDetailListModal;
