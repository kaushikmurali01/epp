import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

const CustomPagination = ({
  count,
  pageInfo,
  setPageInfo,
  incomingRowPerPageArr = [5, 10, 15, 25, 50],
}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const totalPages = Math.ceil(count / pageInfo?.pageSize);
  const pageButtons = [];
  let startPage = Math.max(1, pageInfo?.page - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (pageInfo?.page > 3 && pageInfo?.page + 2 <= totalPages) {
    startPage = pageInfo?.page - 2;
    endPage = pageInfo?.page + 2;
  } else if (pageInfo?.page > 3 && pageInfo?.page + 2 > totalPages) {
    startPage = Math.max(1, totalPages - 4);
    endPage = totalPages;
  }
  const handlePrevPage = (pageInfo, setPageInfo) => {
    if (pageInfo?.page > 1) {
      setPageInfo({ ...pageInfo, page: pageInfo?.page - 1 });
    }
  };

  const handleNextPage = (count, pageInfo, setPageInfo) => {
    const totalPages = Math.ceil(count / pageInfo?.pageSize);
    if (pageInfo?.page < totalPages) {
      setPageInfo({ ...pageInfo, page: pageInfo?.page + 1 });
    }
  };

  const handleFirstPage = (pageInfo, setPageInfo) => {
    setPageInfo({ ...pageInfo, page: 1 });
  };

  const handleLastPage = (count, pageInfo, setPageInfo) => {
    const totalPages = Math.ceil(count / pageInfo?.pageSize);
    setPageInfo({ ...pageInfo, page: totalPages });
  };

  const handleRowsPerPageChange = (event, pageInfo, setPageInfo) => {
    setPageInfo({ ...pageInfo, page: 1, pageSize: event.target.value });
  };
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <Button
        key={i}
        style={{ fontSize: "0.875rem" }}
        variant={i === pageInfo?.page ? "contained" : "text"}
        onClick={() => setPageInfo({ ...pageInfo, page: i })}
        disableRipple
      >
        {i}
      </Button>
    );
  }
  const rowsPerPageArr = incomingRowPerPageArr;

  return (
    <Grid
      container
      justifyContent="flex-end"
      sx={{
        borderTop: "0.063rem solid #E0E0E0",
        borderBottom: "0.063rem solid #E0E0E0",
        padding: "1rem 0",
      }}
    >
      <Box
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isSmallScreen ? "flex-start" : "flex-end",
          flexDirection: isSmallScreen && "column",
        }}
      >
        <Box>
          <Typography
            variant="small"
            color="text.secondary "
            sx={{
              textWrap: "nowrap",
              marginLeft: "1rem",
            }}
          >
            Items per Page:{" "}
          </Typography>
          <Select
            value={pageInfo?.pageSize}
            onChange={(event) =>
              handleRowsPerPageChange(event, pageInfo, setPageInfo)
            }
            variant="outlined"
            size="small"
            style={{
              marginLeft: "auto",
              height: "2rem",
              fontSize: "0.875rem",
            }}
          >
            {rowsPerPageArr.map((item) => (
              <MenuItem key={item} value={item} sx={{ fontSize: "0.875rem" }}>
                {item}
              </MenuItem>
            ))}
          </Select>
          <Typography
            variant="small"
            color="text.secondary "
            sx={{
              textWrap: "nowrap",
              marginLeft: "1rem",
            }}
          >
            Page {pageInfo?.page} of {totalPages}
          </Typography>
        </Box>
        <ButtonGroup
          size="small"
          variant="text"
          style={{
            height: "20px",
            marginLeft: !isSmallScreen && "1rem",
            marginTop: isSmallScreen && "1rem",
          }}
        >
          <IconButton
            onClick={() => handleFirstPage(pageInfo, setPageInfo)}
            disableRipple
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton
            onClick={() => handlePrevPage(pageInfo, setPageInfo)}
            disableRipple
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          {pageButtons}
          <IconButton
            onClick={() => handleNextPage(count, pageInfo, setPageInfo)}
            disableRipple
          >
            <KeyboardArrowRightIcon />
          </IconButton>
          <IconButton
            onClick={() => handleLastPage(count, pageInfo, setPageInfo)}
            disableRipple
          >
            <LastPageIcon />
          </IconButton>
        </ButtonGroup>
      </Box>
    </Grid>
  );
};

export default CustomPagination;
