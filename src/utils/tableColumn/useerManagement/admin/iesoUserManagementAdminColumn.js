import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import PopUpAlert from "utils/modalContentData/userManagement/PopUpAlert";


const IESOUserManagementColumn = () => {
const navigate = useNavigate();
const [isChecked, setIsChecked] = useState(false);
const [alertModalContnet, setAlertModalContnet] = useState({
    title: 'Alert',
    content: ''
})

const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    margin: '0.4375rem 0.5rem',
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
        <Grid container alignItems='center' flexDirection="column" textAlign='center' sx={{ padding: { md: '0 5%'}}} >
            <Grid item sx={{textAlign:'center'}}>
                <figure>
                    <img src="/images/icons/deleteIcon.svg" alt="" />
                </figure>
            </Grid>
            <Grid item>
                <Typography variant="h4">
                    Are you sure you would like to Delete
                    the IESO user Details
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



const IESO_USER_MANAGEMENT_ADMIN_COLUMN = (userData,handleAPISuccessCallBack, setVisibleInvitePage, setSelectTableRow, setModalConfig,setInvitePageInfo,setInviteAPIURL) => [
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
                        <Typography variant="span" sx={{ ...buttonStyle,margin: '0', padding: '0.4375rem 1rem',  border: '1px solid #DCFF88', color: 'primary.main', backgroundColor: '#DCFF88', textTransform: 'capitalize', marginRight: '1rem' }}  >
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
                <Typography disabled={userData?.user?.id === item?.id} variant="span" sx={{ ...buttonStyle, color: 'primary.main' }} onClick={()=> handelManagePermission(userData,item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL)}>
                    Manage permission
                </Typography>
                <Typography disabled={item.status === 'pending'} variant="span" sx={{ ...buttonStyle, color: 'blue.main' }} onClick={() => handelNavigateProfile(item)  } >
                    View
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'warning.main' }} onClick={() => handelAlertModalOpen(item,setModalConfig)} >
                    Alert
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} onClick={() => handelDeleteModalOpen(item,handleAPISuccessCallBack,setModalConfig)} >
                    Delete
                </Typography>

            </Box>
        ),
    },
];


const handelNavigateProfile = (item)=> {
    console.log(item, "item status")
    if(item.status === 'pending'){
        NotificationsToast({ message: "You don't have permission for this!", type: "error" });
        return;
    }
     navigate(`/user-management/profile/${item?.company_id === undefined ? '0': item?.company_id}/${item?.id}`)
    // navigate(`/user-management/profile/${item?.company_id === undefined ? '0': item?.company_id}/${item?.id}`)
}


const handelManagePermission = (userData,item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL) => {
    if(userData?.user?.id === item?.id){
        NotificationsToast({ message: "You don't have permission for this!", type: "error" });
        return;
    }
    const apiURL = ENERVA_USER_MANAGEMENT.EDIT_EV_INVITATION_BY_ADMIN;
    setVisibleInvitePage(true);
    setSelectTableRow(item)
    setInvitePageInfo({title:'Manage IESO User and permissions', type: '4' })
    setInviteAPIURL(apiURL)
}

const handelDeleteModalOpen = (item, handleAPISuccessCallBack, setModalConfig) => {
    setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        buttonsUI: {
            ...prevState.buttonsUI,
            saveButton: true,
            cancelButton: true,
        },
        modalBodyContent: <DeleteModelContent />,
        saveButtonAction: () =>  handelDelete(item, handleAPISuccessCallBack, setModalConfig),
    }));
    // handelDelete(item, handleAPISuccessCallBack)
}

const handelAlertModalOpen = (item, setModalConfig) => {
    const apiURL = ENERVA_USER_MANAGEMENT.SEND_USER_ALERT;
    const apiData = {
        apiURL,
        item
    }
    setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <PopUpAlert modalContent={alertModalContnet} setModalConfig={setModalConfig} apiData={apiData} />,
        buttonsUI: {
            ...prevState.buttonsUI,
            saveButton: false,
            cancelButton: false,
        }
    }));
}





const handelDelete = (item, handleSuccessCallback, setModalConfig) => {
    const company_id = 0; // for enerva and Ieso
    const apiURL = USER_MANAGEMENT.DELETE_USER_REQUEST + '/' + item.id + '/' + item.entry_type + '/' + company_id;
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