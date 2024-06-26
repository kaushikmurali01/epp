import { Box, Button, Grid, Link, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import EvModal from "utils/modal/EvModal";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import {
  deleteAdminFacilityMeasureReport,
  fetchAdminFacilityMeasureReportListing,
} from "../../../../redux/admin/actions/adminFacilityActions";

const MeasureReportCard = ({
  onOpenEdit,
  data,
  pageInfo,
  setAddMeasureModalConfig,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleDeleteMeasureReport = () => {
    if (data?.id) {
      dispatch(deleteAdminFacilityMeasureReport(data?.id))
        .then(() => {
          setAddMeasureModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          dispatch(fetchAdminFacilityMeasureReportListing(pageInfo, id));
        })
        .catch((error) => {
          setAddMeasureModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
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
    headerText: "Delete measure report",
    headerSubText: "Are you sure you want to delete this measure report?",
    modalBodyContent: "",
    saveButtonAction: handleDeleteMeasureReport,
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
      sx={{
        background: "#EBFFEF",
        borderRadius: "12px",
        padding: "1.5rem",
      }}
    >
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="small">Measure name</Typography>
          <Typography variant="h6">{data?.measure_name}</Typography>
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
        {data?.measure_description && (
          <Grid item>
            <Typography variant="small">Measure description</Typography>
            <Typography
              variant="body2"
              sx={{ wordWrap: "break-word", hyphens: "auto" }}
            >
              {data?.measure_description}
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid container>
        {data?.baseline_detail && (
          <Grid item>
            <Typography variant="small">Baseline condition details</Typography>
            <Typography
              variant="body2"
              sx={{ wordWrap: "break-word", hyphens: "auto" }}
            >
              {data?.baseline_detail}
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid container>
        {data?.start_date && (
          <Grid item xs={12} sm={3}>
            <Typography variant="small">
              Measure installation start date
            </Typography>
            <Typography variant="body2">
              {format(new Date(data?.start_date), "MM/dd/yyyy")}
            </Typography>
          </Grid>
        )}
        {data?.end_date && (
          <Grid item xs={12} sm={3}>
            <Typography variant="small">Measure completion date</Typography>
            <Typography variant="body2">
              {format(new Date(data?.end_date), "MM/dd/yyyy")}
            </Typography>
          </Grid>
        )}
        {data?.measure_install_cost && (
          <Grid item xs={12} sm={3}>
            <Typography variant="small">Measure cost</Typography>
            <Typography variant="body2">
              ${data?.measure_install_cost}
            </Typography>
          </Grid>
        )}
        {data?.file_upload && (
          <Grid container xs={12} sm={3} alignItems="center">
            <Tooltip title="Click to download this measure report">
              <Link href={data?.file_upload} target={"_blank"}>
                <InsertDriveFileIcon
                  sx={{
                    color: "#2E813E",
                    fontSize: "2.5rem",
                    transform: "scaleX(-1)",
                  }}
                />
              </Link>
            </Tooltip>

            <Box>
              <Typography variant="small">Uploaded file</Typography>
              <Typography
                variant="body2"
                sx={{ wordWrap: "break-word", hyphens: "auto" }}
              >
                {data?.file_description}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </Grid>
  );
};

export default MeasureReportCard;
