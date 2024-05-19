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
import FacilityOverview from "./facilityOverview";
import FacilityApproved from "./facilityApproved";
import FacilityReview from "./facilityReview";
import FacilityRejected from "./facilityRejected";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import FacilityCreated from "./facilityCreated";
import EvModal from "utils/modal/EvModal";
import { Form, Formik } from "formik";
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  adminAssignFacilities,
  fetchAdminFacilitiesDropdown,
} from "../../../redux/admin/actions/adminFacilityActions";
import { validationSchemaAssignFacility } from "utils/validations/formValidation";
import { fetchAdminCompanyListing } from "../../../redux/admin/actions/adminCompanyAction";

const AdminFacilityListing = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("overview");
  const [companyFilter, setCompanyFilter] = useState("");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const dispatch = useDispatch();
  const [searchString, setSearchString] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  useEffect(() => {
    dispatch(fetchAdminFacilitiesDropdown());
    dispatch(fetchAdminCompanyListing(pageInfo));
  }, [dispatch]);

  const adminFacilitiesDropdownData = useSelector(
    (state) => state?.adminFacilityReducer?.facilitiesDropdown?.data || []
  );
  const companyListDropdownData = useSelector(
    (state) => state?.adminCompanyReducer?.companyList?.data?.rows || []
  );
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
    headerSubText: "Lorem Ipsum is simply dummy text of the print",
    modalBodyContent: "",
  });

  const RequestToJoinForm = () => {
    const initialValues = {
      email: "",
      facilityId: [],
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
        validationSchema={validationSchemaAssignFacility}
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
              <InputLabel>Assign Facility*</InputLabel>
              <FormControl>
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
      case "overview":
        return <FacilityOverview searchVal={searchString} />;
      case "created_facilities":
        return (
          <FacilityCreated
            searchVal={searchString}
            companyFilter={companyFilter}
          />
        );
      case "approved":
        return (
          <FacilityApproved
            searchVal={searchString}
            companyFilter={companyFilter}
          />
        );
      case "underreview":
        return (
          <FacilityReview
            searchVal={searchString}
            companyFilter={companyFilter}
          />
        );
      case "rejected":
        return (
          <FacilityRejected
            searchVal={searchString}
            companyFilter={companyFilter}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item>
          <Typography
            variant="h4"
            sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
          >
            Facilities Management
          </Typography>
          <Typography variant="small2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Typography>
        </Grid>
        <Grid item display="flex" alignItems="center" justifyContent="center">
          <TextField
            name="search"
            label="Search by Facility name & ID"
            type="text"
            fullWidth
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                height: "2.9rem",
                borderRadius: "6px",
              },
            }}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </Grid>
        <Grid
          item
          sm={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <FormGroup className="theme-form-group theme-select-form-group">
            <FormControl sx={{ minWidth: "6rem" }}>
              <Select
                displayEmpty={true}
                className="transparent-border"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                <MenuItem value="" disabled>
                  <em>Company name</em>
                </MenuItem>
                {companyListDropdownData?.map((item) => (
                  <MenuItem key={item?.id} value={item?.company_name}>
                    {item?.company_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>
        </Grid>
        <Grid
          item
          // sm={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="contained"
            sx={{
              padding: 0,
              minWidth: "5rem!important",
              bgcolor: "#2C77E9",
            }}
            onClick={openRequestModal}
          >
            Assign
          </Button>
        </Grid>
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
      <Grid item xs={12} md={8} mt={4}>
        <Tabs
          className="theme-tabs-list"
          value={tabValue}
          onChange={handleChange}
          sx={{ display: "inline-flex" }}
        >
          <Tab value="overview" label="Overview" sx={{ minWidth: "10rem" }} />
          <Tab
            value="created_facilities"
            label="Created facilities"
            sx={{ minWidth: "10rem" }}
          />

          <Tab value="approved" label="Approved" sx={{ minWidth: "10rem" }} />
          <Tab
            value="underreview"
            label="Under Review"
            sx={{ minWidth: "10rem" }}
          />
          <Tab value="rejected" label="Rejected" sx={{ minWidth: "10rem" }} />
        </Tabs>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderTabContent()}
        </Grid>
      </Grid>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </Container>
  );
};

export default AdminFacilityListing;
