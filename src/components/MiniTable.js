import { useTable } from "react-table";
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
} from "@mui/material";

export const MiniTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: "none", border: "1px solid #2E813E" }}
    >
      <MUITable {...getTableProps()} size="small">
        <TableHead sx={{ background: "#CBFFD5" }}>
          {headerGroups.map((headerGroup) => (
            <TableRow
              {...headerGroup.getHeaderGroupProps()}
              sx={{ borderBottom: "none" }}
              size="small"
            >
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps()}
                  size="small"
                  padding="none"
                  sx={{
                    borderBottom: "none",
                    width: column.cWidth && column.cWidth,
                    contentVisibility:
                      column.headerVisibility && column.headerVisibility,
                  }}
                >
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()} size="small">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                size="small"
                sx={{ background: "#EBFFEF", borderBottom: "none" }}
              >
                {row.cells.map((cell) => {
                  return (
                    <TableCell
                      {...cell.getCellProps()}
                      size="small"
                      padding="none"
                      sx={{
                        "&:first-child": { background: "#CBFFD5" },
                        borderBottom: "none",
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
      </MUITable>
    </TableContainer>
  );
};
