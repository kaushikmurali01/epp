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

const CustomTable = ({ data, handleAction }) => {
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
              Super Admin Name
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
              Company Type
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
              Created on (Date)
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
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
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
                {row.superAdminName}
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
                {row.companyType}
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
              <TableCell
                sx={{
                  color: "#242424",
                  fontSize: "0.925rem !important",
                  fontWeight: "600",
                  lineHeight: "106.815%",
                  textAlign: "left",
                }}
              >
                {row.createdOn}
              </TableCell>
              <TableCell>
              {row.status=="Inactive"?  <Button variant="outlined" 
                   sx={{
                      color: "#FF5858",
                      borderRadius:"2rem",
                      fontSize: "0.925rem !important",
                      fontWeight: "600",
                      lineHeight: "106.815%",
                      textAlign: "left",
                      minWidth: "0.135rem !important",
                      borderColor:" var(--error-light, #DA060608)",
                      background:" var(--error-light, #DA060608)",
                    }}
                > {row.status}</Button>:
                <Button variant="outlined" 
                   sx={{
                      color: "#2E813E",
                      borderRadius:"2rem",
                      fontSize: "0.925rem !important",
                      fontWeight: "600",
                      lineHeight: "106.815%",
                      textAlign: "left",
                      minWidth: "0.135rem !important",
                      borderColor:"#DCFF88",
                      background:" #DCFF88",
                    }}
                > {row.status}</Button>}
              </TableCell>
              <TableCell>
                <Stack spacing={0} direction="row">
                <Button
                    variant="text"
                    sx={{
                      color: "#56B2AE",
                      // width:'px !important',
                      fontSize: "16px !important",
                      fontWeight: "600",
                      lineHeight: "106.815%",
                      textAlign: "left",
                      minWidth: "0.235rem !important",
                    }}
                  >
                  View Participant Agreement
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: "#2E813E",
                      fontSize: "16px !important",
                      fontWeight: "600",
                      lineHeight: "106.815%",
                      textAlign: "left",
                      minWidth: "0.135rem !important",
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: "#2C77E9",
                      fontSize: "16px !important",
                      fontWeight: "600",
                      lineHeight: "106.815%",
                      textAlign: "left",
                      minWidth: "0.135rem !important",
                    }}
                  >
                    Alert
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: "#FF5858",
                      fontSize: "16px !important",
                      fontWeight: "600",
                      lineHeight: "106.815%",
                      textAlign: "left",
                      minWidth: "0.135rem !important",
                    }}
                  >
                    Inactive
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

export default CustomTable;
