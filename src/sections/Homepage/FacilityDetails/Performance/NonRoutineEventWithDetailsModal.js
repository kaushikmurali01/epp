import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Typography, Button, Link } from "@mui/material";
import { deleteNonRoutineEvent, getNonRoutineEventDetails, getNonRoutineEventList } from "../../../../redux/superAdmin/actions/performanceAction";

const NonRoutineEventWithDetailsModal = ({
  eventId,
  closeNonEventRoutineDetailsModal,
  openAddNonRoutineEventModal,
}) => {
  const dispatch = useDispatch();
  const { nonRoutineEventDetails, loading } = useSelector(
    (state) => state?.performanceReducer
  );

  const facility_id = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data?.id
  );

  useEffect(() => {
    dispatch(getNonRoutineEventDetails(eventId));
  }, [dispatch, eventId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-CA");
  };

  const handleDeleteEvent = () => {
    dispatch(deleteNonRoutineEvent(eventId))
      .then(() => {
        closeNonEventRoutineDetailsModal();
        dispatch(getNonRoutineEventList(facility_id));
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
              {formatDate(nonRoutineEventDetails.event_from_period)} to{" "}
              {formatDate(nonRoutineEventDetails.event_to_period)}
            </Typography>
          </Grid>
          <Grid sx={{ marginTop: "20px" }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
            >
              Comment
            </Typography>
            <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>
              {nonRoutineEventDetails.event_description}
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
            {nonRoutineEventDetails.event_name}
          </Typography>
        </Grid>
      </Grid>

      {nonRoutineEventDetails.dataEntries &&
      nonRoutineEventDetails.dataEntries.length > 0 ? (
        nonRoutineEventDetails.dataEntries.map((entry, index) => {
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

      {nonRoutineEventDetails.dataEntries &&
        nonRoutineEventDetails.dataEntries.some((entry) => entry.file_url) && (
          <Grid container sx={{ marginTop: "10px" }}>
            <Grid item xs={12} md={12}>
              <Typography
                sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
              >
                Upload data in bulk for '{nonRoutineEventDetails.event_name}'
              </Typography>
              <Link
                underline="hover"
                sx={{
                  fontSize: "14px !important",
                  color: "#2C77E9",
                  cursor: "pointer",
                }}
              >
                {
                  nonRoutineEventDetails.dataEntries.find(
                    (entry) => entry.file_url
                  ).file_url
                }
              </Link>
            </Grid>
          </Grid>
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
