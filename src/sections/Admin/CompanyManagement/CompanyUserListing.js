import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import { Box, Container, Grid, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUsersByCompanyId } from "../../../redux/admin/actions/adminCompanyAction";

import Loader from "pages/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { format } from "date-fns";

const CompanyUserListing = () => {
  const columns = [
    {
      Header: "UserId",
      accessor: "user_id",
    },
    {
      Header: "User name",
      accessor: (item) => (
        <>
          {item?.first_name} {item?.last_name}
        </>
      ),
    },
    {
      Header: "User email",
      accessor: "email",
    },
    {
      Header: "User type",
      accessor: "role_name",
    },
    {
      Header: "Created on(Date)",
      accessor: (item) => (
        <>
          {item?.created_at && format(new Date(item?.created_at), "yyyy-MM-dd")}
        </>
      ),
    },
    {
      Header: "Status",
      accessor: (item) => <>{item?.is_active === 1 ? "Inactive" : "Active"}</>,
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
          Company users list
        </Typography>
      </Grid>
      <Grid container mt={2} alignItems="center" justifyContent="space-between">
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

export default CompanyUserListing;
