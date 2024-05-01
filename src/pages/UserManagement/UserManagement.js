import React, { useMemo } from 'react';
import { USER_MANAGEMENT_COLUMN } from '../../utils/tableColumn/userManagementColumn';
import Table from 'components/Table';
import { Box, Button, Container, FormControl, FormGroup, Grid, IconButton, InputBase, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
const UserManagement = () => {
  const [tabValue, setTabValue] = React.useState('allUsers');
  const columns = useMemo(() => USER_MANAGEMENT_COLUMN, []);
  const data = [
    {
      name: "Jane Cooper",
      email: "Jane.cooper@dummy.com",
      Facility: 'Facility 1',
      RoleType: 'Employee',

    },
    {
      name: "Lois Lane",
      email: "lois.lane@dummy.com",
      Facility: 'Facilit 2',
      RoleType: 'Account Manager',

    },
    {
      name: "Clark Kent",
      email: "clark.kent@dummy.com",
      Facility: 'Facility 3',
      RoleType: 'Sub Admin',

    },
    {
      name: "Henry Higgins",
      email: "henry.higgins@dummy.com",
      Facility: 'Facility 4',
      RoleType: 'Admin',

    },
    {
      name: "Jane Cooper 2",
      email: "Jane.cooper2@dummy.com",
      Facility: 'Facility 5',
      RoleType: 'Employee',

    },
    {
      name: "Jane Cooper 3",
      email: "Jane.cooper3@dummy.com",
      Facility: 'Facility 6',
      RoleType: 'Employee',

    },
    {
      name: "Jane Cooper 4",
      email: "Jane.cooper4@dummy.com",
      Facility: 'Facility 7',
      RoleType: 'Employee',

    },
  ];

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box component="section">
      <Grid>
        <Container maxWidth="lg">
          <Grid container sx={{ paddingTop: '1.5rem' }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h4'>User Management</Typography>
              <Button variant="contained" color="success">
                Invite User
              </Button>

            </Grid>
            <Grid item xs={12} sx={{marginTop: '1rem'}}>
              <Tabs
                className='theme-tabs-list'
                value={tabValue}
                onChange={handleChange}
                textColor="dark.main"
              // indicatorColor="secondary"
              >
                <Tab value="allUsers" label="All Users" sx={{ minWidth: '16rem' }} />
                <Tab value="invitationSent" label="Invitation Sent" sx={{ minWidth: '16rem' }} variant />
              </Tabs>
            </Grid>

          </Grid>
        </Container>
      </Grid>

      <Grid sx={{ marginTop: '2rem', backgroundColor: 'primary.thinGrayLight', padding: '1.5rem 0' }}>
        <Container maxWidth="lg">
          <Grid container >
            <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Filter By:
              </Typography>
              <Grid sx={{ display: 'flex', alignItems: 'center', marginLeft: '3rem', gap: '2rem' }} >
                <Grid item>
                  <FormGroup className='theme-form-group'>


                    <FormControl fullWidth >
                      <Select
                        value=""
                        displayEmpty
                        renderValue={(value) => (value ? value : 'Facility')}
                        sx={{ bgcolor: '#fff' }}
                      >
                        <MenuItem value="">Facility</MenuItem>
                        <MenuItem value="facility1">Facility 1</MenuItem>
                        <MenuItem value="facility2">Facility 2</MenuItem>
                      </Select>
                    </FormControl>
                  </FormGroup>
                </Grid>
                <Grid item>
                  <FormGroup className='theme-form-group'>
                    <FormControl>
                      <Select
                        value=""
                        displayEmpty
                        renderValue={(value) => (value ? value : 'Role')}
                        sx={{ bgcolor: '#fff' }}
                      >
                        <MenuItem value="">Role</MenuItem>
                        <MenuItem value="role1">Role 1</MenuItem>
                        <MenuItem value="role2">Role 2</MenuItem>
                      </Select>
                    </FormControl>
                  </FormGroup>
                </Grid>
                <Grid item>
                  <Typography variant='span' sx={{ color: 'primary.main' }}>
                    Clear Filter
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ bgcolor: '#fff', borderRadius: '8px', padding: '0.5rem 0', color: 'dark.main' }}>
                <InputBase
                  placeholder="Search by name and email"
                  inputProps={{ style: { color: '#242424' } }}
                  startAdornment={
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        </Container>
      </Grid>

      <Grid>
        <Container maxWidth="lg">
          <Grid container>
            <Table columns={columns} data={data} />
          </Grid>
        </Container>
      </Grid>



    </Box >
  )
}

export default UserManagement
