import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, FormGroup, FormLabel, Grid, IconButton, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { emailRegExp } from 'config/regex';
import { GET_REQUEST, POST_REQUEST, PUT_REQUEST } from 'utils/HTTPRequests';
import { ENERVA_USER_MANAGEMENT, USER_MANAGEMENT } from 'constants/apiEndPoints';
import NotificationsToast from 'utils/notification/NotificationsToast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import EvModal from 'utils/modal/EvModal';
import EvLoader from 'utils/loader/EvLoader';

const InviteUser = ({ getUserRole, setVisibleInvitePage, handleAPISuccessCallBack, selectTableRow, invitePageInfo, inviteAPIURL, getCompanyList }) => {
    const dispatch = useDispatch();
    // console.log(selectTableRow, "selectTableRow", Object.keys(selectTableRow).length)
    const isEdited = Object.keys(selectTableRow).length > 0;
    const [userEmail, setUserEmail] = useState(selectTableRow?.email || '');
    const [selectRoleType, setSelectRoleType] = useState(selectTableRow?.role_id || '');
    const [selectCompanyType, setSelectCompanyType] = useState(selectTableRow?.company_id || '');
    const [isFormValid, setIsFormValid] = useState(false);
    const [permissions, setPermission] = useState([])
    const [selectedPermissions, setSelectedPermissions] = useState([]);



    const [permissionStates, setPermissionStates] = useState([]);

    const userData = useSelector((state) => state?.facilityReducer?.userDetails || {});
    const show_loader = useSelector((state) => state?.loaderReducer?.show_loader);

    // const isPagePermissionDisabled = (userData?.user?.id === selectTableRow?.id) || (selectTableRow.status === 'Initiated');
    const isPagePermissionDisabled = ((userData?.user?.id === selectTableRow?.id) || (selectTableRow?.role_id === 1));


    const [modalConfig, setModalConfig] = useState({
        modalVisible: false,
        modalUI: {
          showHeader: true,
          crossIcon: true,
          modalClass: "",
          headerTextStyle: { color: 'rgba(84, 88, 90, 1)' },
          headerSubTextStyle: { marginTop: '1rem' },
          fotterActionStyle: {justifyContent: "center", gap: '1rem'},
          modalBodyContentStyle: {minHeight: '110px', display: 'flex',flexWrap: 'wrap', alignItems: 'center', color: 'dark.light'}
        },
        buttonsUI: {
          saveButton: true,
          cancelButton: true,
          saveButtonName: "Send Request",
          cancelButtonName: "Cancel",
          successButtonStyle: {backgroundColor: 'primary.main',"&:hover": {backgroundColor: 'primary.main'}, color: '#fff'},
          cancelButtonStyle: {backgroundColor: 'dark.colorSmoke',"&:hover": {backgroundColor: 'dark.colorSmoke'}, color: '#fff'},
          saveButtonClass: "",
          cancelButtonClass: "",
    
        },
        headerText: "",
        headerSubText: '',
        modalBodyContent: 'Are you sure you want to change the binding authority permission?'
      });

    const handleSelectChange = (event) => {
        setSelectRoleType(event.target.value);
    };
    const handelEmailSelectChange = (event) => {
        setUserEmail(event.target.value)
    }
    const handleSelectCompanyChange = (event) => {
        setSelectCompanyType(event.target.value);
    };

    const setTogglePermissionsState = (event, index, permission)=> {
        setPermissionStates((prevStates) => {
            const newStates = [...prevStates];
            const permissionId = permissions[index].permission_id;
            const isSelected = !newStates.includes(permissionId);

            if (isSelected) {
                newStates.push(permissionId);
                setSelectedPermissions((prevSelectedPermissions) => [
                    ...prevSelectedPermissions,
                    permissions[index],
                ]);
            } else {
                const updatedStates = newStates.filter((id) => id !== permissionId);
                setSelectedPermissions((prevSelectedPermissions) =>
                    prevSelectedPermissions.filter(
                        (permission) => permission.permission_id !== permissionId
                    )
                );
                return updatedStates;
            }

            return newStates;
        });
    }

    const handelPA_Permission = (event, index, permission)=> {
        setTogglePermissionsState(event, index, permission);
        setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
      
       
         
          }));
    }
    const handleAlignment = (event, index, permission,isPermissionSelected) => {
        if (permission.is_active === 0) {
            NotificationsToast({ message: "You don't have permission for this!", type: "error" });
            return;
        }

        if(permission.permission_id === 4 && !isPermissionSelected){
            setModalConfig((prevState) => ({
                ...prevState,
                modalVisible: true,
                buttonsUI: {
                  ...prevState.buttonsUI,
                 
              },
              saveButtonAction: () =>  handelPA_Permission(event, index, permission),
             
              }));
        } else {
            setTogglePermissionsState(event, index, permission)
        }

      


    };

    const getPermissionList = (permission_id) => {
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
        //check if we have type or not in page info, if we have type then it is user management admin page
        const apiURL = invitePageInfo?.type !== null ? ENERVA_USER_MANAGEMENT.GET_EV_DEFAULT_PERMISSIONS_BY_ROLE_ID + '/' + permission_id : USER_MANAGEMENT.GET_DEFAULT_PERMISSIONS_BY_ROLE_ID + '/' + permission_id;
        GET_REQUEST(apiURL)
            .then((res) => {
                setPermission(res.data)
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
            }).catch((error) => {
                console.log(error)
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
            });

    }

    const permissionUpDate = (apiURL, requestBody, handelAccept) => {
        POST_REQUEST(apiURL, requestBody)
            .then((response) => {
                handleAPISuccessCallBack();
                setVisibleInvitePage(false);
                if (handelAccept) {
                    NotificationsToast({ message: 'You have accepted the request and updated the invite permissions.', type: "success" });
                } else {
                    NotificationsToast({ message: 'The permission has been updated successfully', type: "success" });
                }
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });

            })
            .catch((error) => {
                console.log(error, 'error')
                NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
            });
    }

    const handelAccept = (item, handelAccept, permissionEditAPI, reqBody) => {

        const apiURL = USER_MANAGEMENT.ACCEPT_USER_REQUEST;
        const requestBody = {
            "user_id": item.id,
            "company_id": item.company_id
        }

        POST_REQUEST(apiURL, requestBody)
            .then((_response) => {
                permissionUpDate(permissionEditAPI, reqBody, handelAccept)
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });

            })
            .catch((error) => {
                console.log(error, 'error')
                NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });

            })
    }



    const handelInviteSubmit = () => {
        if (!isFormValid) {
            NotificationsToast({ message: "You don't have permission for this!", type: "error" });
            return;
        }

        // const apiURL = isEdited ? USER_MANAGEMENT.EDIT_INVITATION_BY_ADMIN : USER_MANAGEMENT.SEND_INVITATION_BY_ADMIN;
        const apiURL = inviteAPIURL;
        const permissionIds = selectedPermissions.map(permission => permission.permission_id);

        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
        // return;
        if (isEdited) {
            const requestBody = {
                "email": userEmail,
                "role_id": selectRoleType,
                // "company_id": selectTableRow.company_id, // comapnay id is static right now.
                "permissions": permissionIds,
                "entry_type": selectTableRow.entry_type
            }
            //  for enverva admin types
            if (invitePageInfo?.type !== null) {
                requestBody.type = invitePageInfo?.type;
            }

            //  for enverva admin types
            if (invitePageInfo?.type === "2" && selectCompanyType !== '') {
                requestBody.company_id = selectTableRow.company_id
            }


            if (invitePageInfo?.handelAccept) {
                handelAccept(selectTableRow, invitePageInfo?.handelAccept, apiURL, requestBody,);

            } else {
                permissionUpDate(apiURL, requestBody, false)
            }


        } else {
            const requestBody = {
                "email": userEmail,
                "role": selectRoleType,
                "permissions": permissionIds,
            }
            //  for super admin types

            if (invitePageInfo?.type !== null) {
                requestBody.type = invitePageInfo?.type
            } else {
                requestBody.company = userData?.user?.company_id
            }

            //  for enverva admin types
            if (invitePageInfo?.type === "2" && selectCompanyType !== '') {
                requestBody.company = selectCompanyType;
            }

            POST_REQUEST(apiURL, requestBody)
                .then((response) => {
                    if (response.data.status === 200) {
                        NotificationsToast({ message: 'The Invite has been sent', type: "success" });
                        setVisibleInvitePage(false);
                        handleAPISuccessCallBack();
                    } else if (response.data.status === 500 || response.data.status === 409) {
                        NotificationsToast({ message: response.data.message, type: "error" });
                    }
                    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
                })
                .catch((error) => {
                    console.log(error, 'error')
                    NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
                    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });

                })
        }

    }

    const getUserPermissionListAPI = (item) => {
        const apiURL = invitePageInfo?.type !== null ? ENERVA_USER_MANAGEMENT.GET_EV_USER_PERMISSONS_BY_ID + '/' + item.id + '/' + invitePageInfo?.type + "/" + (item.company_id ? item.company_id : '0') + "/" + item.entry_type : USER_MANAGEMENT.GET_USER_PERMISSONS_BY_ID + '/' + item.id + '/' + item.company_id + '/' + item.entry_type;
        GET_REQUEST(apiURL)
            .then((res) => {
                const userPermissions = res.data?.permissions || []; // Assuming permissions is an array of permission IDs
                const userPermissionObjects = permissions.filter(permission => userPermissions.includes(permission.permission_id));
                setPermissionStates(userPermissions);
                setSelectedPermissions(userPermissionObjects);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (Object.keys(selectTableRow).length !== 0) {
            getUserPermissionListAPI(selectTableRow);
        } else {
            setPermissionStates([]);
            setSelectedPermissions([]);
        }
    }, [selectTableRow, permissions]);

    useEffect(() => {
        const isValidEmail = emailRegExp.test(userEmail)
        const isRoleTypePermissonsSelected = selectRoleType !== '' && selectedPermissions?.length > 0;

        if (invitePageInfo?.type === "2") {
            setIsFormValid(isValidEmail && isRoleTypePermissonsSelected && selectCompanyType !== '')
        } else {
            setIsFormValid(isValidEmail && isRoleTypePermissonsSelected)
        }

    }, [userEmail, selectRoleType, selectCompanyType, selectedPermissions])


    useEffect(() => {
        if (selectRoleType) {
            setPermissionStates([]); // Reset permissionStates
            setSelectedPermissions([]); // Reset selectedPermissions
            getPermissionList(selectRoleType);
        }

    }, [selectRoleType]);


    return (
        <Box component="section">

            <Container maxWidth="lg">
                <Grid container sx={{ justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }} >
                    <Grid item sx={{ display: 'flex', }}>
                        <IconButton onClick={() => setVisibleInvitePage(false)} sx={{
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                            },
                            marginRight: '1rem'
                        }} >
                            <ArrowBackIcon
                                sx={{
                                    color: "#fff",
                                    fontSize: "1.25rem",
                                }}
                            />
                        </IconButton>
                        <Typography variant='h4'>
                            {/* {isEdited ? 'Manage permission' : 'Invite user and set permissions'} */}
                            {invitePageInfo?.title}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between', }}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <FormGroup className='theme-form-group'>
                            <FormLabel sx={{ marginBottom: '0.5rem', fontSize: '0.875rem', minWidth: '12rem' }}> Business Email* </FormLabel>
                            <FormControl className='theme-form-control'>
                                <TextField
                                    placeholder="Business Email"
                                    onChange={(e) => handelEmailSelectChange(e)}
                                    value={userEmail}
                                    disabled={isEdited}
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup className='theme-form-group'>
                            <FormLabel sx={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}> Role Type* </FormLabel>
                            <FormControl sx={{ minWidth: '12rem' }} >
                                <Select
                                    value={selectRoleType}
                                    onChange={(e) => handleSelectChange(e)}
                                    displayEmpty={true}
                                    disabled={isPagePermissionDisabled}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select</em>
                                    </MenuItem>
                                    {selectTableRow?.role_id === 1 &&
                                        <MenuItem value="1">
                                            Super Admin
                                        </MenuItem>
                                    }

                                    {getUserRole && (getUserRole).map((item) => {
                                        return (
                                            <MenuItem key={item.id} value={item?.id}>{item?.rolename}</MenuItem>
                                        )
                                    })}

                                </Select>


                            </FormControl>

                        </FormGroup>
                        {invitePageInfo?.type === "2" &&
                            <FormGroup className='theme-form-group'>
                                <FormLabel sx={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}> Company* </FormLabel>
                                <FormControl sx={{ minWidth: '12rem' }} >
                                    <Select
                                        value={selectCompanyType}
                                        onChange={(e) => handleSelectCompanyChange(e)}
                                        displayEmpty={true}
                                        disabled={isEdited}
                                    >
                                        <MenuItem value="" disabled>
                                            <em>Select</em>
                                        </MenuItem>
                                        {getCompanyList && (getCompanyList).map((item) => {
                                            return (
                                                <MenuItem key={`${item.id}_${item.company_name}`} value={item?.id}>{item?.company_name}</MenuItem>
                                            )
                                        })}

                                    </Select>


                                </FormControl>

                            </FormGroup>
                        }
                    </Grid>
                    {!isPagePermissionDisabled &&
                        <Grid item >
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{ alignSelf: 'center' }}
                                onClick={() => handelInviteSubmit()}
                                disabled={!isFormValid}
                            >
                                {isEdited ? 'Update Permission' : ' Send Invite'}

                            </Button>
                        </Grid>
                    }
                </Grid>
                <Box sx={{ position: 'relative' }}>
                    {permissions?.length > 0 ?
                        <Box component='div' sx={{ width: { xs: '100%', sm: '85%' } }} >
                            <Grid container sx={{ justifyContent: 'space-between', marginTop: '2rem' }}>
                                <Grid item>
                                    <Typography variant='small'>List of Permissions</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant='small'>Toggle to grant</Typography>
                                </Grid>
                            </Grid>
                            <Stack >
                                {permissions && permissions.map((permission, index) => {
                                    const isPermissionSelected = permissionStates?.includes(permission.permission_id);
                                    return (
                                        <Grid key={permission.permission_id} container sx={{ justifyContent: 'space-between', marginTop: '2rem' }}>
                                            <Grid item xs={12} md={10}>
                                                <Typography variant='body2'>{permission.desc} </Typography>
                                            </Grid>
                                            <Grid item>
                                                <ToggleButtonGroup

                                                    value={isPermissionSelected ? 'yes' : 'no'}
                                                    exclusive
                                                    onChange={(event) => handleAlignment(event, index, permission,isPermissionSelected)}
                                                    aria-label="text alignment"
                                                    key={permission.permission_id}
                                                >
                                                    <ToggleButton disabled={(permission.is_active === 0 || isPagePermissionDisabled)} className='theme-toggle-yes' value="yes" sx={{ fontSize: '0.875rem' }}>
                                                        Yes
                                                    </ToggleButton>
                                                    <ToggleButton disabled={(permission.is_active === 0 || isPagePermissionDisabled)} className='theme-toggle-no' value="no" sx={{ fontSize: '0.875rem' }}>
                                                        No
                                                    </ToggleButton>
                                                </ToggleButtonGroup>

                                            </Grid>
                                        </Grid>
                                    )
                                })}
                            </Stack>
                        </Box>
                        :
                        <Box component='div' >
                            <Grid container sx={{ justifyContent: 'center', padding: '5rem 0' }}>
                                <Grid item>
                                    <Typography variant='span' sx={{ letterSpacing: '1px', }}>
                                        {(selectRoleType === '') && "Please select role type"}
                                        {(selectRoleType !== '' && permissions?.length === 0 && !show_loader) && "The list of permissions is not available for this role."}


                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    }

                    {show_loader &&
                        <EvLoader sectionLoader={true} minHeight="150px" />
                    }
                </Box>

                {(!isPagePermissionDisabled && permissions.length > 0 ) &&
                        <Grid item >
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{ alignSelf: 'center' }}
                                onClick={() => handelInviteSubmit()}
                                disabled={!isFormValid}
                            >
                                {isEdited ? 'Update Permission' : ' Send Invite'}

                            </Button>
                        </Grid>
                    }
            </Container >

            <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
        </Box >
    )
}

export default InviteUser
