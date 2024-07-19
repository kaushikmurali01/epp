import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  TextField,
  Select,
  MenuItem,
  Stack,
  InputLabel,
  FormControl,
  FormGroup,
} from "@mui/material";
import FacilityOverview from "../AdminFacilityListing/facilityOverview";
import FacilityApproved from "../AdminFacilityListing/facilityApproved";
import FacilityReview from "../AdminFacilityListing/facilityReview";
import FacilityRejected from "../AdminFacilityListing/facilityRejected";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import FacilityCreated from "../AdminFacilityListing/facilityCreated";
import EvModal from "utils/modal/EvModal";
import { Form, Formik } from "formik";
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  adminAssignFacilities,
  downloadFacilitiesBulkData,
  downloadFacilityRowData,
  fetchAdminFacilitiesDropdown,
} from "../../../redux/admin/actions/adminFacilityActions";
import { validationSchemaAssignFacility } from "utils/validations/formValidation";
import { fetchAdminCompaniesDropdown } from "../../../redux/admin/actions/adminCompanyAction";
import NotificationsToast from "utils/notification/NotificationsToast";
import Loader from "pages/Loader";
import FacilityEnrolledActive from "./facilityEnrolledActive";
import FacilityEnrolledInProcess from "./facilityEnrolledInProcess";

const AdminFacilityListingNew = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("enrolled_active_facilities");
  const [companyFilter, setCompanyFilter] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const dispatch = useDispatch();
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    dispatch(fetchAdminFacilitiesDropdown());
    dispatch(fetchAdminCompaniesDropdown());
  }, [dispatch]);

  const adminFacilitiesDropdownData = useSelector(
    (state) => state?.adminFacilityReducer?.facilitiesDropdown?.data || []
  );
  const adminCompaniesDropdownData = useSelector(
    (state) => state?.adminCompanyReducer?.companiesDropdown?.data || []
  );
  const loadingState = useSelector(
    (state) => state?.adminFacilityReducer?.loading
  );
  const alertLoadingState = useSelector(
    (state) => state?.adminCompanyReducer?.loading
  );
  const emailToAvoid = useSelector(
    (state) => state?.facilityReducer?.userDetails?.user?.email || ""
  );

  const onDownloadBulkClick = (page_info, status) => {
    dispatch(downloadFacilitiesBulkData(page_info, companyFilter, status)).then(
      (response) => {
        const data = response?.data;
        if (data) {
          fetch(data)
            .then((res) => {
              res.blob().then((blob) => {
                const fileURL = window.URL.createObjectURL(blob);
                let alink = document.createElement("a");
                alink.href = fileURL;
                let fileName = "Facilities_Bulk_Data.csv";
                alink.download = fileName;
                alink.click();
              });
              NotificationsToast({
                message: "Downloading facilities bulk data completed",
                type: "success",
              });
            })
            .catch((error) => {
              NotificationsToast({
                message: error?.message
                  ? error.message
                  : "Something went wrong while downloading!",
                type: "error",
              });
            });
        }
      }
    );
  };

  const onDownloadRowClick = (facility_id, facility_name) => {
    dispatch(downloadFacilityRowData(facility_id)).then((response) => {
      const data = response?.data;
      if (data) {
        fetch(data).then((res) => {
          res
            .blob()
            .then((blob) => {
              const fileURL = window.URL.createObjectURL(blob);
              let alink = document.createElement("a");
              alink.href = fileURL;
              let fileName = "Facility_Data";
              if (facility_name) {
                fileName += "_for_" + facility_name + ".csv";
              }
              alink.download = fileName;
              alink.click();
              NotificationsToast({
                message: `Downloading facility data for ${facility_name} completed`,
                type: "success",
              });
            })
            .catch((error) => {
              NotificationsToast({
                message: error?.message
                  ? error.message
                  : "Something went wrong while downloading!",
                type: "error",
              });
            });
        });
      }
    });
  };
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
      successButtonStyle: {},
      cancelButtonStyle: {},
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "Assign Facility",
    headerSubText: "",
    modalBodyContent: "",
  });

  const RequestToJoinForm = () => {
    const initialValues = {
      email: "",
      facilityId: [],
      companyId: null,
    };
    const formSubmit = (values) => {
      dispatch(adminAssignFacilities(values)).then(() => {
        setModalConfig((prevState) => ({
          ...prevState,
          modalVisible: false,
        }));
      });
    };

    return (
      <Formik
        initialValues={{
          ...initialValues,
        }}
        validationSchema={validationSchemaAssignFacility(emailToAvoid)}
        onSubmit={formSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Stack sx={{ marginBottom: "1rem" }}>
              <InputField
                name="email"
                label="User email ID*"
                placeholder="email1, email2, ..."
              />
            </Stack>
            <Stack sx={{ marginBottom: "1rem", width: "300px" }}>
              <FormGroup className="theme-form-group theme-select-form-group">
                <InputLabel>Assign Facility*</InputLabel>
                <FormControl sx={{ color: "primary.main" }}>
                  <Select
                    fullWidth
                    name="facilityId"
                    multiple
                    value={values.facilityId}
                    onChange={(e) => {
                      setFieldValue("facilityId", e.target.value);
                    }}
                  >
                    {adminFacilitiesDropdownData?.map((item) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.facility_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
            </Stack>
            <Stack sx={{ marginBottom: "1rem", width: "300px" }}>
              <FormGroup className="theme-form-group theme-select-form-group">
                <InputLabel>Assign Facility*</InputLabel>
                <FormControl sx={{ color: "primary.main" }}>
                  <Select
                    fullWidth
                    name="facilityId"
                    value={values.facilityId}
                    onChange={(e) => {
                      setFieldValue("facilityId", e.target.value);
                    }}
                  >
                    {adminFacilitiesDropdownData?.map((item) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.facility_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
            </Stack>
            <Grid display="flex" sx={{ marginTop: "1rem" }}>
              <ButtonWrapper type="submit" variant="contained">
                Submit
              </ButtonWrapper>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  };

  const openRequestModal = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <RequestToJoinForm />,
    }));
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case "enrolled_active_facilities":
        return (
          <FacilityEnrolledActive
            searchVal={searchString}
            companyFilter={companyFilter}
            onDownloadBulkClick={onDownloadBulkClick}
            onDownloadRowClick={onDownloadRowClick}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
          />
        );
      case "in_process_facilities":
        return (
          <FacilityEnrolledInProcess
            searchVal={searchString}
            companyFilter={companyFilter}
            onDownloadBulkClick={onDownloadBulkClick}
            onDownloadRowClick={onDownloadRowClick}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
          />
        );
      case "underreview":
        return (
          <FacilityReview
            searchVal={searchString}
            companyFilter={companyFilter}
            onDownloadBulkClick={onDownloadBulkClick}
            onDownloadRowClick={onDownloadRowClick}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
          />
        );
      case "rejected":
        return (
          <FacilityRejected
            searchVal={searchString}
            companyFilter={companyFilter}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={100} md={4}>
          <Typography
            variant="h4"
            sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
          >
            List of Facilities
          </Typography>
          {/* <Typography variant="small2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Typography> */}
        </Grid>
        <Grid item xs={100} md={8}>
          <Grid
            container
            alignItems="center"
            sx={{
              gap: "2rem",
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <Grid
              item
              // sm={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
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
                onClick={() => navigate("/facility-list/add-facility")}
              >
                Add Facility
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div container>
        <Grid
          item
          xs={12}
          md={8}
          mt={4}
          sx={{
            overflowX: "auto!important",
            ".MuiTabs-scroller": {
              overflowX: { xs: "auto !important", md: "hidden" },
            },
          }}
        >
          <Tabs
            className="theme-tabs-list"
            value={tabValue}
            onChange={handleChange}
            sx={{
              display: "inline-flex",
            }}
          >
            <Tab
            value="enrolled_active_facilities" 
            label="Enrolled/Active Facilities" 
            sx={{ minWidth: "10rem" }} />
            <Tab
              value="in_process_facilities"
              label="In-process Facilities"
              sx={{ minWidth: "10rem" }}
            />

            {/* <Tab
              value="inactive_Facilities"
              label="Inactive Facilities"
              sx={{ minWidth: "10rem" }}
            /> */}
          </Tabs>
        </Grid>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderTabContent()}
        </Grid>
      </Grid>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState || alertLoadingState}
        loaderPosition="fixed"
      />
    </Container>
  );
};

export default AdminFacilityListingNew;
