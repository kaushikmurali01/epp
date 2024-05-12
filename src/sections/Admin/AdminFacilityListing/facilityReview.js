import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import Table from "../../../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminFacilityListing } from "../../../redux/admin/actions/adminFacilityActions";
import AdminFacilityStatus from "components/AdminFacilityStatus";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const FacilityReview = () => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminFacilityListing(pageInfo, 3));
  }, [dispatch, pageInfo.page, pageInfo.pageSize]);

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
              color: "#007398",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            // onClick={() => openDeleteModal(item?.id)}
          >
            Download
          </Button>
          <Button
            style={{
              color: "#2E813E",
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            // onClick={() => openDeleteModal(item?.id)}
          >
            Review
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container mt={4} mb={4}>
            <Grid item xs={6}>
              <Typography
                variant="h2"
                sx={{
                  color: "#242424",
                  fontWeight: "500",
                  fontSize: "20px !important",
                  fontStyle: "italic",
                  lineHeight: "27.5px",
                  letterSpacing: "-0.01125rem",
                  fontStyle: "italic",
                }}
              >
                List of under review facilities
              </Typography>
            </Grid>
            <Grid container xs={6} gap={4} justifyContent="flex-end">
              <Grid item alignContent="center">
                <Button
                  style={{
                    backgroundColor: "transparent",
                    color: "#007398",
                    padding: 0,
                    minWidth: "unset",
                    fontSize: "0.875rem",
                  }}
                  disableRipple
                  startIcon={
                    <FileDownloadIcon
                      style={{
                        color: "text.primary",
                        fontSize: "2rem",
                      }}
                    />
                  }
                >
                  Download Bulk
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Table
            columns={columns}
            data={adminFacilityData}
            count={adminFacilityCount}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityReview;
