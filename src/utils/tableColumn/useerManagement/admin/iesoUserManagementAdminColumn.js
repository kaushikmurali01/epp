import React, { useState } from "react";
import {
    Box,
    Checkbox,
    FormGroup,
    FormLabel,
    Grid,
    Typography,
} from "@mui/material";
import { DELETE_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import { ENERVA_USER_MANAGEMENT, USER_MANAGEMENT } from "constants/apiEndPoints";
import NotificationsToast from "utils/notification/NotificationsToast";
import { ConvertIntoDateMonth } from "utils/dateFormat/ConvertIntoDateMonth";


const IESOUserManagementColumn = () => {

const [isChecked, setIsChecked] = useState(false)

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



const IESO_USER_MANAGEMENT_ADMIN_COLUMN = (handleAPISuccessCallBack, setVisibleInvitePage, setSelectTableRow, setModalConfig,setInvitePageInfo,setInviteAPIURL) => [
    {
        Header: "User ID",
        accessor: 'id',
    },
    {
        Header: "User Full Name",
        accessor: (item) => `${item?.first_name ? item?.first_name : ''} ${item?.last_name ? item?.last_name : ''}`
    },
    {
        Header: "Business Email",
        accessor: "email",
    },
    {
        Header: "Role Type",
        accessor: "rolename",
    },
    {
        Header: "Created on (Date)",
        accessor: (item) => `${ConvertIntoDateMonth(item?.createdAt)}`
    },
    {
        Header: "Status",
        accessor: (item) => {
            // if (item.status === 'pending') {
                return (
                    <Box>
                        <Typography variant="span" sx={{ ...buttonStyle, border: '1px solid #DCFF88', color: 'primary.main', backgroundColor: '#DCFF88', textTransform: 'capitalize', marginRight: '1rem' }}  >
                            {/* <CheckCircleIcon /> */}
                             {item.status}
                        </Typography>
                    </Box>
                );
        }
    },
    {
        Header: "Action",
        accessor: (item) => (
            <Box gap={1}>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'blue.main' }} onClick={()=> handelManagePermission(item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL)}>
                    Manage permission
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} onClick={() => handelDeleteModalOpen(item,handleAPISuccessCallBack,setModalConfig)} >
                    Delete
                </Typography>

            </Box>
        ),
    },
];


const handelManagePermission = (item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL) => {
    const apiURL = ENERVA_USER_MANAGEMENT.EDIT_EV_INVITATION_BY_ADMIN;
    setVisibleInvitePage(true);
    setSelectTableRow(item)
    setInvitePageInfo({title:'Invite Enerva User and set permissions', type: '4' })
    setInviteAPIURL(apiURL)
}

const handelDeleteModalOpen = (item, handleAPISuccessCallBack, setModalConfig) => {
    setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
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

return {IESO_USER_MANAGEMENT_ADMIN_COLUMN}

}

export default IESOUserManagementColumn;