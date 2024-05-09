import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  Select, // Import Select from MUI
  MenuItem,
} from "@mui/material";
import React from "react";
import { useTable, useSortBy } from "react-table";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

const Table = ({
  columns,
  data,
  headbgColor,
  onClick,
  count,
  pageInfo,
  setPageInfo,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
      useSortBy
    );
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handlePrevPage = () => {
    if (pageInfo?.page > 1) {
      setPageInfo({ ...pageInfo, page: pageInfo?.page - 1 });
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(count / pageInfo?.pageSize);
    if (pageInfo?.page < totalPages) {
      setPageInfo({ ...pageInfo, page: pageInfo.page + 1 });
    }
  };

  const handleFirstPage = () => {
    setPageInfo({ ...pageInfo, page: 1 });
  };

  const handleLastPage = () => {
    const totalPages = Math.ceil(count / pageInfo?.pageSize);
    setPageInfo({ ...pageInfo, page: totalPages });
  };

  const handlePageClick = (pageNumber) => {
    setPageInfo({ ...pageInfo, page: pageNumber });
  };

  const handleRowsPerPageChange = (event) => {
    setPageInfo({ ...pageInfo, page: 1, pageSize: event.target.value });
  };

  const totalPages = Math.ceil(count / pageInfo?.pageSize);
  const pageButtons = [];
  let startPage = Math.max(1, pageInfo.page - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (pageInfo.page > 3 && pageInfo.page + 2 <= totalPages) {
    startPage = pageInfo.page - 2;
    endPage = pageInfo.page + 2;
  } else if (pageInfo.page > 3 && pageInfo.page + 2 > totalPages) {
    startPage = totalPages - 4;
    endPage = totalPages;
  }

  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <Button
        key={i}
        style={{ fontSize: "0.875rem" }}
        variant={i === pageInfo?.page ? "contained" : "text"}
        onClick={() => handlePageClick(i)}
        disableRipple
      >
        {i}
      </Button>
    );
  }
  const rowsPerPageArr = [10, 20, 40, 70, 100];

  return (
    <TableContainer>
      <MUITable {...getTableProps()}>
        <TableHead sx={{ backgroundColor: headbgColor || "#D9D9D9" }}>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const { id } = row.original;
            return (
              <TableRow
                {...row.getRowProps()}
                sx={{
                  "&:hover": {
                    backgroundColor: "#DBFFE2",
                  },
                }}
              >
                {row.cells.map((cell) => {
                  return (
                    <TableCell
                      {...cell.getCellProps()}
                      onClick={() => {
                        if (onClick) {
                          onClick(id, row?.original);
                        }
                      }}
                      sx={{
                        cursor: "pointer",
                        color: "text.primary2",
                        textAlign: "center",
                        fontSize: "0.875rem",
                        padding: "1.5rem 0.5rem",
                        "&:first-of-type": {
                          fontWeight: 600,
                        },
                      }}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={columns.length}
              sx={
                {
                  // borderBottom: "none",
                }
              }
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
                    Rows per Page:{" "}
                  </Typography>
                  <Select
                    value={pageInfo.pageSize}
                    onChange={handleRowsPerPageChange}
                    variant="outlined"
                    size="small"
                    style={{
                      marginLeft: "auto",
                      height: "2rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {rowsPerPageArr.map((item) => (
                      <MenuItem value={item} sx={{ fontSize: "0.875rem" }}>
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
                    Page {pageInfo.page} of {totalPages}
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
                  <IconButton onClick={handleFirstPage} disableRipple>
                    <FirstPageIcon />
                  </IconButton>
                  <IconButton onClick={handlePrevPage} disableRipple>
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  {pageButtons}
                  <IconButton onClick={handleNextPage} disableRipple>
                    <KeyboardArrowRightIcon />
                  </IconButton>
                  <IconButton onClick={handleLastPage} disableRipple>
                    <LastPageIcon />
                  </IconButton>
                </ButtonGroup>
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </MUITable>
    </TableContainer>
  );
};

export default Table;
