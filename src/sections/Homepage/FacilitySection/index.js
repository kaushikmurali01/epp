import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  assignFacilities,
  deleteFacility,
  fetchFacilitiesDropdown,
  fetchFacilityListing,
  submitFacilityForApproval,
} from "../../../redux/superAdmin/actions/facilityActions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import CustomSlider from "components/CustomSlider";
import EvModal from "utils/modal/EvModal";
import { Form, Formik } from "formik";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import ButtonWrapper from "components/FormBuilder/Button";
import debounce from "lodash.debounce";
import { validationSchemaAssignFacility } from "utils/validations/formValidation";
import AdminFacilityStatus from "components/AdminFacilityStatus";
import { hasPermission } from "utils/commonFunctions";

const Facility = () => {
  const [facilityToDelete, setFacilityToDelete] = useState("");
  const permissionList = useSelector(
    (state) => state?.facilityReducer?.userDetails?.permissions || []
  );

  const columns = [
    {
      Header: "Name/Nick Name",
      accessorKey: "facility_name",
      accessor: (item) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textWrap: "nowrap",
            alignItems: "flex-start",
          }}
          gap={2}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography variant="body2" sx={{ fontWeight: "inherit" }}>
            {item.facility_name}
          </Typography>
          {item?.facility_id_submission_status === 1 && (
            <Button
              variant="contained"
              sx={{
                display: item.is_approved && "none",
                fontSize: { xs: "0.875rem" },
              }}
              onClick={() => submitForApprovalHandler(item.id)}
            >
              Submit for baseline modelling
            </Button>
          )}
          {false ? (
            <Link
              href="#"
              variant="small"
              sx={{ color: "#2C77E9", cursor: "pointer" }}
              underline="none"
            >
              Update energy savings calculation
            </Link>
          ) : (
            <></>
          )}
        </Box>
      ),
    },
    {
      Header: "Total Electicity Savings",
      accessor: "total_electricity_savings",
    },
    {
      Header: "% Energy Savings",
      accessor: (item) => (
        <Box
          sx={{
            display: item.energy_savings ? "flex" : "none",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>{item.energy_savings}%</Typography>
          <CustomSlider value={item.energy_savings} />
        </Box>
      ),
    },
    {
      Header: "Total Incentive Earned",
      accessor: "total_incentive_earned",
    },
    {
      Header: "Benchmarking EUI",
      accessor: "benchmarking_eui",
    },
    {
      Header: "Facility Status",
      accessor: (item) => (
        <AdminFacilityStatus>
          {item.facility_id_submission_status}
        </AdminFacilityStatus>
      ),
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box
          display="flex"
          onClick={(e) => e.stopPropagation()}
          justifyContent="flex-end"
        >
          <Button
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            onClick={() => navigate(`/facility-list/edit-facility/${item?.id}`)}
          >
            Edit
          </Button>
          {hasPermission(permissionList, "delete-facility") && (
            <Button
              color="error"
              disableRipple
              style={{
                backgroundColor: "transparent",
                padding: 0,
                minWidth: "unset",
                marginLeft: "1rem",
                fontSize: "0.875rem",
              }}
              onClick={() => {
                openDeleteFacilityModal(item?.id);
              }}
            >
              Delete
            </Button>
          )}
        </Box>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userCompanyId = useSelector(
    (state) => state?.facilityReducer?.userDetails?.user?.company_id
  );
  const facilityListData = useSelector(
    (state) => state?.facilityReducer?.facilityList?.data?.rows || []
  );
  const facilityCount = useSelector(
    (state) => state?.facilityReducer?.facilityList?.data?.count || []
  );
  const facilitiesDropdownData = useSelector(
    (state) => state?.facilityReducer?.facilitiesDropdown?.data || []
  );
  useEffect(() => {
    dispatch(fetchFacilitiesDropdown(userCompanyId));
  }, [dispatch]);

  const [searchString, setSearchString] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const openDeleteFacilityModal = (facilityId) => {
    setFacilityToDelete(facilityId);
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
    }));
  };

  const handleDeleteFacility = (id) => {
    if (id) {
      dispatch(deleteFacility(id))
        .then(() => {
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          dispatch(fetchFacilityListing(pageInfo, "", userCompanyId));
        })
        .catch((error) => {
          console.error("Error deleting facility:", error);
        });
    }
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
      saveButton: true,
      cancelButton: true,
      saveButtonName: "Delete",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "Delete facility",
    headerSubText: "Are you sure you want to delete this facility?",
    modalBodyContent: "",
    saveButtonAction: handleDeleteFacility,
  });

  const debouncedSearch = debounce(
    (pageInfo, searchString, sort_Column, sort_Order) => {
      dispatch(
        fetchFacilityListing(
          pageInfo,
          searchString,
          userCompanyId,
          sort_Column,
          sort_Order
        )
      );
    },
    300
  );

  useEffect(() => {
    debouncedSearch(pageInfo, searchString, sortColumn, sortOrder);
    return () => {
      debouncedSearch.cancel();
    };
  }, [
    dispatch,
    pageInfo.page,
    pageInfo.pageSize,
    searchString,
    sortColumn,
    sortOrder,
  ]);

  const submitForApprovalHandler = (facilityId) => {
    dispatch(submitFacilityForApproval(facilityId))
      .then(() => {
        dispatch(fetchFacilityListing(pageInfo, searchString, userCompanyId));
      })
      .catch((error) => {
        console.error("Error submitting for approval:", error);
      });
  };

  const [assignModalConfig, setAssignModalConfig] = useState({
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
      companyId: userCompanyId,
    };
    const formSubmit = (values) => {
      dispatch(assignFacilities(values)).then(() => {
        setAssignModalConfig((prevState) => ({
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
                  {facilitiesDropdownData?.map((item) => (
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
    setAssignModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <RequestToJoinForm />,
    }));
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography
            variant="h4"
            sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
          >
            Facility List
          </Typography>
          {/* <Typography variant="small2">
            Please note that signing{" "}
            <Link
              href="#/participant-agreement"
              variant="span2"
              sx={{ color: "#2C77E9", cursor: "pointer" }}
              underline="none"
            >
              {" "}
              Participant Agreement
            </Link>{" "}
            is mandatory before you enrol your facility
          </Typography> */}
        </Grid>
        <Grid item xs={12} sm={8}>
          <Grid
            container
            sx={{
              gap: { xs: "1rem", md: "2rem" },
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <Grid item>
              <TextField
                name="search"
                label="Search by Facility name"
                type="text"
                fullWidth
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "3rem",
                    borderRadius: "6px",
                  },
                }}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </Grid>
            <Grid
              item
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="contained"
                sx={{
                  padding: "4px 12px",
                  minWidth: "5rem!important",
                  // bgcolor: "#2C77E9",
                }}
                onClick={openRequestModal}
              >
                Assign Access
              </Button>
            </Grid>
            <Grid
              item
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
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

      <Box sx={{ marginTop: "2rem" }}>
        <Table
          cursorStyle="pointer"
          columns={columns}
          data={facilityListData}
          count={facilityCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          onClick={(id) => navigate(`/facility-list/facility-details/${id}`)}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          setSortColumn={setSortColumn}
          setSortOrder={setSortOrder}
        />
      </Box>
      <EvModal
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        actionButtonData={facilityToDelete}
      />
      <EvModal
        modalConfig={assignModalConfig}
        setModalConfig={setAssignModalConfig}
      />
    </Container>
  );
};

export default Facility;
