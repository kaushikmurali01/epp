import { Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import Table from "components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteContact,
  getContacts,
} from "../../../../redux/admin/actions/adminPerformanceActions";

const ContactsMicroComponent = ({ handleEditContact }) => {
  const dispatch = useDispatch();
  const { contactList } = useSelector((state) => state.adminPerformanceReducer);
  const facilityId = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

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
      accessor: (item) => {
        if (typeof item?.role === "string") {
          // Check if the role is one of the predefined roles
          const predefinedRoles = [1, 2, 3, 4];
          if (predefinedRoles.includes(parseInt(item?.role))) {
            switch (parseInt(item?.role)) {
              case 1:
                return "Super-Admin";
              case 2:
                return "Sub-Admin";
              case 3:
                return "Employee";
              case 4:
                return "Consultant";
              default:
                break;
            }
          }
          // If it's not a predefined role, it's a custom role, so return it as is
          return item.role;
        }
      },
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
      Header: "Action",
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
            onClick={() => handleEditContact(item?.id)}
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
            onClick={() => handleDeleteContact(item?.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const contactListCount = contactList?.length;

  const handleDeleteContact = (contactId) => {
    dispatch(deleteContact(facilityId, contactId)).then(() => {
      dispatch(getContacts(facilityId));
    });
  };

  return (
    <Grid container>
      <Table
        columns={columns}
        data={contactList}
        count={contactListCount}
        pageInfo={pageInfo}
        setPageInfo={setPageInfo}
      />
    </Grid>
  );
};

export default ContactsMicroComponent;
