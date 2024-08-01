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
import { DatePicker } from '@mui/x-date-pickers';
import SelectBox from 'components/FormBuilder/Select';
import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from 'react-redux';
import EvModal from "utils/modal/EvModal";
import { getNonRoutineEventDetails, getNonRoutineEventList } from "../../../../redux/superAdmin/actions/performanceAction";
import Loader from "pages/Loader";
import NonRoutineEventWithDetailsModal from "./NonRoutineEventWithDetailsModal";
import AddNonRoutineDataModal from "./AddNonRoutineDataModal";
import AddNonRoutineEventModal from "./AddNonRoutineEventModal";


const PerformancePeriodInformationAccordion = ({meter_type}) => {
  const [activeButton, setActiveButton] = useState(0);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState({ isEditing: false, eventId: null });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const facility_id = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data?.id
  );

  const { loading, nonRoutineEventList, nonRoutineEventDetails } = useSelector(
    (state) => state?.performanceReducer
  );
  
  // useEffect(() => {
  //   dispatch(getNonRoutineEventList(facility_id, meter_type));
  // }, [meter_type]);

  useEffect(() => {
    dispatch(
      getNonRoutineEventList(facility_id, meter_type, page, itemsPerPage)
    ).then((response) => {
      if (response && response.count) {
        setTotalPages(Math.ceil(response?.count / itemsPerPage));
      }
    });
  }, [meter_type, page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  const savingReportDropdown = [
    {
      id: 1,
      name: "Estimated",
      label: "Estimated",
      value: "Estimated",
    },
    {
      id: 2,
      name: "Submitted",
      label: "Submitted",
      value: "Submitted",
    },
    {
      id: 3,
      name: "Verified",
      label: "Verified",
      value: "Verified",
    },
  ];
  const [performanceTabs, setPerformanceTabs] = useState("firstPayDay");

  const handleChangePerformance = (event, newValue) => {
    setPerformanceTabs(newValue);
  };
  const [initialValues, setInitialValues] = useState({
    adjusted_baseline: "",
    reporting_period_NG_consumption: "",
    non_routine_adjustment: "",
    NG_savings: "",
    NG_savings_percentage: "",
  });

  const performancePeriodStyleInAccordion = {
    color: "#2E813E",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
  };

  const performancePeriodStyleInArea = {
    // textAlign: "center",
    // justifyContent: "center",
    display: "flex",
    alignItems: "center",
    // marginTop: "12px",
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
  const baselineStyleInAccordion = {
    color: "#242424",
    padding: "0.375rem 1rem",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
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
  
  const [addNonRoutineEventModalConfig, setAddNonRoutineEventModalConfig] = useState({
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
            value={performanceTabs}
            onChange={handleChangePerformance}
            sx={{
              display: "inline-flex",
              flexWrap: "wrap",
            }}
          >
            <Tab
              value="firstPayDay"
              label="First pay-for-performance"
              sx={{ minWidth: "10rem" }}
            />
            <Tab
              value="secondPayDay"
              label="Second pay-for-performance"
              sx={{ minWidth: "10rem" }}
            />
            <Tab
              value="thirdPayDay"
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
        <Grid
          item
          xs={12}
          md={9.7}
          sx={{
            border: "1px solid #2E813E",
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "#CBFFD5",
          }}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{ ...initialValues }}
          >
            <Form>
              <Grid item container>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    Pay-for-performance period
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2} sx={performancePeriodStyleInArea}>
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        From
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        id="from_date"
                        name="from_date"
                        sx={{
                          width: "100%",
                          input: { color: "#111" },
                        }}
                        disableFuture
                        format="dd/MM/yyyy"
                      />
                    </Grid>
                    <Grid item xs={12} md={2} sx={performancePeriodStyleInArea}>
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        To
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        id="to_date"
                        name="to_date"
                        sx={{
                          width: "100%",
                          input: { color: "#111" },
                        }}
                        disableFuture
                        format="dd/MM/yyyy"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    Adjusted baseline NG consumption
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        10,345,443
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="adjusted_baseline"
                        options={savingReportDropdown}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    Reporting period NG consumption
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        -41,137
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="reporting_period_NG_consumption"
                        options={savingReportDropdown}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    Non-routine adjustment
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        723,192
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="non_routine_adjustment"
                        options={savingReportDropdown}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    NG savings
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        10,010
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="NG_savings"
                        options={savingReportDropdown}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    NG savings as percentage of adjusted baseline NG consumption
                    and non-routine adjustment
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        6.5%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="NG_savings_percentage"
                        options={savingReportDropdown}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          </Formik>
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
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(event, newPage) =>
                    handlePageChange(event, newPage - 1)
                  }
                  color="primary"
                  sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                />
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
}

export default PerformancePeriodInformationAccordion;