import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";

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

const AcceptRejectBtn = ({ label }) => {
  return <Button>{label}</Button>;
};

const DetailLink = styled("span")({
  color: "rgba(0, 128, 0, 0.7)",
  textDecoration: "underline",
  cursor: "pointer",
});

const BaselineModelingTable = ({ headers, rows }) => {
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
      <StyledTable aria-label="dynamic table">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <HeaderCell key={index}>{header}</HeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <RowCell key={cellIndex}>{cell}</RowCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

BaselineModelingTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
};

export default BaselineModelingTable;
