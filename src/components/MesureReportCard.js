import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import EvModal from "utils/modal/EvModal";

const MesureReportCard = ({ onOpenEdit }) => {
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
    headerText: "Delete measure report",
    headerSubText: "Are you sure you want to delete this measure report?",
    modalBodyContent: "",
    // saveButtonAction: handleDeleteFacility,
  });

  const openDeleteMeasureReportModal = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
    }));
  };

  return (
    <Grid
      container
      rowGap={2}
      sx={{ background: "#EBFFEF", borderRadius: "12px", padding: "1.5rem" }}
    >
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="small">Measure name</Typography>
          <Typography variant="h6">Demtroys System</Typography>
        </Grid>
        <Grid item>
          <Box>
            <Button
              style={{
                backgroundColor: "transparent",
                padding: 0,
                minWidth: "unset",
              }}
              disableRipple
              onClick={onOpenEdit}
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
              disableRipple
              onClick={openDeleteMeasureReportModal}
            >
              Delete
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          <Typography variant="small">Measure description</Typography>
          <Typography variant="body2">
            The building is provided with a heat management system that combines
            heat modulation and load shedding. It includes: (1) Demtroys systems
            + RF electrical energy management computer, micro-sequencer,
            high-powered RF wireless and remote access capacity
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          <Typography variant="small">Baseline condition details</Typography>
          <Typography variant="body2">
            Multi-residential building with 23 floors and 293 units heated with
            baseboard heaters (1st floor) and radiant ceilings. New make-up air
            unit installed in the fall of 2020. No central air-conditioning.
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <Typography variant="small">
            Measure installation start date
          </Typography>
          <Typography variant="body2">Demtroys System</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="small">Measure completion date</Typography>
          <Typography variant="body2">Demtroys System</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="small">Measure cost</Typography>
          <Typography variant="body2">Demtroys System</Typography>
        </Grid>
        <Grid container xs={12} sm={3} alignItems="center">
          <InsertDriveFileIcon
            sx={{
              color: "#2E813E",
              fontSize: "2.5rem",
              transform: "scaleX(-1)",
            }}
          />
          <Box>
            <Typography variant="small">Uploaded file</Typography>
            <Typography variant="body2">Demtroys System</Typography>
          </Box>
        </Grid>
      </Grid>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </Grid>
  );
};

export default MesureReportCard;
