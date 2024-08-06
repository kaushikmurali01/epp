import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Typography, Button, Link, Box } from "@mui/material";
import { downloadFileFromUrl } from "utils/helper/helper";
import { deleteAdminNonRoutineEvent, getAdminNonRoutineEventDetails, getAdminNonRoutineEventList } from "../../../../redux/admin/actions/adminPerformanceActions";

const NonRoutineEventWithDetailsModal = ({
  eventId,
  closeNonEventRoutineDetailsModal,
  openAddNonRoutineEventModal,
  meter_type
}) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const dispatch = useDispatch();
  const { adminNonRoutineEventDetails, loading } = useSelector(
    (state) => state?.adminPerformanceReducer
  );

  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );

useEffect(() => {
  dispatch(getAdminNonRoutineEventDetails(eventId));
}, [dispatch, eventId, facility_id, meter_type]);

const getUploadedFiles = () => {
  if (
    adminNonRoutineEventDetails.dataEntries &&
    adminNonRoutineEventDetails.dataEntries.length > 0
  ) {
    const firstEntry = adminNonRoutineEventDetails.dataEntries[0];
    if (firstEntry.type === 2) {
      return adminNonRoutineEventDetails.dataEntries.map((entry, index) => {
        const extension = entry.file_url
          .split("/")
          .pop()
          .split(".")
          .pop()
          .split("?")[0];
        return {
          id: entry.id,
          file_url: entry.file_url,
          name: `non-routine-data-file-${index + 1}`,
          fullName: `non-routine-data-file-${index + 1}.${extension}`,
        };
      });
    }
  }
  return [];
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteEvent = () => {
    dispatch(deleteAdminNonRoutineEvent(eventId))
      .then(() => {
        closeNonEventRoutineDetailsModal();
        dispatch(getAdminNonRoutineEventList(facility_id, meter_type, page, itemsPerPage));
      })
      .catch(console.error());
  };

  if (loading) {
    return <Typography variant="h5" color={"inherit"}>Please wait while we're fetching the details.</Typography>
  }

  return (
    <Grid container>
      <Grid
        container
        sx={{ paddingBottom: "10px", borderBottom: "1px solid #54585A" }}
      >
        <Grid item xs={12} md={9}>
          <Grid>
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
            >
              Event period
            </Typography>
            <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>
              {formatDate(adminNonRoutineEventDetails.event_from_period)} to{" "}
              {formatDate(adminNonRoutineEventDetails.event_to_period)}
            </Typography>
          </Grid>
          <Grid sx={{ marginTop: "20px" }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
            >
              Comment
            </Typography>
            <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>
              {adminNonRoutineEventDetails.event_description}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3} sx={{ justifySelf: "flex-end" }}>
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
          >
            Event name
          </Typography>
          <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>
            {adminNonRoutineEventDetails.event_name}
          </Typography>
        </Grid>
      </Grid>

      {adminNonRoutineEventDetails.dataEntries &&
      adminNonRoutineEventDetails.dataEntries.length > 0 ? (
        adminNonRoutineEventDetails.dataEntries.map((entry, index) => {
          return (
            entry.start_date &&
            entry.end_date && (
              <Grid
                key={index}
                container
                sx={{
                  marginTop: "10px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #54585A",
                }}
              >
                <Grid item xs={12} md={9}>
                  <Grid>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#54585A",
                      }}
                    >
                      Start date
                    </Typography>
                    <Typography
                      sx={{ fontSize: "14px !important", color: "#242424" }}
                    >
                      {formatDate(entry.start_date)}
                    </Typography>
                  </Grid>
                  <Grid sx={{ marginTop: "20px" }}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#54585A",
                      }}
                    >
                      Non-routine adjustment
                    </Typography>
                    <Typography
                      sx={{ fontSize: "14px !important", color: "#242424" }}
                    >
                      {entry.non_routine_adjustment}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3} sx={{ justifySelf: "flex-end" }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#54585A",
                    }}
                  >
                    End date
                  </Typography>
                  <Typography
                    sx={{ fontSize: "14px !important", color: "#242424" }}
                  >
                    {formatDate(entry.end_date)}
                  </Typography>
                </Grid>
              </Grid>
            )
          );
        })
      ) : (
        <Grid container sx={{ marginTop: "10px" }}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: "14px", color: "#54585A" }}>
              No data is there, please add non routine data.
            </Typography>
          </Grid>
        </Grid>
      )}

      {getUploadedFiles().length > 0 && (
        <Box sx={{ marginTop: "1rem" }}>
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
          >
            Uploaded files:
          </Typography>
          {getUploadedFiles().map((file, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "0.5rem",
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: "blue.main", cursor: "pointer" }}
                onClick={() =>
                  downloadFileFromUrl(
                    file.file_url,
                    file.name || `non_routine_file_${index + 1}`
                  )
                }
              >
                {file.fullName}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Grid sx={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "blue.main",
            color: "#ffffff",
            ":hover": { backgroundColor: "#2360bc" },
          }}
          onClick={() => {
            openAddNonRoutineEventModal(eventId);
            closeNonEventRoutineDetailsModal();
          }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "primary.main",
            color: "#ffffff",
            marginLeft: "15px",
            ":hover": { backgroundColor: "primary.mainDarkShade" },
          }}
        >
          Download
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "danger.main",
            color: "#ffffff",
            marginLeft: "15px",
            ":hover": { backgroundColor: "danger.colorCrimson" },
          }}
          onClick={handleDeleteEvent}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
};

export default NonRoutineEventWithDetailsModal;
