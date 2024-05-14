import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, FormGroup, FormLabel, Grid, IconButton, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { emailRegExp } from 'config/regex';
import { GET_REQUEST, POST_REQUEST, PUT_REQUEST } from 'utils/HTTPRequests';
import { ENERVA_USER_MANAGEMENT, USER_MANAGEMENT } from 'constants/apiEndPoints';
import NotificationsToast from 'utils/notification/NotificationsToast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RolePermissionsUserInvite = ({ getUserRole, setVisibleInvitePage, handleAPISuccessCallBack, selectTableRow, invitePageInfo, inviteAPIURL }) => {
    console.log(selectTableRow, "selectTableRow", Object.keys(selectTableRow).length)
    const isEdited = Object.keys(selectTableRow).length > 0;
    const [roleName, setRoleName] = useState(selectTableRow?.rolename || '');
    const [selectRoleType, setSelectRoleType] = useState(selectTableRow?.user_type || '1');
    const [isFormValid, setIsFormValid] = useState(false);
    const [permissions, setPermission] = useState([])
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [permissionStates, setPermissionStates] = useState([]);

    const handleSelectChange = (event) => {
        setSelectRoleType(event.target.value);
    };
    const handelEmailSelectChange = (event) => {
        setRoleName(event.target.value)
    }


    const handleAlignment = (event, index) => {
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
    };

    const getPermissionList = (permission_id) => {
        //check if we have type or not in page info, if we have type then it is user management admin page
        const apiURL = invitePageInfo?.type !== null ? ENERVA_USER_MANAGEMENT.GET_EV_DEFAULT_PERMISSIONS_BY_ROLE_ID + '/' + permission_id : USER_MANAGEMENT.GET_DEFAULT_PERMISSIONS_BY_ROLE_ID + '/' + permission_id;
        GET_REQUEST(apiURL)
            .then((res) => {
                setPermission(res.data)
            }).catch((error) => {
                console.log(error)
            });

    }



    const handelInviteSubmit = () => {

        // const apiURL = isEdited ? USER_MANAGEMENT.EDIT_INVITATION_BY_ADMIN : USER_MANAGEMENT.SEND_INVITATION_BY_ADMIN;
        const apiURL = inviteAPIURL;
        const permissionIds = selectedPermissions.map(permission => permission.permission_id);

        console.log(apiURL, permissionIds, "checked data");
        const requestBody = {
            "role_name": roleName,
            "user_type": selectRoleType,
            "permissions": permissionIds
        }
        // return;
        if (isEdited) {
            requestBody.role_id = '2';

            console.log(requestBody, 'requestBody edit')

            return;
         
            POST_REQUEST(apiURL, requestBody)
                .then((response) => {

                    NotificationsToast({ message: 'Roles and permissions updated successfully!', type: "success" });
                    setVisibleInvitePage(false);
                    handleAPISuccessCallBack();
                })
                .catch((error) => {
                    console.log(error, 'error')
                    NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
                });
        } else {
           
            console.log(requestBody, 'requestBody submit')

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
                })
                .catch((error) => {
                    console.log(error, 'error')
                    NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });

                })
        }

    }

    const getUserPermissionListAPI = (item) => {
        const apiURL =  ''
        GET_REQUEST(apiURL)
            .then((res) => {
                const userPermissions = res.data[0]?.permissions || []; // Assuming permissions is an array of permission IDs
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
            // getUserPermissionListAPI(selectTableRow);
        } else {
            setPermissionStates([]);
            setSelectedPermissions([]);
        }
    }, [selectTableRow, permissions]);

    useEffect(() => {
       
        setIsFormValid(roleName && selectRoleType !== '')
    }, [roleName, selectRoleType])


    useEffect(() => {
        if (selectRoleType) {
            setPermissionStates([]); // Reset permissionStates
            setSelectedPermissions([]); // Reset selectedPermissions
            getPermissionList(selectRoleType);
        }

    }, [selectRoleType,]);

    console.log(roleName,selectRoleType, 'invitePageInfo')

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
                <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between', }}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>


                        {invitePageInfo?.type === 'default' ?
                            <Stack flexDirection="row" sx={{display: 'flex', width: '100%', gap:'2rem'}}>
                                <Box component='div' sx={{ borderRight: { md: '1px solid #ccc' }, paddingRight: { md: '2rem'} }}>
                                    <Typography variant='span' sx={{marginBottom: '0.5rem', display: 'inline-block'}} >User type</Typography>
                                    <Typography variant='h5'>Role Type</Typography>
                                </Box>
                                <Box component='div'>
                                    <Typography variant='span' sx={{marginBottom: '0.5rem', display: 'inline-block'}}  >User type</Typography>
                                    <Typography variant='h5'>Role Type</Typography>
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
                                                // console.log(item, "Role Type");

                                                return (
                                                    <MenuItem key={`${item.id}_${item.userType}`} value={item?.id}>{item?.userType}</MenuItem>
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
                    <Box component='div' sx={{ width: { xs: '100%', sm: '75%' } }} >
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
                                        <Grid item >
                                            <Typography variant='body2'>{permission.desc} </Typography>
                                        </Grid>
                                        <Grid item>
                                            <ToggleButtonGroup

                                                value={isPermissionSelected ? 'yes' : 'no'}
                                                exclusive
                                                onChange={(event) => handleAlignment(event, index)}
                                                aria-label="text alignment"
                                                key={permission.permission_id}
                                            >
                                                <ToggleButton className='theme-toggle-yes' value="yes" sx={{ fontSize: '0.875rem' }}>
                                                    Yes
                                                </ToggleButton>
                                                <ToggleButton className='theme-toggle-no' value="no" sx={{ fontSize: '0.875rem' }}>
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
