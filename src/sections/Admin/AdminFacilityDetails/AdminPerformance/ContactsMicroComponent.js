import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import Table from "components/Table";
import { useDispatch, useSelector } from 'react-redux';
import { deleteContact, getContacts } from '../../../../redux/admin/actions/adminPerformanceActions';

const ContactsMicroComponent = ({handleEditContact}) => {
  const dispatch = useDispatch();
  const { contactList } = useSelector(
    (state) => state.adminPerformanceReducer
  );
  const facilityId = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  const RolesArray = [
    {
      id: 1,
      name: 1,
      label: 1,
      value: 1,
    },
    {
      id: 2,
      name: 2,
      label: 2,
      value: 2,
    },
  ];

  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Company",
      accessor: "company_name",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Phone",
      accessor: "phone",
    },
    {
      Header: "Address",
      accessor: (item) => (
        <>
          {" "}
          {item?.address && `${item?.address} ,`}{" "}
          {item?.street_number && `${item?.street_number} `}{" "}
          {item?.street_name && `${item?.street_name} ,`}{" "}
          {item?.sector && `${item?.sector} ,`}{" "}
          {item?.city && `${item?.city} ,`}{" "}
          {item?.province && `${item?.province} ,`}{" "}
          {item?.country && `${item?.country} ,`}{" "}
          {item?.postal_code && `${item?.postal_code} `}
        </>
      ),
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
            onClick={()=>handleEditContact(item?.id)}
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
            onClick={()=>handleDeleteContact(item?.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const contactListCount = contactList?.length;

  const handleDeleteContact = (contactId) => {
    dispatch(deleteContact(facilityId, contactId))
      .then(() => {
        dispatch(getContacts(facilityId));
    })
  };

  return (
    <>
      <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={contactList}
          count={contactListCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
        />
      </Box>
    </>
  );
};

export default ContactsMicroComponent;
