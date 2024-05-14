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
import SelectBox from "components/FormBuilder/Select";
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminFacilityListing } from "../../../redux/admin/actions/adminFacilityActions";

const AdminFacilityListing = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("overview");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const dispatch = useDispatch();
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 100 });

  useEffect(() => {
    dispatch(fetchAdminFacilityListing(pageInfo, 0));
  }, [dispatch]);

  const adminFacilityData = useSelector(
    (state) => state?.adminFacilityReducer?.facilityList?.data?.rows || []
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
      emails: "",
      assign_facility: "",
    };
    const formSubmit = (values) => {
      const emailArray = values.emails?.split(",").map((email) => email.trim());
      console.log(emailArray);
    };

    return (
      <Formik
        initialValues={{
          ...initialValues,
        }}
        onSubmit={formSubmit}
      >
        <Form>
          <Stack sx={{ marginBottom: "1rem" }}>
            <InputField
              name="emails"
              label="User email ID*"
              placeholder="email1, email2, ..."
            />
          </Stack>
          <Stack sx={{ marginBottom: "1rem" }}>
            <SelectBox
              name="assign_facility"
              label="Assign Facility*"
              options={adminFacilityData}
              valueKey="id"
              labelKey="facility_name"
            />
          </Stack>
          <Grid display="flex" sx={{ marginTop: "1rem" }}>
            <ButtonWrapper type="submit" variant="contained">
              Submit
            </ButtonWrapper>
          </Grid>
        </Form>
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
        return <FacilityOverview />;
      case "created_facilities":
        return <FacilityCreated />;
      case "approved":
        return <FacilityApproved />;
      case "underreview":
        return <FacilityReview />;
      case "rejected":
        return <FacilityRejected />;
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
          />
        </Grid>
        <Grid
          item
          sm={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Select name="Company" fullWidth size="small">
            <MenuItem value="">
              <em>Company</em>
            </MenuItem>
          </Select>
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
