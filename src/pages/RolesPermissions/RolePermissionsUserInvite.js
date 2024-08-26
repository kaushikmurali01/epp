import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, FormGroup, FormLabel, Grid, IconButton, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { emailRegExp } from 'config/regex';
import { GET_REQUEST, POST_REQUEST, PUT_REQUEST } from 'utils/HTTPRequests';
import { ENERVA_USER_MANAGEMENT, ROLES_PERMISSIONS_MANAGEMENT, USER_MANAGEMENT } from 'constants/apiEndPoints';
import NotificationsToast from 'utils/notification/NotificationsToast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';

const RolePermissionsUserInvite = ({ getUserRole, setVisibleInvitePage, handleAPISuccessCallBack, selectTableRow, invitePageInfo, inviteAPIURL }) => {
    const dispatch = useDispatch();
    const isEdited = Object.keys(selectTableRow).length > 0;
    const [roleName, setRoleName] = useState(selectTableRow?.rolename || '');
    const [selectRoleType, setSelectRoleType] = useState(isEdited ? selectTableRow?.user_type_id : '');
    const [isFormValid, setIsFormValid] = useState(false);
    const [permissions, setPermission] = useState([])
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [permissionStates, setPermissionStates] = useState([]);
    const [initialPermissionStates, setInitialPermissionStates] = useState([]);


    const handleSelectChange = (event) => {
        setSelectRoleType(event.target.value);
    };
    const handelEmailSelectChange = (event) => {
        setRoleName(event.target.value)
    }

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "instant",
        });
    };

  

    const handleAlignment = (event, index, permission) => {
        setPermissionStates((prevStates) => {
            const newStates = [...prevStates];
            const permissionId = permissions[index]?.id;
            const isSelected = !newStates.some((perm) => perm.id === permissionId);

            if (isSelected) {
                newStates.push({ id: permissionId, is_default: 1 }); // Default is 1 when selected
                setSelectedPermissions((prevSelectedPermissions) => [
                    ...prevSelectedPermissions,
                    { id: permissionId, is_default: 1 },
                ]);
            } else {
                const updatedStates = newStates.filter((perm) => perm.id !== permissionId);
                setSelectedPermissions((prevSelectedPermissions) =>
                    prevSelectedPermissions.filter(
                        (perm) => perm?.id !== permissionId
                    )
                );
                return updatedStates;
            }

            return newStates;
        });
    };


    // const handleDefaultPermissions = (event, index, permission) => {
    //     const isDefault = event.target.value === 'yes' ? 1 : 0;

    //     setPermissionStates((prevStates) => {
    //         const newStates = prevStates.map((perm) =>
    //             perm.id === permission.id ? { ...perm, is_default: isDefault } : perm
    //         );

    //         setSelectedPermissions((prevSelectedPermissions) =>
    //             prevSelectedPermissions.map((perm) =>
    //                 perm.id === permission.id ? { ...perm, is_default: isDefault } : perm
    //             )
    //         );

    //         return newStates;
    //     });
    // };

    const handleDefaultPermissions = (event, index, permission) => {
        const isDefault = event.target.value === 'yes' ? 1 : 0;
    
        setPermissionStates((prevStates) => {
            const newStates = prevStates.map((perm) =>
                perm.id === permission.id ? { ...perm, is_default: isDefault } : perm
            );
    
            // Update the selectedPermissions state accordingly
            setSelectedPermissions((prevSelectedPermissions) => {
                const updatedPermissions = prevSelectedPermissions.map((perm) =>
                    perm.id === permission.id ? { ...perm, is_default: isDefault } : perm
                );
    
                // Check if permission is missing from selectedPermissions and add it if necessary
                if (!updatedPermissions.some((perm) => perm.id === permission.id)) {
                    updatedPermissions.push({ ...permission, is_default: isDefault });
                }
    
                return updatedPermissions;
            });
    
            return newStates;
        });
    };
    


    const getPermissionList = () => {
        //check if we have type or not in page info, if we have type then it is user management admin page
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
        const apiURL = ROLES_PERMISSIONS_MANAGEMENT.GET_ALL_PERMISSIONS_LIST;
        GET_REQUEST(apiURL)
            .then((res) => {
                setPermission(res.data)
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
            }).catch((error) => {
                console.log(error)
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
            });

    }



    const handelInviteSubmit = () => {
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
        const apiURL = inviteAPIURL;
        // const permissionIds = selectedPermissions.map(permission => permission.id);
         // We can simply map over permissionStates to extract only the id and is_default for each permission.
        const mergedPermissions = permissionStates.map(permission => ({
            id: permission.id,
            is_default: permission.is_default,
        }));

        const requestBody = {
            "role_name": roleName,
            "user_type": selectRoleType,
            "permissions": mergedPermissions
        }

        console.log(requestBody, "check permissions submission");
        // return;
        if (isEdited) {
            requestBody.role_id = selectTableRow?.role_id;
            PUT_REQUEST(apiURL, requestBody)
                .then((response) => {

                    NotificationsToast({ message: 'Roles and permissions updated successfully!', type: "success" });
                    setVisibleInvitePage(false);
                    handleAPISuccessCallBack();
                    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
                })
                .catch((error) => {
                    console.log(error, 'error')
                    NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
                    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
                });
        } else {

            // return;
            POST_REQUEST(apiURL, requestBody)
                .then((response) => {
                    if (response.data.status === 200) {
                        NotificationsToast({ message: 'Roles and permissions added successfully!', type: "success" });
                        setVisibleInvitePage(false);
                        handleAPISuccessCallBack();
                    } else if (response.data.status === 500) {
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
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
        const apiURL = ROLES_PERMISSIONS_MANAGEMENT.GET_ROLE_PERMISSIONS_BY_ID + '/' + item?.role_id + '/' + selectRoleType;
        GET_REQUEST(apiURL)
            .then((res) => {
                const userPermissions = res.data?.permissionIds || []; // Assuming permissions is an array of permission IDs
                const userPermissionObjects = permissions.filter(permission => userPermissions.includes(permission?.id));
                setInitialPermissionStates(userPermissions); // Store the initial permission states
                setPermissionStates(userPermissions);
                
                setSelectedPermissions(userPermissionObjects);
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
            });
    };

    useEffect(() => {
        scrollTop();
        return () => {
            scrollTop();
        };
    }, [])

    useEffect(() => {
        if (Object.keys(selectTableRow).length !== 0) {
            getUserPermissionListAPI(selectTableRow);
        } else {
            setPermissionStates([]);
            setSelectedPermissions([]);
        }
    }, [selectTableRow, permissions]);

  
    useEffect(() => {
        // Check if role name and user type are selected
        const isRoleAndTypeValid = roleName && selectRoleType !== '';
    
        // Check if any permissions are selected
        const arePermissionsSelected = permissionStates.length > 0;
    
        // Check if permissions have been modified compared to the initial state
        const arePermissionsModified = permissionStates.some((perm, index) => {
            const initialPerm = initialPermissionStates[index];
            return (
                !initialPerm ||
                initialPerm.id !== perm.id ||
                initialPerm.is_default !== perm.is_default
            );
        });
    
        // Update isFormValid based on all conditions
        setIsFormValid(isRoleAndTypeValid && arePermissionsSelected && arePermissionsModified);
    }, [roleName, selectRoleType, permissionStates, initialPermissionStates]);
    

    useEffect(() => {
        if (selectRoleType) {
            setPermissionStates([]); // Reset permissionStates
            setSelectedPermissions([]); // Reset selectedPermissions
            getPermissionList(selectRoleType);
        }

    }, [selectRoleType,]);


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
                            {invitePageInfo?.title}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'space-between' }, gap: '1.5rem' }}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>


                        {invitePageInfo?.type === 'default' ?
                            <Stack flexDirection="row" sx={{ display: 'flex', width: '100%', gap: '2rem' }}>
                                <Box component='div' sx={{ borderRight: { md: '1px solid #ccc' }, paddingRight: { md: '2rem' } }}>
                                    <Typography variant='span' sx={{ marginBottom: '0.5rem', display: 'inline-block' }} >Role type </Typography>
                                    <Typography variant='h5'>{selectTableRow?.rolename}</Typography>
                                </Box>
                                <Box component='div'>
                                    <Typography variant='span' sx={{ marginBottom: '0.5rem', display: 'inline-block' }}  >User type</Typography>
                                    <Typography variant='h5'>{selectTableRow?.userType}</Typography>
                                </Box>
                            </Stack>
                            :
                            <React.Fragment>
                                <FormGroup className='theme-form-group'>
                                    <FormLabel sx={{ marginBottom: '0.5rem', fontSize: '0.875rem', minWidth: '12rem' }}> Role Name* </FormLabel>
                                    <FormControl className='theme-form-control'>
                                        <TextField
                                            placeholder="Role Name"
                                            onChange={(e) => handelEmailSelectChange(e)}
                                            value={roleName}
                                        />
                                    </FormControl>
                                </FormGroup>
                                <FormGroup className='theme-form-group'>
                                    <FormLabel sx={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}> User type* </FormLabel>
                                    <FormControl sx={{ minWidth: '12rem' }} >
                                        <Select
                                            value={selectRoleType}
                                            onChange={(e) => handleSelectChange(e)}
                                            displayEmpty={true}
                                        >
                                            <MenuItem value="" disabled>
                                                <em>Select</em>
                                            </MenuItem>
                                            {getUserRole && (getUserRole).map((item) => {
                                                return (
                                                    <MenuItem key={`${item.id}_${item.user_type}`} value={item?.id}>{item?.user_type}</MenuItem>
                                                )
                                            })}

                                        </Select>


                                    </FormControl>

                                </FormGroup>
                            </React.Fragment>


                        }


                    </Grid>
                    <Grid item >
                        <Button
                            color="primary"
                            variant="contained"
                            sx={{ alignSelf: 'center' }}
                            onClick={() => handelInviteSubmit()}
                            disabled={!isFormValid}
                        >
                            {invitePageInfo?.type === 'default' ? 'Save'
                                :
                                isEdited ? 'Update' : ' Add role'
                            }


                        </Button>
                    </Grid>
                </Grid>

                {permissions?.length > 0 ?
                    <Box component='div' sx={{ width: { xs: '100%' } }} >
                        <Grid container sx={{ justifyContent: 'space-between', marginTop: '2rem' }}>
                            <Grid item sx={{ width: { xs: '100%', sm: '60%' } }}>
                                <Typography variant='small'>List of Permissions</Typography>
                            </Grid>
                            <Grid item sx={{ width: { xs: '100%', sm: '20%' }, textAlign: 'right' }} >
                                <Typography variant='small'>Toggle to make visible</Typography>
                            </Grid>
                            <Grid item sx={{ width: { xs: '100%', sm: '20%' }, textAlign: 'right' }}>
                                <Typography variant='small'>Toggle to make default</Typography>
                            </Grid>
                        </Grid>
                        <Stack>
                            {permissions && permissions.map((permission, index) => {
                                // Check if the current permission is selected and if it's set as default
                                const isPermissionSelected = permissionStates.some((perm) => perm.id === permission.id);
                                const isDefaultSelected = permissionStates.find((perm) => perm.id === permission.id)?.is_default === 1;

                                return (
                                    <Grid key={permission?.id} container sx={{ justifyContent: 'space-between', marginTop: '2rem' }}>
                                        <Grid item sx={{ width: { xs: '100%', sm: '60%' } }}>
                                            <Typography variant='body2'>{permission.permission_description} </Typography>
                                        </Grid>
                                        <Grid item sx={{ width: { xs: '100%', sm: '20%' }, textAlign: 'right' }}>
                                            <ToggleButtonGroup
                                                value={isPermissionSelected ? 'yes' : 'no'}
                                                exclusive
                                                onChange={(event) => handleAlignment(event, index, permission)}
                                                aria-label="text alignment"
                                                key={permission?.id}
                                            >
                                                <ToggleButton className='theme-toggle-yes' value="yes" sx={{ fontSize: '0.875rem' }}>
                                                    Yes
                                                </ToggleButton>
                                                <ToggleButton className='theme-toggle-no' value="no" sx={{ fontSize: '0.875rem' }}>
                                                    No
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>
                                      
                                      
                                            <Grid item sx={{ width: { xs: '100%', sm: '20%' }, textAlign: 'right' }}>
                                                {
                                                     isPermissionSelected &&
                                                    <ToggleButtonGroup
                                                        value={isDefaultSelected ? 'yes' : 'no'}
                                                        exclusive
                                                        onChange={(event) => handleDefaultPermissions(event, index, permission)}
                                                        aria-label="default permission alignment"
                                                        key={permission?.id + "_default"}
                                                        disabled={!isPermissionSelected}  // Disable 
                                                    >
                                                        <ToggleButton className='theme-toggle-yes' value="yes" sx={{ fontSize: '0.875rem' }}>
                                                            Yes
                                                        </ToggleButton>
                                                        <ToggleButton className='theme-toggle-no' value="no" sx={{ fontSize: '0.875rem' }}>
                                                            No
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                }
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
                                <Typography variant='span' sx={{ letterSpacing: '1px', }}> Please select role type </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                }

            </Container >
        </Box >
    )
}

export default RolePermissionsUserInvite
