import React from "react";
import { Box, Button, Link, Typography } from "@mui/material";
import FacilityStatus from "../components/FacilityStatus";
import CustomSlider from "../components/CustomSlider";

export const FACILITY_COLUMNS = [
  {
    Header: "Name/Nick Name",
    accessor: (item) => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textWrap: "nowrap",
          alignItems: "flex-start",
        }}
        gap={2}
      >
        <Typography>{item.facility_name}</Typography>
        <Button variant="contained">Submit for approval</Button>
        <Link
          href="#"
          variant="small"
          sx={{ color: "#2C77E9", cursor: "pointer" }}
          underline="none"
        >
          Update energy savings calculation
        </Link>
      </Box>
    ),
  },
  {
    Header: "Total Electicity Savings",
    accessor: "total_electicity_savings",
  },
  {
    Header: "% Energy Savings",
    accessor: (item) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>{item.energy_savings}%</Typography>
        <CustomSlider value={item.energy_savings} />
      </Box>
    ),
  },
  {
    Header: "Total Incentive Earned",
    accessor: "total_Incentive_earned",
  },
  {
    Header: "Benchmarking EUI",
    accessor: "benchmarking_eui",
  },
  {
    Header: "Facility Status",
    accessor: (item) => <FacilityStatus>{item.facility_status}</FacilityStatus>,
  },
  {
    Header: "View/Edit",
    accessor: (item) => (
      <Box display="flex">
        <Button
          style={{
            backgroundColor: "transparent",
            padding: 0,
            minWidth: "unset",
          }}
        >
          Edit
        </Button>
        <Button
          color="error"
          style={{
            backgroundColor: "transparent",
            padding: 0,
            minWidth: "unset",
            marginLeft: "1rem",
          }}
        >
          Delete
        </Button>
      </Box>
    ),
  },
];
