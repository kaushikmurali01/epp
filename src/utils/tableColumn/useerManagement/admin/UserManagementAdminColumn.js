import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormGroup,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";

import { DELETE_REQUEST, POST_REQUEST, PUT_REQUEST } from "utils/HTTPRequests";
import { ENERVA_USER_MANAGEMENT, USER_MANAGEMENT } from "constants/apiEndPoints";
import NotificationsToast from "utils/notification/NotificationsToast";
import { ConvertIntoDateMonth } from "utils/dateFormat/ConvertIntoDateMonth";
import PopUpAlert from "utils/modalContentData/userManagement/PopUpAlert";
import EvThemeDropdown from "utils/dropdown/EvThemeDropdown";
import { useDispatch } from "react-redux";

// import { SnackbarContext } from "utils/notification/SnackbarProvider";


const UserManagementAdminColumn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
const [isChecked, setIsChecked] = useState(false);
const [alertModalContnet, setAlertModalContnet] = useState({
    title: 'Alert',
    content: ''
})
const [dropdownConfig, setDropdownConfig] = useState({
    title: 'Change Status',
    options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ],
    selectedValue: '',
});
const [isTableRowStatus, setTableRowStatus] = useState('');

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
                    the Customer user Details
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






const USER_MANAGEMENT_ADMIN_COLUMN = (userData,setRefreshTableData, setVisibleInvitePage, setSelectTableRow, setModalConfig,setInvitePageInfo,setInviteAPIURL) => [
    {
        Header: "Customer ID",
        accessor: 'id',
        accessorKey: "id",
        isSearch: true,
    },
    {
        Header: " Customer admin name",
        accessor: (item) => `${item?.first_name ? item?.first_name : ''} ${item?.last_name ? item?.last_name : ''}`,
        accessorKey: "first_name",
        isSearch: true,
    },
    {
        Header: "Business Email",
        accessor: "email",
        accessorKey: "email",
        isSearch: true,
    },
    {
        Header: "Role Type",
        accessor: "rolename",
        isSearch: true,
    },
    {
        Header: "Created on (Date)",
        accessor: (item) => `${ConvertIntoDateMonth(item?.createdAt)}`,
        isSearch: false,

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
                <Typography disabled={userData?.user?.id === item?.id}  variant="span" sx={{ ...buttonStyle, color: 'primary.main' }} onClick={()=> handelManagePermission(userData,item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL)}>
                    Manage permission
                </Typography>
               
                <Typography disabled={item.status === 'pending'} variant="span" sx={{ ...buttonStyle, color: 'blue.main' }} onClick={() => handelNavigateProfile(item) } >
                    View
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'warning.main' }} onClick={() => handelAlertModalOpen(item,setModalConfig)} >
                    Alert
                </Typography>
                <Typography variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} onClick={() => handelDeleteModalOpen(item,setRefreshTableData,setModalConfig)} >
                    Delete
                </Typography>
                 <EvThemeDropdown dropdownConfig={dropdownConfig} setDropdownConfig={setDropdownConfig} dataRow = {item} setRefreshTableData={setRefreshTableData} disabledTitle={item.status.toLowerCase() === "pending"} />

            </Box>
        ),
    },
];


 useEffect(()=>{
     if(dropdownConfig.selectedValue !== ''){
        console.log(dropdownConfig, "values changes")
        userStatusUpdate(dropdownConfig)
     }
 },[dropdownConfig]) 


 const userStatusUpdate = (dropdowndata)=> {
    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    const apiURL = ENERVA_USER_MANAGEMENT.USER_ACTIVE_IN_ACTIVE+"/"+ dropdowndata?.dataRow?.id;
    const successMessage = dropdowndata.selectedValue === "active" ? "User activated successfully." : 'User deactivated successfully.'
    const requestBody = {
        "is_active": dropdowndata.selectedValue === "active" ? "1" : "0",
      }


      console.log(requestBody, apiURL,"requestBody");   
    //   return;
      PUT_REQUEST(apiURL, requestBody)
      .then((result)=> {
        console.log(result, "success");
        NotificationsToast({ message: successMessage, type: "success" });
        dropdownConfig.setRefreshTableData(prevState => prevState + 1);;
      }).catch((error)=>{
        console.log(error, "error")
        NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
      })
 }


const handelNavigateProfile = (item)=> {
    console.log(item, "item status")
    if(item.status === 'pending'){
        NotificationsToast({ message: "You don't have permission for this!", type: "error" });
        return;
    }
    navigate(`/user-management/profile/${(item?.company_id === (undefined || null)) ? '0': item?.company_id}/${item?.id}`)
}

const handelManagePermission = (userData,item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL) => {
    if(userData?.user?.id === item?.id){
        NotificationsToast({ message: "You don't have permission for this!", type: "error" });
        return;
    }
    const apiURL = ENERVA_USER_MANAGEMENT.EDIT_EV_INVITATION_BY_ADMIN;
    setVisibleInvitePage(true);
    setSelectTableRow(item)
    setInvitePageInfo({title:'Manage Customer User and permissions', type: "2" })
    setInviteAPIURL(apiURL)
    
}

const handelDeleteModalOpen = (item,setRefreshTableData, setModalConfig) => {
    setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        buttonsUI: {
            ...prevState.buttonsUI,
            saveButton: true,
            cancelButton: true,
        },
        modalBodyContent: <DeleteModelContent />,
        saveButtonAction: () =>  handelDelete(item,setRefreshTableData, setModalConfig),
    }));
   
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



const handelDelete = (item, setRefreshTableData, setModalConfig) => {
    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    // for customer we need to company_id to delete
    const apiURL = ENERVA_USER_MANAGEMENT.DELETE_ENERVA_USER_REQUEST + '/' + item.id + '/' + item.entry_type + '/' + item.company_id;
    // return;
    DELETE_REQUEST(apiURL)
        .then((_response) => {
            NotificationsToast({ message: "The user has been deleted successfully.", type: "success" });
            // handleSuccessCallback();
            setRefreshTableData(prevState => prevState + 1);
            // close the modal
            setModalConfig((prevState) => ({
                ...prevState,
                modalVisible: false,
            }));
            dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
        })
        .catch((error) => {
            console.log(error, 'error')

            NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
             // close the modal
             setModalConfig((prevState) => ({
                ...prevState,
                modalVisible: false,
            }));
            dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
        })
}

return {USER_MANAGEMENT_ADMIN_COLUMN}

}

export default UserManagementAdminColumn;