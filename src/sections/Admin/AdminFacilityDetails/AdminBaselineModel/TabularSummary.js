import { Box, Button, Grid, Typography } from "@mui/material";
import CustomPagination from "components/CustomPagination";
import { MiniTable } from "components/MiniTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import {
  fetchBaselineRecordId,
  fetchExportStatus,
  fetchUnreadNotifications,
} from "../../../../redux/global/actions/exportFileAction";
import NotificationsToast from "utils/notification/NotificationsToast";
import { fetchAdminBaselinePredictedData } from "../../../../redux/admin/actions/adminBaselineAction";
const TabularSummary = ({ meterType }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(
      fetchAdminBaselinePredictedData(
        id,
        meterType,
        4,
        pageInfo.pageSize,
        pageInfo.page
      )
    );
  }, [id, meterType, pageInfo.pageSize, pageInfo.page]);

  const count = useSelector(
    (state) => state?.adminBaselineReducer?.baselinePredictedData?.count || []
  );
  const tableData = useSelector(
    (state) => state?.adminBaselineReducer?.baselinePredictedData?.data || []
  );
  const user_id =
    (localStorage.getItem("userDetails") &&
      JSON.parse(localStorage.getItem("userDetails"))) ||
    {};

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
    dispatch(fetchBaselineRecordId(id, meterType, 4, user_id.id)).then(
      (res) => {
        if (res.success) {
          const recordId = res.record_id;
          const existingRecords = sessionStorage.getItem(
            "export_admin_record_id"
          );
          if (existingRecords) {
            const recordsArray = JSON.parse(existingRecords);
            recordsArray.push(recordId);
            sessionStorage.setItem(
              "export_admin_record_id",
              JSON.stringify(recordsArray)
            );
          } else {
            sessionStorage.setItem(
              "export_admin_record_id",
              JSON.stringify([recordId])
            );
          }
          startCheckingExportStatus();
        }
      }
    );
  }

  function startCheckingExportStatus() {
    const interval = setInterval(() => {
      // Fetch the latest record IDs from sessionStorage in each interval
      const recordIds = sessionStorage.getItem("export_admin_record_id");
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
                    "export_admin_record_id",
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
      {count > 0 && (
        <Box alignSelf={"flex-end"} mb={2}>
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

export default TabularSummary;
