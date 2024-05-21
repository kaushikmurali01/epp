import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import FacilityRejectedTable from "components/FacilityRejected";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminFacilityListing } from "../../../redux/admin/actions/adminFacilityActions";
import Table from "components/Table";
import AdminFacilityStatus from "components/AdminFacilityStatus";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { format } from "date-fns";

const FacilityRejected = ({ searchVal, companyFilter }) => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const debouncedSearch = debounce((pageInfo, searchString, company_filter) => {
    dispatch(
      fetchAdminFacilityListing(pageInfo, 6, searchString, company_filter)
    );
  }, 300);

  useEffect(() => {
    debouncedSearch(pageInfo, searchVal, companyFilter);
    return () => {
      debouncedSearch.cancel();
    };
  }, [dispatch, pageInfo.page, pageInfo.pageSize, searchVal, companyFilter]);

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
      Header: "Facility name",
      accessor: "facility_name",
    },
    {
      Header: "Submitted by",
      accessor: "submitted_by",
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
      Header: "Status",
      accessor: (item) => (
        <AdminFacilityStatus>
          {item?.facility_id_submission_status}
        </AdminFacilityStatus>
      ),
    },
    {
      Header: "Submitted on",
      accessor: (item) => (
        <>{item?.submitted_on && format(item?.submitted_on, "MM/dd/yyyy")}</>
      ),
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
