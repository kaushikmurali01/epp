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
    fontSize: { sm: '0.875rem' },
    cursor: 'pointer',

}

export const USER_MANAGEMENT_COLUMN = [
    {
        Header: "Name",
        accessor: (item) => `${item?.first_name} ${item?.last_name}`
    },
    {
        Header: "Email ID",
        accessor: "email",
    },
    {
        Header: "Facility",
        accessor: "facility",
    },
    {
        Header: "Role Type",
        accessor: "rolename",
    },
    {
        Header: "Status",
        accessor: (item) => {
            if (item.status === 'pending') {
                return (
                    <Box>
                        <Typography variant="span" sx={{ ...buttonStyle, border: '1px solid #2e813e', color: 'primary.main', marginRight: '1rem' }}>
                            <CheckCircleIcon /> Accept
                        </Typography>
                        <Typography variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} >
                            <CancelIcon /> Reject
                        </Typography>
                    </Box>
                );
            } else {
                return item.status; // Display status text for other status types
            }
        }
    },
    {
        Header: "Action",
        accessor: (item) => (
            <Box gap={1}>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'blue.main' }}>
                    Manage permission
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} >
                    Delete
                </Typography>

            </Box>
        ),
    },
];
