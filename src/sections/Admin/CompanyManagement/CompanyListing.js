import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  Grid,
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
  fetchAdminCompanyListing,
} from "../../../redux/admin/actions/adminCompanyAction";
import { Form, Formik } from "formik";
import ButtonWrapper from "components/FormBuilder/Button";
import { format } from "date-fns";
import TextAreaField from "components/FormBuilder/TextAreaField";
import { debounce } from "lodash";

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
      accessor: "company_name",
    },
    {
      Header: "Super admin name",
      accessor: (item) => (
        <>
          {item?.first_name} {item?.last_name}
        </>
      ),
    },
    {
      Header: "Company type",
      accessor: (item) => {
        const userType = companyTypes.find(
          (type) => type.id === item?.company_type
        );
        return userType ? userType.userType : "";
      },
    },
    {
      Header: "Business email",
      accessor: "email",
    },
    {
      Header: "Created on(Date)",
      accessor: (item) => (
        <>{format(new Date(item?.createdAt), "yyyy-MM-dd")}</>
      ),
    },
    {
      Header: "Status",
      accessor: (item) => <>{item?.is_active === 1 ? "active" : "inactive"}</>,
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box display="flex" onClick={(e) => e.stopPropagation()}>
          <Button
            disableRipple
            style={{
              color: "#56B2AE",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            onClick={() => navigate(`/companies/company-agreement/${item?.id}`)}
          >
            View Participant Agreement
          </Button>
          <Button
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
              fontSize: "0.875rem",
            }}
            onClick={() => navigate(`/companies/company-profile/${item?.id}`)}
          >
            View
          </Button>
          <Button
            disableRipple
            style={{
              color: "#2C77E9",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
              fontSize: "0.875rem",
            }}
            onClick={() => openRequestModal(item?.id)}
          >
            Alert
          </Button>
          <Button
            color={item?.is_active === 1 ? "error" : "primary"}
            disableRipple
            style={{
              minWidth: "unset",
              backgroundColor: "transparent",
              padding: 0,
              marginLeft: "1rem",
              fontSize: "0.875rem",
            }}
            onClick={() => openStatusModal(item?.id, item?.is_active)}
          >
            {item?.is_active === 1 ? "Inactive" : "Active"}
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
  const [searchString, setSearchString] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  const debouncedSearch = debounce((pageInfo, searchString, company_filter) => {
    dispatch(fetchAdminCompanyListing(pageInfo, searchString, company_filter));
  }, 300);

  useEffect(() => {
    debouncedSearch(pageInfo, searchString, companyFilter);
    return () => {
      debouncedSearch.cancel();
    };
  }, [dispatch, pageInfo.page, pageInfo.pageSize, searchString, companyFilter]);

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
    headerSubText:
      "",
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
              style={{ width: "85%", minHeight: "200px", padding: "5px" }}
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
      console.log(formdata);
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
          {/* <Typography variant="small2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Typography> */}
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
            onChange={(e) => setSearchString(e.target.value)}
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
        />
      </Box>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
      <EvModal
        modalConfig={statusModalConfig}
        setModalConfig={setStatusModalConfig}
      />
    </Container>
  );
};

export default CompanyListing;
