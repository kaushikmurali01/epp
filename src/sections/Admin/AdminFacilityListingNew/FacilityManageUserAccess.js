import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { debounce } from "lodash";
import Loader from "pages/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EvThemeTable from "components/Table/EvThemeTable";
import NotificationsToast from "utils/notification/NotificationsToast";
import { ENERVA_USER_MANAGEMENT, adminFacilityEndpoints } from "constants/apiEndPoints";
import { DELETE_REQUEST, GET_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import EvModal from "utils/modal/EvModal";
import { capitalizeFirstChar } from "utils/helper/helper";
import { fetchFacilityListByUserId } from "../../../redux/admin/actions/adminFacilityActions";
import AssignedUserForm from "./AssignedUserForm";

const FacilityManageUserAccess = () => {
  const userData= useSelector((state) => state?.facilityReducer?.userDetails || {});
  const [isChecked, setIsChecked] = useState(false);
  const [refreshTableData, setRefreshTableData] = useState(0);
  const [getUserList, setUserList] = useState([]);
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
      saveButtonName: "Yes, Delete!",
      cancelButtonName: "No, Cancel",  
    },
    headerText: "",
    headerSubText: "",
    modalBodyContent: "",
  });
  const [modalConfigAssignUser, setModalConfigAssignUser] = useState({
    ...modalConfig,
    modalUI: {
      ...modalConfig.modalUI,
      modalBodyContentStyle: {width: {xs: '100%', md: "450px"}, padding: '0 1rem !important'}
    
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonClass: "",
      cancelButtonClass: "",
      successButtonStyle: {backgroundColor: 'danger.scarlet',"&:hover": {backgroundColor: 'danger.colorCrimson'}, color: '#fff'},
      cancelButtonStyle: "",
      saveButtonName: "Submit",
      cancelButtonName: "",  
    },
  })

  const columns = [
    {
      Header: "UserID",
      accessor: "id",
    },
    {
      Header: "User full name",
      accessor: (item) => (
        <>
          {item?.first_name} {item?.last_name}
        </>
      ),
      accessorKey: "first_name",
      isSearch: true,
    },
    {
      Header: "Company name",
      accessor: "company_name",
      accessorKey: "company_name",
      isSearch: true,
    },
    {
      Header: "Business email",
      accessor: "email",
      accessorKey: "email",
      isSearch: true,
    },
    {
      Header: "Facility name",
      accessor: "facility_name",
      accessorKey: "facility_name",
      isSearch: true,
    },
    {
      Header: "Facility UBI",
      accessor: "facility_ubi",
      accessorKey: "facility_ubi",
      isSearch: true,
    },  
    {
      Header: "User type",
      // accessor: "user_type",
      accessor: (item) => `${capitalizeFirstChar(item?.user_type)}`,
    },
    // {
    //   Header: "User role",
    //   accessor: "user_name",
    // },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box
          display="flex"
          columnGap={1}
          sx={{
            flexWrap: "wrap",
            justifyContent: "flex-end",
            justifyItems: "flex-end",
            textWrap: "nowrap",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            disabled={userData?.user?.id === item?.id}
            color="error"
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            onClick={() => handelDeleteModalOpen(userData,item)}
            // uncomment the onClick when any one work on it and update the api endpoint for this...
            
          >
            Remove
          </Button>
        </Box>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { id } = useParams();
  const getParams = useLocation();
  const facilityId = getParams.state?.facilityId || '';
  const companyID = getParams.state?.companyId || '';
  const [selectTableRow, setSelectTableRow] = useState({});
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchData, setSearchData] = useState([]);



  const companyUserListData = useSelector(
    (state) => state?.adminFacilityReducer?.facilityListByUsersId?.rows || []
  );

  const userCount = useSelector(
    (state) => state?.adminFacilityReducer?.facilityListByUsersId?.count || []
  );
  const loadingState = useSelector(
    (state) => state?.adminFacilityReducer?.loading
  );

  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });



  const DeleteModelContent = ({facilityData}) => {
    console.log(facilityData, "check item")
    return (
        <Grid container alignItems='center' flexDirection="column" textAlign='center' sx={{ padding: { md: '0 5%'}}} >
            <Grid item sx={{textAlign:'center'}}>
                <figure>
                    <img src="/images/icons/deleteIcon.svg" alt="" />
                </figure>
            </Grid>
            <Grid item>
                <Typography variant="h4">
                    Are you sure you would like to delete
                    the user access from {facilityData.facility_name}
                </Typography>
            </Grid>
          
        </Grid>
    )
}


  const handelDeleteModalOpen = (userData,item) => {
    if(userData?.user?.id === item?.id){
        NotificationsToast({ message: "You don't have permission for this!", type: "error" });
        return;
    }
    console.log(userData,item, "check modal delete")
    setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        buttonsUI: {
            ...prevState.buttonsUI,
            saveButton: true,
            cancelButton: true,
        },
        modalBodyContent: <DeleteModelContent facilityData={item} />,
        saveButtonAction: () =>  handelDelete(item, setModalConfig),
    }));
   
}

const handelDelete = (item, setModalConfig) => {
  dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
  
  const apiURL = adminFacilityEndpoints.REMOVE_MANAGE_ACCESS_USER+"/"+item.facility_id+"/"+item.id;

  console.log(apiURL,item, "check delete api url")
  // return;
  DELETE_REQUEST(apiURL)
      .then((response) => {
          console.log(response, 'check delete response');
          if(response.data.status === 409) {
              console.log("response.data", "check delete response new");
              NotificationsToast({ message: response.data.body, type: "error" });
              setModalConfig((prevState) => ({
                  ...prevState,
                  modalVisible: false,
              }));
          } else {
          NotificationsToast({ message: "The user has been deleted successfully.", type: "success" });
          // handleSuccessCallback();
          // close the modal
          setModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
          }));
          setRefreshTableData(prevState => prevState + 1);
      }
          dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      })
      .catch((error) => {
          console.log(error, 'error')

          NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
           // close the modal
           setModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
          }));
          dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      })
}

  
// const RequestToJoinForm = () => {

//   const initialValues = {
//     userIds: [],
//     facilityId: ""
// }
// const [dropdownConfig, setDropdownConfig] = useState({
//   title: 'Change Status',
//   options: [
//       { value: 'active', label: 'Active' },
//       { value: 'inactive', label: 'Inactive' }
//   ],
//   selectedValue: '',
// });
//   const formSubmit = (data) => {
//     console.log(data, "check role")
//     const apiURL = "";
//     const requestBody = {
//       user_ids:data.userIds,
//       facility_id: data.facilityId
//   }
//     console.log(requestBody, apiURL, "check payload")
//   return
//     POST_REQUEST(apiURL, requestBody)
//       .then((response) => {
//         const successMessage = response.data.status === 200 ? `Your request to join ${response?.data?.company?.company_name} has been submitted. The company’s administrators will review your request.` : response.data.message;

//         setModalConfig((prevState) => ({
//           ...prevState,
//           modalVisible: true,
//           modalUI: {
//             ...prevState.modalUI,
//             modalBodyContentStyle: {color: 'primary_2.main', lineHeight: '1.5rem'},
//             fotterActionStyle: { justifyContent: "center", gap: "1rem" },
//           },
//           buttonsUI: {
//             ...prevState.buttonsUI,
//             saveButton: false,
//             cancelButton: true,
//             cancelButtonStyle: {
//               backgroundColor: "primary.main",
//               "&:hover": { backgroundColor: "primary.main" },
//               color: "#fff",
//             },
//             cancelButtonName: "Okay",
//         },
//         headerText: "",
//         headerSubText: '',
//         modalBodyContent: successMessage
//         }));

//       })
//       .catch((error) => {
//         console.log(error, 'error')
//         // NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });

//       })
//   }

//   return (
//     <Formik
//       initialValues={{
//         ...initialValues
//       }}
//       validationSchema= ""
//       onSubmit={formSubmit}
//     >
//       <Form >
//       <h3>sdfds</h3>
//         <Stack sx={{ marginBottom: '1rem' }}>

//             <EvThemeDropdown />
//         </Stack>



//         {/* <SelectBox /> */}
//         <Grid display="flex" sx={{ marginTop: '1.5rem' }}>
//           <ButtonWrapper type="submit" variant="contained"  >
//             Submit
//           </ButtonWrapper>

//         </Grid>
//       </Form>
//     </Formik>
//   )
// }

  const handleAssignUser = ()=> {
    console.log("assign user clicked")

    setModalConfigAssignUser((prevState) => ({
      ...prevState,
      modalVisible: true,
    headerText: "Assign user",
    headerSubText: '',
      modalBodyContent: <AssignedUserForm setModalConfig={setModalConfigAssignUser} userList={getUserList} facilityId={facilityId} setRefreshTableData={setRefreshTableData} />
    }));
  }

  const getUserListByCompanyId = () => {
    const apiURL = adminFacilityEndpoints.GET_USER_LIST_BY_COMPANY_ID+"/"+companyID+"/"+facilityId
    GET_REQUEST(apiURL)
      .then((res) => {
        setUserList(res.data.data)
      }).catch((error) => {
        console.log(error)
      });
  }

  useEffect(()=> {
    getUserListByCompanyId()
  }, [refreshTableData])


  const debouncedSearch = debounce((pageInfo, facility_id, search, sort_Column, sort_Order) => {
    dispatch(
      fetchFacilityListByUserId(
        pageInfo,
        facility_id,
        search,
        sort_Column,
        sort_Order
      )
    );
  },300);

useEffect(() => {
  debouncedSearch(
    pageInfo,
    facilityId,
    searchData,
    sortColumn,
    sortOrder
  );
  return () => {
    debouncedSearch.cancel();
  };
}, [dispatch, pageInfo.page, pageInfo.pageSize, facilityId,searchData,refreshTableData,sortColumn,sortOrder]);



  console.log(getUserList, "companyUserListData")



  return (
    <Container>
      <Grid container sx={{ paddingTop: {xs: '0.5rem', sm: '1.5rem'}, marginBottom: '1.5rem', justifyContent: 'space-between', }}>
      <Grid item xs={12} sm={6}   >
      <IconButton
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.main",
            },
            marginRight: "1rem",
          }}
          textAlign="center"
          onClick={() => navigate("/facility-list")}
        >
          <ArrowBackIcon
            sx={{
              color: "#fff",
              fontSize: "1.25rem",
            }}
          />
        </IconButton>
        <Typography
          variant="h4"
          sx={{ fontSize: "1.5rem", color: "text.secondary2", display: 'inline-block' }}
        >
          Manage access
        </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: {xs: 'flex-start', sm: 'flex-end'}, alignItems: 'center', gap: {xs: '1rem', sm: '2rem'} }}>
                  <Typography variant='small' sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() =>  handleAssignUser()  } >
                    Assign User
                  </Typography>
              </Grid>
      </Grid>

      <Box sx={{ marginTop: "2rem" }}>
         <EvThemeTable tableClass="enerva-customer-table" 
                headbgColor="rgba(217, 217, 217, 0.2)"

                columns={columns}
                data={companyUserListData}
                count={userCount}
                pageInfo={pageInfo}
                setPageInfo={setPageInfo}

                searchData={searchData}
                setSearchData={setSearchData}

                setSortColumn={setSortColumn}
                setSortOrder={setSortOrder}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
              
              />
      </Box>
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState}
        loaderPosition="fixed"
      />
      {modalConfig.modalVisible && <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />}
      {modalConfigAssignUser.modalVisible && <EvModal modalConfig={modalConfigAssignUser} setModalConfig={setModalConfigAssignUser} />}
      
    </Container>
  );
};

export default FacilityManageUserAccess;
