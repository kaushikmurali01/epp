import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, FormGroup, FormLabel, Grid, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';


const InviteUser = () => {
    const navigate = useNavigate();

    const [alignment, setAlignment] = useState('left');

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const roleType = [
        {
            permissionRoleType: 'Super Admin',
            key: '1',
        },
        {
            permissionRoleType: 'Sub-Admin',
            key: '2',
        },
        {
            permissionRoleType: 'Employee',
            key: '3',
        },
        {
            permissionRoleType: 'Consultant',
            key: '4',
        },
        {
            permissionRoleType: 'Account Manager',
            key: '5',
        },
    ]

    const permissions = [
        {
            key: '1',
            title: 'Adding Other Users on the website ',
            status: true

        },
        {
            key: '2',
            title: 'Grant/Revoke access to/from other users ',
            status: false

        }, {
            key: '3',
            title: 'Profile Information Update and Password Reset ',
            status: true

        }, {
            key: '4',
            title: 'Bind the company ',
            status: false

        }, {
            key: '5',
            title: 'Account/Portfolio Data Visualizations',
            status: true

        }, {
            key: '6',
            title: 'Building/Facility ',
            status: true

        }, {
            key: '7',
            title: 'Doing Building/Facility Data  ',
            status: false

        }, {
            key: '8',
            title: 'Building/Facility Data Visualizations ',
            status: false

        }, {
            key: '9',
            title: 'Baseline Energy Modelling ',
            status: false

        }, {
            key: '10',
            title: 'Energy Savings Calculation ',
            status: false

        }, {
            key: '11',
            title: 'Viewing Incentive Payment Calculation',
            status: false

        }, {
            key: '12',
            title: 'Viewing In-Situ Benchmarking ',
            status: true

        }, {
            key: '13',
            title: 'ENERGY STAR Benchmarking',
            status: true

        }, {
            key: '14',
            title: 'Viewing and Exporting EWRB Report ',
            status: true

        },
    ]
    return (
        <Box component="section" sx={{ padding: {xs: '1rem', md: '4rem'}}}>

            <Container maxWidth="lg">
                <Grid container sx={{ justifyContent: 'space-between', marginBottom: '2rem' }} >
                    <Grid item xs={12} >
                        <Typography variant='h4'>Invite user and set permissions</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between', }}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <FormGroup className='theme-form-group'>
                            <FormLabel sx={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}> Business Email* </FormLabel>
                            <FormControl className='theme-form-control'>
                                <TextField
                                    placeholder="Business Email"
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup className='theme-form-group'>
                            <FormControl sx={{ width: "100%", }} >
                                <FormLabel sx={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Role Type</FormLabel>
                                {/* <TextField >
                                    {roleType && (roleType).map((item) => {
                                        console.log(item, "check role")
                                        return (
                                            <MenuItem key={item?.key} value={item?.permissionRoleType}>
                                                {item?.permissionRoleType}
                                            </MenuItem>
                                        )
                                    })}
                                </TextField> */}
                                <Select
                                    // value={age}
                                    label="Age"
                                    sx={{ minHeight: '3.85rem', minWidth: '12rem' }}

                                // onChange={handleChange}
                                >
                                    {roleType && (roleType).map((item) => {
                                        console.log(item, "check role")
                                        return (
                                            <MenuItem key={item?.key} value={item?.permissionRoleType}  >
                                                {item?.permissionRoleType}
                                            </MenuItem>
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
                            onClick={() => navigate('usermanagement/invite')}
                        >
                            Send Invite
                        </Button>
                    </Grid>
                </Grid>

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
                        {permissions && permissions.map((permission) => {
                            return (
                                <Grid container md={8} sx={{ justifyContent: 'space-between', marginTop: '2rem' }}>
                                        <Grid item key={permission.key}>
                                            <Typography variant='body2'>{permission.title} </Typography>
                                        </Grid>
                                        <Grid item>
                                            <ToggleButtonGroup
                                                value={alignment}
                                                exclusive
                                                onChange={handleAlignment}
                                                aria-label="text alignment"

                                            >
                                                <ToggleButton value="left"  sx={{ fontSize: '0.875rem' }}>
                                                    Yes
                                                </ToggleButton>
                                                <ToggleButton value="center" sx={{ fontSize: '0.875rem' }}>
                                                    No
                                                </ToggleButton>

                                            </ToggleButtonGroup>

                                        </Grid>
                                </Grid>
                            )
                        })}
                    </Stack>
                </Box>

            </Container >
        </Box >
    )
}

export default InviteUser
