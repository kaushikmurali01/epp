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

const Table = ({ columns, data, headbgColor, onClick }) => {
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

  return (
    <TableContainer>
      <MUITable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  sx={{
                    color: "text.secondary2",
                    textAlign: "center",
                    fontWeight: "400",
                    fontSize: "0.75rem",
                    bgcolor: headbgColor,
                  }}
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
              <TableRow {...row.getRowProps()}>
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
