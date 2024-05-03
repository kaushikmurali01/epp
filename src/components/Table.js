import { useTheme } from "@emotion/react";
import {
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { useTable, useSortBy } from "react-table";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const Table = ({ columns, data, headbgColor }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageCount,
  } = useTable({ columns, data }, useSortBy);
  console.log(headbgColor, "headbgColor")
  return (
    <TableContainer>
      <MUITable {...getTableProps()}>
        <TableHead>
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
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell
                      {...cell.getCellProps()}
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
            <TableCell colSpan={columns.length} sx={{ textAlign: "center" }}>
              <ButtonGroup variant="outlined">
                <IconButton
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <ArrowCircleLeftIcon
                    sx={{
                      color: "text.primary",
                      fontSize: "1.875rem",
                    }}
                  />
                </IconButton>
                <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
                  <ArrowCircleRightIcon
                    sx={{
                      color: "text.primary",
                      fontSize: "1.875rem",
                    }}
                  />
                </IconButton>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        </TableFooter>
      </MUITable>
    </TableContainer>
  );
};

export default Table;
