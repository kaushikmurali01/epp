import React, { useEffect,useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from 'components/Table';
import { Box, Button, Container, FormControl, FormGroup, Grid, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import EvModal from 'utils/modal/EvModal';
import SelectBox from 'components/FormBuilder/Select';
import { Form, Formik } from 'formik';
import ButtonWrapper from 'components/FormBuilder/Button';
import { GET_REQUEST, POST_REQUEST } from 'utils/HTTPRequests';
import { USER_MANAGEMENT } from 'constants/apiEndPoints';
import { SnackbarContext } from '../../utils/notification/SnackbarProvider';
import InviteUser from './InviteUser';
import NotificationsTost from 'utils/notification/NotificationsTost';
import UserManagementColumn from 'utils/tableColumn/useerManagement/userManagementColumn';

const UserManagement = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  // pull functions from user management..
  const {USER_MANAGEMENT_COLUMN_ACTION} = UserManagementColumn()

  const [getAllUser, setAllUser] = useState([]);
  const [getUserRole, setUserRole] = useState([]);
  const [isVisibleInvitePage, setVisibleInvitePage] = useState(false);
  const [getCompanyList, setCompanyList] = useState([]);
  const [tabValue, setTabValue] = useState('allUsers');
  const [selectTaleRow, setSelectTableRow] = useState({});
  

  // need to call this function before USER_MANAGEMENT_COLUMN
  const handleAPISuccessCallBack = () => {
    // Call the API to get all user data
    getUserManagementData();
};
  const columns = useMemo(() => USER_MANAGEMENT_COLUMN_ACTION(handleAPISuccessCallBack,setVisibleInvitePage,setSelectTableRow), []);

  const initialValues = {
    company: '',
    role: '',
  };

  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
      headerTextStyle: { color: 'rgba(84, 88, 90, 1)' },
      headerSubTextStyle: { marginTop: '1rem', color: 'rgba(36, 36, 36, 1)', fontSize: { md: '0.875rem' } },
      fotterActionStyle: "",
      modalBodyContentStyle: ''
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Sent Request",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",

    },
    headerText: "Request to join other company",
    headerSubText: 'Please enter the following details to send request to join other company',
    modalBodyContent: "",
  });

 
  

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const RequestToJoinForm = () => {
    const formSubmit = (data) => {
      const apiURL = USER_MANAGEMENT.JOIN_REQUEST;
      const requestBody = {
        "company_id": data.company.toString(),
        "role": data.role.toString(),
        "user_id": "1"
    }

   
    POST_REQUEST(apiURL, requestBody)
    .then((response) => {
      handleAPISuccessCallBack();
        NotificationsTost({ message: "Your form has been submitted!", type: "success" });
        setModalConfig((prevState) => ({
          ...prevState,
          modalVisible: false,
          modalBodyContent: ''
        }));
        
    })
    .catch((error) => {
        console.log(error, 'error')
        NotificationsTost({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
       

    })

    }

    return (
      <Formik
        initialValues={{
          ...initialValues
        }}
        // validationSchema={}
        onSubmit={formSubmit}
      >
        <Form >
          <Stack sx={{ marginBottom: '1rem' }}>
            {/* <SelectBox name="company" label="Company name" options={getUserRole} /> */}
            <SelectBox name="company" label="Company name" options={getCompanyList} valueKey="id" labelKey="company_name" />
          </Stack>
          <Stack sx={{ marginBottom: '1rem' }}>
            <SelectBox name="role" label="Role" options={getUserRole} valueKey="id" labelKey="rolename" />
          </Stack>



          {/* <SelectBox /> */}
          <Grid display="flex" sx={{ marginTop: '1rem' }}>
            <ButtonWrapper type="submit" variant="contained"  >
              Submit
            </ButtonWrapper>

          </Grid>
        </Form>
      </Formik>
    )
  }

  const openRequestModal = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <RequestToJoinForm />
    }));
  }

  const getUserManagementData = () => {
    // const apiURL = "https://enervauser.azurewebsites.net/api/combinedusers/0/100/1"
    const apiURL = USER_MANAGEMENT.GET_USER_LIST+'/0/100/1';
    GET_REQUEST(apiURL)
        .then((res) => {
          setAllUser(res.data?.body)
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
        <InviteUser 
        getUserRole={getUserRole} setVisibleInvitePage={setVisibleInvitePage} 
        isVisibleInvitePage={isVisibleInvitePage}
        handleAPISuccessCallBack={handleAPISuccessCallBack} 
        selectTaleRow={selectTaleRow}
        /> : 
        
          <Box component="section">
            <Container maxWidth="lg">
              <Grid container sx={{ justifyContent: 'space-between' }} >
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
                    onClick={() => {setVisibleInvitePage(true); setSelectTableRow({}); }}
                  >
                    Invite User
                  </Button>
                </Grid>

              </Grid>

              <Grid container sx={{ alignItems: "center", justifyContent: 'space-between', marginTop: '1rem', marginBottom: '3rem' }}>
                <Grid item xs={12} md={8} >
                  <Tabs
                    className='theme-tabs-list'
                    value={tabValue}
                    onChange={handleChange}
                    sx={{ display: 'inline-flex' }}


                  >
                    <Tab value="allUsers" label="All Users" sx={{ minWidth: '10rem' }} />
                    {/* <Tab value="invitationSent" label="Invitation Sent" sx={{ minWidth: '10rem' }} />
                    <Tab value="request" label="Requestt" sx={{ minWidth: '10rem' }} /> */}
                  </Tabs>
                </Grid>
                <Grid item sx={{ justifySelf: 'flex-end' }}>
                  <Typography variant='small' sx={{ color: 'blue.main', cursor: 'pointer' }} onClick={openRequestModal}>
                    Request to join other company
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
               {getAllUser &&  <Table columns={columns} data={getAllUser} headbgColor="#D9D9D9" /> }
              </Grid>
            </Container>

            <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
          </Box >
      }
    
     </React.Fragment>
  )
}

export default UserManagement
