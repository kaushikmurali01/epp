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
  Stack,
  FormGroup,
  FormControl,
  TextField,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import React from "react";
import { useTable, useSortBy } from "react-table";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { ReactComponent as SortIcon } from "../../assets/images/sortIcon.svg";
import { ReactComponent as SortIconUp } from "../../assets/images/sortIconUp.svg";
import { ReactComponent as SortIconDown } from "../../assets/images/sortIconDown.svg";
import { useSelector } from "react-redux";
import Loader from "pages/Loader";

const EvThemeTable = ({
  columns,
  data,
  headbgColor,
  onClick,
  count,
  pageInfo,
  setPageInfo,
  tableClass = "",
  customTableStyles = {},
  cursorStyle,
  sortColumn,
  sortOrder,
  setSortColumn,
  setSortOrder,
  searchData,
  setSearchData
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
      useSortBy
    );
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const show_loader = useSelector((state) => state?.loaderReducer?.show_loader);

  const handleSortChange = (accessorKey) => {
    if (!accessorKey || sortColumn !== accessorKey) {
      setSortColumn(accessorKey);
      setSortOrder("ASC");
    } else if (sortOrder === "ASC") {
      setSortOrder("DESC");
    } else {
      // Reset sorting
      setSortColumn("");
      setSortOrder("");
    }
  };

  const handlePrevPage = () => {
    if (pageInfo?.page > 1) {
      setPageInfo({ ...pageInfo, page: pageInfo?.page - 1 });
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(count / pageInfo?.pageSize);
    if (pageInfo?.page < totalPages) {
      setPageInfo({ ...pageInfo, page: pageInfo?.page + 1 });
    }
  };

  const handleFirstPage = () => {
    if (pageInfo?.page) {
      setPageInfo({ ...pageInfo, page: 1 });
    }
  };

  const handleLastPage = () => {
    const totalPages = Math.ceil(count / pageInfo?.pageSize);
    if (pageInfo?.page) {
      setPageInfo({ ...pageInfo, page: totalPages });
    }
  };

  const handlePageClick = (pageNumber) => {
    if (pageInfo?.page) {
      setPageInfo({ ...pageInfo, page: pageNumber });
    }
  };

  const handleRowsPerPageChange = (event) => {
    if (pageInfo?.page) {
      setPageInfo({ ...pageInfo, page: 1, pageSize: event.target.value });
    }
  };
  const handelSetSearch = (e,column)=> {
    setSearchData((prev) => {
      const newData = { [column.accessorKey]: e.target.value };
      
      // Convert the object to an array of { key, value } pairs
      const newDataArray = Object.entries(newData).map(([key, value]) => ({ key, value }));
      
      // Merge with previous data, replacing or adding as necessary
      const mergedData = [...prev.filter(item => item.key !== column.accessorKey), ...newDataArray];
      
      return mergedData;
    })
  }

  const handleClearSearch = (column) => {
    setSearchData((prev) => prev.filter(item => item.key !== column.accessorKey));
  };

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



  // console.log(headerGroups, "headerGroups")
  return (
    <TableContainer>
      <MUITable
        {...getTableProps()}
        sx={{ ...customTableStyles, position: "relative", minHeight: "150px" }}
        className={`ev-theme-table ${tableClass}`}
      >
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell

                  sx={{ verticalAlign: 'top' }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}  >
                    <Stack direction="row" sx={{ alignItems: 'center', width: '100%', padding: "1.5rem 1rem", backgroundColor: headbgColor || "rgba(217, 217, 217, 0.2)" }}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      onClick={() =>
                        column.accessorKey && handleSortChange(column.accessorKey)
                      }
                    >
                      {column.render("Header")}
                      {column.accessorKey && (
                        <Box sx={{ width: "1.2rem", height: "1.2rem" }}>
                          {sortColumn === column.id ||
                            sortColumn === column.accessorKey ? (
                            <>
                              {sortOrder === "" && (
                                <SortIcon
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                  }}
                                />
                              )}
                              {sortOrder === "ASC" && (
                                <SortIconUp
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                  }}
                                />
                              )}
                              {sortOrder === "DESC" && (
                                <SortIconDown
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                  }}
                                />
                              )}
                            </>
                          ) : (
                            <SortIcon
                              style={{
                                width: "16px",
                                height: "16px",
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </Stack>
                    {column.isSearch &&
                      <Stack sx={{ padding: '1rem 0.5rem' }}>
                        <FormGroup >
                          <FormControl fullWidth sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', borderRadius: '8px', padding: '0.5rem 0', color: 'dark.main' }}>
                            <TextField
                              value={searchData.find(item => item.key === column.accessorKey)?.value || ""}
                              placeholder="Search"
                              inputProps={{ style: { color: '#242424', fontSize: '1rem', padding: '0.25rem 2.25rem 0.25rem 0.5rem', height: 'auto', maxWidth: '5rem' } }}
                              onChange={(e) => handelSetSearch(e,column)}
                            // onChange={(e) => setSearchData((prev) => ({...prev, [column.accessorKey]: e.target.value}))}
                            />
                            <img src="/images/icons/tableSearchIcon.svg" alt="" />

                            {/* <FilterAltIcon /> */}
                            {searchData.find(item => item.key === column.accessorKey)?.value &&
                                <ClearIcon
                                onClick={() => handleClearSearch(column)}
                                  sx={{
                                    color: "#333",
                                    fontSize: "1.25rem",
                                    position: "absolute",
                                    right: "0.75rem",
                                    top: '0', bottom: '0', margin: 'auto',
                                    zIndex: "1",
                                    cursor: "pointer"
                                  }}
                                />
                              }
                          </FormControl>
                        </FormGroup>
                      </Stack>
                    }
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows?.length > 0 ? (
            rows.map((row) => {
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
                          color: "text.primary2",
                          textAlign: "center",
                          fontSize: "0.875rem",
                          padding: "1.5rem 0.5rem",
                          // cursor: 'pointer',
                          cursor: cursorStyle ? cursorStyle : "default",
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
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ textAlign: "center !important" }}
              >
                No Data found.
              </TableCell>
            </TableRow>
          )}
          {show_loader && (
            <Loader
              sectionLoader={true}
              minHeight="100%"
              customStyles={{
                maxHeight: "400px",
                top: rows?.length > 0 ? "0" : "20px",
              }}
            />
          )}
        </TableBody>
        {pageInfo?.pageSize && rows?.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
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
                      value={pageInfo?.pageSize}
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
        )}
      </MUITable>
    </TableContainer>
  );
};

export default EvThemeTable;
