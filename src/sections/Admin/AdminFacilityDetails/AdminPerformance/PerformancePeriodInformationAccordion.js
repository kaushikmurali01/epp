import {
  Button,
  Grid,
  Tab,
  Tabs,
  Typography,
  List,
  Pagination,
  ListItem,
} from "@mui/material";
import React, { useEffect, useState } from 'react';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from 'react-redux';
import EvModal from "utils/modal/EvModal";
import Loader from "pages/Loader";
import NonRoutineEventWithDetailsModal from "./NonRoutineEventWithDetailsModal";
import AddNonRoutineDataModal from "./AddNonRoutineDataModal";
import AddNonRoutineEventModal from "./AddNonRoutineEventModal";
import { getAdminNonRoutineEventDetails, getAdminNonRoutineEventList, getIncentiveSettings } from "../../../../redux/admin/actions/adminPerformanceActions";
import SavingsReportForm from "./SavingsReportForm";

const PerformancePeriodInformationAccordion = ({
  meter_type,
  submitTrigger,
  refreshTrigger,
  onDateValidation,
}) => {
  const [activeButton, setActiveButton] = useState(0);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState({ isEditing: false, eventId: null });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [responseCount, setResponseCount] = useState(0);
  
  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );
 
  const { loading, incentiveSettings, adminNonRoutineEventList, adminNonRoutineEventDetails } =
    useSelector((state) => state?.adminPerformanceReducer);

  useEffect(() => {
    dispatch(getIncentiveSettings(facility_id));
    dispatch(
      getAdminNonRoutineEventList(facility_id, meter_type, page, itemsPerPage)
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
      dispatch(getAdminNonRoutineEventDetails(eventId))
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
      dispatch(getAdminNonRoutineEventDetails(event_id))
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
                eventDetails={adminNonRoutineEventDetails}
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

  const [performanceP4PCalcTab, setPerformanceP4PCalcTab] =
    useState(1);
    const [p4PStartEndDates, setP4PStartEndDates] = useState({
      startDate: "",
      endDate: "",
    });
  
  const [p4pIncentiveStatus, setP4PIncentiveStatus] = useState();

  const handleChangePerformance = (event, newValue) => {
    setPerformanceP4PCalcTab(newValue);
  };

  useEffect(() => {
    let startDate = "";
    let endDate = "";
    let p4pIncentiveStatus = "";

    if (incentiveSettings) {
      switch (performanceP4PCalcTab) {
        case 1:
          startDate = incentiveSettings.p4pStartDate1;
          endDate = incentiveSettings.p4pEndDate1;
          p4pIncentiveStatus = incentiveSettings.p4pIncentiveStatus1;
          break;
        case 2:
          startDate = incentiveSettings.p4pStartDate2;
          endDate = incentiveSettings.p4pEndDate2;
          p4pIncentiveStatus = incentiveSettings.p4pIncentiveStatus2;
          break;
        case 3:
          startDate = incentiveSettings.p4pStartDate3;
          endDate = incentiveSettings.p4pEndDate3;
          p4pIncentiveStatus = incentiveSettings.p4pIncentiveStatus3;
          break;
        default:
          break;
      }
    }

    setP4PStartEndDates({ startDate, endDate });
    setP4PIncentiveStatus(p4pIncentiveStatus);
  }, [performanceP4PCalcTab, incentiveSettings]);
  
  const initialMeterData = {
    adjusted_baseline_energy_consumption: 11109772,
    reporting_period_energy_consumption: 10345443,
    non_routine_adjustment: -41137,
    total_energy_savings: 733202,
    off_peak_energy_savings: 10010,
    on_peak_energy_savings: 723192,
    off_peak_energy_savings_incentive: "",
    on_peak_energy_savings_incentive: "-",
    performance_incentive: "-",
    peak_demand_savings: 91,
    energy_savings_percentage: 6.5,
  };

  return (
    <>
      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
          marginBottom: "3rem",
        }}
      >
        <Grid item xs={12} md={9}>
          <Tabs
            className="theme-tabs-list"
            value={performanceP4PCalcTab}
            onChange={handleChangePerformance}
            sx={{
              display: "inline-flex",
              flexWrap: "wrap",
            }}
          >
            <Tab
              value={1}
              label="First pay-for-performance"
              sx={{ minWidth: "10rem" }}
            />
            <Tab
              value={2}
              label="Second pay-for-performance"
              sx={{ minWidth: "10rem" }}
            />
            <Tab
              value={3}
              label="Third pay-for-performance"
              sx={{ minWidth: "10rem" }}
            />
          </Tabs>
        </Grid>
        <Grid item sx={{ justifySelf: "flex-end" }}>
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

      <Grid item container flexWrap={"nowrap"} gap={"1rem"}>
        <Grid xs={12} md={9.3}>
          <SavingsReportForm
            meterType={meter_type}
            performanceP4PCalcTab={performanceP4PCalcTab}
            p4PStartEndDates={p4PStartEndDates}
            p4pIncentiveStatus={p4pIncentiveStatus}
            initialData={initialMeterData}
            submitTrigger={submitTrigger}
            refreshTrigger={refreshTrigger}
            onDateValidation={onDateValidation}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={2.7}
          sx={{
            border: "1px solid #2E813E",
            borderRadius: "10px",
            backgroundColor: "#CBFFD5",
          }}
        >
          <Typography variant="h6" sx={nonRoutingStyleInAccordion}>
            Non-routine event name
          </Typography>
          <Grid sx={{ background: "#E2F8E6" }}>
            {adminNonRoutineEventList.length > 0 ? (
              <>
                <List>
                  {adminNonRoutineEventList.map((eventItem, index) => (
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

      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />

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