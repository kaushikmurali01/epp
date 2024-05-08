import {
  Box,
  Button,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Grid,
  Tabs,
  Tab,
  Typography,
  Stack,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { useContext, useEffect, useState } from "react";
import Table from "components/Table";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntriesListing } from "./../../../redux/actions/entriesAction";
import FacilityStatus from "components/FacilityStatus";
import { format, getYear } from "date-fns";
import { entriesEndPoints } from "constants/apiEndPoints";
import { DELETE_REQUEST, PATCH_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import { SnackbarContext } from "utils/notification/SnackbarProvider";
import EvModal from "utils/modal/EvModal";
import InputField from "components/FormBuilder/InputField";
import { Form, Formik } from "formik";
import ButtonWrapper from "components/FormBuilder/Button";
import { validationSchemaEntry } from "utils/validations/formValidation";

const EntriesListing = ({ onAddButtonClick, facilityMeterDetailId, meterId }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 100 });
  const [tabValue, setTabValue] = useState('monthlyEntries');
  const [entryToDelete, setEntryToDelete] = useState('');

  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
      headerTextStyle: { color: 'rgba(84, 88, 90, 1)' },
      headerSubTextStyle: { marginTop: '1rem', color: 'rgba(36, 36, 36, 1)', fontSize: { md: '0.875rem' } },
      fotterActionStyle: "",
      modalBodyContentStyle: ''
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Sent Request",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",

    },
    headerText: "Add Entry",
    headerSubText: 'Please enter the following details to add a new entry for this meter',
    modalBodyContent: "",
  });

  const handleDeleteEntry = (id) => {
    if (id) {
      DELETE_REQUEST(entriesEndPoints.DELETE_ENTRY + '/' + id)
        .then((response) => {
          dispatch(fetchEntriesListing(pageInfo, facilityMeterDetailId));
          setDeleteModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));

        })
        .catch((error) => {
          console.error("Error deleting entry:", error);
        })
    }
  };

  const [deletModalConfig, setDeleteModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
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
      saveButton: true,
      cancelButton: true,
      saveButtonName: "Delete",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "Delete entry",
    headerSubText: "Are you sure you want to delete this entry?",
    modalBodyContent: "",
    saveButtonAction: handleDeleteEntry,
  });

  const [initialValues, setInitialValues] = useState({
    start_date: '',
    end_date: '',
    usage: '',
    demand: '',
    total_cost: '',
  })

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const currentDate = new Date();
  const currentYear = getYear(currentDate);
  const columns = [
    {
      Header: "Start date",
      accessor: (item) => <>{format(item.start_date, "MM/dd/yyyy")}</>,
    },
    {
      Header: "End date",
      accessor: (item) => <>{format(item.end_date, "MM/dd/yyyy")}</>,
    },
    {
      Header: "Usage (KWh)",
      accessor: "usage",
    },
    {
      Header: "Demand (KW)",
      accessor: "demand",
    },
    {
      Header: "Total cost",
      accessor: "total_cost",
    },
    {
      Header: "Last updated",
      accessor: (item) => <>{format(item.updated_at, "MM/dd/yyyy")}</>,
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box display="flex" onClick={(e) => e.stopPropagation()}>
          <Button
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
            }}
            onClick={() => openRequestModal(true, item)}
          >
            Edit
          </Button>
          <Button
            color="error"
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            onClick={() => openDeleteModal(item?.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const enteriesListingData = useSelector(
    (state) => state?.entriesReducer?.entriesList?.data?.rows || []
  );
  useEffect(() => {
    dispatch(fetchEntriesListing(pageInfo, facilityMeterDetailId));
  }, [dispatch, pageInfo]);

  const handleAddButtonClick = () => {
    onAddButtonClick();
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const AddEditEntry = ({ isEdit, data }) => {
    const formSubmit = (data) => {
      const apiURL = entriesEndPoints.ADD_EDIT_ENTRY;
      const requestBody = {
        facility_id: parseInt(id),
        facility_meter_detail_id: parseInt(facilityMeterDetailId),
        meter_id: parseInt(meterId),
        year: currentYear,
        start_date: data.start_date,
        end_date: data.end_date,
        usage: parseInt(data.usage),
        demand: parseInt(data.demand),
        total_cost: parseInt(data.total_cost),
      }

      if (!isEdit) {
        POST_REQUEST(apiURL, requestBody)
          .then((response) => {
            showSnackbar('Your form has been submitted!', 'success', { vertical: 'top', horizontal: 'right' });
            dispatch(fetchEntriesListing(pageInfo, facilityMeterDetailId));
            setModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
              modalBodyContent: ''
            }));

          })
          .catch((error) => {
            showSnackbar(error?.message ? error.message : 'Something went wrong!', 'error', { vertical: 'top', horizontal: 'right' });
          })
      } else {
        PATCH_REQUEST(apiURL + '/' + data?.id, requestBody)
          .then((response) => {
            showSnackbar('Your form has been updated!', 'success', { vertical: 'top', horizontal: 'right' });
            dispatch(fetchEntriesListing(pageInfo, facilityMeterDetailId));
            setModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
              modalBodyContent: ''
            }));

          })
          .catch((error) => {
            showSnackbar(error?.message ? error.message : 'Something went wrong!', 'error', { vertical: 'top', horizontal: 'right' });
          })
      }
    }
    return (
      <>
        <Formik
          initialValues={{ ...initialValues }}
          validationSchema={validationSchemaEntry}
          enableReinitialize={true}
          onSubmit={formSubmit}
        >
          <Form>
            <Stack sx={{ marginBottom: '1rem' }}>
              <InputField
                name="start_date"
                type="date"
                label="Start Date*"
              />
            </Stack>
            <Stack sx={{ marginBottom: '1rem' }}>
              <InputField
                name="end_date"
                type="date"
                label="End Date*"
              />
            </Stack>

            <Stack sx={{ marginBottom: '1rem' }}>
              <InputField
                name="usage"
                label="Usage (KWh)*"
                type="text" />
            </Stack>

            <Stack sx={{ marginBottom: '1rem' }}>
              <InputField
                name="demand"
                label="Demand (KW)*"
                type="text" />
            </Stack>

            <Stack sx={{ marginBottom: '1rem' }}>
              <InputField
                name="total_cost"
                label="Total cost*"
                type="text" />
            </Stack>

            <Grid display="flex" sx={{ marginTop: '1rem' }}>
              <ButtonWrapper type="submit" variant="contained"  >
                Submit
              </ButtonWrapper>

            </Grid>

          </Form>
        </Formik>
      </>
    )
  }

  const openRequestModal = (isEdit, data) => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: !isEdit ? "Add Entry" : "Edit Entry",
      headerSubText: !isEdit ? 'Please enter the following details to add a new entry for this meter' : 'Please edit the following details to update the entry for this meter',
      modalBodyContent: ""
    }));
    if (isEdit) {
      setInitialValues(prevValues => {
        return {
          ...prevValues,
          ...data,
          start_date: data?.start_date
            ? format(new Date(data.start_date), "yyyy-MM-dd")
            : "",
          end_date: data?.end_date
            ? format(new Date(data.end_date), "yyyy-MM-dd")
            : "",
        };
      });
    }
    setTimeout(() => {
      setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        headerText: !isEdit ? "Add Entry" : "Edit Entry",
        headerSubText: !isEdit ? 'Please enter the following details to add a new entry for this meter' : 'Please edit the following details to update the entry for this meter',
        modalBodyContent: <AddEditEntry isEdit={isEdit} data={data} />
      }));
    }, 10);
  };

  const openDeleteModal = (entryId) => {
    setEntryToDelete(entryId);
    setDeleteModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
    }));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          // justifyContent: "space-between",
          // alignItems: "center",
          flexDirection: isSmallScreen ? "column" : "row",
        }}
      >

        <Box sx={{
          borderRight: "1px solid black",
          padding: '0 20px 0 20px',
        }}>
          <Typography variant="small2">
            Meter Name
          </Typography>
          <Typography variant="h6" gutterBottom>
            Meter name 1
          </Typography>
        </Box>

        <Box sx={{
          borderRight: "1px solid black",
          padding: '0 20px 0 20px',
        }}>
          <Typography variant="small2">
            Meter ID
          </Typography>
          <Typography variant="h6" gutterBottom>
            345634756
          </Typography>
        </Box>

        <Box sx={{
          borderRight: "1px solid black",
          padding: '0 20px 0 20px',
        }}>
          <Typography variant="small2">
            Meter type
          </Typography>
          <Typography variant="h6" gutterBottom>
            Electricity
          </Typography>
        </Box>

        <Box sx={{
          borderRight: "1px solid black",
          padding: '0 20px 0 20px',
        }}>
          <Typography variant="small2">
            Date meter became active
          </Typography>
          <Typography variant="h6" gutterBottom>
            05/01/2024
          </Typography>
        </Box>

        <Box sx={{
          padding: '0 0 0 20px',
        }}>
          <Typography variant="h6" gutterBottom>
            Revenue-grade meter
          </Typography>
        </Box>

        <Box sx={{
          padding: '5px 0 0 20px',
        }}>
          <Typography variant='small' sx={{ color: 'blue.main', cursor: 'pointer' }}>
            Edit
          </Typography>
          <Typography variant='small' sx={{ color: 'danger.main', cursor: 'pointer', marginLeft: '20px' }}>
            Delete
          </Typography>
        </Box>

      </Box>

      <Grid container sx={{ alignItems: "center", justifyContent: 'space-between', marginTop: '1rem', marginBottom: '3rem' }}>
        <Grid item xs={12} md={6} >
          <Tabs
            className='theme-tabs-list'
            value={tabValue}
            onChange={handleChange}
            sx={{ display: 'inline-flex' }}
          >
            <Tab value="monthlyEntries" label="Monthly entries" sx={{ minWidth: '10rem' }} />
            <Tab value="hourlyOrSub-hourlyEntries" label="Hourly or Sub-hourly entries" sx={{ minWidth: '10rem' }} />
          </Tabs>
        </Grid>
        <Grid item sx={{ justifySelf: 'flex-end' }}>
          {/* <Typography variant='small' sx={{ color: 'blue.main', cursor: 'pointer' }}>
            Downlod in excel
          </Typography>
          <Typography variant='small' sx={{ color: 'danger.main', cursor: 'pointer', marginLeft: '20px' }}>
            Delete entry
          </Typography> */}
          <Button variant="contained" sx={{ marginLeft: "2rem" }} onClick={() => openRequestModal(false)}>
            Add Entry
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={enteriesListingData}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
        />
      </Box>

      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
      <EvModal modalConfig={deletModalConfig} setModalConfig={setDeleteModalConfig} actionButtonData={entryToDelete} />

    </>
  );
};

export default EntriesListing;
