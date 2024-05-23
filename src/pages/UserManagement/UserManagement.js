import React, { useEffect, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from 'components/Table';
import { Box, Button, Container, FormControl, FormGroup, FormLabel, Grid, IconButton, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import EvModal from 'utils/modal/EvModal';
import SelectBox from 'components/FormBuilder/Select';
import { Form, Formik } from 'formik';
import ButtonWrapper from 'components/FormBuilder/Button';
import { GET_REQUEST, POST_REQUEST } from 'utils/HTTPRequests';
import { USER_MANAGEMENT } from 'constants/apiEndPoints';
import { SnackbarContext } from '../../utils/notification/SnackbarProvider';
import InviteUser from './InviteUser';
import NotificationsToast from 'utils/notification/NotificationsToast';
import UserManagementColumn from 'utils/tableColumn/useerManagement/userManagementColumn';
import debounce from "lodash.debounce";
import ClearIcon from '@mui/icons-material/Clear';
import { useSelector } from 'react-redux';
import { requestToJoinCompanyFormValidationSchema } from 'utils/validations/formValidation';

const UserManagement = () => {
  const navigate = useNavigate();

  // pull functions from user management..
  const { USER_MANAGEMENT_COLUMN_ACTION } = UserManagementColumn();

  const [searchString, setSearchString] = useState("");
  const [getAllUser, setAllUser] = useState([]);
  const [getUserRole, setUserRole] = useState([]);
  const [isVisibleInvitePage, setVisibleInvitePage] = useState(false);
  const [getAllCompanyList, setAllCompanyList] = useState([]);
  const [getIndividualCompanyList, setIndividualCompanyList] = useState([]);
  const [tabValue, setTabValue] = useState('allUsers');
  const [selectTableRow, setSelectTableRow] = useState({});
  const [invitePageInfo, setInvitePageInfo] = useState({});
  const [inviteAPIURL, setInviteAPIURL] = useState('');
  const [selectFilterType, setSelectFilterType] = useState('0');
  // for pagination
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [pageCount, setPageCount] = useState('');

  // selector 
  const hasToken = localStorage.getItem("accessToken");
  const userCompanyId = useSelector((state) => state?.facilityReducer?.userDetails?.user?.company_id);
  const userData= useSelector((state) => state?.facilityReducer?.userDetails || {});

  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
      headerTextStyle: { color: 'rgba(84, 88, 90, 1)' },
      headerSubTextStyle: { marginTop: '1rem', color: 'rgba(36, 36, 36, 1)', fontSize: { md: '0.875rem' }, },
      fotterActionStyle: "",
      modalBodyContentStyle: ''
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Sent Request",
      cancelButtonName: "Cancel",
      successButtonStyle: {},
      cancelButtonStyle: {},
      saveButtonClass: "",
      cancelButtonClass: "",

    },
    headerText: "",
    headerSubText: '',
    modalBodyContent: "",
  });

  // need to call this function before USER_MANAGEMENT_COLUMN
  const handleAPISuccessCallBack = () => {
    // Call the API to get all user data
    getUserManagementData(pageInfo, searchString);
  };
  const columns = useMemo(() => USER_MANAGEMENT_COLUMN_ACTION(userData,handleAPISuccessCallBack, setVisibleInvitePage, setSelectTableRow, setModalConfig, setInvitePageInfo, setInviteAPIURL), []);

  const initialValues = {
    company: '',
    role: '',
  };





  const handleSelectChange = (event) => {
    setSelectFilterType(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const RequestToJoinForm = () => {
    const formSubmit = (data) => {
      const apiURL = USER_MANAGEMENT.JOIN_REQUEST;
      const requestBody = {
        "company_id": data.company.toString(),
        "role": data.role.toString(),
        "user_id": userData?.user?.id
      }



      POST_REQUEST(apiURL, requestBody)
        .then((response) => {
          handleAPISuccessCallBack();
          NotificationsToast({ message: "You have successfully submitted!", type: "success" });
            setModalConfig((prevState) => ({
              ...prevState,
              modalVisible: true,
              modalUI: {
                ...prevState.modalUI,
                crossIcon: false,
                modalBodyContentStyle: {color: 'primary_2.main', lineHeight: '1.5rem'},
                fotterActionStyle: { justifyContent: "center", gap: "1rem" },
              },
              buttonsUI: {
                ...prevState.buttonsUI,
                saveButton: false,
                cancelButton: true,
                cancelButtonStyle: {
                  backgroundColor: "primary.main",
                  "&:hover": { backgroundColor: "primary.main" },
                  color: "#fff",
                },
                cancelButtonName: "Okay",
            },
            headerText: "",
            headerSubText: '',
            modalBodyContent: 'Your request to join has been submitted. The company’s administrators will review your request and approve as needed.'
            }));

        })
        .catch((error) => {
          console.log(error, 'error')
          NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });

        })

    }

    return (
      <Formik
        initialValues={{
          ...initialValues
        }}
        validationSchema={requestToJoinCompanyFormValidationSchema}
        onSubmit={formSubmit}
      >
        <Form >
          <Stack sx={{ marginBottom: '1rem' }}>
            {/* <SelectBox name="company" label="Company name" options={getUserRole} /> */}
            <SelectBox name="company" label="Company name" options={getAllCompanyList} valueKey="id" labelKey="company_name" />
          </Stack>
          <Stack sx={{ marginBottom: '1rem' }}>
            <SelectBox name="role" label="Role" options={getUserRole} valueKey="id" labelKey="rolename" />
          </Stack>



          {/* <SelectBox /> */}
          <Grid display="flex" sx={{ marginTop: '1.5rem' }}>
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
      buttonsUI: {
        ...prevState.buttonsUI,
        saveButton: false,
        cancelButton: false,
    },
    headerText: "Request to join company",
    headerSubText: 'Please enter the following details to send request to join other company',
      modalBodyContent: <RequestToJoinForm />
    }));
  }

  const filterByData = [
    {
      label: 'All users',
      id: '0',
      defaultSelected: true,
    },
    {
      label: 'Invitation sent',
      id: '2',
      defaultSelected: false,
    },
    {
      label: 'Request received',
      id: '3',
      defaultSelected: false,
    }
  ]

  const handelInviteUser = () => {
    const apiURL = USER_MANAGEMENT.SEND_INVITATION_BY_ADMIN;
    setVisibleInvitePage(true);
    setSelectTableRow({});
    setInvitePageInfo({ title: 'Invite user and set permissions', type: null })
    setInviteAPIURL(apiURL)
  }

  const getUserManagementData = (pageDataInfo, search) => {

    // const allUserTypes = selectFilterType;
    const filterApiURL = `${USER_MANAGEMENT.GET_FILTER_USER_LIST}/${(pageDataInfo.page - 1) * pageDataInfo.pageSize
      }/${pageDataInfo.pageSize}/${selectFilterType}/${userCompanyId}?search=${search}`;

    const apiURL = `${USER_MANAGEMENT.GET_USER_LIST}/${(pageDataInfo.page - 1) * pageDataInfo.pageSize
      }/${pageDataInfo.pageSize}/${selectFilterType}/${userCompanyId}?search=${search}`;

    const getAPI_Data = (url) => {
      GET_REQUEST(url)
        .then((res) => {
          // setAllUser(res.data?.body)
          if (res.data?.body?.rows instanceof Array) {
            setAllUser(res.data?.body?.rows)
            setPageCount(res.data?.body?.count)
          } else {
            setAllUser([])
            setPageCount(0)
          }
        }).catch((error) => {
          console.log(error)
        });
    }

    if (selectFilterType !== '0') {
      getAPI_Data(filterApiURL)
    } else {
      getAPI_Data(apiURL)
    }



  }

  const getUserRoleData = () => {
    const userType = "2" // for customers
    const apiURL = USER_MANAGEMENT.GET_USER_ROLE+"/"+userType;
    GET_REQUEST(apiURL)
      .then((res) => {
        setUserRole(res.data?.body)
      }).catch((error) => {
        console.log(error)
      });
  }

  const getIndividualCompanyListData = () => {
    const apiURL = USER_MANAGEMENT.GET_LIST_OF_COMPANIES_BY_USER;
    GET_REQUEST(apiURL)
      .then((res) => {
        setIndividualCompanyList(res?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllCompanyListData = () => {
    const apiURL = USER_MANAGEMENT.GET_COMPANY_LIST + "/" + "0/100";
    GET_REQUEST(apiURL)
      .then((res) => {
        setAllCompanyList(res.data?.data?.rows);
      }).catch((error) => {
        console.log(error)
      });
  }
  useEffect(() => {
    if(getIndividualCompanyList.length > 0 && getAllCompanyList.length > 0) {
      const companiesWithoutUserCompanies = getAllCompanyList.filter(allcompanyItem => 
        !getIndividualCompanyList.some(companyItem => companyItem?.id === allcompanyItem?.id)
      )
      if(companiesWithoutUserCompanies.length != getAllCompanyList.length){
        setAllCompanyList([...companiesWithoutUserCompanies])
      }
    }
  }, [getIndividualCompanyList, getAllCompanyList]);

  const debouncedSearch = debounce((pageInfo, searchString) => {
    getUserManagementData(pageInfo, searchString);
  }, 300);

  useEffect(() => {
    debouncedSearch(pageInfo, searchString);
    return () => {
      debouncedSearch.cancel();
    };
  }, [pageInfo.page, pageInfo.pageSize, searchString, selectFilterType]);


  useEffect(() => {
    if(userData?.user?.id && hasToken){
      getIndividualCompanyListData();
    }
  }, [userData, hasToken, userCompanyId]);

  useEffect(() => {
    getUserRoleData()
    getAllCompanyListData()
  }, [])


console.log(getAllCompanyList, 'getting getAllCompanyList');  

  return (
    <React.Fragment>
      {isVisibleInvitePage ?
        <InviteUser
          getUserRole={getUserRole}
          setVisibleInvitePage={setVisibleInvitePage}
          isVisibleInvitePage={isVisibleInvitePage}
          invitePageInfo={invitePageInfo}
          handleAPISuccessCallBack={handleAPISuccessCallBack}
          selectTableRow={selectTableRow}
          inviteAPIURL={inviteAPIURL}
        /> :

        <Box component="section">
          <Container maxWidth="lg">
            <Grid container sx={{ justifyContent: 'space-between' }} >
              <Grid item xs={12} md={4} >
                <Typography variant='h4'>User Management</Typography>
              </Grid>
              <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: {xs: 'flex-start', md: 'flex-end'}, gap: {xs: '0.5rem', md: '2rem'}, marginTop: {xs: '1rem' ,md: '0'} }}>
                <FormGroup className="theme-form-group theme-select-form-group" >

                  <FormControl sx={{ minWidth: '6rem', maxWidth: '8rem', flexGrow: '1' }}>
                    <Select
                      value={selectFilterType}
                      onChange={(e) => handleSelectChange(e)}
                      displayEmpty={true}
                      className="transparent-border"
                    >
                      <MenuItem value="" disabled>
                        Filter by
                      </MenuItem>
                      {filterByData?.map((item) => (
                        <MenuItem key={`${item.id}`} value={item?.id}>
                          {item?.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormGroup>
                <FormGroup >
                  <FormControl fullWidth sx={{ position: 'relative', bgcolor: '#fff', borderRadius: '8px', color: 'dark.main' }}>
                    <TextField
                      value={searchString}
                      placeholder="Search"
                      inputProps={{ style: { color: '#242424', fontSize: '1rem', paddingRight: '2rem' } }}
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

                <Button
                  color="primary"
                  variant="contained"
                  sx={{ alignSelf: 'flex-start', marginTop: {xs: '1rem', md: '0'} }}
                  onClick={() => handelInviteUser()}
                >
                  Invite User
                </Button>
              </Grid>

            </Grid>

            <Grid container sx={{ alignItems: "center", justifyContent: 'space-between', gap: '1rem', marginTop: '1rem', marginBottom: '3rem' }}>
              <Grid item xs={4}  >
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
                Request to join company
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              {getAllUser && <Table
                columns={columns} data={getAllUser || []}
                count={pageCount}
                pageInfo={pageInfo}
                setPageInfo={setPageInfo}
                headbgColor="rgba(217, 217, 217, 0.2)" />}
            </Grid>
          </Container>

          <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
        </Box >
      }

    </React.Fragment>
  )
}

export default UserManagement
