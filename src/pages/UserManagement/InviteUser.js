import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, FormGroup, FormLabel, Grid, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { emailRegExp } from 'config/regex';
import { GET_REQUEST, POST_REQUEST } from 'utils/HTTPRequests';
import { USER_MANAGEMENT } from 'constants/apiEndPoints';
import NotificationsTost from 'utils/notification/NotificationsTost';


const InviteUser = ({ getUserRole, setVisibleInvitePage }) => {
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
        const apiURL = USER_MANAGEMENT.GET_DEFAULT_PERMISSIONS_BY_ROLE_ID + '/' + permission_id;
        console.log(apiURL, "getPermissionList")
        GET_REQUEST(apiURL)
            .then((res) => {
                setPermission(res.data)
                setPermissionStates(res.data.map((permission) => permission.is_assigned));
            }).catch((error) => {
                console.log(error)
            });

    }

    // const permissions = [
    //     {
    //         "permission_id": 1,
    //         "desc": "Adding other users on the website",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 2,
    //         "desc": "Grant/Revoke Access to/from other users",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 3,
    //         "desc": "Profile Information Update and Password Reset",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 4,
    //         "desc": "Bind the Company",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 5,
    //         "desc": "Account Portfolio and Data Visualizations",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 6,
    //         "desc": "Building/Facility",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 7,
    //         "desc": "Doing Building Facility Data",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 8,
    //         "desc": "Building/Facility Data Visualizations",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 9,
    //         "desc": "Baseline Energy Modelling",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 10,
    //         "desc": "Energy Savings Calculations",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 11,
    //         "desc": "Viewing Incentive Payment Calculations",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 12,
    //         "desc": "Viewing In-Situ Benchmarking",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 13,
    //         "desc": "Energy Start Benchmarking",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 14,
    //         "desc": "Viewing and Exporting EWRB Report",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 15,
    //         "desc": "Green Button Data Integration",
    //         "is_assigned": false
    //     },
    //     {
    //         "permission_id": 16,
    //         "desc": "Financial Details",
    //         "is_assigned": false
    //     }
    // ]


    const [permissionStates, setPermissionStates] = useState(
        permissions.map(() => false)
    );

    const handelInviteSubmit = ()=> {
        const apiURL = USER_MANAGEMENT.SEND_INVITATION_BY_ADMIN;
        const permissionIds = selectedPermissions.map(permission => permission.permission_id);
        const requestBody = {
            "email": userEmail,
            "role": selectRoleType,
            "company": "1", // comapnay id is static right now.
            "permissions": permissionIds
        }


        console.log(requestBody, apiURL, "requestBody");

        POST_REQUEST(apiURL, requestBody)
            .then((response) => {
                console.log(response, "response")
                NotificationsTost({ message: "Your form has been submitted!", type: "success" });
                setVisibleInvitePage(false);
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
                        <Typography variant='h4'>Invite user and set permissions</Typography>
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

export default InviteUser
