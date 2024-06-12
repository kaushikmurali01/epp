import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  useMediaQuery,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EvModal from "utils/modal/EvModal";
import { deleteAdminFacility } from "../../../redux/admin/actions/adminFacilityActions";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import AdminFacilityStatus from "components/AdminFacilityStatus";

const BoxCard = styled(Box)(({ theme }) => {
  return {
    backgroundColor: "#FEFFE6",
    padding: "0.625rem",
    borderRadius: "0.75rem",
  };
});

const AdminFacilityHeader = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const facilityDetails = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data
  );
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const handleDeleteFacility = () => {
    if (id) {
      dispatch(deleteAdminFacility(id))
        .then(() => {
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          navigate("/facility-list");
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

  const openDeleteFacilityModal = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {facilityDetails?.display_pic_url ? (
                <img
                  src={facilityDetails?.display_pic_url}
                  alt="FacilityImage"
                  style={{
                    borderRadius: "50%",
                    height: "7.5rem",
                    width: "7.5rem",
                  }}
                />
              ) : (
                <MapsHomeWorkIcon
                  sx={{
                    fontSize: "7.5rem",
                    color: "#B9B9B9",
                  }}
                />
              )}
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              sx={{ width: "100%" }}
              alignItems={isSmallScreen ? "center" : "start"}
            >
              <Typography variant="h5">
                {facilityDetails?.facility_name}
              </Typography>
              <Typography variant="small2" gutterBottom>
                {facilityDetails?.address && `${facilityDetails?.address} ,`}{" "}
                {facilityDetails?.sector && `${facilityDetails?.sector}`}
                <br />
                {facilityDetails?.city && `${facilityDetails?.city} ,`}{" "}
                {facilityDetails?.country && `${facilityDetails?.country}`}
                <br />
                {facilityDetails?.province &&
                  `${facilityDetails?.province} ,`}{" "}
                {facilityDetails?.postal_code &&
                  `${facilityDetails?.postal_code} `}
              </Typography>
              <Box>
                <AdminFacilityStatus>
                  {facilityDetails?.facility_id_submission_status}
                </AdminFacilityStatus>
              </Box>
              <Box>
                <Button
                  style={{
                    backgroundColor: "transparent",
                    padding: 0,
                    minWidth: "unset",
                  }}
                  onClick={() => navigate(`/facility-list/edit-facility/${id}`)}
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
                  onClick={openDeleteFacilityModal}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Graph section */}
        {/* <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ height: 150 }}>
            <Typography variant="body2">Graph Placeholder</Typography>
          </Paper>
        </Grid> */}

        <Grid
          container
          item
          xs={12}
          md={4}
          spacing={1}
          justifyContent="flex-end"
        >
          <Grid item xs={6}>
            <BoxCard>
              <Typography variant="small2">Facility ID</Typography>
              <Typography variant="h6">{facilityDetails?.id}</Typography>
            </BoxCard>
          </Grid>
          {/* <Grid item xs={6}>
            <BoxCard>
              <Typography variant="small2">Total Incentive Paid</Typography>
              <Typography variant="h6">
                {facilityDetails?.total_incentive_earned}
              </Typography>
            </BoxCard>
          </Grid>
          <Grid item xs={6}>
            <BoxCard>
              <Typography variant="small2">Annual Baseline Electricity Consumption</Typography>
              <Typography variant="h6">
                {facilityDetails?.total_electricty_consumptions}
              </Typography>
            </BoxCard>
          </Grid>
          <Grid item xs={6}>
            <BoxCard>
              <Typography variant="small2">Benchmarking EUI</Typography>
              <Typography variant="h6">
                {facilityDetails?.benchmarking_eui}
              </Typography>
            </BoxCard>
          </Grid> */}
        </Grid>
      </Grid>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </Container>
  );
};

export default AdminFacilityHeader;
