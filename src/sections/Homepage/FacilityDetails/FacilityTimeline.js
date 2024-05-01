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

const steps = [
  "Create Facility",
  "Enter Facility Data",
  "Submit Facility",
  "Accept Baseline Model",
  "Program Start",
];

const DashedConnector = styled(StepConnector)(({ theme }) => ({
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
    },
    "& .MuiStepIcon-text": {
      display: "none",
    },
    "& .MuiStepLabel-label": {
      position: "relative",
      borderRadius: "12px 12px 12px 0",
      backgroundColor: active ? "#B8FFBF" : "#474747",
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

export default function FacilityTimeline() {
  const [activeSteps, setActiveSteps] = React.useState([0]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const handleStepChange = (newActiveStep) => {
    setActiveSteps([...activeSteps, newActiveStep]);
  };

  return (
    <Box sx={{ width: "90%" }}>
      <Stepper
        alternativeLabel
        connector={<DashedConnector />}
        onStepChange={handleStepChange}
        orientation={isSmallScreen ? "vertical" : "horizontal"}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <CustomStepLabel active={activeSteps.includes(index)}>
              <Typography variant="small2">{label}</Typography>
              {activeSteps.includes(index) && (
                <CheckCircleIcon
                  sx={{ position: "absolute", top: -10, right: -10 }}
                />
              )}
            </CustomStepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
