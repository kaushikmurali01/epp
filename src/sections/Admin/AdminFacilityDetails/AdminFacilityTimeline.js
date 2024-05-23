import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  StepConnector,
  Typography,
  stepConnectorClasses,
  styled,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAdminFacilityStatus } from "../../../redux/admin/actions/adminFacilityActions";

const DashedConnector = styled(StepConnector)(({ theme, active }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    border: "dashed 0.073rem #2e813e",
    [theme.breakpoints.down("sm")]: {
      display: "none",
      transform: "rotate(90deg)",
    },
  },
}));

const CustomStepLabel = styled(StepLabel)(({ theme, active }) => {
  return {
    position: "relative",
    "& .MuiStepIcon-root": {
      width: 8,
      color: active ? "#2E813E!important" : "#D4D4D4!important",
    },
    "& .MuiStepIcon-text": {
      display: "none",
      color: active ? "#2E813E!important" : "#D4D4D4!important",
    },
    "& .MuiStepLabel-label": {
      position: "relative",
      borderRadius: "12px 12px 12px 0",
      backgroundColor: active ? "#B8FFBF" : "#D4D4D4",
      color: "#242424!important",
      padding: "8px 4px",
      width: "80%",
      [theme.breakpoints.down("sm")]: {
        width: "200px",
        padding: "8px 10px",
        height: "100%",
      },
    },

    "& .MuiStepLabel-labelContainer": {
      position: "absolute",
      top: -60,
      left: "100%",
      transform: "translateX(-50%)",
      color: active ? "#111111" : "#FFFFFF",
      [theme.breakpoints.down("lg")]: {
        top: -70,
      },
      [theme.breakpoints.down("md")]: {
        top: -90,
      },
      [theme.breakpoints.down("sm")]: {
        width: "100px",
        top: -30,
        transform: "translateX(30%)",
      },
    },
  };
});

export default function AdminFacilityTimeline() {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { id } = useParams();

  React.useEffect(() => {
    dispatch(fetchAdminFacilityStatus(id));
  }, [dispatch, id]);

  const facility_status = useSelector(
    (state) => state?.adminFacilityReducer?.facilityStatus?.data
  );

  const steps = [
    {
      step: 1,
      label: "Create Facility",
    },
    {
      step: 2,
      label: "Enter Facility Data",
    },
    {
      step: 3,
      label: "Submit Facility",
    },
    {
      step: 4,
      label: "Accept Baseline Model",
    },
    {
      step: 5,
      label: "Program Start",
    },
  ];

  return (
    <Box sx={{ width: "90%" }}>
      <Stepper
        alternativeLabel
        connector={<DashedConnector />}
        orientation={isSmallScreen ? "vertical" : "horizontal"}
        // sx={{ overflowY: isSmallScreen ? "auto" : "none" }}
      >
        {steps.map((step) => (
          <Step key={step.step}>
            <CustomStepLabel
              active={step.step <= facility_status?.facility_id_general_status}
            >
              <Typography variant="small2">{step.label}</Typography>
              {step.step <= facility_status?.facility_id_general_status && (
                <CheckCircleIcon
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    color: "#2E813E",
                  }}
                />
              )}
            </CustomStepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
