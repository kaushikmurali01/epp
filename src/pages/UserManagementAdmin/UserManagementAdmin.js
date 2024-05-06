import React, { useEffect,useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_MANAGEMENT_ADMIN_COLUMN } from '../../utils/tableColumn/userManagementAdminColumn';
import Table from 'components/Table';
import { Box, Button, Container, FormControl, FormGroup, FormLabel, Grid, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import EvModal from 'utils/modal/EvModal';
import SelectBox from 'components/FormBuilder/Select';
import { Form, Formik } from 'formik';
import ButtonWrapper from 'components/FormBuilder/Button';
import { GET_REQUEST, POST_REQUEST } from 'utils/HTTPRequests';
import { USER_MANAGEMENT } from 'constants/apiEndPoints';
import { SnackbarContext } from '../../utils/notification/SnackbarProvider';
import InviteUserAdmin from './InviteUserAdmin';
import NotificationsTost from 'utils/notification/NotificationsTost';

const UserManagementAdmin = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);

  const [getAllUser, setAllUser] = useState([]);
  const [getUserRole, setUserRole] = useState([]);
  const [isVisibleInvitePage, setVisibleInvitePage] = useState(false);
  const [getCompanyList, setCompanyList] = useState([]);
  const [tabValue, setTabValue] = useState('enervaUsers');
  const [selectRoleType, setSelectRoleType] = useState('');

  // need to call this function before USER_MANAGEMENT_ADMIN_COLUMN
  const handleAPISuccessCallBack = () => {
    // Call the API to get all user data
    getUserManagementData();
};
  const columns = useMemo(() => USER_MANAGEMENT_ADMIN_COLUMN(handleAPISuccessCallBack,setVisibleInvitePage), []);

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

  
 

  const getUserManagementData = () => {
    const apiURL = "https://enervauser.azurewebsites.net/api/enerva/0/100"
    // const apiURL = USER_MANAGEMENT.GET_USER_LIST+'/1/10/1';
    GET_REQUEST(apiURL)
        .then((res) => {
          setAllUser(res.data?.body?.users)
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
  getUserManagementData();
  getUserRoleData()
  getComapanyListData()
}, [])


  return (
    <React.Fragment>
      {isVisibleInvitePage ? 
        <InviteUserAdmin getUserRole={getUserRole} setVisibleInvitePage={setVisibleInvitePage} /> : 
        
          <Box component="section">
            <Container maxWidth="lg">
              <Grid container sx={{ paddingTop: '1.5rem', justifyContent: 'space-between',  }} >
                <Grid item xs={12} md={6} >
                  <Typography variant='h4' sx={{marginBottom: '0.5rem'}}>User Management </Typography>
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

              <Grid container sx={{ alignItems: "center", justifyContent: 'space-between', marginTop: '2rem', marginBottom: '3rem' }}>
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
                    <Tab value="aggregatorUsers" label="Aggregator Users" sx={{ minWidth: '12rem' }} />
                  </Tabs>
                </Grid>
               
              </Grid>

              <Grid container>
               {getAllUser &&  <Table columns={columns} data={getAllUser} headbgColor="#D9D9D9" /> }
              </Grid>
            </Container>
          </Box >
      }
    
     </React.Fragment>
  )
}

export default UserManagementAdmin;
