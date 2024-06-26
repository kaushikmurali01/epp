import React, { useState, useRef, useMemo } from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  TextField, Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Table from "components/Table";
import EvModal from "utils/modal/EvModal";

const EmailTemplateMicroComponent = () => {
  const [filePreviewModalConfig, setFilePreviewModalConfig] = useState({
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
      saveButton: false,
      cancelButton: false,
      saveButtonName: "",
      cancelButtonName: "",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    modalBodyContent: "",
  });
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [searchString, setSearchString] = useState("");
  const inputRef = useRef(null);

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEditFile = (file) => {
    console.log("Editing file:", file);
    // Implement your edit logic here
  };

  const handleDownloadFile = (file) => {
    console.log("Downloading file:", file);
    // Implement your download logic here
  };

  const handleDeleteFile = (file) => {
    console.log("Deleting file:", file);
    // Implement your delete logic here
  };

  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Size",
      accessor: "size",
    },
    {
      Header: "Date modified",
      accessor: "date_modified",
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box
          display="flex"
          onClick={(e) => e.stopPropagation()}
          justifyContent="flex-end"
        >
          <Button
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
              fontSize: "0.875rem",
              color: "#027397",
            }}
            onClick={() => handleEditFile(item)}
          >
            Edit
          </Button>
          <Button
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
              fontSize: "0.875rem",
              color: "primary.main",
            }}
            onClick={() => handleDownloadFile(item)}
          >
            Download
          </Button>
          <Button
            color="error"
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
              fontSize: "0.875rem",
            }}
            onClick={() => handleDeleteFile(item)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const contactListingData = {
    1: {
      id: 1,
      name: "Report-2022",
      type: "Document",
      size: "10kb",
      date_modified: "2022/01/01",
      file_description:
        "Lorem ipsum dolor sit amet consectetur. Venenatis vel sed sit duis pharetra neque quis nec. Amet convallis ipsum in habitant purus libero. Aliquam blandit sed et justo pharetra magna nulla ac. Quam semper ligula eu nunc ultrices pellentesque. Ultrices erat eget congue suspendisse. Dignissim habitasse et est mi. Augue morbi.",
    },
    2: {
    id: 2,
      name: "Presentation-Q1",
        type: "Document",
          size: "15kb",
            date_modified: "2022/03/15",
              file_description:
    "Lorem ipsum dolor sit amet consectetur. Venenatis vel sed sit duis pharetra neque quis nec. Amet convallis ipsum in habitant purus libero. Aliquam blandit sed et justo pharetra magna nulla ac. Quam semper ligula eu nunc ultrices pellentesque. Ultrices erat eget congue suspendisse. Dignissim habitasse et est mi. Augue morbi.",
    },
  3: {
    id: 3,
      name: "Budget-2023",
        type: "Spreadsheet",
          size: "20kb",
            date_modified: "2023/01/10",
              file_description:
    "Lorem ipsum dolor sit amet consectetur. Venenatis vel sed sit duis pharetra neque quis nec. Amet convallis ipsum in habitant purus libero. Aliquam blandit sed et justo pharetra magna nulla ac. Quam semper ligula eu nunc ultrices pellentesque. Ultrices erat eget congue suspendisse. Dignissim habitasse et est mi. Augue morbi.",
    },
  4: {
    id: 4,
      name: "Meeting-Notes",
        type: "Document",
          size: "5kb",
            date_modified: "2023/05/20",
              file_description:
    "Lorem ipsum dolor sit amet consectetur. Venenatis vel sed sit duis pharetra neque quis nec. Amet convallis ipsum in habitant purus libero. Aliquam blandit sed et justo pharetra magna nulla ac. Quam semper ligula eu nunc ultrices pellentesque. Ultrices erat eget congue suspendisse. Dignissim habitasse et est mi. Augue morbi.",
    },
};

  // Search function
 const filteredData = useMemo(() => {
   return Object.values(contactListingData).filter((item) =>
     item.name.toLowerCase().includes(searchString.toLowerCase())
   );
 }, [contactListingData, searchString]);

  const contactListCount = filteredData.length;

 const handleFilePreviewModal = (id) => {
   const selectedFile = contactListingData[id];
   console.log("file preview", selectedFile);
   setFilePreviewModalConfig((prevState) => ({
     ...prevState,
     modalVisible: true,
     file: selectedFile,
     modalBodyContent: (
       <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
         <Typography
           variant="span"
           sx={{
             padding: 0,
             fontSize: "1.125rem !important",
             fontStyle: "normal",
             fontWeight: 600,
             lineHeight: "128.571% !important",
           }}
         >
           {selectedFile.name}
         </Typography>
         <Typography
           variant="span"
           sx={{
             padding: 0,
             fontSize: "0.875rem !important",
             fontStyle: "normal",
             fontWeight: 400,
             lineHeight: "128.571% !important",
           }}
         >
           {selectedFile.file_description}
         </Typography>
         <Box sx={{ display: "flex", gap: "1rem" }}>
           <Button
             variant="contained"
             style={{
               fontSize: "0.875rem",
               background: "#027397",
             }}
             onClick={() => handleEditFile(selectedFile)}
           >
             Edit
           </Button>
           <Button
             variant="contained"
             style={{
               fontSize: "0.875rem",
               color: "primary.main",
             }}
             onClick={() => handleDownloadFile(selectedFile)}
           >
             Download
           </Button>
           <Button
             variant="contained"
             color="error"
             style={{
               fontSize: "0.875rem",
             }}
             onClick={() => handleDeleteFile(selectedFile)}
           >
             Delete
           </Button>
         </Box>
       </Box>
     ),
   }));
 };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <FormGroup>
        <FormControl
          fullWidth
          sx={{
            position: "relative",
            bgcolor: "#fff",
            borderRadius: "8px",
            color: "dark.main",
          }}
        >
          <TextField
            inputRef={inputRef}
            value={searchString}
            placeholder="Search by file name"
            inputProps={{
              style: {
                color: "#242424",
                fontSize: "1rem",
                paddingRight: "2rem",
              },
            }}
            onChange={(e) => setSearchString(e.target.value)}
          />
          {searchString?.length > 0 ? (
            <ClearIcon
              onClick={() => setSearchString("")}
              sx={{
                color: "#333",
                fontSize: "1.25rem",
                position: "absolute",
                right: "0.75rem",
                top: "0",
                bottom: "0",
                margin: "auto",
                zIndex: "1",
                cursor: "pointer",
              }}
            />
          ) : (
            <SearchIcon
              onClick={handleSearchIconClick}
              sx={{
                color: "#333",
                fontSize: "1.25rem",
                position: "absolute",
                right: "0.75rem",
                top: "0",
                bottom: "0",
                margin: "auto",
                zIndex: "1",
                cursor: "pointer",
              }}
            />
          )}
        </FormControl>
      </FormGroup>

      <Grid container>
        <Table
          columns={columns}
          data={filteredData}
          count={contactListCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          headbgColor="rgba(217, 217, 217, 0.2)"
          onClick={(id) =>handleFilePreviewModal(id)}
        />
      </Grid>
      <EvModal
        modalConfig={filePreviewModalConfig}
        setModalConfig={setFilePreviewModalConfig}
      />
    </Box>
  );
};

export default EmailTemplateMicroComponent;