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
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  fetchAdminCompanyListing,
  fetchUsersByCompanyId,
} from "../../../redux/admin/actions/adminCompanyAction";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { format } from "date-fns";
import { debounce } from "lodash";
import Loader from "pages/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EvThemeTable from "components/Table/EvThemeTable";
import NotificationsToast from "utils/notification/NotificationsToast";
import { ENERVA_USER_MANAGEMENT } from "constants/apiEndPoints";
import { DELETE_REQUEST } from "utils/HTTPRequests";
import EvModal from "utils/modal/EvModal";
import { capitalizeFirstChar } from "utils/helper/helper";

const CompanyManageUserAccess = () => {
  const userData= useSelector((state) => state?.facilityReducer?.userDetails || {});
  const [isChecked, setIsChecked] = useState(false);
  const [refreshTableData, setRefreshTableData] = useState(0);
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
      // isSearch: true,
    },
    {
      Header: "Business email",
      accessor: "email",
      accessorKey: "email",
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
            style={{
              color: "#2C77E9",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            onClick={()=> handelManagePermission(userData,item)}
          >
            Manage permissions
          </Button>
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
  const companyId = getParams.state?.companyId || '';
  const [selectTableRow, setSelectTableRow] = useState({});
  const [sortCustomerColumn, setSortCustomerColumn] = useState("");
  const [sortCustomerOrder, setSortCustomerOrder] = useState("");
  const [searchData, setSearchData] = useState([]);


  const companyUserListData = useSelector(
    (state) => state?.adminCompanyReducer?.companyUsersById?.body?.rows || []
  );

  const userCount = useSelector(
    (state) => state?.adminCompanyReducer?.companyUsersById?.body?.count || []
  );
  const loadingState = useSelector(
    (state) => state?.adminCompanyReducer?.loading
  );

  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  const DeleteModelContent = () => {
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
                    the customer user details
                </Typography>
            </Grid>
            <Grid item>
                <FormGroup sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                 <Checkbox id="receiveCopy" onChange={(e)=> setIsChecked(e.target.checked) } />
                <FormLabel htmlFor="receiveCopy">if you want to receive a copy of delete email</FormLabel>
                </FormGroup>
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
        modalBodyContent: <DeleteModelContent />,
        saveButtonAction: () =>  handelDelete(item, setModalConfig),
    }));
   
}

const handelDelete = (item, setModalConfig) => {
  dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
  // for customer we need to company_id to delete
  const apiURL = ENERVA_USER_MANAGEMENT.DELETE_ENERVA_USER_REQUEST + '/' + item.id + '/' + item.entry_type + '/' + item.company_id;
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
          setRefreshTableData(prevState => prevState + 1);;
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

  const handelInviteUserAdmin = () => {
   
    const data = {
      pageInfo: { title: 'Add company user' },
      isEdited: false,
      companyId: companyId,
      companyName: getParams.state.companyName,
      selectTableRow: {
        user_type : "customer",
        user_type_id : 2,
        company_id: companyId,
        isDisabled: true,
        
      },
      returnPageURL: `/companies/${companyId}/manage-access`
    }
    // set state on session storage
    // navigate('/user-management/manage-access',{state: data})
    navigate(`/companies/${companyId}/manage-access/add-user`, {state: data})

  }
  const handelManagePermission = (userData,item) => {
    if(userData?.user?.id === item?.id){
        NotificationsToast({ message: "You don't have permission for this!", type: "error" });
        return;
    }

    const data = {
      pageInfo: { title: 'Manage company user and permissions' },
      isEdited: true,
      companyId: companyId,
      companyName: getParams.state.companyName,
      selectTableRow: item,
      returnPageURL: `/companies/${companyId}/manage-access`
    }

    navigate(`/companies/${companyId}/manage-access/add-user`, {state: data})
    
}

  useEffect(() => {
    dispatch(fetchUsersByCompanyId(pageInfo, companyId,searchData));
  }, [dispatch, pageInfo.page, pageInfo.pageSize, companyId,searchData,refreshTableData]);

  console.log(companyUserListData,companyId, "companyUserListData")

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
          onClick={() => navigate("/companies")}
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

      <Box sx={{ marginTop: "2rem" }}>
        {/* <Table
          columns={columns}
          data={companyUserListData}
          count={userCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
        /> */}
         <EvThemeTable tableClass="enerva-customer-table" 
                headbgColor="rgba(217, 217, 217, 0.2)"

                columns={columns}
                data={companyUserListData}
                count={userCount}
                pageInfo={pageInfo}
                setPageInfo={setPageInfo}

                searchData={searchData}
                setSearchData={setSearchData}

                // setSortColumn={setSortCustomerColumn}
                // setSortOrder={setSortCustomerOrder}
                // sortColumn={sortCustomerColumn}
                // sortOrder={sortCustomerOrder}
              
              />
      </Box>
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState}
        loaderPosition="fixed"
      />
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </Container>
  );
};

export default CompanyManageUserAccess;
