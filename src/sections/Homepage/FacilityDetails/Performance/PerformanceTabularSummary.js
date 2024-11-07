import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";
import CustomPagination from "components/CustomPagination";
import { MiniTable } from "components/MiniTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPerformancePredictedData } from "../../../../redux/superAdmin/actions/performanceAction";
import DownloadIcon from "@mui/icons-material/Download";
import {
  fetchExportStatus,
  fetchPerformanceRecordId,
  fetchUnreadNotifications,
} from "../../../../redux/global/actions/exportFileAction";
import NotificationsToast from "utils/notification/NotificationsToast";

const PerformanceTabularSummary = ({ meterType }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [performanceP4PCalcTab, setPerformanceP4PCalcTab] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(
      fetchPerformancePredictedData(
        id,
        meterType,
        5,
        pageInfo.page,
        pageInfo.pageSize,
        performanceP4PCalcTab
      )
    );
  }, [id, meterType, pageInfo.page, pageInfo.pageSize, performanceP4PCalcTab]);

  useEffect(() => {
    setPageInfo({
      page: 1,
      pageSize: 10,
    });
  }, [performanceP4PCalcTab]);

  const count = useSelector(
    (state) => state?.performanceReducer?.performancePredictedData?.count || []
  );
  const tableData = useSelector(
    (state) => state?.performanceReducer?.performancePredictedData?.data || []
  );
  const user_id =
    (localStorage.getItem("userDetails") &&
      JSON.parse(localStorage.getItem("userDetails"))) ||
    {};

  const handleChangePerformance = (event, newValue) => {
    setPerformanceP4PCalcTab(newValue);
  };

  const observeDataColumn = [
    {
      Header: "Start date",
      accessor: "start_date",
    },
    {
      Header: "End date",
      accessor: "end_date",
    },
    {
      Header: "Temperature",
      accessor: "temperature",
    },
    {
      Header: "Observed value",
      accessor: "observed",
    },
    {
      Header: "Predicted value",
      accessor: "predicted",
    },
  ];

  function exportTable() {
    NotificationsToast({
      message: "Exporting started...",
      type: "success",
    });
    dispatch(
      fetchPerformanceRecordId(
        id,
        meterType,
        5,
        user_id.id,
        performanceP4PCalcTab
      )
    ).then((res) => {
      if (res.success) {
        const recordId = res.record_id;
        const existingRecords = sessionStorage.getItem("export_record_id");
        if (existingRecords) {
          const recordsArray = JSON.parse(existingRecords);
          recordsArray.push(recordId);
          sessionStorage.setItem(
            "export_record_id",
            JSON.stringify(recordsArray)
          );
        } else {
          sessionStorage.setItem(
            "export_record_id",
            JSON.stringify([recordId])
          );
        }
        startCheckingExportStatus();
      }
    });
  }

  function startCheckingExportStatus() {
    const interval = setInterval(() => {
      // Fetch the latest record IDs from sessionStorage in each interval
      const recordIds = sessionStorage.getItem("export_record_id");
      if (recordIds) {
        const parsedRecordIds = JSON.parse(recordIds);
        // Call the API only if there are record IDs to check
        if (parsedRecordIds.length > 0) {
          dispatch(fetchExportStatus(recordIds))
            .then((response) => {
              const { data } = response;
              // To keep track of updated IDs after each API call
              let updatedRecordIds = [...parsedRecordIds];
              data.forEach((record) => {
                if (record.status_code !== 200) {
                  // Remove the successful record ID from sessionStorage
                  updatedRecordIds = updatedRecordIds.filter(
                    (id) => id !== record.id
                  );
                  sessionStorage.setItem(
                    "export_record_id",
                    JSON.stringify(updatedRecordIds)
                  );
                  if (record.status_code > 201) {
                    NotificationsToast({
                      message: record?.message
                        ? record.message
                        : "Something went wrong!",
                      type: "error",
                    });
                  } else if (record.status_code == 201) {
                    // get unread notifications
                    dispatch(fetchUnreadNotifications(user_id.id, 10, 1));
                    NotificationsToast({
                      message:
                        "File exported successfully and ready to download!",
                      type: "success",
                    });
                  }
                }
              });
            })
            .catch((error) => {
              console.error("Failed to fetch export status:", error);
              clearInterval(interval);
            });
        }
      }
    }, 10000);

    // Return a function to clear the interval if needed (cleanup)
    return () => clearInterval(interval);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        mb={2}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Tabs
          className="theme-tabs-list"
          value={performanceP4PCalcTab}
          onChange={handleChangePerformance}
          sx={{
            display: "inline-flex",
            flexWrap: "wrap",
          }}
          variant="scrollable"
          scrollButtons="false"
        >
          {/* <Tab
            value={0}
            label="Total"
            sx={{ minWidth: { xs: "auto", md: "10rem" }, textTransform: "none" }}
          /> */}
          <Tab
            value={1}
            label="1st P4P"
            sx={{
              minWidth: { xs: "auto", md: "10rem" },
              textTransform: "none",
            }}
          />
          <Tab
            value={2}
            label="2nd P4P"
            sx={{
              minWidth: { xs: "auto", md: "10rem" },
              textTransform: "none",
            }}
          />
          <Tab
            value={3}
            label="3rd P4P"
            sx={{
              minWidth: { xs: "auto", md: "10rem" },
              textTransform: "none",
            }}
          />
        </Tabs>
        {count > 0 && (
          <Box>
            <Button
              style={{
                backgroundColor: "transparent",
                padding: 0,
                minWidth: "unset",
                fontSize: "0.875rem",
              }}
              disableRipple
              startIcon={
                <DownloadIcon
                  style={{
                    color: "text.primary",
                    fontSize: "2rem",
                  }}
                />
              }
              onClick={exportTable}
            >
              Export
            </Button>
          </Box>
        )}
      </Grid>
      <Box>
        <MiniTable columns={observeDataColumn} data={tableData} />
        <CustomPagination
          count={count}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          incomingRowPerPageArr={[10, 20, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
};

export default PerformanceTabularSummary;
