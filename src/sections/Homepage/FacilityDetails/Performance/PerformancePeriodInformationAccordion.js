import {
  Button,
  Grid,
  Tab,
  Tabs,
  Typography,
  List,
  Pagination,
  ListItem,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from "react-redux";
import EvModal from "utils/modal/EvModal";
import Loader from "pages/Loader";
import NonRoutineEventWithDetailsModal from "./NonRoutineEventWithDetailsModal";
import AddNonRoutineDataModal from "./AddNonRoutineDataModal";
import AddNonRoutineEventModal from "./AddNonRoutineEventModal";
import {
  getIncentiveSettings,
} from "../../../../redux/admin/actions/adminPerformanceActions";
import SavingsReportForm from "./SavingsReportForm";
import { getNonRoutineEventDetails, getNonRoutineEventList, getPerformanceReportFromDB } from "../../../../redux/superAdmin/actions/performanceAction";
import { isBefore, parseISO } from "date-fns";

const PerformancePeriodInformationAccordion = ({
  meter_type,
  submitTrigger,
  setSubmitTrigger,
  refreshTrigger,
  onDateValidation,
  onSubmittedP4PsChange,
  onSubmissionDateChange,
  onVerifiedP4PsChange,
  onVerificationDateChange,
  onPerformanceTypeChange,
}) => {
  const [activeButton, setActiveButton] = useState(0);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState({ isEditing: false, eventId: null });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [responseCount, setResponseCount] = useState(0);

  const facility_id = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data?.id
  );

  const {
    processing,
    nonRoutineEventList,
    nonRoutineEventDetails,
    performanceReportInDB,
  } = useSelector((state) => state?.performanceReducer);

  useEffect(() => {
    dispatch(getIncentiveSettings(facility_id));
    dispatch(
      getNonRoutineEventList(facility_id, meter_type, page, itemsPerPage)
    ).then((response) => {
      if (response && response.count) {
        setResponseCount(response.count);
        setTotalPages(Math.ceil(response?.count / itemsPerPage));
      }
    });
  }, [meter_type, page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const nonRoutingStyleInAccordion = {
    color: "#242424",
    padding: "20px",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
  };

  const eventNameStyleInAccordion = {
    color: "#2C77E9",
    padding: "10px 20px",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
    cursor: "pointer",
  };

  const openNonEventRoutineDetailsModal = (eventId) => {
    setNonEventRoutineDetailsModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "Event detail",
      modalBodyContent: (
        <NonRoutineEventWithDetailsModal
          eventId={eventId}
          closeNonEventRoutineDetailsModal={closeNonEventRoutineDetailsModal}
          openAddNonRoutineEventModal={openAddNonRoutineEventModal}
          meter_type={meter_type}
        />
      ),
    }));
  };

  const closeNonEventRoutineDetailsModal = () => {
    setNonEventRoutineDetailsModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  };

  const [
    nonEventRoutineDetailsModalConfig,
    setNonEventRoutineDetailsModalConfig,
  ] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "emailArchiveModal",
      headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
      headerSubTextStyle: {
        marginTop: "1rem",
        color: "rgba(36, 36, 36, 1)",
        fontSize: { md: "0.875rem" },
      },
      fotterActionStyle: "",
      modalBodyContentStyle: "",
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Edit",
      cancelButtonName: "Download",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    modalBodyContent: "",
  });

  const openAddNonRoutineEventModal = (eventId = null) => {
    setEditMode({ isEditing: !!eventId, eventId });

    if (eventId) {
      dispatch(getNonRoutineEventDetails(eventId))
        .then(() => {
          setAddNonRoutineEventModalConfig((prevState) => ({
            ...prevState,
            modalVisible: true,
            headerText: "Edit non-routine event",
            modalBodyContent: (
              <AddNonRoutineEventModal
                meter_type={meter_type}
                closeAddNonRoutineEventModal={closeAddNonRoutineEventModal}
                openAddNonRoutineDataModal={openAddNonRoutineDataModal}
                editMode={{ isEditing: true, eventId }}
              />
            ),
          }));
        })
        .catch((error) => {
          console.error("Error fetching event details:", error);
          // Handle error (e.g., show error message)
        });
    } else {
      setAddNonRoutineEventModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        headerText: "Non-routine event",
        modalBodyContent: (
          <AddNonRoutineEventModal
            meter_type={meter_type}
            closeAddNonRoutineEventModal={closeAddNonRoutineEventModal}
            openAddNonRoutineDataModal={openAddNonRoutineDataModal}
            editMode={{ isEditing: false, eventId: null }}
          />
        ),
      }));
    }
  };

  const openAddNonRoutineDataModal = (
    event_id,
    event_to_period,
    event_from_period,
    isEditing = false
  ) => {
    const editMode = { isEditing, eventId: event_id };
    if (isEditing) {
      dispatch(getNonRoutineEventDetails(event_id))
        .then(() => {
          setAddNonRoutineDataModalConfig((prevState) => ({
            ...prevState,
            modalVisible: true,
            headerText: "Edit non-routine event data",
            modalBodyContent: (
              <AddNonRoutineDataModal
                event_id={event_id}
                event_to_period={event_to_period}
                event_from_period={event_from_period}
                closeAddNonRoutineDataModal={closeAddNonRoutineDataModal}
                editMode={editMode}
                eventDetails={nonRoutineEventDetails}
                key={Date.now()} // Force re-render
                meter_type={meter_type}
              />
            ),
          }));
        })
        .catch((error) => {
          console.error("Error fetching event details:", error);
          // Handle error (e.g., show error message)
        });
    } else {
      setAddNonRoutineDataModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        headerText: "Add Non-routine Event Data",
        modalBodyContent: (
          <AddNonRoutineDataModal
            event_id={event_id}
            event_to_period={event_to_period}
            event_from_period={event_from_period}
            closeAddNonRoutineDataModal={closeAddNonRoutineDataModal}
            editMode={editMode}
            key={Date.now()} // Force re-render
            meter_type={meter_type}
          />
        ),
      }));
    }
  };

  const closeAddNonRoutineEventModal = () => {
    setAddNonRoutineEventModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  };

  const closeAddNonRoutineDataModal = () => {
    setAddNonRoutineDataModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  };

  const [addNonRoutineEventModalConfig, setAddNonRoutineEventModalConfig] =
    useState({
      modalVisible: false,
      modalUI: {
        showHeader: true,
        crossIcon: false,
        modalClass: "emailArchiveModal",
        headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
        headerSubTextStyle: {
          marginTop: "1rem",
          color: "rgba(36, 36, 36, 1)",
          fontSize: { md: "0.875rem" },
        },
        fotterActionStyle: "",
        modalBodyContentStyle: "",
      },
      buttonsUI: {
        saveButton: false,
        cancelButton: false,
        saveButtonName: "Sent Request",
        cancelButtonName: "Cancel",
        saveButtonClass: "",
        cancelButtonClass: "",
      },
      modalBodyContent: "",
    });

  const [addNonRoutineDataModalConfig, setAddNonRoutineDataModalConfig] =
    useState({
      modalVisible: false,
      modalUI: {
        showHeader: true,
        crossIcon: false,
        modalClass: "emailArchiveModal",
        headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
        headerSubTextStyle: {
          marginTop: "1rem",
          color: "rgba(36, 36, 36, 1)",
          fontSize: { md: "0.875rem" },
        },
        fotterActionStyle: "",
        modalBodyContentStyle: "",
      },
      buttonsUI: {
        saveButton: false,
        cancelButton: false,
        saveButtonName: "Sent Request",
        cancelButtonName: "Cancel",
        saveButtonClass: "",
        cancelButtonClass: "",
      },
      modalBodyContent: "",
    });

  const [submittedP4Ps, setSubmittedP4Ps] = useState({});
  const [verifiedP4Ps, setVerifiedP4Ps] = useState({});
  const [performanceP4PCalcTab, setPerformanceP4PCalcTab] = useState(1);
  const [p4PStartDates, setP4PStartDates] = useState({});

  useEffect(() => {
    dispatch(
      getPerformanceReportFromDB(
        facility_id,
        meter_type,
        performanceP4PCalcTab
      )
    );
  }, [dispatch, facility_id, meter_type, performanceP4PCalcTab, processing]);

  useEffect(() => {
    if (performanceReportInDB) {
      const performanceType = performanceReportInDB.performance_type;
      const status = performanceReportInDB.status;

      if (performanceType) {
        setSubmittedP4Ps((prevSubmittedP4Ps) => {
          const updatedP4Ps = { ...prevSubmittedP4Ps };
          if (!updatedP4Ps[meter_type]) {
            updatedP4Ps[meter_type] = [];
          }
          if (status === "SUBMITTED") {
            // Add the performance type if it's submitted and not already in the array
            if (!updatedP4Ps[meter_type].includes(performanceType)) {
              updatedP4Ps[meter_type] = [...updatedP4Ps[meter_type], performanceType];
            }
          } else if (status === "VERIFIED") {
            // Remove the performance type from submitted if it's verified
            updatedP4Ps[meter_type] = updatedP4Ps[meter_type].filter(type => type !== performanceType);
          }
          return updatedP4Ps;
        });

        setVerifiedP4Ps((prevVerifiedP4Ps) => {
          const updatedVerifiedP4Ps = { ...prevVerifiedP4Ps };
          if (!updatedVerifiedP4Ps[meter_type]) {
            updatedVerifiedP4Ps[meter_type] = [];
          }
          if (status === "VERIFIED") {
            // Add the performance type if it's verified and not already in the array
            if (!updatedVerifiedP4Ps[meter_type].includes(performanceType)) {
              updatedVerifiedP4Ps[meter_type] = [...updatedVerifiedP4Ps[meter_type], performanceType];
            }
          } else if (status === "SUBMITTED") {
            // Remove the performance type from verified if it's submitted
            updatedVerifiedP4Ps[meter_type] = updatedVerifiedP4Ps[meter_type].filter(type => type !== performanceType);
          }
          return updatedVerifiedP4Ps;
        });
      }

      if (performanceType === performanceP4PCalcTab) {
        onPerformanceTypeChange(performanceType);
        if (status === "SUBMITTED") {
          onSubmissionDateChange(performanceReportInDB.submit_date);
        } else if (status === "VERIFIED") {
          onVerificationDateChange(performanceReportInDB.updated_at);
        }
      }
    }
  }, [
    meter_type,
    performanceReportInDB,
    performanceP4PCalcTab,
    onPerformanceTypeChange,
    onSubmissionDateChange,
    onVerificationDateChange,
    onSubmittedP4PsChange,
    onVerifiedP4PsChange,
  ]);

  const handleChangePerformance = (event, newValue) => {
    setPerformanceP4PCalcTab(newValue);
  };

  useEffect(() => {
    const isSubmitted =
      submittedP4Ps[meter_type]?.includes(performanceP4PCalcTab) || false;
    const isVerified =
      verifiedP4Ps[meter_type]?.includes(performanceP4PCalcTab) || false;
    onSubmittedP4PsChange(isSubmitted);
    onVerifiedP4PsChange(isVerified);
  }, [
    submittedP4Ps,
    verifiedP4Ps,
    performanceP4PCalcTab,
    onSubmittedP4PsChange,
    meter_type,
  ]);

  const handleP4PStartDatesLoaded = (startDates) => {
    setP4PStartDates(startDates);
  };

  // const isTabDisabled = (tabValue) => {
  //   if (tabValue === 1) return false;
  //   const submittedP4PsForMeterType = submittedP4Ps[meter_type] || [];
  //   const verifiedP4PsForMeterType = verifiedP4Ps[meter_type] || [];
  //   return (
  //     !submittedP4PsForMeterType.includes(tabValue - 1) &&
  //     !verifiedP4PsForMeterType.includes(tabValue - 1)
  //   );
  // };

  const isTabDisabled = (tabValue) => {
    const today = new Date();
    const startDate = p4PStartDates[tabValue]
      ? parseISO(p4PStartDates[tabValue])
      : null;

    if (!startDate) return true; // If no start date, disable the tab

    if (isBefore(today, startDate)) return true; // If start date is in the future, disable the tab

    if (tabValue === 1) return false; // First tab is enabled if it's not in the future

    const submittedP4PsForMeterType = submittedP4Ps[meter_type] || [];
    const verifiedP4PsForMeterType = verifiedP4Ps[meter_type] || [];

    // Check if the previous P4P has been submitted or verified
    return (
      !submittedP4PsForMeterType.includes(tabValue - 1) &&
      !verifiedP4PsForMeterType.includes(tabValue - 1)
    );
  };

  if (processing) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          marginTop: "1rem",
          marginInline: "1rem",
          justifyContent: "center",
          padding: "2rem",
          background: "#FFFFFF",
          borderRadius: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          maxWidth: "65rem",
        }}
      >
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            marginRight: "1rem",
            fontWeight: 700,
          }}
        >
          Please note: Performance scoring is currently in progress. You will be
          able to proceed with the P4P (Pay-for-Performance) calculation once
          this process is complete. We appreciate your patience during this
          time.
        </Typography>
        <div className="progress-loader"></div>
      </Box>
    );
  }

  return (
    <>
      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: { xs: "1rem", md: "1.5rem" },
        }}
        width={"100%"}
      >
        <Grid item>
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
            <Tab
              value={1}
              label="First pay-for-performance"
              sx={{ minWidth: { xs: "auto", md: "10rem" } }}
              disabled={isTabDisabled(1)}
            />
            <Tab
              value={2}
              label="Second pay-for-performance"
              sx={{ minWidth: { xs: "auto", md: "10rem" } }}
              disabled={isTabDisabled(2)}
            />
            <Tab
              value={3}
              label="Third pay-for-performance"
              sx={{ minWidth: { xs: "auto", md: "10rem" } }}
              disabled={isTabDisabled(3)}
            />
          </Tabs>
        </Grid>
        <Grid
          item
          sx={{
            display: "flex",
            width: { xs: "100%", md: "auto" },
            justifyContent: "flex-end",
            marginLeft: "auto",
          }}
        >
          <Button
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            disableRipple
            endIcon={
              <AddCircleIcon
                style={{
                  color: "text.primary",
                  fontSize: "2rem",
                }}
              />
            }
            onClick={() => openAddNonRoutineEventModal()}
          >
            Add non-routine event
          </Button>
        </Grid>
      </Grid>

      <Grid
        item
        container
        sx={{
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: "1rem",
          overflow: "auto",
          width: "100%",
        }}
      >
        <Grid item xs={12} md={9.3}>
          <SavingsReportForm
            meter_type={meter_type}
            performanceP4PCalcTab={performanceP4PCalcTab}
            submitTrigger={submitTrigger}
            setSubmitTrigger={setSubmitTrigger}
            refreshTrigger={refreshTrigger}
            onDateValidation={onDateValidation}
            initialData={
              performanceReportInDB === null
                ? null
                : performanceReportInDB?.parameter_data
            }
            isSubmitted={
              submittedP4Ps[meter_type]?.includes(performanceP4PCalcTab) ||
              verifiedP4Ps[meter_type]?.includes(performanceP4PCalcTab) ||
              false
            }
            onP4PStartDatesLoaded={handleP4PStartDatesLoaded}
            reviewRequested={performanceReportInDB?.status === "REQUESTED"}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={2.7}
          height={"max-content"}
          sx={{
            border: "1px solid #2E813E",
            borderRadius: "10px",
            backgroundColor: "#CBFFD5",
          }}
        >
          <Typography variant="h6" sx={nonRoutingStyleInAccordion}>
            Non-routine event name
          </Typography>
          <Grid sx={{ background: "#E2F8E6", borderRadius: "10px" }}>
            {nonRoutineEventList.length > 0 ? (
              <>
                <List>
                  {nonRoutineEventList.map((eventItem, index) => (
                    <ListItem
                      key={index}
                      variant="h6"
                      sx={eventNameStyleInAccordion}
                      onClick={() =>
                        openNonEventRoutineDetailsModal(eventItem?.id)
                      }
                    >
                      {eventItem?.event_name}
                    </ListItem>
                  ))}
                </List>
                {responseCount > 10 && (
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={(event, newPage) =>
                      handlePageChange(event, newPage - 1)
                    }
                    color="primary"
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  />
                )}
              </>
            ) : (
              <Typography
                variant="h6"
                textAlign={"center"}
                sx={eventNameStyleInAccordion}
              >
                Non-routine event is not added yet.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      <EvModal
        modalConfig={addNonRoutineEventModalConfig}
        setModalConfig={setAddNonRoutineEventModalConfig}
      />
      <EvModal
        modalConfig={addNonRoutineDataModalConfig}
        setModalConfig={setAddNonRoutineDataModalConfig}
      />
      <EvModal
        modalConfig={nonEventRoutineDetailsModalConfig}
        setModalConfig={setNonEventRoutineDetailsModalConfig}
      />
    </>
  );
};

export default PerformancePeriodInformationAccordion;