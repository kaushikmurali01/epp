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
import React, { useEffect, useState } from "react";
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

  const handleDeleteFacility = () => {
    if (id) {
      dispatch(deleteFacility(id))
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

  // const incentiveData = [
  //   { name: "Total", value: 3255, onPeak: 3255, offPeak: 0 },
  //   { name: "3rd P4P", value: 1550, onPeak: 750, offPeak: 800 },
  //   { name: "2nd P4P", value: 1085, onPeak: 525, offPeak: 560 },
  //   { name: "1st P4P", value: 625, onPeak: 300, offPeak: 325 },
  //   { name: "Pre-Project", value: 1500, onPeak: 1500, offPeak: 0 },
  // ];

  // const energySavingData = [
  //   { name: "3rd P4P", value: 1550, onPeak: 750, offPeak: 800 },
  //   { name: "2nd P4P", value: 1085, onPeak: 525, offPeak: 560 },
  //   { name: "1st P4P", value: 625, onPeak: 300, offPeak: 325 },
  // ];

  function Legend() {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          mt: 0.5,
          fontSize: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
          <Box sx={{ width: 10, height: 10, bgcolor: "#8bc34a", mr: 0.5 }} />
          <Typography variant="caption">
            On-Peak {activeButton === "incentive" ? "Incentive" : "Saving"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: 10, height: 10, bgcolor: "#4caf50", mr: 0.5 }} />
          <Typography variant="caption">
            Off-Peak {activeButton === "incentive" ? "Incentive" : "Saving"}
          </Typography>
        </Box>
      </Box>
    );
  }

  const CustomBar = (props) => {
    const { x, y, width, height, value, fill } = props;
    const displayIncentiveValue =
      typeof value === "number" && activeButton === "incentive"
        ? `$${value.toFixed(2)}`
        : value;
    const displaySavingValue = `${value}kWh`;
    return (
      <g>
        <rect x={x} y={y} width={width} height={15} fill={fill} />
        {width > 30 && (
          <text
            x={x + width / 2}
            y={y + 15 / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#000000"
            fontSize={10}
          >
            {activeButton === "incentive"
              ? displayIncentiveValue
              : displaySavingValue}
          </text>
        )}
      </g>
    );
  };

  function IncentiveChart({ data }) {
    const processedData = React.useMemo(() => {
      return data?.reduce((acc, item, index, array) => {
        let transparentValue = 0;
        let cumulativeTotal = item.value;

        if (item.name.includes("2nd P4P")) {
          const firstP4PIndex = array.findIndex((d) =>
            d.name.includes("1st P4P")
          );
          transparentValue = array[firstP4PIndex].value;
          cumulativeTotal += transparentValue;
        } else if (item.name.includes("3rd P4P")) {
          const firstP4PIndex = array.findIndex((d) =>
            d.name.includes("1st P4P")
          );
          const secondP4PIndex = array.findIndex((d) =>
            d.name.includes("2nd P4P")
          );
          transparentValue =
            array[firstP4PIndex].value + array[secondP4PIndex].value;
          cumulativeTotal += transparentValue;
        }
        return [
          ...acc,
          {
            ...item,
            transparentValue,
            cumulativeTotal,
          },
        ];
      }, []);
    }, [data]);

    const maxTotal = Math.max(
      ...processedData.map((item) => item.cumulativeTotal)
    );

    return (
      <Box sx={{ width: "100%", height: 120, overflow: "hidden" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={processedData}
            margin={{ left: 25 }}
          >
            <XAxis type="number" domain={[0, maxTotal]} hide />
            <YAxis
              dataKey="name"
              type="category"
              tick={{
                fontSize: 10,
                fontWeight: 500,
                fill: "#333",
                textAnchor: "end",
                width: 160,
              }}
              wrapperStyle={{ whiteSpace: "nowrap" }}
            />
            <Bar
              dataKey="transparentValue"
              stackId="a"
              fill="transparent"
              shape={(props) => <CustomBar {...props} value={null} />}
            />

            <Bar
              dataKey="onPeak"
              stackId="a"
              fill="#8bc34a"
              shape={(props) => (
                <CustomBar {...props} value={props.payload.onPeak} />
              )}
            />
            <Bar
              dataKey="offPeak"
              stackId="a"
              fill="#4caf50"
              shape={(props) => (
                <CustomBar {...props} value={props.payload.offPeak} />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  function EnergySavingsChart({ data }) {
    return (
      <Box sx={{ width: "100%", height: 120, overflow: "hidden" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ left: 25 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              tick={{
                fontSize: 10,
                fontWeight: 500,
                fill: "#333",
                textAnchor: "end",
                width: 160,
              }}
              wrapperStyle={{ whiteSpace: "nowrap" }}
            />
            <Bar
              dataKey="onPeak"
              stackId="a"
              fill="#8bc34a"
              shape={(props) => (
                <CustomBar {...props} value={props.payload.onPeak} />
              )}
            />
            <Bar
              dataKey="offPeak"
              stackId="a"
              fill="#4caf50"
              shape={(props) => (
                <CustomBar {...props} value={props.payload.offPeak} />
              )}
            />
            <text
              x="50%"
              y="100%"
              dy={-5}
              textAnchor="middle"
              fill="#333"
              fontSize={10}
            >
              Minimum savings: {minimumSaving}
            </text>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  const IncentiveEnergyChart = React.memo(function IncentiveEnergyChart({
    incentiveData,
    energySavingData,
  }) {
    return (
      <Box sx={{ height: 141, fontFamily: "Arial, sans-serif" }}>
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <StyledButtonGroup
            disableElevation
            variant="contained"
            color="primary"
          >
            <Button
              sx={
                activeButton === "incentive"
                  ? activeButtonStyle
                  : inactiveButtonStyle
              }
              onClick={() => handleButtonClick("incentive")}
            >
              Incentive
            </Button>
            <Button
              sx={
                activeButton === "energy_saving"
                  ? activeButtonStyle
                  : inactiveButtonStyle
              }
              onClick={() => handleButtonClick("energy_saving")}
            >
              Energy saving
            </Button>
          </StyledButtonGroup>
          <Legend />
        </Grid>
        {activeButton === "incentive" ? (
          <IncentiveChart data={incentiveData} />
        ) : (
          <EnergySavingsChart data={energySavingData} />
        )}
      </Box>
    );
  });

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
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
              <Box>
                <AdminFacilityStatus>
                  {facilityDetails?.facility_id_submission_status}
                </AdminFacilityStatus>
              </Box>
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
                {hasPermission(permissionList, "delete-facility") && (
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
                )}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Graph section */}
        <Grid item xs={12} md={5}>
          <IncentiveEnergyChart
            incentiveData={incentiveData}
            energySavingData={energySavingData}
          />
        </Grid>

        <Grid
          container
          item
          xs={12}
          md={3.5}
          spacing={1}
          justifyContent="flex-end"
        >
          <Grid item xs={6}>
            <BoxCard>
              <Typography variant="small2">Facility UBI</Typography>
              <Typography variant="h6">
                {facilityDetails?.facility_ubi}
              </Typography>
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

export default FacilityHeader;
