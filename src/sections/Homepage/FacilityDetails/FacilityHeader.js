import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  useMediaQuery,
  styled,
  ButtonGroup,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteFacility,
  fetchFacilityDetails,
  fetchFacilityListing,
  getWaterfallData,
  submitFacilityForApproval,
} from "../../../redux/superAdmin/actions/facilityActions";
import EvModal from "utils/modal/EvModal";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import AdminFacilityStatus from "components/AdminFacilityStatus";
import { hasPermission } from "utils/commonFunctions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { INVERTED_FACILITY_ID_SUBMISSION_STATUS } from "utils/ConstantsTypes";
import FacilityWaterfallChart from "./FacilityWaterfallChart.js";

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  "& .MuiButtonGroup-firstButton": {
    borderRadius: "20.8125rem 0rem 0rem 20.8125rem",
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-middleButton": {
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-lastButton": {
    borderRadius: "0 20.8125rem 20.8125rem 0",
  },
  "& .MuiButton-root": {
    "&:hover": {
      color: "#F7F7F5",
    },
  },
}));

export const buttonStyle = {
  padding: "0.44rem 1rem",
  lineHeight: "0.7",
  height: "max-content",
  fontSize: "12px!important",

  ".MuiButtonGroup-firstButton": {
    BorderRight: "10px",
  },
  whiteSpace: "nowrap",
};

export const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#2E813E",
  color: "#F7F7F5",
};

export const inactiveButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#EBEBEB",
  color: "#696969",
};

const BoxCard = styled(Box)(({ theme }) => {
  return {
    backgroundColor: "#FEFFE6",
    padding: "0.625rem",
    borderRadius: "0.75rem",
  };
});

const FacilityHeader = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const facilityDetails = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  const permissionList = useSelector(
    (state) => state?.facilityReducer?.userDetails?.permissions || []
  );
  const userCompanyId = useSelector(
    (state) => state?.facilityReducer?.userDetails?.user?.company_id
  );
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState("incentive");
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  const incentiveData = useSelector(
    (state) => state?.facilityReducer?.waterfallData?.data?.data || []
  );
  const energySavingData = useSelector(
    (state) => state?.facilityReducer?.waterfallData?.data?.data || []
  );
  const minimumSaving = useSelector(
    (state) => state?.facilityReducer?.waterfallData?.data?.minimumSaving || []
  );
  useEffect(() => {
    const graphData = {
      facility_id: id,
      meter_type: 1,
      energySaving: activeButton === "incentive" ? false : true,
    };
    dispatch(getWaterfallData(graphData));
  }, [dispatch, id, activeButton]);

  const handleDeleteFacility = (fId) => {
    if (fId) {
      dispatch(deleteFacility(fId))
        .then((res) => {
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          if (res.statusCode === 404) {
            return;
          } else {
            navigate("/facility-list");
          }
        })
        .catch((error) => {
          console.error("Error deleting facility:", error);
        });
    }
  };

  const submitForApprovalHandler = (facilityId) => {
    dispatch(submitFacilityForApproval(facilityId))
      .then(() => {
        dispatch(fetchFacilityDetails(facilityId));
      })
      .catch((error) => {
        console.error("Error submitting for approval:", error);
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
    headerText: "Delete facility",
    headerSubText: "Are you sure you want to delete this facility?",
    modalBodyContent: "",
  });

  const openDeleteFacilityModal = (fId) => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      saveButtonAction: () => handleDeleteFacility(fId),
    }));
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ marginTop: "2rem", padding: "0 !important" }}
    >
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={12} md={3.5}>
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
                {facilityDetails?.address && `${facilityDetails?.address}, `}{" "}
                {facilityDetails?.street_number &&
                  `${facilityDetails?.street_number}, `}
                {facilityDetails?.street_name &&
                  `${facilityDetails?.street_name}`}
                {facilityDetails?.sector && `${facilityDetails?.sector}`}
                <br />
                {facilityDetails?.city && `${facilityDetails?.city}, `}{" "}
                {facilityDetails?.country && `${facilityDetails?.country}`}
                <br />
                {facilityDetails?.province &&
                  `${facilityDetails?.province}, `}{" "}
                {facilityDetails?.postal_code &&
                  `${facilityDetails?.postal_code} `}
              </Typography>
              {/* <Box>
                <AdminFacilityStatus>
                  {facilityDetails?.facility_id_submission_status}
                </AdminFacilityStatus>
              </Box> */}
              {facilityDetails?.facility_id_submission_status === 1 && (
                <Box sx={{ marginTop: "15px", marginBottom: "15px" }}>
                  <Button
                    variant="contained"
                    sx={{
                      display: facilityDetails.is_approved && "none",
                      fontSize: { xs: "0.875rem" },
                      minWidth: { xs: "13rem" },
                    }}
                    onClick={() => submitForApprovalHandler(facilityDetails.id)}
                  >
                    Submit for baseline modelling
                  </Button>
                </Box>
              )}
              <Box>
                {hasPermission(permissionList, "facility-data") && <Button
                  style={{
                    backgroundColor: "transparent",
                    padding: 0,
                    minWidth: "unset",
                  }}
                  onClick={() => navigate(`/facility-list/edit-facility/${id}`)}
                >
                  Edit
                </Button>}
                {hasPermission(permissionList, "delete-facility") && (
                  <Button
                    color="error"
                    style={{
                      backgroundColor: "transparent",
                      padding: 0,
                      minWidth: "unset",
                      marginLeft: "1rem",
                    }}
                    onClick={() => openDeleteFacilityModal(id)}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Graph section */}
        <Grid item xs={12} md={5}>
          {/* <FacilityWaterfallChart /> */}
        </Grid>

        <Grid
          container
          // item
          xs={12}
          md={3.5}
          spacing={1}
          justifyContent="flex-end"
        >
          <Box container xs={6}>
            <Typography
              variant="h6"
              sx={{
                padding: "0.375rem 1rem",
                borderRadius: "1.8125rem",
                background: "#CFEEFF",
                color: "#1976AA",
                fontSize: "0.75rem",
                fontStyle: "italic",
                fontWeight: 400,
                mt: { xs: 2, lg: 0 },
              }}
            >
              {
                INVERTED_FACILITY_ID_SUBMISSION_STATUS[
                  `${facilityDetails?.facility_id_submission_status}`
                ]
              }
            </Typography>
          </Box>
          <Grid container justifyContent="flex-end">
            {facilityDetails?.total_incentive_earned && (
              <Grid item xs={6}>
                <BoxCard>
                  <Typography variant="small2" sx={{ color: "#54585A" }}>
                    Total Incentive Paid
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "0.875rem" }}>
                    {facilityDetails?.total_incentive_earned}
                  </Typography>
                </BoxCard>
              </Grid>
            )}
            {facilityDetails?.facility_ubi && (
              <Grid item xs={6}>
                <BoxCard>
                  <Typography variant="small2" sx={{ color: "#54585A" }}>
                    Facility UBI
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "0.875rem", textWrap: "wrap" }}
                  >
                    {facilityDetails?.facility_ubi}
                  </Typography>
                </BoxCard>
              </Grid>
            )}
          </Grid>
          <Grid container>
            {facilityDetails?.total_electricty_consumptions && (
              <Grid item xs={6}>
                <BoxCard>
                  <Typography variant="small2" sx={{ color: "#54585A" }}>
                    Baseline Energy Consumption
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "0.875rem" }}>
                    {facilityDetails?.total_electricty_consumptions}
                  </Typography>
                </BoxCard>
              </Grid>
            )}
            {facilityDetails?.benchmarking_eui && (
              <Grid item xs={6}>
                <BoxCard>
                  <Typography variant="small2" sx={{ color: "#54585A" }}>
                    Benchmarking EUI
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "0.875rem" }}>
                    {facilityDetails?.benchmarking_eui}
                  </Typography>
                </BoxCard>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <EvModal
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        key={id}
      />
    </Container>
  );
};

export default FacilityHeader;
