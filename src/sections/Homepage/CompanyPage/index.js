import React from "react";
import { Container, Typography, Grid } from "@mui/material";
import CustomTable from "components/CustomTable";

const CompanyPage = () => {
  // Sample data for Table 1
  const data1 = [
    {
      id: 1,
      companyName: "ABC Inc.",
      superAdminName: "John Doe",
      companyType: "Tech",
      businessEmail: "john.doe@abc.com",
      createdOn: "2024-05-03",
      status: "Active",
    },
    // Add more data objects as needed
  ];

  // Sample data for Table 2
  const data2 = [
    {
      id: 2,
      companyName: "XYZ Corp.",
      superAdminName: "Jane Smith",
      companyType: "Finance",
      businessEmail: "jane.smith@xyz.com",
      createdOn: "2024-05-04",
      status: "Inactive",
    },
  ];

  // Merge data1 and data2 into one array
  const mergedData = [...data1, ...data2];

  // Define handleAction function
  const handleAction = (id) => {
    // Your action logic here
    console.log("View details for row with id:", id);
  };

  return (
    <Container>
      <Typography
        variant="h2"
        sx={{
          marginTop: "2rem",
              color: "#242424",
              fontWeight: "700",
              fontSize: "24px !important",
              fontStyle: "italic",
              lineHeight: "27.5px",
              letterSpacing: "-0.01125rem",
              fontStyle: "italic",
        }}
      >
        Company List
      </Typography>
      <Typography
        variant="h5"
        sx={{
          marginTop: "0.500rem",
              fontWeight: "400",
              fontSize: "12px !important",
              marginBottom: "2rem",
              lineHeight: "13.75px !important",
        }}
      >
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h2"
            sx={{
              marginBottom: "2rem",
              color: "#242424",
              fontWeight: "500",
              fontSize: "20px !important",
              fontStyle: "italic",
              lineHeight: "27.5px",
              letterSpacing: "-0.01125rem",
              fontStyle: "italic",
            }}
          >
            All Users
          </Typography>
          <CustomTable data={mergedData} handleAction={handleAction} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyPage;
