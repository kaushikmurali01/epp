import React, { useEffect, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from 'components/Table';
import { Box, Button, Container, FormControl, FormGroup, IconButton, Grid, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { GET_REQUEST } from 'utils/HTTPRequests';
import { ENERVA_USER_MANAGEMENT, USER_MANAGEMENT } from 'constants/apiEndPoints';
import ClearIcon from '@mui/icons-material/Clear';
import debounce from "lodash.debounce";

import { AGGREGATOR_USER_MANAGEMENT_ADMIN_COLUMN } from 'utils/tableColumn/useerManagement/admin/aggregatorUserManagementAdminColumn';
import InviteUser from 'pages/UserManagement/InviteUser';
import EvModal from 'utils/modal/EvModal';

import EnvervaUserManagementColumn from 'utils/tableColumn/useerManagement/admin/enervaUserManagementAdminColumn';
import CustomerUserManagementColumn from 'utils/tableColumn/useerManagement/admin/customerUserManagementAdminColumn';
import IESOUserManagementColumn from 'utils/tableColumn/useerManagement/admin/iesoUserManagementAdminColumn';

const UserManagementAdmin = () => {

  const {ENERVA_USER_MANAGEMENT_ADMIN_COLUMN} = EnvervaUserManagementColumn();
  const {CUSTOMER_USER_MANAGEMENT_ADMIN_COLUMN} = CustomerUserManagementColumn();
  const {IESO_USER_MANAGEMENT_ADMIN_COLUMN} = IESOUserManagementColumn();

  // tabs table data
  const [searchString, setSearchString] = useState("");
  const [getEnervaUser, setEnervaUser] = useState([]);
  const [getIesoUser, setIesoUser] = useState([]);
  const [getCustomerUser, setCustomerUser] = useState([]);
  const [getAggregatorUser, setAggregatorUser] = useState([]);

  const [getUserRole, setUserRole] = useState([]);
  const [isVisibleInvitePage, setVisibleInvitePage] = useState(false);
  const [getCompanyList, setCompanyList] = useState([]);
  const [tabValue, setTabValue] = useState('enervaUsers');
  const [selectRoleType, setSelectRoleType] = useState('0');
  const [invitePageInfo, setInvitePageInfo] = useState({});
  const [selectTableRow, setSelectTableRow] = useState({});
  const [inviteAPIURL, setInviteAPIURL] = useState('');

  // need to call this function before USER_MANAGEMENT_ADMIN_COLUMN
  const handleAPISuccessCallBack = () => {
    // Call the API to get all user data
    getEnervaUserManagementData(enervaPageInfo, searchString,selectRoleType);
    getIESOUserManagementData(iesoPageInfo, searchString,selectRoleType);
    getCustomerUserManagementData(customerPageInfo, searchString,selectRoleType);
    // getAggregatorUserManagementData();
  };
  const initialValues = {
    company: '',
    role: '',
  };

  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: true,
      modalClass: "",
      headerTextStyle: { color: 'rgba(84, 88, 90, 1)' },
      headerSubTextStyle: { marginTop: '1rem', color: 'rgba(36, 36, 36, 1)', fontSize: { md: '0.875rem' }, },
      fotterActionStyle: {justifyContent: "center", gap: '1rem'},
      modalBodyContentStyle: ''
    },
    buttonsUI: {
      saveButton: true,
      cancelButton: true,
      saveButtonClass: "",
      cancelButtonClass: "",
      successButtonStyle: {backgroundColor: 'danger.scarlet',"&:hover": {backgroundColor: 'danger.colorCrimson'}, color: '#fff'},
      cancelButtonStyle: {backgroundColor: 'dark.colorSmoke',"&:hover": {backgroundColor: 'dark.colorSilver'}, color: '#fff'},
      saveButtonName: "Yes,Delete!",
      cancelButtonName: "No,Cancel",  

    },
    headerText: "",
    headerSubText: "",
    modalBodyContent: "",
  });


  const enervaUsersColumns = useMemo(() => ENERVA_USER_MANAGEMENT_ADMIN_COLUMN(handleAPISuccessCallBack,setVisibleInvitePage,setSelectTableRow,setModalConfig,setInvitePageInfo,setInviteAPIURL), []);
  const iesoUsersColumns = useMemo(() => IESO_USER_MANAGEMENT_ADMIN_COLUMN(handleAPISuccessCallBack,setVisibleInvitePage,setSelectTableRow,setModalConfig,setInvitePageInfo,setInviteAPIURL), []);
  const customerUsersColumns = useMemo(() => CUSTOMER_USER_MANAGEMENT_ADMIN_COLUMN(handleAPISuccessCallBack,setVisibleInvitePage,setSelectTableRow,setModalConfig,setInvitePageInfo,setInviteAPIURL), []);
  const aggregatorUsersColumns = useMemo(() => AGGREGATOR_USER_MANAGEMENT_ADMIN_COLUMN(handleAPISuccessCallBack,setVisibleInvitePage,setSelectTableRow,setModalConfig,setInvitePageInfo,setInviteAPIURL), []);

// for pagination
const defaultPagination = { page: 1, pageSize: 10 }
  const [enervaPageInfo, setEnervaPageInfo] = useState({ ...defaultPagination });
  const [iesoPageInfo, setIesoPageInfo] = useState({ ...defaultPagination });
  const [customerPageInfo, setCustomerPageInfo] = useState({ ...defaultPagination });
  const [aggregatorPageInfo, setAggregatorPageInfo] = useState({ ...defaultPagination });
  
  const [pageCount, setPageCount] = useState({
    enerva: '',
    ieso: '',
    customer: '',
    aggregator: ''
  });


  const handleSelectChange = (event) => {
    setSelectRoleType(event.target.value);
  };


  const handleChange = (event, newValue) => {
    setSearchString('');
    setSelectRoleType('0');
    setTabValue(newValue);
    setPageInfo(newValue);
  };


  const handleAddUser = () => {
    setVisibleInvitePage(true);
    setPageInfo(tabValue);

  }

  const setPageInfo = (newTabValue) => {
    if (newTabValue === 'enervaUsers') {
      setInvitePageInfo({
        title: 'Invite Enerva User and set permissions',
        type: '1'
      })
    } else if (newTabValue === 'iesoUsers') {
      setInvitePageInfo({
        title: 'Invite IESO User and set permissions',
        type: '4'
      })
    }
    else if (newTabValue === 'customerUsers') {
      setInvitePageInfo({
        title: 'Invite Customer User and set permissions',
        type: '2'
      })

    } else {
      // default tab is first
      setInvitePageInfo({
        title: 'Invite Enerva User and set permissions',
        type: '1'
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


  const getEnervaUserManagementData = (pageInfo,search,role) => {

    const apiURL = `${ENERVA_USER_MANAGEMENT.GET_ENERVA_USER_LIST}/${
      (pageInfo.page - 1) * pageInfo.pageSize
    }/${pageInfo.pageSize}?search=${search}&role=${role ==="0" ? "" : role}`;
    GET_REQUEST(apiURL)
      .then((res) => {       
        if(res.data?.body?.rows instanceof Array){
          setEnervaUser(res.data?.body?.rows)
          setPageCount((prevState) => ({
            ...prevState,
            enerva: res.data?.body?.count
          }));
        }
        
      }).catch((error) => {
        console.log(error)
      });
  }

  const getIESOUserManagementData = (pageInfo,search,role) => {
    const apiURL = `${ENERVA_USER_MANAGEMENT.GET_IESO_USER_LIST}/${
      (pageInfo.page - 1) * pageInfo.pageSize
    }/${pageInfo.pageSize}?search=${search}&role=${role ==="0" ? "" : role}`;
    // const apiURL = ENERVA_USER_MANAGEMENT.GET_IESO_USER_LIST+'/0/100/';
    GET_REQUEST(apiURL)
      .then((res) => {
        if(res.data?.body?.rows instanceof Array){
          setIesoUser(res.data?.body?.rows)
          setPageCount((prevState) => ({
            ...prevState,
            ieso: res.data?.body?.count
          }));
        }
      }).catch((error) => {
        console.log(error)
      });
  }
  const getCustomerUserManagementData = (pageInfo,search,role) => {
    const apiURL = `${ENERVA_USER_MANAGEMENT.GET_CUSTOMER_USER_LIST}/${
      (pageInfo.page - 1) * pageInfo.pageSize
    }/${pageInfo.pageSize}?search=${search}&role=${role ==="0" ? "" : role}`;
    // const apiURL = ENERVA_USER_MANAGEMENT.GET_CUSTOMER_USER_LIST+'/0/100';
    GET_REQUEST(apiURL)
      .then((res) => {
        if(res.data?.body?.rows instanceof Array){
          setCustomerUser(res.data?.body?.rows)
          setPageCount((prevState) => ({
            ...prevState,
            ieso: res.data?.body?.count
          }));
        }
      }).catch((error) => {
        console.log(error)
      });
  }

  const handelInviteUserAdmin = () => {
    const apiURL = ENERVA_USER_MANAGEMENT.SEND_EV_INVITATION_BY_ADMIN
    setVisibleInvitePage(true); 
    setSelectTableRow({}); 
    setInvitePageInfo({title:'Invite Enerva User and set permissions', type: invitePageInfo.type }) 
    setInviteAPIURL(apiURL)

    handleAddUser(); 
    setSelectTableRow({});
  }

  const getAggregatorUserManagementData = () => {
    // const apiURL = "https://enervauser.azurewebsites.net/api/enerva/0/100"
    const apiURL = ENERVA_USER_MANAGEMENT.GET_AGGREGATOR_USER_LIST+'/0/100';
    GET_REQUEST(apiURL)
      .then((res) => {
        setAggregatorUser(res.data)
      }).catch((error) => {
        console.log(error)
      });
  }

  const getUserRoleData = () => {
    const apiURL = USER_MANAGEMENT.GET_USER_ROLE+"/"+invitePageInfo?.type;
    GET_REQUEST(apiURL)
      .then((res) => {
        setUserRole(res.data?.body)
      }).catch((error) => {
        console.log(error)
      });
  }

  const getComapanyListData = () => {
    const apiURL = USER_MANAGEMENT.GET_COMPANY_LIST + "/" + "0/100";
    GET_REQUEST(apiURL)
      .then((res) => {
        setCompanyList(res.data?.data?.rows);
      }).catch((error) => {
        console.log(error)
      });
  }

  
  useEffect(()=> {
    getComapanyListData();
    setPageInfo();
  }, [])

  useEffect(()=> {
    if(invitePageInfo?.type !== undefined){
      getUserRoleData();
    }

  }, [invitePageInfo])


// search implementation


  const debouncedSearch = debounce((pageInfo, searchString,selectedRole) => {
    if(tabValue === 'enervaUsers' && (searchString?.length > 0 || selectedRole) ) {
      getEnervaUserManagementData(pageInfo, searchString,selectedRole);
    }else if(tabValue === 'iesoUsers' && (searchString?.length > 0 || selectedRole) ) {
      getIESOUserManagementData(pageInfo, searchString,selectedRole);
    }else if(tabValue === 'customerUsers' && (searchString?.length > 0 || selectedRole) ) {
      getCustomerUserManagementData(pageInfo, searchString,selectedRole);
    }

  }, 300);

  
  useEffect(() => {
    debouncedSearch(enervaPageInfo, searchString,selectRoleType);
    return () => {
      debouncedSearch.cancel();
    };
  }, [enervaPageInfo.page, enervaPageInfo.pageSize, searchString, selectRoleType]);


  useEffect(() => {
    debouncedSearch(iesoPageInfo, searchString,selectRoleType);
    return () => {
      debouncedSearch.cancel();
    };
  }, [iesoPageInfo.page, iesoPageInfo.pageSize, searchString, selectRoleType]);


  useEffect(() => {
    debouncedSearch(customerPageInfo, searchString,selectRoleType);
    return () => {
      debouncedSearch.cancel();
    };
  }, [customerPageInfo.page, customerPageInfo.pageSize, searchString, selectRoleType]);
  

  useEffect(() => {
    // load all default function on page load
    getEnervaUserManagementData(enervaPageInfo, searchString,selectRoleType);
    getIESOUserManagementData(iesoPageInfo, searchString,selectRoleType);
    getCustomerUserManagementData(customerPageInfo, searchString,selectRoleType);
  }, [])


  return (
    <React.Fragment>
      {isVisibleInvitePage ?
        <InviteUser 
        getUserRole={getUserRole} 
        setVisibleInvitePage={setVisibleInvitePage} 
        invitePageInfo={invitePageInfo} 
        handleAPISuccessCallBack={handleAPISuccessCallBack}
        selectTableRow={selectTableRow}
        inviteAPIURL={inviteAPIURL}
        getCompanyList={getCompanyList}
        /> :

        <Box component="section">
          <Container maxWidth="lg">
            <Grid container sx={{ paddingTop: '1.5rem', justifyContent: 'space-between', }} >
              <Grid item xs={12} md={6} >
                <Typography variant='h4' sx={{ marginBottom: '0.5rem' }}>User Management </Typography>
                <Typography variant='body2'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Typography>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
                <FormGroup sx={{ minWidth: '14rem' }}>
                  <FormControl fullWidth sx={{ bgcolor: '#fff', borderRadius: '8px', padding: '0.5rem 0', color: 'dark.main' }}>
                    <TextField
                      value={searchString}
                      placeholder="Search by Username"
                      inputProps={{ style: { color: '#242424', fontSize: '1rem' } }}
                      onChange={(e) => setSearchString(e.target.value)}
                    />
                     {searchString?.length > 0 &&
                      <ClearIcon
                        onClick={() => setSearchString("")}
                        sx={{
                          color: "#333",
                          fontSize: "1.25rem",
                          position: "absolute",
                          right: "0.75rem",
                          top: '0', bottom: '0', margin: 'auto',
                          zIndex: "1",
                          cursor: "pointer"
                        }}
                      />
                    }
                  </FormControl>
                </FormGroup>

                <FormGroup className='theme-form-group theme-select-form-group'>

                  <FormControl sx={{  }} >
                    <Select
                      className='transparent-border'
                      value={selectRoleType}
                      onChange={(e) => handleSelectChange(e)}
                      displayEmpty={true}
                    >
                      <MenuItem key={0} value="0">
                        Role Type
                      </MenuItem>
                      {getUserRole?.length > 0 && (getUserRole).map((item) => {
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
                  <Typography variant='small' sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() =>  handelInviteUserAdmin()  } >
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
                  <Table columns={enervaUsersColumns} data={getEnervaUser} headbgColor="rgba(217, 217, 217, 0.2)" 
                  count={pageCount.enerva}
                  pageInfo={enervaPageInfo}
                  setPageInfo={setEnervaPageInfo}
                  />
              }
              {(getIesoUser && tabValue === 'iesoUsers') && <Table columns={iesoUsersColumns} data={getIesoUser} headbgColor="rgba(217, 217, 217, 0.2)" 
              count={pageCount.ieso}
              pageInfo={iesoPageInfo}
              setPageInfo={setIesoPageInfo}
              />}
              {(getCustomerUser && tabValue === 'customerUsers') && <Table columns={customerUsersColumns} data={getCustomerUser} headbgColor="rgba(217, 217, 217, 0.2)"
                count={pageCount.customer}
                pageInfo={customerPageInfo}
                setPageInfo={setCustomerPageInfo}
              
              />}
              {(getAggregatorUser && tabValue === 'aggregatorUsers') && <Table columns={aggregatorUsersColumns} data={getAggregatorUser} headbgColor="rgba(217, 217, 217, 0.2)" 
              count={pageCount.aggregator}
              pageInfo={aggregatorPageInfo}
              setPageInfo={setAggregatorPageInfo}
              />}
            </Grid>
          </Container>
        </Box >
      }

      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </React.Fragment>
  )
}

export default UserManagementAdmin;
