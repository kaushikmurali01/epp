import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, FormGroup, FormLabel, Grid, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { emailRegExp } from 'config/regex';
import { GET_REQUEST, POST_REQUEST } from 'utils/HTTPRequests';
import { ENERVA_USER_MANAGEMENT, USER_MANAGEMENT } from 'constants/apiEndPoints';
import NotificationsTost from 'utils/notification/NotificationsTost';


const InviteUserAdmin = ({ getUserRole, setVisibleInvitePage, invitePageInfo, handleAPISuccessCallBack }) => {
    const navigate = useNavigate();

    const [alignment, setAlignment] = useState('yes');
    const [userEmail, setUserEmail] = useState('');
    const [selectRoleType, setSelectRoleType] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [permissions, setPermission] = useState([])
    const [selectedPermissions, setSelectedPermissions] = useState([]);



    const handleSelectChange = (event) => {
        setSelectRoleType(event.target.value);
    };
    const handelEmailSelectChange = (event) => {
        setUserEmail(event.target.value)
    }



    // const handleAlignment = (event, index) => {
    //     setPermissionStates((prevStates) => {
    //         const newStates = [...prevStates];
    //         newStates[index] = !newStates[index];
    //         return newStates;
    //     });
    // };
    const handleAlignment = (event, index) => {
        setPermissionStates((prevStates) => {
          const newStates = [...prevStates];
          newStates[index] = !newStates[index];
      
          // Update selectedPermissions based on the new state
          if (newStates[index]) {
            setSelectedPermissions((prevSelectedPermissions) => [
              ...prevSelectedPermissions,
              permissions[index],
            ]);
          } else {
            setSelectedPermissions((prevSelectedPermissions) =>
              prevSelectedPermissions.filter(
                (permission) => permission.permission_id !== permissions[index].permission_id
              )
            );
          }
      
          return newStates;
        });
      };

    const getPermissionList = (permission_id) => {
        const apiURL = ENERVA_USER_MANAGEMENT.GET_PERMISSIONS_BY_ROLE_ID+ '/' + permission_id;
        console.log(apiURL, "getPermissionList")
        GET_REQUEST(apiURL)
            .then((res) => {
                setPermission(res.data)
                setPermissionStates(res.data.map((permission) => permission.is_assigned));
            }).catch((error) => {
                console.log(error)
            });

    }


    const [permissionStates, setPermissionStates] = useState(
        permissions.map(() => false)
    );

    const handelInviteSubmit = ()=> {
        // const apiURL = ENERVA_USER_MANAGEMENT;
        const apiURL = 'https://enervauser.azurewebsites.net/api/send';
        const permissionIds = selectedPermissions.map(permission => permission.permission_id);
        const requestBody = {
            "email": userEmail,
            "role": selectRoleType,
            "company": "1", // comapnay id is static right now.
            "permissions": permissionIds,
            "type": invitePageInfo.type
        }


        console.log(requestBody, apiURL, "requestBody");
        // return;

        POST_REQUEST(apiURL, requestBody)
            .then((response) => {
                console.log(response, "response")
                NotificationsTost({ message: response?.data?.message, type: "success" });
                setVisibleInvitePage(false);
                handleAPISuccessCallBack();
            })
            .catch((error) => {
                console.log(error, 'error')
                NotificationsTost({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });

            })
    }

    useEffect(() => {
        const isValidEmail = emailRegExp.test(userEmail)
        setIsFormValid(isValidEmail && selectRoleType !== '')
        console.log(isValidEmail)
    }, [userEmail, selectRoleType])


  useEffect(() => {
    if (selectRoleType) {
        setPermissionStates([]); // Reset permissionStates
        setSelectedPermissions([]); // Reset selectedPermissions
        getPermissionList(selectRoleType);
    }
}, [selectRoleType]);

    // console.log(selectRoleType, userEmail, isFormValid, "selectRoleType")
    console.log('Selected Permissions:', selectedPermissions);
    console.log("permissions:", permissions)


    return (
        <Box component="section" sx={{ padding: { xs: '1rem', md: '4rem' } }}>

            <Container maxWidth="lg">
                <Grid container sx={{ justifyContent: 'space-between', marginBottom: '2rem' }} >
                    <Grid item xs={12} >
                        <Typography variant='h4'>{invitePageInfo.title}</Typography>
                        
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
                                >
                                    <MenuItem value="">
                                        Select
                                    </MenuItem>
                                    {getUserRole && (getUserRole).map((item) => {
                                        return (
                                            <MenuItem key={item.id} value={item?.id}>{item?.rolename}</MenuItem>
                                        )
                                    })}

                                </Select>

                            </FormControl>

                        </FormGroup>
                    </Grid>
                    <Grid item >
                        <Button
                            color="primary"
                            variant="contained"
                            sx={{ alignSelf: 'center' }}
                            onClick={() => handelInviteSubmit()}
                            disabled={!isFormValid}
                        >
                            Send Invite
                        </Button>
                    </Grid>
                </Grid>

                {permissions?.length > 0 ?
                    <Box component='div' >
                        <Grid container md={8} sx={{ justifyContent: 'space-between', marginTop: '2rem' }}>
                            <Grid item>
                                <Typography variant='small'>List of Permissions</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant='small'>Toggle to grant</Typography>
                            </Grid>
                        </Grid>
                        <Stack>
                            {permissions && permissions.map((permission, index) => {
                                return (
                                    <Grid key={permission.permission_id} container md={8} sx={{ justifyContent: 'space-between', marginTop: '2rem' }}>
                                        <Grid item >
                                            <Typography variant='body2'>{permission.desc} </Typography>
                                        </Grid>
                                        <Grid item>
                                            <ToggleButtonGroup

                                                value={permissionStates[index] ? 'yes' : 'no'}
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
                        <Grid container md={12} sx={{ justifyContent: 'center', padding: '5rem 0' }}>
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

export default InviteUserAdmin
