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
import { ENERVA_USER_MANAGEMENT, ROLES_PERMISSIONS_MANAGEMENT, USER_MANAGEMENT } from "constants/apiEndPoints";
import NotificationsToast from "utils/notification/NotificationsToast";
import { ConvertIntoDateMonth } from "utils/dateFormat/ConvertIntoDateMonth";


const RolesPermissionManagementColumn = () => {

const [isChecked, setIsChecked] = useState(false)

const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    margin: '0.4375rem 1rem',
    borderRadius: '1.5rem',
    fontWeight: '500',
    fontSize: { sm: '0.875rem' },
    cursor: 'pointer',
    '&:last-child': {
        marginRight: 0,
    }

}

const DeleteModelContent = () => {
    return (
        <Grid container alignItems='center' flexDirection="column" textAlign='center' >
            <Grid item sx={{textAlign:'center'}}>
                <figure>
                    <img src="/images/icons/deleteIcon.svg" alt="" />
                </figure>
            </Grid>
            <Grid item>
                <Typography variant="h4">
                Are you sure you would like to delete
                the role from the system.
                </Typography>
            </Grid>
            <Grid item>
                <FormGroup sx={{display: 'block',}}>
                 <Checkbox id="receiveCopy" onChange={(e)=> setIsChecked(e.target.checked) } />
                <FormLabel htmlFor="receiveCopy">Check if you want to receive a copy of the delete confirmation email</FormLabel>
                </FormGroup>
            </Grid>
        </Grid>
    )
}



const ROLES_PERMISSIONS_MANAGEMENT_COLUMN = (getUserRole,handleAPISuccessCallBack, setVisibleInvitePage, setSelectTableRow, setModalConfig,setInvitePageInfo,setInviteAPIURL) => [
    {
        Header: "Role name",
        accessor: 'rolename',
    },
    {
        Header: "User    Type",
        accessor: "userType",
    },
    {
        Header: "Created date",
        accessor: (item) => `${ConvertIntoDateMonth(item?.createdAt)}`
    },
    {
        Header: "Action",
        accessor: (item) => (
            <Box gap={1}>
                 <Typography variant="span" sx={{ ...buttonStyle, color: 'primary.main' }} onClick={()=> handelDefaultPermission(item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL)}>
                    Set Default permission
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'blue.main' }} onClick={()=> handelManagePermission(item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL)}>
                    Edit
                </Typography>
                <Typography disabled={hasDefaultPermission(getUserRole,item.role_id)}  variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} onClick={() => handelDeleteModalOpen(item,handleAPISuccessCallBack,setModalConfig)} >
                    Delete
                </Typography>

            </Box>
        ),
    },
];

const hasDefaultPermission = (permissions,roleId) => {
    const isDefault = permissions.some((perm) => perm.id === roleId);
    return isDefault;
  };

const handelDefaultPermission = (item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL) => {
    const apiURL = ROLES_PERMISSIONS_MANAGEMENT.ROLES_PERMISSIONS;
    setVisibleInvitePage(true);
    setSelectTableRow(item)
    setInvitePageInfo({title:'Set Default Permissions', type: 'default' }) 
    setInviteAPIURL(apiURL)
}

const handelManagePermission = (item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL) => {
    const apiURL = ROLES_PERMISSIONS_MANAGEMENT.ROLES_PERMISSIONS;
    setVisibleInvitePage(true);
    setSelectTableRow(item)
    setInvitePageInfo({title:'Edit Role', type: 'edit' }) 
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
    const apiURL = ROLES_PERMISSIONS_MANAGEMENT.ROLES_PERMISSIONS + '/' + item.role_id;
    // return;
    DELETE_REQUEST(apiURL)
        .then((response) => {
            console.log(response, "check response");
            NotificationsToast({ message: response?.message ||  "Role and records deleted successfully", type: "success" });
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

return {ROLES_PERMISSIONS_MANAGEMENT_COLUMN}

}

export default RolesPermissionManagementColumn;