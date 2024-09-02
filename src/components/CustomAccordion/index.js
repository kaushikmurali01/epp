import React, { useState } from "react";
import {
  Typography,
  styled,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  display: "grid",
  overflowAnchor: "auto",
  gap: "2rem",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
  ({ theme }) => ({
    flexDirection: "row",
    padding: "0 1.5rem",
    borderRadius: "0.75rem",
    background: "#E2F8E6",
    "&.Mui-expanded": {
      borderRadius: "0.75rem 0.75rem 0rem 0rem",
    },
    "& .MuiAccordionSummary-expandIconWrapper": {
      color: "#242424",
    },
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      color: "#2E813E",
    },
    "& .MuiAccordionSummary-content": {
      marginBlock: theme.spacing(2),
    },
  })
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "0 0 2rem 0",
}));

const CustomAccordion = ({ summary, details, panelId, expanded, onChange }) => {

  const handleAccordionChange = (event, isExpanded) => {
    onChange(panelId, isExpanded);
  };

  return (
    <Accordion expanded={expanded === panelId} onChange={handleAccordionChange}>
      <AccordionSummary
        aria-controls={`${panelId}-content`}
        id={`${panelId}-header`}
        expandIcon={
          expanded === panelId ? (
            <RemoveCircleRoundedIcon sx={{ fontSize: "1.5rem" }} />
          ) : (
            <AddCircleRoundedIcon sx={{ fontSize: "1.5rem" }} />
          )
        }
      >
        <Typography
          variant="h6"
          sx={{
            color: "#000",
            fontSize: "1.125rem",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
          }}
        >
          {summary}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{details}</AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
