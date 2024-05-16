import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import FacilityRejectedTable from "components/FacilityRejected";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminFacilityListing } from "../../../redux/admin/actions/adminFacilityActions";
import Table from "components/Table";
import AdminFacilityStatus from "components/AdminFacilityStatus";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const FacilityRejected = ({ searchVal }) => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const debouncedSearch = debounce((pageInfo, searchString) => {
    dispatch(fetchAdminFacilityListing(pageInfo, 6, searchString));
  }, 300);

  useEffect(() => {
    debouncedSearch(pageInfo, searchVal);
    return () => {
      debouncedSearch.cancel();
    };
  }, [dispatch, pageInfo.page, pageInfo.pageSize, searchVal]);

  const adminFacilityData = useSelector(
    (state) => state?.adminFacilityReducer?.facilityList?.data?.rows || []
  );
  const adminFacilityCount = useSelector(
    (state) => state?.adminFacilityReducer?.facilityList?.data?.count || []
  );

  const columns = [
    {
      Header: "Facility ID",
      accessor: "id",
    },
    {
      Header: "Submitted by",
      accessor: "submitted_by",
    },
    {
      Header: "Company Name",
      accessor: "company_name",
    },
    {
      Header: "Business Email",
      accessor: "email",
    },
    {
      Header: "Status",
      accessor: (item) => (
        <AdminFacilityStatus>
          {item?.facility_id_submission_status}
        </AdminFacilityStatus>
      ),
    },
    {
      Header: "Submitted on",
      accessor: "submitted_on",
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box display="flex" onClick={(e) => e.stopPropagation()}>
          <Button
            style={{
              color: "#F26D04",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            // onClick={() => openDeleteModal(item?.id)}
          >
            Comment
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h2"
            sx={{
              marginTop: "2rem",
              marginBottom: "2rem",
              color: "#242424",
              fontWeight: "500",
              fontSize: "20px !important",
              fontStyle: "italic",
              lineHeight: "27.5px",
              letterSpacing: "-0.01125rem",
              fontStyle: "italic",
            }}
          >
            List of rejected facilities
          </Typography>
          <Table
            columns={columns}
            data={adminFacilityData}
            count={adminFacilityCount}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
            onClick={(id) => navigate(`/facility-list/facility-details/${id}`)}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityRejected;
