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

      <Container maxWidth="lg">
        <Grid container sx={{ paddingTop: '1.5rem', justifyContent: 'space-between' }} >
          <Grid item xs={12} md={4} >
            <Typography variant='h4'>User Management</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
            <FormGroup sx={{ flexGrow: '1' }}>
              <FormControl fullWidth sx={{ bgcolor: '#fff', borderRadius: '8px', padding: '0.5rem 0', color: 'dark.main' }}>
                <TextField
                  placeholder="Search"
                  inputProps={{ style: { color: '#242424', fontSize: '1rem' } }}
                />
              </FormControl>
            </FormGroup>

            <Button
              color="primary"
              variant="contained"
              sx={{ alignSelf: 'center' }}

            >
              Invite User
            </Button>
          </Grid>

        </Grid>

        <Grid container sx={{ alignItems: "center", justifyContent: 'space-between', marginTop: '1rem', marginBottom: '3rem' }}>
          <Grid item xs={12} md={8} >
            <Tabs
              // className='theme-tabs-list'
              value={tabValue}
              onChange={handleChange}
            // textColor="dark.main"
            // indicatorColor="secondary"
            >
              <Tab value="allUsers" label="All Users" sx={{ minWidth: '10rem' }} />
              <Tab value="invitationSent" label="Invitation Sent" sx={{ minWidth: '10rem' }} />
              <Tab value="request" label="Requestt" sx={{ minWidth: '10rem' }} />
            </Tabs>
          </Grid>
          <Grid item sx={{ justifySelf: 'flex-end' }}>
            <Typography variant='small' sx={{ color: 'blue.main', cursor: 'pointer' }}>
              Request to join other company
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Table columns={columns} data={data} headbgColor="#D9D9D9"/>
        </Grid>
      </Container>
    </Box >
  )
}

export default UserManagement
