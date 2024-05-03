import React from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";



const buttonStyle = {
    padding: '0.4375rem 0.625rem',
    borderRadius: '0.125rem',
    fontWeight: '500',
    fontSize:  {sm: '0.875rem'}

    

}

export const USER_MANAGEMENT_COLUMN = [
    {
        Header: "Name",
        accessor: 'name'
    },
    {
        Header: "Email ID",
        accessor: "email",
    },
    {
        Header: "Facility",
        accessor: "Facility",
    },
    {
        Header: "Role Type",
        accessor: "RoleType",
    },
    {
        Header: "Status",
        accessor: (item) => (
            <Box >
                  <Typography variant="span" sx={{...buttonStyle, background: 'rgba(46, 129, 62, 0.20)', color: 'primary.main', marginRight: '1rem'}}>
                   Accept
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle, background: 'rgba(255, 88, 88, 0.20)', color: 'danger.main' }} >
                    Delete
                </Typography>
              
            </Box>
        ),
    },
    {
        Header: "Action",
        accessor: (item) => (
            <Box gap={1}>
                  <Typography variant="span" sx={{...buttonStyle,  color: 'blue.main'}}>
                  Manage permission
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} >
                    Delete
                </Typography>
              
            </Box>
        ),
    },
];
