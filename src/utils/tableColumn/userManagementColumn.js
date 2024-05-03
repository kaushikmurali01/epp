import React from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.4375rem 1rem',
    borderRadius: '1.5rem',
    fontWeight: '500',
    fontSize:  {sm: '0.875rem'},
    cursor: 'pointer',
    
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
                  <Typography variant="span" sx={{...buttonStyle, border: '1px solid #2e813e',  color: 'primary.main', marginRight: '1rem'}}>
                    <CheckCircleIcon /> Accept
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle,  color: 'danger.main' }} >
                   <CancelIcon /> Accept
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
