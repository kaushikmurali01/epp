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

const FacilityRejectedTable = ({ data }) => {
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
              Facility ID
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
              Submitted by
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
              Company Name
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
              Business Email
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
              Status
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
              Submitted on
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
              Add Comment
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
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
                {row.facilityId}
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
                {row.submittedBy}
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
                {row.companyName}
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
                {row.businessEmail}
              </TableCell>
              <TableCell>
                {row.status == "Inactive" ? (
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#FF5858",
                      borderRadius: "2rem",
                      fontSize: "0.925rem !important",
                      fontWeight: "600",
                      lineHeight: "106.815%",
                      textAlign: "left",
                      minWidth: "0.135rem !important",
                      borderColor: " var(--error-light, #DA060608)",
                      background: " var(--error-light, #DA060608)",
                    }}
                  >
                    {" "}
                    {row.status}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#54585A",
                      borderRadius: "2rem",
                      fontSize: "0.925rem !important",
                      fontWeight: "600",
                      lineHeight: "106.815%",
                      textAlign: "left",
                      minWidth: "0.135rem !important",
                      borderColor: "#bdc5c9",
                      background: " #bdc5c9",
                    }}
                  >
                    {" "}
                    {row.status}
                  </Button>
                )}
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
                {row.submittedOn}
              </TableCell>
              <TableCell>
                <Stack spacing={0} direction="row">
                  <Button
                    variant="text"
                    sx={{
                      color: "#F26D04",
                      fontSize: "0.925rem !important",
                      fontWeight: "600",
                      lineHeight: "106.815%",
                      textAlign: "left",
                      minWidth: "0.135rem !important",
                    }}
                  >
                    Comment
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FacilityRejectedTable;
