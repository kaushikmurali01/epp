import React, { useContext } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { POST_REQUEST } from "utils/HTTPRequests";
import { USER_MANAGEMENT } from "constants/apiEndPoints";
import NotificationsTost from "utils/notification/NotificationsTost";
// import { SnackbarContext } from "utils/notification/SnackbarProvider";






const UserManagementColumn = () => {

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

    const UserRole = [
        {
          "id": 1,
          "rolename": "Super-Admin",
          "description": "Super Administrator Role",
          "is_active": 1,
        },
        {
          "id": 2,
          "rolename": "Sub-Admin",
          "description": "Sub Administrator Role",
          "is_active": 1,
        },
        {
          "id": 3,
          "rolename": "Employee",
          "description": "Employee Role",
          "is_active": 1,
        },
        {
          "id": 4,
          "rolename": "Consultant",
          "description": "Consultant Role",
          "is_active": 1,
        },
        {
          "id": 5,
          "rolename": "Account Manager",
          "description": "Account Manager Role",
          "is_active": 1,
        }
      ]


     const USER_MANAGEMENT_COLUMN_ACTION = (handleAPISuccessCallBack, setVisibleInvitePage, setSelectTableRow) => [
        {
            Header: "Name",
            // accessor: (item) => `${item?.first_name ? item?.first_name : ''} ${item?.last_name ? item?.last_name : ''}`
            accessor: (item) => `${item?.company_name}`
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
                if (item.status === 'Initiated') {
                    return (
                        <Box>
                            <Typography variant="span" sx={{ ...buttonStyle, border: '1px solid #2e813e', color: 'primary.main', marginRight: '1rem' }} onClick={() => handelAccept(item, handleAPISuccessCallBack)} >
                                <CheckCircleIcon /> Accept
                            </Typography>
                            <Typography variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} onClick={() => handelReject(item, handleAPISuccessCallBack)} >
                                <CancelIcon /> Reject
                            </Typography>
                        </Box>
                    );
                } else if (item.status === 'pending') {
                    return 'Request sent'
                }
                else {
                    return item.status; // Display status text for other status types
                }
            }
        },
        {
            Header: "Action",
            accessor: (item) => (
                <Box gap={1}>
                    <Typography variant="span" sx={{ ...buttonStyle, color: 'blue.main' }} onClick={() => handelManagePermission(item, setVisibleInvitePage, setSelectTableRow)}>
                        Manage permission
                    </Typography>
                    <Typography disabled variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} onClick={() => handelDelete(item)} >
                        Delete
                    </Typography>

                </Box>
            ),
        },
    ];


    const handelAccept = (item, handleSuccessCallback) => {

        const apiURL = USER_MANAGEMENT.ACCEPT_USER_REQUEST;
        const requestBody = {
            "user_id": item.id,
            "company_id": item.company_id
        }

        POST_REQUEST(apiURL, requestBody)
            .then((response) => {
                NotificationsTost({ message: "You have accepted the request!", type: "success" });
                handleSuccessCallback();

            })
            .catch((error) => {
                console.log(error, 'error')
                NotificationsTost({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });

            })
    }

    const handelReject = (item, handleSuccessCallback) => {
        const apiURL = USER_MANAGEMENT.REJECT_USER_REQUEST;
        const requestBody = {
            "user_id": item.id,
            "company_id": item.company_id
        }

        POST_REQUEST(apiURL, requestBody)
            .then((response) => {
                NotificationsTost({ message: "You have rejected the request!", type: "success" });
                handleSuccessCallback();

            })
            .catch((error) => {
                console.log(error, 'error')
                NotificationsTost({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });

            })
    }

    const handelManagePermission = (item, setVisibleInvitePage, setSelectTableRow) => {
        const roleNameToFilter = item.rolename;
        const filteredRoles = UserRole.filter(role => role.rolename === roleNameToFilter);
        const filteredRoleObject = filteredRoles.length > 0 ? filteredRoles[0] : null;
        setVisibleInvitePage(true);
        setSelectTableRow({...filteredRoleObject, email : item.email})
    }

    const handelDelete = (item) => {
        const apiURL = USER_MANAGEMENT.DELETE_USER_REQUEST;
        const requestBody = {
            "user_id": "1",
            "company_id": item.id
        }
        console.log("requestBody", requestBody);
        return;
        // POST_REQUEST(apiURL, requestBody)
        // .then((response) => {
        //     alert('Rejected User successfully')
        //     // showSnackbar('Your form has been submitted!', 'success', { vertical: 'top', horizontal: 'right' });

        // })
        // .catch((error) => {
        //     console.log(error, 'error')
        //     // showSnackbar(error?.message ? error.message : 'Something went wrong!', 'error', { vertical: 'top', horizontal: 'right' });


        // })
    }

    return { USER_MANAGEMENT_COLUMN_ACTION, handelManagePermission }
}

export default UserManagementColumn;
