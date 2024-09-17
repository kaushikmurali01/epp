import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { useState } from "react";
import { MiniTable } from "components/MiniTable";
import { format } from "date-fns";
import { downloadFileFromUrl } from "utils/helper/helper";
import CustomPagination from "components/CustomPagination";

const DownloadFilesTab = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });
  const dataFiles = [
    {
      id: "1",
      module: "baseline",
      file_type: "electricity",
      status: "ready to download",
      created_on: "2023-09-16T14:30:00Z",
      file_url:
        "https://eppdevstorage.blob.core.windows.net/agreement-docs/meter_spreadsheet.xlsx",
    },
    {
      id: "2",
      module: "performance",
      file_type: "water",
      status: "pending",
      created_on: "2023-09-16T15:45:00Z",
      file_url: null,
    },
    {
      id: "3",
      module: "baseline",
      file_type: "natural gas",
      status: "failed",
      created_on: "2023-09-15T09:00:00Z",
      file_url: null,
    },
  ];

  const columns = [
    { Header: "S.No.", accessor: (item) => item.id },
    { Header: "Module", accessor: (item) => item.module },
    { Header: "File type", accessor: (item) => item.file_type },
    { Header: "Status", accessor: (item) => item.status },
    {
      Header: "Created on",
      accessor: (item) => format(item.created_on, "MM-dd-yyyy"),
    },
    { Header: "Action", accessor: (item) => actionButtons(item) },
  ];

  const handleRefreshCalculation = () => {
    console.log(`Refreshing the files.`);
  };

  const handleDeleteFile = (id) => {
    console.log(`deleting the file ${id}.`);
  };

  const actionButtons = (item) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.25rem",
        }}
      >
        <Tooltip title="download file">
          <span>
            <IconButton
              color="primary"
              onClick={() =>
                downloadFileFromUrl(
                  item.file_url,
                  `${item.file_type}_${item.module}`
                )
              }
              disabled={
                item.file_url === null && item.status !== "ready to download"
              }
            >
              <FileDownloadIcon />
            </IconButton>
          </span>
        </Tooltip>
        {"/"}
        <Tooltip title="delete file">
          <span>
            <IconButton
              color="error"
              onClick={() => handleDeleteFile(item.id)}
              disabled={
                item.file_url === null && item.status !== "ready to download"
              }
            >
              <DeleteForeverIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    );
  };

  return (
    <Grid
      container
      sx={{
        width: "100%",
        padding: { xs: "0", md: "0 2rem" },
        marginTop: { xs: "2rem", md: 0 },
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <Grid
        item
        width={"100%"}
        display={"flex"}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        wrap="wrap"
      >
        <Typography variant="h4" sx={{ fontSize: "1.5rem !important" }}>
          Downloads
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Tooltip title="Refresh downloads">
            <span>
              <IconButton
                sx={{
                  background: "#2e813e",
                  color: "#FFF",
                  ":hover": { color: "#FFF", background: "#1e6329" },
                  transition: "all 0.3s",
                }}
                onClick={handleRefreshCalculation}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Grid>

      <Grid
        item
        width={"100%"}
        display="flex"
        direction="column"
        justifyContent="center"
        alignItems="center"
        wrap="wrap"
      >
        <MiniTable
          columns={columns}
          data={dataFiles}
          firstChildColored={true}
        />
        <CustomPagination
          count={5}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
        />
      </Grid>
    </Grid>
  );
};

export default DownloadFilesTab;
