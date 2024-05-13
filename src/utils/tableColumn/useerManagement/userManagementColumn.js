import React, { useState } from "react";
import {
    Box,
    Checkbox,
    FormGroup,
    FormLabel,
    Grid,
    Typography,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { DELETE_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import { USER_MANAGEMENT } from "constants/apiEndPoints";
import NotificationsToast from "utils/notification/NotificationsToast";


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
    const [isChecked, setIsChecked] = useState(false)

    const DeleteModelContent = () => {
        return (
            <Grid container alignItems='center' flexDirection="column" textAlign='center' sx={{ padding: { md: '0 5%'}}} >
                <Grid item sx={{textAlign:'center'}}>
                    <figure>
                        <img src="/images/icons/deleteIcon.svg" alt="" />
                    </figure>
                </Grid>
                <Grid item>
                    <Typography variant="h4">
                        Are you sure you would like to Delete
                        the user Details
                    </Typography>
                </Grid>
                <Grid item>
                    <FormGroup sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                     <Checkbox id="receiveCopy" onChange={(e)=> setIsChecked(e.target.checked) } />
                    <FormLabel htmlFor="receiveCopy">if you want to receive a copy of delete email</FormLabel>
                    </FormGroup>
                </Grid>
            </Grid>
        )
    }

    console.log(isChecked, "isChecked")

    const USER_MANAGEMENT_COLUMN_ACTION = (handleAPISuccessCallBack, setVisibleInvitePage, setSelectTableRow, setModalConfig,setInvitePageInfo,setInviteAPIURL) => [
        {
            Header: "Name",
            accessor: (item) => `${item?.first_name ? item?.first_name : ''} ${item?.last_name ? item?.last_name : ''}`
            // accessor: (item) => `${item?.company_name}`
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
                    <Typography variant="span" sx={{ ...buttonStyle, padding: '0', margin:'0.4375rem 1rem', marginRight: '0', color: 'blue.main' }} onClick={() => handelManagePermission(item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL)}>
                        Manage permission
                    </Typography>
                    <Typography variant="span" sx={{ ...buttonStyle, padding: '0', margin:'0.4375rem 1rem', marginRight: '0', color: 'danger.main' }} onClick={() => handelDeleteModalOpen(item, handleAPISuccessCallBack, setModalConfig)} >
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
                NotificationsToast({ message: "You have accepted the request!", type: "success" });
                handleSuccessCallback();

            })
            .catch((error) => {
                console.log(error, 'error')
                NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });

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
                NotificationsToast({ message: "You have rejected the request!", type: "success" });
                handleSuccessCallback();

            })
            .catch((error) => {
                console.log(error, 'error')
                NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });

            })
    }

    const handelManagePermission = (item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL) => {
        const apiURL = USER_MANAGEMENT.EDIT_INVITATION_BY_ADMIN;
        setVisibleInvitePage(true);
        setSelectTableRow(item)
        setInvitePageInfo({title:'Manage permission', type: null })
        setInviteAPIURL(apiURL)
    }

    const handelDeleteModalOpen = (item, handleAPISuccessCallBack, setModalConfig) => {
        setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: true,
            modalUI: {
                ...prevState.modalUI,
                showHeader: true,
                crossIcon: true,
                fotterActionStyle: {justifyContent: "center", gap: '1rem'}
              },
              buttonsUI: {
                ...prevState.buttonsUI,
                saveButton: true,
                cancelButton: true,
                successButtonStyle: {backgroundColor: 'danger.scarlet',"&:hover": {backgroundColor: 'danger.colorCrimson'}, color: '#fff'},
                cancelButtonStyle: {backgroundColor: 'dark.colorSmoke',"&:hover": {backgroundColor: 'dark.colorSilver'}, color: '#fff'},
                saveButtonName: "Yes,Delete!",
                cancelButtonName: "No,Cancel",          
              },
              headerText: "",
              headerSubText: "",
            modalBodyContent: <DeleteModelContent />,
            saveButtonAction: () =>  handelDelete(item, handleAPISuccessCallBack, setModalConfig),
        }));
        // handelDelete(item, handleAPISuccessCallBack)
    }

    const handelDelete = (item, handleSuccessCallback, setModalConfig) => {
        const apiURL = USER_MANAGEMENT.DELETE_USER_REQUEST + '/' + item.id + '/' + item.entry_type;
        // return;
        DELETE_REQUEST(apiURL)
            .then((_response) => {
                NotificationsToast({ message: "The user has been deleted successfully.", type: "success" });
                handleSuccessCallback();
                // close the modal
                setModalConfig((prevState) => ({
                    ...prevState,
                    modalVisible: false,
                }));

            })
            .catch((error) => {
                console.log(error, 'error')

                NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
                 // close the modal
                 setModalConfig((prevState) => ({
                    ...prevState,
                    modalVisible: false,
                }));

            })
    }

    return { USER_MANAGEMENT_COLUMN_ACTION }
}

export default UserManagementColumn;
