import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  Grid,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import EvModal from "utils/modal/EvModal";
import {
  adminCompanySendAlert,
  adminCompanyUpdateStatus,
  changeSuperAdmin,
  deleteCompanyById,
  fetchAdminCompanyListing,
  fetchCompanyUserList,
} from "../../../redux/admin/actions/adminCompanyAction";
import { Form, Formik } from "formik";
import ButtonWrapper from "components/FormBuilder/Button";
import { format } from "date-fns";
import TextAreaField from "components/FormBuilder/TextAreaField";
import { debounce } from "lodash";
import Loader from "pages/Loader";
import SelectBox from "components/FormBuilder/Select";
import { updateProfilePageRoleSchema } from "utils/validations/formValidation";

const companyTypes = [
  {
    id: 1,
    userType: "Aggregator",
  },
  {
    id: 2,
    userType: "Customer",
  },
];

const CompanyListing = () => {
  const columns = [
    {
      Header: "Company name",
      accessor: (item) => (
        <Link
          href={`#/companies/company-profile/${item?.id}`}
          sx={{ color: "#2C77E9" }}
        >
          {item?.company_name}
        </Link>
      ),
      accessorKey: "company_name",
    },
    {
      Header: "Company address",
      accessor: (item) => (
        <>
          {" "}
          {item?.address && `${item?.address} ,`}{" "}
          {item?.street_number && `${item?.street_number} `}{" "}
          {item?.street_name && `${item?.street_name} ,`}{" "}
          {item?.sector && `${item?.sector} ,`}{" "}
          {item?.city && `${item?.city} ,`}{" "}
          {item?.province && `${item?.province} ,`}{" "}
          {item?.country && `${item?.country} ,`}{" "}
          {item?.postal_code && `${item?.postal_code} `}
        </>
      ),
    },
    {
      Header: "Users",
      accessor: (item) => (
        <>
          <Link
            href={`#/companies/company-users/${item?.id}`}
            sx={{
              color: "#FF5858",
              textDecoration: "none",
            }}
          >
            View all
          </Link>
        </>
      ),
    },
    {
      Header: "PA",
      accessor: (item) => (
        <Link
          href={`#/companies/company-agreement/${item?.id}`}
          sx={{ color: "#2C77E9" }}
        >
          link to the PA
        </Link>
      ),
    },
    {
      Header: "Created on(Date)",
      accessor: (item) => (
        <>
          {item?.createdAt && format(new Date(item?.createdAt), "yyyy-MM-dd")}
        </>
      ),
    },
    {
      Header: "Status",
      accessor: (item) => (
        <>
          {
            <Button
              color={item?.is_active === 1 ? "primary" : "error"}
              disableRipple
              style={{
                minWidth: "unset",
                backgroundColor: "transparent",
                padding: 0,
                fontSize: "0.875rem",
              }}
              onClick={() => openStatusModal(item?.id, item?.is_active)}
            >
              {item?.is_active === 1 ? "Active" : "Inactive"}
            </Button>
          }
        </>
      ),
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box
          display="flex"
          columnGap={1}
          sx={{
            flexWrap: "wrap",
            justifyItems: "flex-start",
            textWrap: "nowrap",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            disableRipple
            style={{
              color: "#2C77E9",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            onClick={() => openRequestModal(item?.id)}
          >
            Alert
          </Button>
          <Button
            disableRipple
            color="error"
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            onClick={() => openDeleteModal(item?.id)}
          >
            Delete
          </Button>
          <Button
            disableRipple
            style={{
              color: "#F26D04",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            disabled
          >
            Logs
          </Button>
          <Button
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            onClick={() => {
              setCompanyUserId(item?.id);
              openChangeSuperAdminModal(item?.id);
            }}
          >
            Change super admin
          </Button>
          <Button
            disableRipple
            style={{
              color: "#56B2AE",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            onClick={() =>
              navigate(`/companies/company-manage-access/${item?.id}`)
            }
          >
            Manage access
          </Button>
        </Box>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companyFilter, setCompanyFilter] = useState("");

  const companyListData = useSelector(
    (state) => state?.adminCompanyReducer?.companyList?.data?.rows || []
  );
  const companyCount = useSelector(
    (state) => state?.adminCompanyReducer?.companyList?.data?.count || []
  );
  const loadingState = useSelector(
    (state) => state?.adminCompanyReducer?.loading
  );
  const companyUserListData = useSelector(
    (state) => state?.adminCompanyReducer?.companyUserList?.data || []
  );
  const [searchString, setSearchString] = useState("");
  const [companyUserId, setCompanyUserId] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const debouncedSearch = debounce(
    (pageInfo, searchString, company_filter, sort_Column, sort_Order) => {
      dispatch(
        fetchAdminCompanyListing(
          pageInfo,
          searchString,
          company_filter,
          sort_Column,
          sort_Order
        )
      );
    },
    300
  );

  useEffect(() => {
    debouncedSearch(
      pageInfo,
      searchString,
      companyFilter,
      sortColumn,
      sortOrder
    );
    return () => {
      debouncedSearch.cancel();
    };
  }, [
    dispatch,
    pageInfo.page,
    pageInfo.pageSize,
    searchString,
    companyFilter,
    sortColumn,
    sortOrder,
  ]);

  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
      headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
      headerSubTextStyle: {
        marginTop: "1rem",
        color: "rgba(36, 36, 36, 1)",
        fontSize: { md: "0.875rem" },
      },
      fotterActionStyle: "",
      modalBodyContentStyle: "",
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Delete",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "Alert",
    headerSubText: "",
    modalBodyContent: "",
    saveButtonAction: "",
  });

  const CommentForm = ({ companyId }) => {
    const initialValues = {
      comment: "",
    };
    const validationSchemaSendAlert = Yup.object().shape({
      comment: Yup.string().required("Comment is required"),
    });
    const formSubmit = (values) => {
      dispatch(adminCompanySendAlert(companyId, values))
        .then(() => {
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
        })
        .catch((error) => {});
    };

    return (
      <Formik
        initialValues={{
          ...initialValues,
        }}
        onSubmit={formSubmit}
        validationSchema={validationSchemaSendAlert}
      >
        <Form>
          <Stack>
            <TextAreaField
              name="comment"
              label="Comment"
              rowsMin={3}
              rowsMax={5}
              textAreaStyle={{ fontSize: "1.125rem" }}
            />
          </Stack>
          <Grid display="flex" sx={{ marginTop: "1rem" }}>
            <ButtonWrapper type="submit" variant="contained">
              Submit
            </ButtonWrapper>
          </Grid>
        </Form>
      </Formik>
    );
  };

  const openRequestModal = (company_id) => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <CommentForm companyId={company_id} />,
    }));
  };

  const [statusModalConfig, setStatusModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
      headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
      headerSubTextStyle: {
        marginTop: "1rem",
        color: "rgba(36, 36, 36, 1)",
        fontSize: { md: "0.875rem" },
      },
      fotterActionStyle: "",
      modalBodyContentStyle: "",
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Yes",
      cancelButtonName: "No",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "",
    headerSubText: "",
    modalBodyContent: "",
    saveButtonAction: "",
  });

  const openStatusModal = (company_id, activity_status) => {
    setStatusModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <StatusChangeModalContent
          companyId={company_id}
          activityStatus={activity_status}
        />
      ),
    }));
  };

  const StatusChangeModalContent = ({ companyId, activityStatus }) => {
    const handleCStatusChange = () => {
      const formdata = new FormData();
      formdata.append("is_active", activityStatus === 1 ? 0 : 1);
      dispatch(adminCompanyUpdateStatus(companyId, formdata))
        .then(() => {
          setStatusModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          dispatch(
            fetchAdminCompanyListing(pageInfo, searchString, companyFilter)
          );
        })
        .catch((error) => {});
    };
    const handleCloseButton = () => {
      setStatusModalConfig((prevState) => ({
        ...prevState,
        modalVisible: false,
      }));
    };
    return (
      <Grid
        container
        alignItems="center"
        flexDirection="column"
        textAlign="center"
        sx={{ padding: { md: "0 5%" } }}
      >
        <Grid container sx={{ justifyContent: "center" }}>
          {activityStatus === 1 ? (
            <figure>
              <img src="/images/statusChangeIcon.svg" alt="" />
            </figure>
          ) : (
            <figure>
              <img src="/images/new_user_popup_icon.svg" alt="" />
            </figure>
          )}
        </Grid>
        <Grid container sx={{ justifyContent: "center" }}>
          <Typography variant="h4">
            {activityStatus === 1
              ? "Are you sure you would like to deactivate the company details?"
              : "Are you sure you would like to activate company details?"}
          </Typography>
        </Grid>
        <Grid container sx={{ justifyContent: "center" }} gap={2} mt={4}>
          <Button
            onClick={handleCStatusChange}
            sx={{
              background: activityStatus === 1 ? "#FF5858" : "#2E813E",
              "&:hover": {
                background: activityStatus === 1 ? "#FF3D3D" : "#296F38",
              },
            }}
            variant="contained"
          >
            Yes
          </Button>
          <Button variant="contained" onClick={handleCloseButton}>
            No
          </Button>
        </Grid>
      </Grid>
    );
  };
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
      headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
      headerSubTextStyle: {
        marginTop: "1rem",
        color: "rgba(36, 36, 36, 1)",
        fontSize: { md: "0.875rem" },
      },
      fotterActionStyle: "",
      modalBodyContentStyle: "",
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Yes",
      cancelButtonName: "No",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "",
    headerSubText: "",
    modalBodyContent: "",
    saveButtonAction: "",
  });

  const openDeleteModal = (company_id) => {
    setDeleteModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <DeleteModalContent companyId={company_id} />,
    }));
  };

  const DeleteModalContent = ({ companyId }) => {
    const handleDeleteCompanyButton = () => {
      dispatch(deleteCompanyById(companyId))
        .then(() => {
          setDeleteModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          dispatch(
            fetchAdminCompanyListing(pageInfo, searchString, companyFilter)
          );
        })
        .catch((error) => {});
    };
    const handleCloseButton = () => {
      setDeleteModalConfig((prevState) => ({
        ...prevState,
        modalVisible: false,
      }));
    };
    return (
      <Grid
        container
        alignItems="center"
        flexDirection="column"
        textAlign="center"
        sx={{ padding: { md: "0 5%" } }}
      >
        <Grid container sx={{ justifyContent: "center" }}>
          <figure>
            <img src="/images/icons/deleteIcon.svg" alt="" />
          </figure>
        </Grid>
        <Grid container sx={{ justifyContent: "center" }}>
          <Typography variant="h4">
            Are you sure you would like to delete this company?
          </Typography>
        </Grid>
        <Grid container sx={{ justifyContent: "center" }} gap={2} mt={4}>
          <Button
            onClick={handleDeleteCompanyButton}
            sx={{
              background: "#FF5858",
              "&:hover": {
                background: "#FF5858",
              },
            }}
            variant="contained"
          >
            Yes
          </Button>
          <Button variant="contained" onClick={handleCloseButton}>
            No
          </Button>
        </Grid>
      </Grid>
    );
  };

  const [changeSuperAdminModalConfig, setChangeSuperAdminModalConfig] =
    useState({
      modalVisible: false,
      modalUI: {
        showHeader: true,
        crossIcon: false,
        modalClass: "",
        headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
        headerSubTextStyle: {
          marginTop: "1rem",
          color: "rgba(36, 36, 36, 1)",
          fontSize: { md: "0.875rem" },
        },
        fotterActionStyle: "",
        modalBodyContentStyle: "",
      },
      buttonsUI: {
        saveButton: false,
        cancelButton: false,
        saveButtonName: "Yes",
        cancelButtonName: "No",
        saveButtonClass: "",
        cancelButtonClass: "",
      },
      headerText: "Change super administrator",
      headerSubText: "",
      modalBodyContent: "",
      saveButtonAction: "",
    });

  useEffect(() => {
    if (!loadingState && changeSuperAdminModalConfig.modalVisible) {
      setChangeSuperAdminModalConfig((prevState) => ({
        ...prevState,
        modalBodyContent: (
          <UpdateRolePermissionForm companyId={companyUserId} />
        ),
      }));
    }
  }, [loadingState, companyUserListData]);

  const openChangeSuperAdminModal = (company_id) => {
    dispatch(fetchCompanyUserList(company_id));

    setChangeSuperAdminModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <UpdateRolePermissionForm companyId={company_id} />,
    }));
  };

  const UpdateRolePermissionForm = ({ companyId }) => {
    const updateRoleInitialValues = {
      selectUser: "",
    };
    const formSubmit = (values) => {
      dispatch(changeSuperAdmin(companyId, values?.selectUser))
        .then(() => {
          setChangeSuperAdminModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
        })
        .catch(() => {
          setChangeSuperAdminModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
        });
    };

    return companyUserListData?.length ? (
      <Formik
        initialValues={{
          ...updateRoleInitialValues,
        }}
        validationSchema={updateProfilePageRoleSchema}
        onSubmit={formSubmit}
      >
        <Form style={{ width: "100%" }}>
          <Stack sx={{ marginBottom: "1rem" }}>
            <SelectBox
              name="selectUser"
              label="Select User"
              options={companyUserListData}
              valueKey="user_id"
              labelKey="full_name"
            />
          </Stack>
          <Grid display="flex" sx={{ marginTop: "1.5rem" }}>
            <ButtonWrapper type="submit" variant="contained">
              Submit
            </ButtonWrapper>
          </Grid>
        </Form>
      </Formik>
    ) : (
      <Grid
        sx={{
          minWidth: { xs: "100%", sm: "500px" },
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "dark.light",
          lineHeight: "1.5rem",
        }}
      >
        No users exist or existing users are the super-admin of another company,
        so won't be able to change the role.
      </Grid>
    );
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={7}>
          <Typography
            variant="h4"
            sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
          >
            Company List
          </Typography>
        </Grid>
        <Grid item display="flex" alignItems="center" justifyContent="center">
          <TextField
            name="search"
            label="Search by name"
            type="text"
            fullWidth
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                height: "2.9rem",
                borderRadius: "6px",
              },
            }}
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
              setPageInfo({ page: 1, pageSize: 10 });
            }}
          />
        </Grid>
        <Grid
          item
          sm={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <FormGroup className="theme-form-group theme-select-form-group">
            <FormControl sx={{ minWidth: "6rem" }}>
              <Select
                displayEmpty={true}
                className="transparent-border"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                <MenuItem value="">
                  <em>Company type</em>
                </MenuItem>
                {companyTypes?.map((item) => (
                  <MenuItem
                    key={item?.id}
                    value={item?.id}
                    disabled={item?.id === 1}
                  >
                    {item?.userType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>
        </Grid>
      </Grid>
      <Grid container mt={2}>
        <Typography
          variant="h5"
          sx={{ fontSize: "1.25rem", fontWeight: "500" }}
        >
          All users
        </Typography>
      </Grid>

      <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={companyListData}
          count={companyCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          //   onClick={(id) => navigate(`/companies/${id}`)}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          setSortColumn={setSortColumn}
          setSortOrder={setSortOrder}
        />
      </Box>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
      <EvModal
        modalConfig={statusModalConfig}
        setModalConfig={setStatusModalConfig}
      />
      <EvModal
        modalConfig={deleteModalConfig}
        setModalConfig={setDeleteModalConfig}
      />
      <EvModal
        modalConfig={changeSuperAdminModalConfig}
        setModalConfig={setChangeSuperAdminModalConfig}
      />
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState}
        loaderPosition="fixed"
      />
    </Container>
  );
};

export default CompanyListing;
