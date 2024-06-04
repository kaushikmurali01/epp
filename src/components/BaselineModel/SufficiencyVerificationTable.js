import React from "react";
import { styled } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTable = styled(Table)({
  minWidth: 650,
});

const HeaderCell = styled(TableCell)({
  backgroundColor: "#CBFFD5",
  borderBottom: "none",
  textAlign: "center !important",
  color: "#242424 !important",
  fontSize: "0.875rem !important",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal !important",
});

const RowCell = styled(TableCell)({
  backgroundColor: "#EBFFEF",
  textAlign: "center !important",
  color: "#242424 !important",
  fontSize: "0.875rem !important",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal !important",
});

const DetailLink = styled("span")({
  color: "rgba(0, 128, 0, 0.7)",
  textDecoration: "underline",
  cursor: "pointer",
});

function createData(header, hourly, daily, monthly, seeDetail) {
  return { header, hourly, daily, monthly, seeDetail };
}

const rows = [
  createData(
    "Sufficiency verification",
    "Hourly",
    "Daily",
    "Monthly",
    "See detail"
  )
];

export default function BasicTable() {
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        borderRadius: "0.25rem",
        border: "1px solid #2E813E",
        opacity: "0.7",
        background: "#EBFFEF",
      }}
    >
      <StyledTable aria-label="simple table">
        <TableHead>
          <TableRow>
            <HeaderCell></HeaderCell>
            <HeaderCell>Hourly</HeaderCell>
            <HeaderCell>Daily</HeaderCell>
            <HeaderCell>Monthly</HeaderCell>
            <HeaderCell></HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <HeaderCell>{row.header}</HeaderCell>
              <RowCell>{row.hourly}</RowCell>
              <RowCell>{row.daily}</RowCell>
              <RowCell>{row.monthly}</RowCell>
              <RowCell>
                <DetailLink>{row.seeDetail}</DetailLink>
              </RowCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}
