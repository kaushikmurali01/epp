import React, { useState } from "react";
import { Container, Typography, Grid, Box, Button } from "@mui/material";
import FacilityTable from "components/FacilityTable";
import Table from "../../../components/Table";
import { format } from "date-fns";
const FacilityApproved = (data) => {
  console.log(data.data)
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  const columns = [
    {
      Header: "Facility ID",
      accessor: "id",
    },
    {
      Header: "Submitted by",
      accessor: "submitted_by",
    },
    {
      Header: "Company Name",
      accessor: "company_name",
    },
    {
      Header: "Business Email",
      accessor: "email",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Submitted on",
      accessor: "submitted_on",
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box display="flex" onClick={(e) => e.stopPropagation()}>
          <Button
            style={{
              color: "#007398",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            // onClick={() => openDeleteModal(item?.id)}
          >
            Download
          </Button>
          <Button
            style={{
              color: "#2E813E",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            // onClick={() => openDeleteModal(item?.id)}
          >
            View
          </Button>
          <Button
            style={{
              color: "#2C77E9",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            // onClick={() => openRequestModal(true, item)}
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
            // onClick={() => openDeleteModal(item?.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Sample data for Table 1
  const data1 = [
    {
      facilityId: "Facility-1",
      submittedBy:'Wade Warren',
      companyName:"Wallmant",
      businessEmail:'wade.warren@dummy.com',
      status:'Approved',
      submittedOn:" 11-April",
    },
  ];

  // Sample data for Table 2
  const data2 = [
    {
      facilityId:"Facility-2",
      submittedBy:'Wade Warren',
      companyName:"Wallmant",
      businessEmail:'wade.warren@dummy.com',
      status:'Approved',
      submittedOn:"11-April",
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h2"
            sx={{
              marginTop: "2rem",
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
            List of Approved Facilities
          </Typography>
          {/* <FacilityTable data={mergedData} handleAction={handleAction} /> */}
          <Table
          columns={columns}
          data={data.data}
          count={data?.data?.length}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
        />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityApproved;
