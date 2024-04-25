import React, { useMemo } from "react";
import Table from "../../../components/Table";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { FACILITY_COLUMNS } from "../../../utils/tableColumns";

const Facility = () => {
  const columns = useMemo(() => FACILITY_COLUMNS, []);
  const data = [
    {
      name: "Facility2",
      facility_id: 1,
      total_electicity_savings: 45251612,
      energy_savings: 19,
      total_enetitative_earned: "$246",
      facility_status: "Submit for Approval",
      benchmarking_eui: "$256",
      adminList: [
        {
          name: "Admin1",
          image: "",
        },
        {
          name: "Admin2",
          image: "",
        },
        { name: "Admin3", image: "" },
      ],
    },
    {
      name: "Facility2",
      facility_id: 2,
      total_electicity_savings: 45251612,
      energy_savings: 100,
      total_enetitative_earned: "$246",
      facility_status: "Approved",
      benchmarking_eui: "$256",
    },
    {
      name: "Facility3",
      facility_id: 3,
      total_electicity_savings: 45251612,
      energy_savings: 35,
      total_enetitative_earned: "$246",
      facility_status: "Draft",
      benchmarking_eui: "$256",
      adminList: [
        { name: "Admin1", image: "" },
        { name: "Admin2", image: "" },
        { name: "Admin3", image: "" },
      ],
    },
    {
      name: "Facility4",
      facility_id: 4,
      total_electicity_savings: 45251612,
      energy_savings: 60,
      total_enetitative_earned: "$246",
      facility_status: "In 1st P4P",
      benchmarking_eui: "$256",
      adminList: [
        { name: "Admin1", image: "" },
        { name: "Admin2", image: "" },
      ],
    },
  ];
  return (
    <Container sx={{ mt: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography
            vari20ant="h4"
            sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
          >
            Facility List
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            name="search"
            label="Search Facility"
            type="text"
            fullWidth
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                height: "3rem",
                borderRadius: "6px",
              },
            }}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            disableElevation
            sx={{
              height: "3rem",
              borderRadius: "6px",
              width: "100%",
              fontWeight: { md: 600 },
              fontSize: { md: "1.125rem" },
            }}
          >
            Add Facility
          </Button>
        </Grid>
      </Grid>
      <Table columns={columns} data={data} />
    </Container>
  );
};

export default Facility;
