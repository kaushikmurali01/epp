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
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
  LinearProgress,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "components/Table";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format, getYear } from "date-fns";
import {
  adminEntriesEndPoints,
  adminHourlyEndPoints,
  hourlyEndPoints,
} from "constants/apiEndPoints";
import {
  DELETE_REQUEST,
  GET_REQUEST,
  PATCH_REQUEST,
  POST_REQUEST,
} from "utils/HTTPRequests";
import { SnackbarContext } from "utils/notification/SnackbarProvider";
import EvModal from "utils/modal/EvModal";
import InputField from "components/FormBuilder/InputField";
import { Field, Form, Formik } from "formik";
import ButtonWrapper from "components/FormBuilder/Button";
import { validationSchemaEntry } from "utils/validations/formValidation";
import {
  deleteAdminMeter,
  fetchAdminMeterDetails,
} from "../../../redux/admin/actions/adminMeterActions";
import { fetchAdminEntriesListing } from "../../../redux/admin/actions/adminEntriesAction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  commonDocumentFileUploadAction,
  documentFileUploadAction,
} from "../../../redux/global/actions/fileUploadAction";
import NotificationsToast from "utils/notification/NotificationsToast";
import {
  fetchAdminFacilityDetails,
  fetchAdminFacilityStatus,
} from "../../../redux/admin/actions/adminFacilityActions";
import EnergyUseByHoursBasisGraph from "sections/Homepage/FacilityDetails/EntryListing/EnergyUseByHoursBasisGraph";
import ViewEntryDetailListModal from "sections/Homepage/FacilityDetails/EntryListing/ViewEntryDetailListModal";
import DeleteEntriesModal from "sections/Homepage/FacilityDetails/EntryListing/DeleteEntriesModal";

const AdminEntriesListing = ({
  OnEditMeterButton,
  onAddMeterSuccess,
  facilityMeterDetailId,
  meterId,
}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const fileInputRef = useRef(null);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [tabValue, setTabValue] = useState("hourlyOrSub-hourlyEntries");
  const [hourlyEntryFile, setHourlyEntryFile] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgUploadData, setImgUploadData] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");

  const [viewEntryList, setViewEntryList] = useState([]);
  const [uploadDataFormVisible, setUploadDataFormVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // const getDataProcessingLoader =
  //   sessionStorage?.getItem("dataProcessingLoader") === "true";
  // const [dataProcessingLoader, setDataProcessingLoader] = useState(
  //   getDataProcessingLoader || false
  // );
  const meterIdKey = `dataProcessingLoader_meter_${meterId}`;
  const getDataProcessingLoader = JSON.parse(
    sessionStorage.getItem(meterIdKey)
  );

  const [dataProcessingLoader, setDataProcessingLoader] = useState(
    getDataProcessingLoader?.loader || false
  );

  console.log(
    getDataProcessingLoader,
    dataProcessingLoader,
    "check loader state.."
  );
  const [refreshPageData, setRefreshPageData] = useState(0);

  const [modalConfig, setModalConfig] = useState({
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
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Sent Request",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "Add Entry",
    headerSubText:
      "Please enter the following details to add a new entry for this meter",
    modalBodyContent: "",
  });

  const [viewEntriesModalConfig, setViewEntriesModalConfig] = useState({
    ...modalConfig,
    modalUI: {
      ...modalConfig.modalUI,
      showHeader: false,
      modalBodyContentStyle: "",
      evModalStyle: {
        paperMaxWidth: "720px", // Set the desired max-width
      },
    },
  });

  const [deleteEntriesModalConfig, setDeleteEntriesModalConfig] = useState({
    ...modalConfig,
    modalUI: {
      ...modalConfig.modalUI,
      showHeader: false,
      modalBodyContentStyle: "",
    },
  });

  const handleDeleteEntry = (id) => {
    if (id) {
      DELETE_REQUEST(adminEntriesEndPoints.DELETE_ENTRY + "/" + id)
        .then((response) => {
          dispatch(fetchAdminEntriesListing(pageInfo, facilityMeterDetailId));
          dispatch(fetchAdminFacilityDetails(id));
          setDeleteModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
        })
        .catch((error) => {
          console.error("Error deleting entry:", error);
        });
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
      successButtonStyle: {
        backgroundColor: "danger.scarlet",
        "&:hover": { backgroundColor: "danger.colorCrimson" },
        color: "#fff",
      },
      cancelButtonStyle: {
        backgroundColor: "primary.main",
        "&:hover": { backgroundColor: "primary.mainDarkShade" },
        color: "#fff",
      },
    },
    headerText: "Delete entry",
    headerSubText: "Are you sure you want to delete this entry?",
    modalBodyContent: "",
    saveButtonAction: handleDeleteEntry,
  });

  const [initialValues, setInitialValues] = useState({
    start_date: "",
    end_date: "",
    usage: "",
    demand: "",
    total_cost: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const currentDate = new Date();
  const currentYear = getYear(currentDate);
  const columns = [
    {
      Header: "Start date",
      accessor: (item) => (
        <>{item?.start_date ? format(item?.start_date, "MM/dd/yyyy") : null}</>
      ),
    },
    {
      Header: "End date",
      accessor: (item) => (
        <>{item?.end_date ? format(item?.end_date, "MM/dd/yyyy") : null}</>
      ),
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

  const handleDeleteMeter = () => {
    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    dispatch(deleteAdminMeter(facilityMeterDetailId))
      .then(() => {
        setDeleteMeterModalConfig((prevState) => ({
          ...prevState,
          modalVisible: false,
        }));
        dispatch(fetchAdminFacilityStatus(id));
        onAddMeterSuccess();
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      })
      .catch((error) => {
        console.error("Error deleting facility:", error);
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      });
  };

  const [deleteMeterModalConfig, setDeleteMeterModalConfig] = useState({
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
      successButtonStyle: {
        backgroundColor: "danger.scarlet",
        "&:hover": { backgroundColor: "danger.colorCrimson" },
        color: "#fff",
      },
      cancelButtonStyle: {
        backgroundColor: "primary.main",
        "&:hover": { backgroundColor: "primary.mainDarkShade" },
        color: "#fff",
      },
    },
    headerText: "Delete Meter",
    headerSubText: "Are you sure you want to delete this meter?",
    modalBodyContent: "",
    saveButtonAction: handleDeleteMeter,
  });

  const enteriesListingData = useSelector(
    (state) => state?.adminEntriesReducer?.entriesList?.data?.rows || []
  );

  const enteriesListingCount = useSelector(
    (state) => state?.adminEntriesReducer?.entriesList?.data?.count || []
  );

  const meterData = useSelector(
    (state) => state?.adminMeterReducer?.meterDetails?.data || {}
  );
  useEffect(() => {
    dispatch(fetchAdminEntriesListing(pageInfo, facilityMeterDetailId));
    dispatch(fetchAdminMeterDetails(facilityMeterDetailId));
    getHourlySubHourlyEntryData();
  }, [dispatch, pageInfo.pageId, pageInfo.pageSize]);

  const handleAddButtonClick = (id) => {
    console.log(id);
    OnEditMeterButton(id);
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const AddEditEntry = ({ isEdit, data }) => {
    const initValues = {
      ...data,
      start_date: data?.start_date
        ? format(new Date(data?.start_date), "yyyy-MM-dd")
        : "",
      end_date: data?.end_date
        ? format(new Date(data?.end_date), "yyyy-MM-dd")
        : "",
    };
    const formSubmit = (data) => {
      const apiURL = adminEntriesEndPoints.ADD_EDIT_ENTRY;
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
      };

      if (!isEdit) {
        POST_REQUEST(apiURL, requestBody)
          .then((response) => {
            showSnackbar("Your form has been submitted!", "success", {
              vertical: "top",
              horizontal: "right",
            });
            dispatch(fetchAdminEntriesListing(pageInfo, facilityMeterDetailId));
            dispatch(fetchAdminFacilityDetails(id));
            setModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
              modalBodyContent: "",
            }));
          })
          .catch((error) => {
            showSnackbar(
              error?.message ? error.message : "Something went wrong!",
              "error",
              { vertical: "top", horizontal: "right" }
            );
          });
      } else {
        PATCH_REQUEST(apiURL + "/" + data?.id, requestBody)
          .then((response) => {
            showSnackbar("Your form has been updated!", "success", {
              vertical: "top",
              horizontal: "right",
            });
            dispatch(fetchAdminEntriesListing(pageInfo, facilityMeterDetailId));
            dispatch(fetchAdminFacilityDetails(id));
            setModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
              modalBodyContent: "",
            }));
          })
          .catch((error) => {
            showSnackbar(
              error?.message ? error.message : "Something went wrong!",
              "error",
              { vertical: "top", horizontal: "right" }
            );
          });
      }
    };
    return (
      <>
        <Formik
          initialValues={{ ...initValues }}
          validationSchema={validationSchemaEntry}
          enableReinitialize={true}
          onSubmit={formSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Stack sx={{ marginBottom: "1rem" }}>
                <InputField
                  name="start_date"
                  type="date"
                  label="Start Date*"
                  inputProps={{
                    max: format(new Date(), "yyyy-MM-dd"),
                  }}
                />
              </Stack>
              <Stack sx={{ marginBottom: "1rem" }}>
                <InputField
                  name="end_date"
                  type="date"
                  label="End Date*"
                  inputProps={{
                    max: format(new Date(), "yyyy-MM-dd"),
                    min:
                      values?.start_date &&
                      format(values?.start_date, "yyyy-MM-dd"),
                  }}
                />
              </Stack>

              <Stack sx={{ marginBottom: "1rem" }}>
                <InputField name="usage" label="Usage (KWh)*" type="number" />
              </Stack>

              <Stack sx={{ marginBottom: "1rem" }}>
                <InputField name="demand" label="Demand (KW)*" type="number" />
              </Stack>

              <Stack sx={{ marginBottom: "1rem" }}>
                <InputField
                  name="total_cost"
                  label="Total cost*"
                  type="number"
                />
              </Stack>

              <Grid display="flex" sx={{ marginTop: "1rem" }}>
                <ButtonWrapper type="submit" variant="contained">
                  Submit
                </ButtonWrapper>
              </Grid>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  const openDeleteMeterModal = () => {
    setDeleteMeterModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
    }));
  };

  const openRequestModal = (isEdit, data) => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: !isEdit ? "Add Entry" : "Edit Entry",
      headerSubText: !isEdit
        ? "Please enter the following details to add a new entry for this meter"
        : "Please edit the following details to update the entry for this meter",
      modalBodyContent: <AddEditEntry isEdit={isEdit} data={data} />,
    }));
  };

  const openDeleteModal = (entryId) => {
    setEntryToDelete(entryId);
    setDeleteModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
    }));
  };

  const handleButtonClick = () => {
    // Trigger the click event on the hidden file input element
    fileInputRef.current.click();
  };

  const getHourlySubHourlyEntryData = () => {
    GET_REQUEST(hourlyEndPoints.GET_HOURLY_DATA + facilityMeterDetailId)
      .then((response) => {
        if (response.data.statusCode == 200) {
          if (response.data?.data?.rows?.length > 0) {
            setFileName(response.data?.data?.rows[0]);
            setIsFileUploaded(true);
          } else {
            setIsFileUploaded(false);
          }
        }
      })
      .catch((error) => {});
  };

  const handleFileChange = (event) => {
    setUploadProgress(0); // reset before upload progress
    setIsUploading(true);
    const selectedFile = event.target.files[0];
    setHourlyEntryFile(selectedFile);
    const apiURL = hourlyEndPoints.ADD_BULK_HOURLY_DATA;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("iv", false);
    formData.append("facility_id", id);
    formData.append("meter_id", facilityMeterDetailId);

    //  dispatch(commonDocumentFileUploadAction(apiURL,formData))
    dispatch(
      commonDocumentFileUploadAction(apiURL, formData, (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        setUploadProgress(progress < 100 ? progress : 99); // wait until upload progress is confirmed
      })
    )
      .then((data) => {
        // setHourlyEntryFile
        if (
          data?.message === undefined ||
          data === undefined ||
          !data.success
        ) {
          setHourlyEntryFile(null);
        }
        setImgUploadData(data);
        setIsUploading(false);
        setUploadProgress(100); // when the upload is confirmed
      })
      .catch((error) => {
        console.error("Error uploading document:", error);
        setIsUploading(false);
      });
  };

  const uploadHourlyEntryFile = (imgData) => {
    uploadEntryFile(imgData);
  };

  const uploadEntryFile = (data) => {
    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    const apiURL = hourlyEndPoints.ADD_HOURLY_METER_DATA;
    const recordId = data.record_id;
    const payload = {
      facility_id: meterData?.facility_id,
      record_id: recordId,
    };

    // return;
    POST_REQUEST(apiURL, payload)
      .then((response) => {
        NotificationsToast({
          message: response.data.status,
          type: "success",
        });

        // reset
        setHourlyEntryFile(null);
        setImgUploadData("");
        setAcceptTermsAndCondition(false);
        setUploadDataFormVisible(false);
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });

        // Start polling for data
        startPollingForData(
          setDataProcessingLoader,
          recordId,
          facilityMeterDetailId
        );
      })
      .catch((error) => {
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
        NotificationsToast({
          message: error?.message ? error.message : "Something went wrong!",
          type: "error",
        });
      });
  };

  const downloadFileFromUrl = (fileUrl) => {
    fetch(imgUrl).then((response) => {
      response.blob().then((blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement("a");
        alink.href = fileURL;
        let fileName = `${
          meterData?.meter_name
        }_facility_meter_hourly_entries_file.${
          imgUrl.split("/").pop().split(".").pop().split("?")[0]
        }`;
        alink.download = fileName;
        alink.click();
      });
    });
  };

  const getUploadResult = async (loader, payload) => {
    let apiURL = `${adminHourlyEndPoints.GET_UPLOAD_RESULT}?iv=false&record_id=${payload.recordId}`;

    try {
      const res = await GET_REQUEST(apiURL);
      return res; // Return the response for polling check
    } catch (error) {
      console.log(error);
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error; // Throw the error to be caught in polling
    }
  };

  // Polling GET API to retrieve the data
  // const startPollingForData = (
  //   setDataProcessingLoader,
  //   getHourlyEntriesData
  // ) => {
  //   // Start data processing loader
  //   setDataProcessingLoader(true);
  //   sessionStorage.setItem("dataProcessingLoader", JSON.stringify(true));

  //   const checkInterval = setInterval(async () => {
  //     try {
  //       const response = await getHourlyEntriesData("processingLoader");
  //       if (response.data?.data?.rows?.length > 0) {
  //         // Data is retrieved successfully, stop polling
  //         setDataProcessingLoader(false);
  //         sessionStorage.removeItem("dataProcessingLoader");
  //         clearInterval(checkInterval);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }, 3000); // Poll every 3 seconds

  //   return checkInterval;
  // };

  const startPollingForData = (setDataProcessingLoader, recordId, meterId) => {
    // Start data processing loader
    setDataProcessingLoader(true);
    // Set the current timestamp along with the loader status
    const storedData = JSON.parse(sessionStorage.getItem(meterIdKey));
    let data = {};
    if (recordId !== undefined && storedData === null) {
      const now = new Date();
      data = {
        loader: true,
        timestamp: now.toISOString(),
        meterId: meterId,
        recordId: recordId || storedData?.recordId,
      };
      sessionStorage.setItem(meterIdKey, JSON.stringify(data));
    }

    let checkInterval;
    const pollData = async () => {
      try {
        // Check if 5 minutes have passed since setting the loader
        const checkStoredData = JSON.parse(sessionStorage.getItem(meterIdKey));
        const storedTime = new Date(checkStoredData.timestamp);
        const currentTime = new Date();
        const timeDifference = currentTime - storedTime;

        if (timeDifference >= 5 * 60 * 1000) {
          // 5 minutes in milliseconds
          console.log("5 minutes have passed, stopping polling.");
          clearInterval(checkInterval);
          setDataProcessingLoader(false);
          sessionStorage.removeItem(meterIdKey);
          NotificationsToast({
            message: "Maximum upload time exceeded. Please try again!",
            type: "error",
          });
          return;
        }

        if (checkStoredData?.recordId !== undefined) {
          const getUploadResultData = await getUploadResult(
            "processingLoader",
            checkStoredData
          );

          if (getUploadResultData.data?.status_code === 201) {
            const response = await getHourlyEntriesData("processingLoader");
            if (response.data?.data?.rows?.length > 0) {
              // Data is retrieved successfully, stop polling
              setDataProcessingLoader(false);
              sessionStorage.removeItem(meterIdKey);
              clearInterval(checkInterval);
              dispatch(fetchAdminFacilityStatus(id));
            }
          } else if (getUploadResultData.data?.status_code === 400) {
            setDataProcessingLoader(false);
            setUploadDataFormVisible(true);
            sessionStorage.removeItem(meterIdKey);
            clearInterval(checkInterval);
            dispatch(fetchAdminFacilityStatus(id));
            NotificationsToast({
              message: getUploadResultData.data
                ? getUploadResultData.data
                : "Something went wrong!",
              type: "error",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // Start the interval
    checkInterval = setInterval(pollData, 3000); // Poll every 3 seconds
    return checkInterval;
  };

  const deleteFile = (imgData) => {
    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    const apiURL = hourlyEndPoints.DELETE_HOURLY_ENTRIES_FILE;
    const payload = {
      record_id: imgData?.record_id,
      iv: false, // for hourly data independent variable will be false...
    };

    // return;
    POST_REQUEST(apiURL, payload)
      .then((response) => {
        setImgUploadData("");
        setHourlyEntryFile(null);
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      });
  };

  const [acceptTermsAndCondition, setAcceptTermsAndCondition] = useState(false);
  const handleTermsAndConditionChange = (event) => {
    setAcceptTermsAndCondition(event.target.checked);
  };

  const handleViewEntries = () => {
    setViewEntriesModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "",
      headerSubText: "",
      modalBodyContent: (
        <ViewEntryDetailListModal
          meterId={meterData?.id}
          meterType={meterData?.meter_type}
          facilityId={meterData?.facility_id}
        />
      ),
    }));
  };

  const handleDeleteEntries = () => {
    setDeleteEntriesModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "",
      headerSubText: "",
      modalBodyContent: (
        <DeleteEntriesModal
          meterId={meterData?.id}
          meterType={meterData?.meter_type}
          facilityId={meterData?.facility_id}
          setModalConfig={setDeleteEntriesModalConfig}
          setRefreshPageData={setRefreshPageData}
        />
      ),
    }));
  };

  const getHourlyEntriesData = async (loader) => {
    if (loader === "processingLoader") {
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
    } else {
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    }

    let apiURL = `${adminHourlyEndPoints.GET_HOURLY_ENTRIES}`;
    let payload = {
      facility_id: meterData?.facility_id,
      limit: 10,
      offset: 0,
      meter_id: meterData?.id,
      meter_type: meterData?.meter_type,
    };

    try {
      const res = await POST_REQUEST(apiURL, payload);
      if (
        res.data?.data?.rows instanceof Array &&
        res.data?.data?.rows.length > 0
      ) {
        setViewEntryList(res.data?.data?.rows);
        setUploadDataFormVisible(false);
      }

      if (loader !== "processingLoader" && res.data?.data?.rows.length === 0) {
        setViewEntryList(res.data?.data?.rows);
        setUploadDataFormVisible(true);
      }

      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      return res; // Return the response for polling check
    } catch (error) {
      console.log(error);
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      throw error; // Throw the error to be caught in polling
    }
  };

  useEffect(() => {
    if (Object.keys(meterData).length > 0 && !dataProcessingLoader) {
      getHourlyEntriesData();
    }

    if (Object.keys(meterData).length > 0 && dataProcessingLoader) {
      startPollingForData(
        setDataProcessingLoader,
        getDataProcessingLoader?.recordId,
        getDataProcessingLoader?.meterId
      );
    }
  }, [meterData, refreshPageData]);

  return (
    <>
      <IconButton
        sx={{
          backgroundColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.main",
          },
          marginLeft: "1rem",
          marginBottom: "1rem",
        }}
        onClick={onAddMeterSuccess}
      >
        <ArrowBackIcon
          sx={{
            color: "#fff",
            fontSize: "1.25rem",
          }}
        />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          // justifyContent: "space-between",
          // alignItems: "center",
          flexDirection: isSmallScreen ? "column" : "row",
        }}
      >
        <Box
          sx={{
            borderRight: "1px solid black",
            padding: "0 20px 0 20px",
          }}
        >
          <Typography variant="small2">Meter Name</Typography>
          <Typography variant="h6" gutterBottom>
            {meterData?.meter_name}
          </Typography>
        </Box>

        <Box
          sx={{
            borderRight: "1px solid black",
            padding: "0 20px 0 20px",
          }}
        >
          <Typography variant="small2">Meter ID</Typography>
          <Typography variant="h6" gutterBottom>
            {meterData?.meter_id}
          </Typography>
        </Box>

        <Box
          sx={{
            borderRight: "1px solid black",
            padding: "0 20px 0 20px",
          }}
        >
          <Typography variant="small2">Meter type</Typography>
          <Typography variant="h6" gutterBottom>
            {meterData?.meter_type == 1
              ? "Electricity"
              : meterData?.meter_type == 2
              ? "Natural Gas"
              : meterData?.meter_type == 3
              ? "Water"
              : ""}
          </Typography>
        </Box>

        <Box
          sx={{
            borderRight: "1px solid black",
            padding: "0 20px 0 20px",
          }}
        >
          <Typography variant="small2">Date meter became active</Typography>
          <Typography variant="h6" gutterBottom>
            {meterData?.meter_active &&
              format(new Date(meterData?.meter_active), "yyyy-MM-dd")}
          </Typography>
        </Box>

        <Box
          sx={{
            padding: "0 0 0 20px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {meterData?.is_rg_meter ? "Revenue-grade meter" : "Sub meter"}
          </Typography>
        </Box>

        <Box
          sx={{
            padding: "5px 0 0 20px",
          }}
        >
          <Link
            underline="hover"
            variant="small"
            sx={{ color: "blue.main", cursor: "pointer" }}
            onClick={() => handleAddButtonClick(facilityMeterDetailId)}
          >
            Edit
          </Link>
          <Link
            underline="hover"
            variant="small"
            sx={{ color: "danger.main", cursor: "pointer", marginLeft: "20px" }}
            onClick={() => openDeleteMeterModal()}
          >
            Delete
          </Link>
        </Box>
      </Box>

      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
          marginBottom: "3rem",
        }}
      >
        <Grid item xs={12} md={6}>
          <Tabs
            className="theme-tabs-list"
            value={tabValue}
            onChange={handleChange}
            sx={{ display: "inline-flex" }}
          >
            <Tab
              value="hourlyOrSub-hourlyEntries"
              label="Hourly or Sub-hourly entries"
              sx={{ minWidth: "10rem" }}
            />
            <Tab
              value="monthlyEntries"
              label="Monthly entries"
              sx={{ minWidth: "10rem" }}
            />
          </Tabs>
        </Grid>
        <Grid item sx={{ justifySelf: "flex-end" }}>
          {/* <Typography variant='small' sx={{ color: 'blue.main', cursor: 'pointer' }}>
            Downlod in excel
          </Typography>
          <Typography variant='small' sx={{ color: 'danger.main', cursor: 'pointer', marginLeft: '20px' }}>
            Delete entry
          </Typography> */}
          {tabValue == "monthlyEntries" ? (
            <Button
              variant="contained"
              sx={{ marginLeft: "2rem" }}
              onClick={() => openRequestModal(false)}
            >
              Add Entry
            </Button>
          ) : (
            <React.Fragment>
              {viewEntryList?.length > 0 && (
                <Stack direction="row" alignItems="center" gap="0.75rem">
                  <Link
                    underline="hover"
                    variant="body2"
                    sx={{ color: "#56B2AE", cursor: "pointer" }}
                    onClick={() => handleViewEntries()}
                  >
                    View entries
                  </Link>
                  <Link
                    underline="hover"
                    variant="body2"
                    sx={{ color: "danger.main", cursor: "pointer" }}
                    onClick={() => handleDeleteEntries()}
                  >
                    Delete entries
                  </Link>
                  <Link
                    underline="hover"
                    variant="body2"
                    sx={{ color: "primary.main", cursor: "pointer" }}
                    onClick={() => setUploadDataFormVisible(true)}
                  >
                    <IconButton>
                      <AddCircleIcon
                        sx={{
                          color: "text.primary",
                          fontSize: "1.875rem",
                        }}
                      />
                    </IconButton>
                    Add entries
                  </Link>
                </Stack>
              )}
            </React.Fragment>
          )}
        </Grid>
      </Grid>

      {tabValue == "monthlyEntries" ? (
        <Box sx={{ marginTop: "2rem" }}>
          <Table
            columns={columns}
            count={enteriesListingCount}
            data={enteriesListingData}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
          />
        </Box>
      ) : uploadDataFormVisible && !dataProcessingLoader ? (
        <Box>
          <Box>
            <Typography variant="h5">
              Upload data in bulk for this meter
            </Typography>
            <Typography variant="small2" gutterBottom>
              {/* You can upload a Green Button XML file or an Excel-compatible
              file. Use this{" "} */}
              You can upload an Excel-compatible file. Use this{" "}
              <Link
                href="https://eppdevstorage.blob.core.windows.net/agreement-docs/meter_spreadsheet.xlsx"
                underline="hover"
                color="#2C77E9"
                sx={{ cursor: "pointer" }}
              >
                single meter spreadsheet
              </Link>{" "}
              to upload the Excel file.
            </Typography>

            {isUploading ? (
              <>
                <Box
                  sx={{
                    mt: 4,
                    width: { xs: "100%", md: "50%" },
                    maxWidth: "350px",
                  }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {hourlyEntryFile?.name} Uploading..
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {uploadProgress}%
                    </Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <React.Fragment>
                {imgUploadData?.record_id ? (
                  <Box sx={{ marginTop: "1.5rem" }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "blue.main", display: "inline-block" }}
                    >
                      {hourlyEntryFile?.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "danger.main",
                        display: "inline-block",
                        marginLeft: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteFile(imgUploadData);
                      }}
                    >
                      Delete
                    </Typography>
                    {imgUploadData?.error && (
                      <Stack direction="row" sx={{ marginTop: "0.5rem" }}>
                        <Typography
                          variant="small"
                          sx={{ color: "danger.main" }}
                        >
                          {imgUploadData?.error}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      my={1}
                      sx={{
                        color: "#2E813E",
                        fontWeight: "500",
                        fontSize: "18px",
                        backgroundColor: "#D1FFDA",
                        padding: "7px 33px",
                        borderRadius: "8px",
                        height: "40px",
                        marginTop: "20px",
                        cursor: "pointer",
                        maxWidth: "fit-content",
                      }}
                      onClick={handleButtonClick}
                    >
                      {hourlyEntryFile ? hourlyEntryFile?.name : "Choose File"}
                    </Typography>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept=".xlsx,.xml,text/xml"
                    />

                    {!imgUploadData?.success && (
                      <Stack direction="row" sx={{ marginTop: "0.5rem" }}>
                        <Typography
                          variant="small"
                          sx={{ color: "danger.main" }}
                        >
                          {imgUploadData?.message}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                )}
              </React.Fragment>
            )}
          </Box>

          <Box>
            <Grid container mb={2} mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTermsAndCondition}
                    sx={{ color: "text.secondary2" }}
                    onChange={handleTermsAndConditionChange}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "14px!important" }}>
                    I hereby certify that this is the original file from the
                    Utility.
                  </Typography>
                }
              />
            </Grid>
            <Button
              variant="contained"
              onClick={() => uploadHourlyEntryFile(imgUploadData)}
              style={{
                padding: "0.2rem 1rem",
                minWidth: "unset",
                width: "165px",
                height: "40px",
              }}
              disabled={
                !hourlyEntryFile ||
                !acceptTermsAndCondition ||
                isUploading ||
                imgUploadData?.error
              }
            >
              Upload
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          {dataProcessingLoader && (
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginRight: "1rem" }}
              >
                Please be patient, file processing is in progress
              </Typography>
              <div class="progress-loader"></div>
            </Box>
          )}

          {/* show here Energy use by hourly basis  graph */}
          {/* {viewEntryList?.length > 0 && (
            <Box className="hourly-graph-row">
              <Stack direction="row" sx={{ width: "100%" }}>
                <Stack direction="row" sx={{ width: "100%" }}>
                  <EnergyUseByHoursBasisGraph />
                </Stack>
              </Stack>
            </Box>
          )} */}
        </Box>
      )}

      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
      <EvModal
        modalConfig={deletModalConfig}
        setModalConfig={setDeleteModalConfig}
        actionButtonData={entryToDelete}
      />
      <EvModal
        modalConfig={deleteMeterModalConfig}
        setModalConfig={setDeleteMeterModalConfig}
      />

      {viewEntriesModalConfig.modalVisible && (
        <EvModal
          modalConfig={viewEntriesModalConfig}
          setModalConfig={setViewEntriesModalConfig}
        />
      )}

      {deleteEntriesModalConfig.modalVisible && (
        <EvModal
          modalConfig={deleteEntriesModalConfig}
          setModalConfig={setDeleteEntriesModalConfig}
        />
      )}
    </>
  );
};

export default AdminEntriesListing;
