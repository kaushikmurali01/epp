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



     const USER_MANAGEMENT_COLUMN_ACTION = (handleAPISuccessCallBack) => [
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
                    <Typography disabled variant="span" sx={{ ...buttonStyle, color: 'blue.main' }} onClick={() => handelManagePermission(item)}>
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
        // const { showSnackbar } = useContext(SnackbarContext);
        console.log("accept", item);
        const apiURL = USER_MANAGEMENT.ACCEPT_USER_REQUEST;
        const requestBody = {
            "user_id": item.id,
            "company_id": item.company_id
        }

        console.log("requestBody", requestBody);

        POST_REQUEST(apiURL, requestBody)
            .then((response) => {
                NotificationsTost({ message: "You have accepted the request!", type: "success" });
                handleSuccessCallback();
                // showSnackbar('Your form has been submitted!', 'success', { vertical: 'top', horizontal: 'right' });

            })
            .catch((error) => {
                console.log(error, 'error')
                NotificationsTost({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
                // showSnackbar(error?.message ? error.message : 'Something went wrong!', 'error', { vertical: 'top', horizontal: 'right' });


            })
    }

    const handelReject = (item, handleSuccessCallback) => {

        // const { showSnackbar } = useContext(SnackbarContext);
        console.log("reject", item);
        const apiURL = USER_MANAGEMENT.REJECT_USER_REQUEST;
        const requestBody = {
            "user_id": item.id,
            "company_id": item.company_id
        }
        console.log("requestBody", requestBody);

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

    const handelManagePermission = (item) => {
        // setVisibleInvitePage(true);
    }

    const handelDelete = (item) => {

        // const { showSnackbar } = useContext(SnackbarContext);
        console.log("delete", item);
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

    return { USER_MANAGEMENT_COLUMN_ACTION }
}

export default UserManagementColumn;
