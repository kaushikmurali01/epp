import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import EvModal from "utils/modal/EvModal";
import { fetchAdminCompanyListing } from "../../../redux/admin/actions/adminCompanyAction";
import { Form, Formik } from "formik";
import ButtonWrapper from "components/FormBuilder/Button";

const CompanyListing = () => {
  const columns = [
    {
      Header: "Company name",
      accessor: "company_name",
    },
    {
      Header: "Super admin name",
      accessor: "super_admin_name",
    },
    {
      Header: "Company type",
      accessor: "company_type",
    },
    {
      Header: "Business email",
      accessor: "business_email",
    },
    {
      Header: "Created on(Date)",
      accessor: "created_on",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box display="flex" onClick={(e) => e.stopPropagation()}>
          <Button
            style={{
              color: "#56B2AE",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              textWrap: "nowrap",
            }}
          >
            View Participant Agreement
          </Button>
          <Button
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            onClick={() => navigate(`/companies/company-profile/${item?.id}`)}
          >
            View
          </Button>
          <Button
            style={{
              color: "#2C77E9",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            onClick={openRequestModal}
          >
            Alert
          </Button>
          <Button
            color="error"
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
          >
            Inactive
          </Button>
        </Box>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const companyListData = useSelector(
    (state) => state?.adminCompanyReducer?.companyList?.data?.rows || []
  );
  const companyCount = useSelector(
    (state) => state?.adminCompanyReducer?.companyList?.data?.count || []
  );
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  useEffect(() => {
    dispatch(fetchAdminCompanyListing(pageInfo));
  }, [dispatch, pageInfo.page, pageInfo.pageSize]);

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
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    modalBodyContent: "",
    saveButtonAction: "",
  });

  const CommentForm = () => {
    const initialValues = {
      comment: "",
    };
    const formSubmit = (values) => {};

    return (
      <Formik
        initialValues={{
          ...initialValues,
        }}
        onSubmit={formSubmit}
      >
        <Form>
          <Stack>
            <TextareaAutosize
              name="comment"
              rowsMin={3}
              rowsMax={5}
              placeholder="Comment"
              sx={{ width: "100%" }}
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

  const openRequestModal = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <CommentForm />,
    }));
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <Typography
            variant="h4"
            sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
          >
            Company List
          </Typography>
          <Typography variant="small2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            name="search"
            label="Search by username & ID"
            type="text"
            fullWidth
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                height: "3rem",
                borderRadius: "6px",
              },
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
          <Select name="Company" fullWidth size="small">
            <MenuItem value="">
              <em>Company type</em>
            </MenuItem>
          </Select>
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
    </Container>
  );
};

export default CompanyListing;
