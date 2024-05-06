import React, { useEffect, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENERVA_USER_MANAGEMENT_ADMIN_COLUMN } from '../../utils/tableColumn/useerManagement/admin/enervaUserManagementAdminColumn';
import Table from 'components/Table';
import { Box, Button, Container, FormControl, FormGroup, IconButton, Grid, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import EvModal from 'utils/modal/EvModal';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import ButtonWrapper from 'components/FormBuilder/Button';
import { GET_REQUEST, POST_REQUEST } from 'utils/HTTPRequests';
import { USER_MANAGEMENT } from 'constants/apiEndPoints';
import { SnackbarContext } from '../../utils/notification/SnackbarProvider';
import InviteUserAdmin from './InviteUserAdmin';
import NotificationsTost from 'utils/notification/NotificationsTost';
import { IESO_USER_MANAGEMENT_ADMIN_COLUMN } from 'utils/tableColumn/useerManagement/admin/iesoUserManagementAdminColumn';
import { CUSTOMER_USER_MANAGEMENT_ADMIN_COLUMN } from 'utils/tableColumn/useerManagement/admin/customerUserManagementAdminColumn';
import { AGGREGATOR_USER_MANAGEMENT_ADMIN_COLUMN } from 'utils/tableColumn/useerManagement/admin/aggregatorUserManagementAdminColumn';

const UserManagementAdmin = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);

  // tabs table data
  const [getEnervaUser, setEnervaUser] = useState([]);
  const [getIesoUser, setIesoUser] = useState([]);
  const [getCustomerUser, setCustomerUser] = useState([]);
  const [getAggregatorUser, setAggregatorUser] = useState([]);

  const [getUserRole, setUserRole] = useState([]);
  const [isVisibleInvitePage, setVisibleInvitePage] = useState(false);
  const [getCompanyList, setCompanyList] = useState([]);
  const [tabValue, setTabValue] = useState('enervaUsers');
  const [selectRoleType, setSelectRoleType] = useState('');
  const [invitePageInfo, setInvitePageInfo] = useState({});
  // need to call this function before USER_MANAGEMENT_ADMIN_COLUMN
  const handleAPISuccessCallBack = () => {
    // Call the API to get all user data
    getEnervaUserManagementData();
    getIESOUserManagementData();
    getCustomerUserManagementData();
    getAggregatorUserManagementData();
  };
  const enervaUsersColumns = useMemo(() => ENERVA_USER_MANAGEMENT_ADMIN_COLUMN(handleAPISuccessCallBack, setVisibleInvitePage), []);
  const iesoUsersColumns = useMemo(() => IESO_USER_MANAGEMENT_ADMIN_COLUMN(handleAPISuccessCallBack, setVisibleInvitePage), []);
  const customerUsersColumns = useMemo(() => CUSTOMER_USER_MANAGEMENT_ADMIN_COLUMN(handleAPISuccessCallBack, setVisibleInvitePage), []);
  const aggregatorUsersColumns = useMemo(() => AGGREGATOR_USER_MANAGEMENT_ADMIN_COLUMN(handleAPISuccessCallBack, setVisibleInvitePage), []);

  const initialValues = {
    company: '',
    role: '',
  };




  const handleSelectChange = (event) => {
    setSelectRoleType(event.target.value);
  };


  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };


  const handleAddUser = () => {
    setVisibleInvitePage(true);
    if (tabValue === 'enervaUsers') {
      setInvitePageInfo({
        title: 'Invite Enerva User and set permissions',
        type: '1'
      })
    } else if (tabValue === 'iesoUsers') {
      setInvitePageInfo({
        title: 'Invite IESO User and set permissions',
        type: '4'
      })
    }
    else if (tabValue === 'customerUsers') {
      setInvitePageInfo({
        title: 'Invite Customer User and set permissions',
        type: '2'
      })

    } else {
      setInvitePageInfo({
        title: 'Invite Aggregator User and set permissions',
        type: '5'
      })
    }


  }

  const  getTabTitle = (tabValue)=> {
    let data;

    switch (tabValue) {
        case 'enervaUsers':
            data = {
              title: "All Users",
              type: '1'
            }
            break;
        case 'iesoUsers':
            data = {
              title: "All IESO Users",
              type: '4'
            }
            break;
        case 'customerUsers':
            data = {
              title: "All Customers",
              type: '2'
            }
            break;
        case 'aggregatorUsers':
            data = {
              title: "List of Aggregators",
              type: '4' // this type {4} will be use for  new users 
            }
            break;
        default:
            data = {
              title: "Unknown Tab",
              type: '5'
            }
            break;
    }

    return data;
}


  const getEnervaUserManagementData = () => {
    const apiURL = "https://enervauser.azurewebsites.net/api/enerva/0/100"
    // const apiURL = USER_MANAGEMENT.GET_USER_LIST+'/1/10/1';
    GET_REQUEST(apiURL)
      .then((res) => {
        setEnervaUser(res.data?.body?.users)
      }).catch((error) => {
        console.log(error)
      });
  }
  const getIESOUserManagementData = () => {
    const apiURL = "https://enervauser.azurewebsites.net/api/ieso/0/100"
    // const apiURL = USER_MANAGEMENT.GET_USER_LIST+'/1/10/1';
    GET_REQUEST(apiURL)
      .then((res) => {
        setIesoUser(res.data?.body?.users)
      }).catch((error) => {
        console.log(error)
      });
  }
  const getCustomerUserManagementData = () => {
    const apiURL = "https://enervauser.azurewebsites.net/api/customer/0/100"
    // const apiURL = USER_MANAGEMENT.GET_USER_LIST+'/1/10/1';
    GET_REQUEST(apiURL)
      .then((res) => {
        setCustomerUser(res.data?.body?.users)
      }).catch((error) => {
        console.log(error)
      });
  }

  const getAggregatorUserManagementData = () => {
    const apiURL = "https://enervauser.azurewebsites.net/api/enerva/0/100"
    // const apiURL = USER_MANAGEMENT.GET_USER_LIST+'/1/10/1';
    GET_REQUEST(apiURL)
      .then((res) => {
        setAggregatorUser(res.data?.body?.users)
      }).catch((error) => {
        console.log(error)
      });
  }

  const getUserRoleData = () => {
    const apiURL = USER_MANAGEMENT.GET_USER_ROLE
    GET_REQUEST(apiURL)
      .then((res) => {
        setUserRole(res.data?.body)
      }).catch((error) => {
        console.log(error)
      });
  }

  const getComapanyListData = () => {
    const apiURL = USER_MANAGEMENT.GET_COMPANY_LIST
    GET_REQUEST(apiURL)
      .then((res) => {
        setCompanyList(res.data)
      }).catch((error) => {
        console.log(error)
      });
  }

  useEffect(() => {
    // load all default function on page load
    getEnervaUserManagementData();
    getIESOUserManagementData();
    getCustomerUserManagementData();
    getAggregatorUserManagementData();

    // other get values functions
    getUserRoleData()
    getComapanyListData()
  }, [])


  console.log(tabValue, "tabValue")


  return (
    <React.Fragment>
      {isVisibleInvitePage ?
        <InviteUserAdmin getUserRole={getUserRole} setVisibleInvitePage={setVisibleInvitePage} invitePageInfo={invitePageInfo} handleAPISuccessCallBack={handleAPISuccessCallBack} /> :

        <Box component="section">
          <Container maxWidth="lg">
            <Grid container sx={{ paddingTop: '1.5rem', justifyContent: 'space-between', }} >
              <Grid item xs={12} md={6} >
                <Typography variant='h4' sx={{ marginBottom: '0.5rem' }}>User Management </Typography>
                <Typography variant='body2'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
                <FormGroup sx={{ flexGrow: '1' }}>
                  <FormControl fullWidth sx={{ bgcolor: '#fff', borderRadius: '8px', padding: '0.5rem 0', color: 'dark.main' }}>
                    <TextField
                      placeholder="Search by Username & ID"
                      inputProps={{ style: { color: '#242424', fontSize: '1rem' } }}
                    />
                  </FormControl>
                </FormGroup>

                <FormGroup className='theme-form-group'>

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

            </Grid>

            <Grid container sx={{ alignItems: "center", justifyContent: 'space-between', marginTop: '2rem', marginBottom: '2rem' }}>
              <Grid item xs={12} md={8} >
                <Tabs
                  className='theme-tabs-list'
                  value={tabValue}
                  onChange={handleChange}
                  sx={{ display: 'inline-flex' }}


                >
                  <Tab value="enervaUsers" label="Enerva Users" sx={{ minWidth: '12rem' }} />
                  <Tab value="iesoUsers" label="IESO Users" sx={{ minWidth: '12rem' }} />
                  <Tab value="customerUsers" label="Customer Users" sx={{ minWidth: '12rem' }} />
                  <Tab value="aggregatorUsers" label="Aggregator Users" sx={{ minWidth: '12rem' }} disabled />
                </Tabs>
              </Grid>

            </Grid>

            <Grid container>
              <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', paddingBottom: '2rem' }}>
                <Grid item sx={{}}>
                  <Typography variant='h4' sx={{}} >
                   {getTabTitle(tabValue).title}
                  </Typography>
                </Grid>
                <Grid item sx={{ justifySelf: 'flex-end' }}>
                  <Typography variant='small' sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => handleAddUser()} >
                    Add User
                    <IconButton>

                      <AddCircleIcon
                        sx={{
                          color: "text.primary",
                          fontSize: "1.875rem",
                        }}
                      />
                    </IconButton>
                  </Typography>
                </Grid>

              </Grid>
              {(getEnervaUser && tabValue === 'enervaUsers') &&
                  <Table columns={enervaUsersColumns} data={getEnervaUser} headbgColor="#D9D9D9" />
              }
              {(getIesoUser && tabValue === 'iesoUsers') && <Table columns={iesoUsersColumns} data={getIesoUser} headbgColor="#D9D9D9" />}
              {(getCustomerUser && tabValue === 'customerUsers') && <Table columns={customerUsersColumns} data={getCustomerUser} headbgColor="#D9D9D9" />}
              {(getAggregatorUser && tabValue === 'aggregatorUsers') && <Table columns={aggregatorUsersColumns} data={getAggregatorUser} headbgColor="#D9D9D9" />}
            </Grid>
          </Container>
        </Box >
      }

    </React.Fragment>
  )
}

export default UserManagementAdmin;
