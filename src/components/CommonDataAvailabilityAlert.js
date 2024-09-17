import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CommonDataAvailabilityAlert = ({
  p4pEndDate,
  isAdmin = false,
  onRequestData,
}) => {
  const [expanded, setExpanded] = useState(false);
  const formattedDate = p4pEndDate
    ? format(parseISO(p4pEndDate), "MMMM d, yyyy")
    : "the P4P end date";

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const getAlertColor = () => {
    return isAdmin ? "#fbd4b1" : "#b7e6ff";
  };

  const getBGColor = () => {
    return isAdmin ? "#fbf3ec" : "#f0faff";
  };

  const getAlertIcon = () => {
    return isAdmin ? <WarningIcon color="warning" /> : <InfoIcon color="info" />;
  };

  const getAlertTitle = () => {
    if (p4pEndDate === null) {
      return "Performance Settings Update Required";
    }

    return isAdmin
      ? "Notice: Incomplete Data for P4P Calculation"
      : "Data Availability Notice";
  };

  const getAlertContent = () => {
    if (p4pEndDate === null) {
      return (
        <Typography variant="body2" paragraph>
          Please update the settings to set the P4P end date. Once the settings
          are updated, you will be able to calculate the P4P calculations.
        </Typography>
      );
    }

    if (isAdmin) {
      return (
        <>
          <Typography variant="body2" paragraph>
            The dataset for the Pay-for-Performance (P4P) calculation is
            incomplete. Data is not available up to {formattedDate}, which is
            required for the full P4P report submission.
          </Typography>
          <Typography
            variant="body2"
            paragraph
            sx={{ marginBottom: "0.15rem", fontWeight: 600 }}
          >
            Current Actions:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2">
                Users can view and analyze the performance of available data
                against the baseline model.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                P4P report submission is currently disabled to prevent
                incomplete submissions.
              </Typography>
            </li>
          </ul>
          {onRequestData && (
            <Button
              variant="contained"
              color="primary"
              onClick={onRequestData}
              sx={{ mt: 2 }}
            >
              Request Data Update
            </Button>
          )}
        </>
      );
    } else {
      return (
        <>
          <Typography variant="body2" paragraph>
            The complete dataset for the Pay-for-Performance (P4P) calculation
            is not yet available up to {formattedDate}. As a result, the P4P
            report cannot be submitted at this time.
          </Typography>
          <Typography variant="body2">
            However, you can still review the performance of the available data
            against the baseline model. This preliminary analysis can provide
            valuable insights while we await the full dataset.
          </Typography>
        </>
      );
    }
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        marginBottom: 2,
        "&:before": {
          display: "none",
        },
        "& .MuiAccordionSummary-root": {
          backgroundColor: `${getAlertColor()}`,
          borderRadius: "8px",
        },
        "& .MuiAccordionDetails-root": {
          padding: "16px 16px 24px",
          backgroundColor: `${getBGColor()}`,
          color: "black",
        },
        "&.Mui-expanded": {
          marginBottom: "1rem !important",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {getAlertIcon()}
          <Typography sx={{ fontWeight: "bold", ml: 1 }}>
            {getAlertTitle()}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{getAlertContent()}</AccordionDetails>
    </Accordion>
  );
};

export default CommonDataAvailabilityAlert;
