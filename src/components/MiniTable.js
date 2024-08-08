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

export const MiniTable = ({ columns, data, firstChildColored = false }) => {
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
          {rows?.length > 0 ? (
            rows.map((row, index) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  size="small"
                  // sx={{ background: "#EBFFEF", borderBottom: "none" }}
                  sx={{
                    background: index % 2 === 0 ? "#FFFFFF" : "#EBFFEF",
                    borderBottom: "none",
                  }}
                >
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        size="small"
                        padding="none"
                        sx={{
                          "&:first-child": firstChildColored && {
                            background: "#CBFFD5",
                          },
                          borderBottom: "none",
                          padding: "6px 10px!important",
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
        </TableBody>
      </MUITable>
    </TableContainer>
  );
};
