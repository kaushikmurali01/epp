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
        Header: "Action",
        accessor: (item) => (
            <Box gap={1} sx={{ display: "flex" }}>
                <Typography variant="span" sx={{ ...buttonStyle, background: 'rgba(255, 88, 88, 0.20)', color: 'danger.main' }} >
                    Delete
                </Typography>
                <Typography variant="span" sx={{...buttonStyle, background: 'rgba(46, 129, 62, 0.20)', color: 'primary.main'}}>
                    Manage Permission
                </Typography>
            </Box>
        ),
    },
];
