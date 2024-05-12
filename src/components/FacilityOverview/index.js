import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
} from "@mui/material";

const FacilityOverViewTable = ({ apiData }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead
          sx={{
            backgroundColor: "#D9D9D9",
            borderRadius: "2rem",
          }}
        >
          <TableRow>
            <TableCell
              sx={{
                color: "#54585A",
                fontSize: "0.825rem !important",
                fontWeight: "500",
                lineHeight: "106.815%",
                textAlign: "left",
              }}
            >
              S/N
            </TableCell>
            <TableCell
              sx={{
                color: "#54585A",
                fontSize: "0.825rem !important",
                fontWeight: "500",
                lineHeight: "106.815%",
                textAlign: "left",
              }}
            >
              Overview
            </TableCell>
            <TableCell
              sx={{
                color: "#54585A",
                fontSize: "0.825rem !important",
                fontWeight: "500",
                lineHeight: "106.815%",
                textAlign: "left",
              }}
            >
              Result
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiData.map((row, index) => (
            <TableRow key={index}>
              <TableCell
                sx={{
                  color: "#242424",
                  fontSize: "0.925rem !important",
                  fontWeight: "600",
                  lineHeight: "106.815%",
                  textAlign: "left",
                }}
              >
                {row.all_pa_signed}
              </TableCell>
              <TableCell
                sx={{
                  color: "#242424",
                  fontSize: "0.925rem !important",
                  fontWeight: "600",
                  lineHeight: "106.815%",
                  textAlign: "left",
                }}
              >
                {row.overview}
              </TableCell>
              <TableCell
                sx={{
                  color: "#242424",
                  fontSize: "0.925rem !important",
                  fontWeight: "600",
                  lineHeight: "106.815%",
                  textAlign: "left",
                }}
              >
                {row.result}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FacilityOverViewTable;
