import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAdminCompanyListing,
  fetchUsersByCompanyId,
} from "../../../redux/admin/actions/adminCompanyAction";
import { format } from "date-fns";
import { debounce } from "lodash";
import Loader from "pages/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CompanyManageUserAccess = () => {
  const columns = [
    {
      Header: "UserID",
      accessor: "user_id",
    },
    {
      Header: "User full name",
      accessor: (item) => (
        <>
          {item?.first_name} {item?.last_name}
        </>
      ),
    },
    {
      Header: "Company name",
      accessor: "company_name",
    },
    {
      Header: "Business email",
      accessor: "email",
    },
    {
      Header: "User type",
      accessor: "role_name",
    },
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
            disableRipple
            style={{
              color: "#2C77E9",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            disabled
          >
            Manage permissions
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
            disabled
          >
            Remove
          </Button>
        </Box>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const companyUserListData = useSelector(
    (state) => state?.adminCompanyReducer?.companyUsersById?.data?.rows || []
  );

  const userCount = useSelector(
    (state) => state?.adminCompanyReducer?.companyUsersById?.data?.count || []
  );
  const loadingState = useSelector(
    (state) => state?.adminCompanyReducer?.loading
  );

  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  useEffect(() => {
    dispatch(fetchUsersByCompanyId(pageInfo, id));
  }, [dispatch, pageInfo.page, pageInfo.pageSize, id]);

  return (
    <Container>
      <Grid container mb={4} alignItems="center">
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
          sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
        >
          Manage access
        </Typography>
      </Grid>

      <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={companyUserListData}
          count={userCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
        />
      </Box>
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState}
        loaderPosition="fixed"
      />
    </Container>
  );
};

export default CompanyManageUserAccess;
