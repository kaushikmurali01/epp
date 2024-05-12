import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFacility,
  fetchFacilityListing,
  submitFacilityForApproval,
} from "../../../redux/superAdmin/actions/facilityActions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import FacilityStatus from "components/FacilityStatus";
import CustomSlider from "components/CustomSlider";
import EvModal from "utils/modal/EvModal";

const Facility = () => {
  const [facilityToDelete, setFacilityToDelete] = useState("");
  const columns = [
    {
      Header: "Name/Nick Name",
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
          <Typography>{item.facility_name}</Typography>
          {item?.facility_id_submission_status === 1 && (
            <Button
              variant="contained"
              sx={{ display: item.is_approved && "none" }}
              onClick={() => submitForApprovalHandler(item.id)}
            >
              Submit for approval
            </Button>
          )}
          <Link
            href="#"
            variant="small"
            sx={{ color: "#2C77E9", cursor: "pointer" }}
            underline="none"
          >
            Update energy savings calculation
          </Link>
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
        <FacilityStatus>{item.facility_id_submission_status}</FacilityStatus>
      ),
    },
    {
      Header: "View/Edit",
      accessor: (item) => (
        <Box display="flex" onClick={(e) => e.stopPropagation()}>
          <Button
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
            }}
            onClick={() => navigate(`/facility-list/edit-facility/${item?.id}`)}
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
            onClick={() => {
              openDeleteFacilityModal(item?.id);
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const facilityListData = useSelector(
    (state) => state?.facilityReducer?.facilityList?.data?.rows || []
  );
  const facilityCount = useSelector(
    (state) => state?.facilityReducer?.facilityList?.data?.count || []
  );
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

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
          dispatch(fetchFacilityListing(pageInfo));
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

  useEffect(() => {
    dispatch(fetchFacilityListing(pageInfo));
  }, [dispatch, pageInfo.page, pageInfo.pageSize]);

  const submitForApprovalHandler = (facilityId) => {
    dispatch(submitFacilityForApproval(facilityId))
      .then(() => {
        dispatch(fetchFacilityListing(pageInfo));
      })
      .catch((error) => {
        console.error("Error submitting for approval:", error);
      });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h4"
            sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
          >
            Facility List
          </Typography>
          <Typography variant="small2">
            Please note that signing{" "}
            <Link
              href="#"
              variant="span2"
              sx={{ color: "#2C77E9", cursor: "pointer" }}
              underline="none"
            >
              {" "}
              Participant Agreement
            </Link>{" "}
            is mandatory before you enrol your facility
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            name="search"
            label="Search by Facility name & ID"
            type="text"
            fullWidth
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                height: "3rem",
                borderRadius: "6px",
              },
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sm={2}
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
      <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={facilityListData}
          count={facilityCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          onClick={(id) => navigate(`/facility-list/facility-details/${id}`)}
        />
      </Box>
      <EvModal
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        actionButtonData={facilityToDelete}
      />
    </Container>
  );
};

export default Facility;
