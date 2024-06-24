import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import Table from "components/Table";

const ContactsMicroComponent = () => {

  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  const columns = [
    {
      Header: "Name",
      accessor: "name",
      // accessorKey: "name",
    },
    {
      Header: "Company",
      accessor: "company",
      // accessorKey: "company",
    },
    {
      Header: "Role",
      accessor: "role",
      // accessorKey: "role",
    },
    {
      Header: "Email",
      accessor: "email",
      // accessorKey: "email",
    },
    {
      Header: "Phone",
      accessor: "phone",
      // accessorKey: "phone",
    },
    {
      Header: "Address",
      accessor: "address",
      // accessorKey: "address",
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box
          display="flex"
          onClick={(e) => e.stopPropagation()}
          justifyContent="flex-end"
        >
          <Button
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
              fontSize: "0.875rem",
              color: "#027397",
            }}
          >
            Edit
          </Button>
          <Button
            color="error"
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
              fontSize: "0.875rem",
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const contactListingData = [
    {
      id: 1,
      name: "John Doe",
      company: "ABC company",
      role: "Manager",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 street",
    },
    {
      id: 2,
      name: "John Doe",
      company: "ABC company",
      role: "Manager",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 street",
    },
    {
      id: 3,
      name: "John Doe",
      company: "ABC company",
      role: "Manager",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 street",
    },
    {
      id: 4,
      name: "John Doe",
      company: "ABC company",
      role: "Manager",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 street",
    },
  ];

  const contactListCount = contactListingData?.length;

  return (
    <>
     <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={contactListingData}
          count={contactListCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          cursorStyle="pointer"
        />
      </Box>
    </>
  )
}

export default ContactsMicroComponent