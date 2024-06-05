import React, { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormGroup,
    FormLabel,
    Grid,
    Tooltip,
    Typography,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { DELETE_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import { USER_MANAGEMENT } from "constants/apiEndPoints";
import NotificationsToast from "utils/notification/NotificationsToast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "pages/Loader";


const UserManagementColumn = () => {
    const dispatch = useDispatch();
    const show_loader = useSelector((state) => state?.loaderReducer?.show_loader);

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
            <Grid container alignItems='center' flexDirection="column" textAlign='center' sx={{ padding: { md: '0 5%'}, position: 'relative'}} >
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
                {show_loader &&
                    <Loader sectionLoader={true} minHeight="150px" />
                }
            </Grid>
        )
    }

    const USER_MANAGEMENT_COLUMN_ACTION = (userData,handleAPISuccessCallBack, setVisibleInvitePage, setSelectTableRow, setModalConfig,setInvitePageInfo,setInviteAPIURL) => [
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
            Header: "Facility name",
            accessor: (item)=> {
                return item.facility
                // if(item.facility){
                //     const companyList = item.facility;
                //     const { companyNames, rest } = stringFilter(companyList);
                //     console.log(companyNames, "company names")
                //     console.log( rest, "company names rest")
                //     return (
                //         <Tooltip title={companyNames } placement="bottom">
                //             <span>{rest}</span>
                //         </Tooltip>
                //     )
                // }
            }
        },
        {
            Header: "Role Type",
            accessor: "rolename",
        },
        {
            Header: "Status",
            accessor: (item) => {
                const capitalizeSentence = (str) => {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                };
                if (item.status === 'Initiated') {
                    return (
                        <Box  >
                            <Typography variant="span" sx={{ ...buttonStyle, border: '1px solid #2e813e', color: 'primary.main', marginRight: '1rem' }} onClick={() => handelAcceptManagePermission(item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL)} >
                                <CheckCircleIcon /> Accept
                            </Typography>
                            <Typography variant="span" sx={{ ...buttonStyle, color: 'danger.main' }} onClick={() => handelReject(item, handleAPISuccessCallBack)} >
                                <CancelIcon /> Reject
                            </Typography>
                        </Box>
                    );
                } else if (item.status === 'pending') {
                    return 'Invitation sent'
                }
                else {
                    return capitalizeSentence(item.status); // Display status text for other status types
                }
            }
        },
        {
            Header: "Action",
            accessor: (item) => (
                <Box gap={1} >
                    <Typography disabled={item.status === 'Initiated' || item.status === 'Rejected' }  variant="span" sx={{ ...buttonStyle, padding: '0', margin:'0.4375rem 1rem', marginRight: '0', color: 'blue.main' }} onClick={() => handelManagePermission(userData,item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL)}>
                    {((userData?.user?.id === item?.id) || (userData?.user?.id !== item?.id && item?.role_id === 1) ) ? 'View permission' : 'Manage permission'} 
                    </Typography>
                    <Typography disabled={(userData?.user?.id === item?.id) || (item.status === 'Initiated' || item.role_id === 1)} variant="span" sx={{ ...buttonStyle, padding: '0', margin:'0.4375rem 1rem', marginRight: '0', color: 'danger.main' }} onClick={() => handelDeleteModalOpen(userData,item, handleAPISuccessCallBack, setModalConfig)} >
                        Delete
                    </Typography>

                </Box>
            ),
        },
    ];

    const stringFilter = (str) => {
        const [companyNames, rest] = str.split(',')
          .reduce(([companyNames, rest], part) => {
            if (part.includes('_')) {
              return [[...companyNames, part], rest];
            } else {
              return [companyNames, [...rest, part]];
            }
          }, [[], []]);
      
        return { companyNames, rest };
      };

    const handelAcceptManagePermission = (item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL)=> {
        // if((userData?.user?.id === item?.id) || (item.status === 'Initiated')){
        //     NotificationsToast({ message: "You don't have permission for this!", type: "error" });
        //     return;
        // }

        const apiURL = USER_MANAGEMENT.EDIT_INVITATION_BY_ADMIN;
        setVisibleInvitePage(true);
        setSelectTableRow(item)
        setInvitePageInfo({title:'Manage permission', type: null, handelAccept: true })
        setInviteAPIURL(apiURL)

    }


    // const handelAccept = (item, handleSuccessCallback) => {

    //     const apiURL = USER_MANAGEMENT.ACCEPT_USER_REQUEST;
    //     const requestBody = {
    //         "user_id": item.id,
    //         "company_id": item.company_id
    //     }

    //     POST_REQUEST(apiURL, requestBody)
    //         .then((response) => {
    //             NotificationsToast({ message: "You have accepted the request!", type: "success" });
    //             handleSuccessCallback();

    //         })
    //         .catch((error) => {
    //             console.log(error, 'error')
    //             NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });

    //         })
    // }

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

    const handelManagePermission = (userData,item, setVisibleInvitePage, setSelectTableRow,setInvitePageInfo,setInviteAPIURL) => {
        if(item.status === 'Initiated' || item.status === 'Rejected'){
            NotificationsToast({ message: "You don't have permission for this!", type: "error" });
            return;
        }
        const pageTitle = ((userData?.user?.id === item?.id) || (userData?.user?.id !== item?.id && item?.role_id === 1) ) ? "View permission" : "Manage permission"
        const apiURL = USER_MANAGEMENT.EDIT_INVITATION_BY_ADMIN;
        setVisibleInvitePage(true);
        setSelectTableRow(item)
        setInvitePageInfo({title:pageTitle, type: null })
        setInviteAPIURL(apiURL)
    }

    const handelDeleteModalOpen = (userData,item, handleAPISuccessCallBack, setModalConfig) => {
        console.log(userData, item, 'check results');
        // return if user wants to delete self account
        if((userData?.user?.id === item?.id) || (item.status === 'Initiated' || item.role_id === 1)){
            NotificationsToast({ message: "You don't have permission for this!", type: "error" });
            return;
        }

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
        const apiURL = USER_MANAGEMENT.DELETE_USER_REQUEST + '/'+ item.id + '/' + item.entry_type+'/'+ item.company_id;
        // return;
        // dispatch({ type: "SHOW_LOADER", payload: true });
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
                // dispatch({ type: "SHOW_LOADER", payload: false });

            })
            .catch((error) => {
                console.log(error, 'error')

                NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
                 // close the modal
                 setModalConfig((prevState) => ({
                    ...prevState,
                    modalVisible: false,
                }));
                // dispatch({ type: "SHOW_LOADER", payload: false });

            })
    }

    return { USER_MANAGEMENT_COLUMN_ACTION }
}

export default UserManagementColumn;
