import { Button, Divider, Grid, Typography } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useState } from "react";
import EvModal from "utils/modal/EvModal";

const truncateText = (text, maxWords) => {
  const words = text.split(" ");
  if (words.length <= maxWords) {
    return text;
  } else {
    return words.slice(0, maxWords).join(" ") + "...";
  }
};

const DocumentCard = () => {
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
    headerText: "Delete document",
    headerSubText: "Are you sure you want to delete this document?",
    modalBodyContent: "",
    // saveButtonAction: handleDeleteFacility,
  });

  const openDeleteDocumentModal = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
    }));
  };

  return (
    <Grid>
      <Grid
        sx={{
          background: "#EBFFEF",
          borderRadius: "1.25rem",
          width: "12.056rem",
          minHeight: "15.946rem",
        }}
      >
        <InsertDriveFileIcon
          sx={{
            color: "#2E813E60",
            fontSize: "7.75rem",
            transform: "scaleX(-1)",
          }}
        />
        <Grid
          item
          sx={{
            padding: "0 1rem 1rem 1rem",
          }}
        >
          <Typography variant="h6">Demtroys System</Typography>
          <Typography variant="body2" mb={1}>
            {truncateText(
              "Lorem ipsum this is the dummy data Lorem ipsum this is the dummy data",
              14
            )}
          </Typography>
          <Divider />
          <Grid container justifyContent="space-between" mt={1}>
            <Typography variant="small">6/12/2023</Typography>
            <Typography variant="small">6.1mb</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Button
          color="error"
          style={{
            backgroundColor: "transparent",
            padding: 0,
            minWidth: "unset",
            marginLeft: "1rem",
          }}
          disableRipple
          onClick={openDeleteDocumentModal}
        >
          Delete
        </Button>
      </Grid>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </Grid>
  );
};

export default DocumentCard;
