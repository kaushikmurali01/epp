import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Tabs, Tab, Button } from "@mui/material";
import FacilityOverview from "./facilityOverview";
import FacilityApproved from "./facilityApproved";
import FacilityReview from "./facilityReview";
import FacilityRejected from "./facilityRejected";
import { GET_REQUEST } from "utils/HTTPRequests";
import { facilityEndPoints } from "constants/apiEndPoints";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";

const FacilityPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("overview");
  const [tableData, setTableData] = useState([]);
  const [approvedListData, setApprovedDataList] = useState([]);
  const [inReviewListData, setInReviewList] = useState([]);
  const [rejectedListData, setRejectedList] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case "overview":
        return <FacilityOverview />;
      case "approved":
        return <FacilityApproved data={approvedListData} count={approvedListData?.length} />;
      case "underreview":
        return <FacilityReview data={inReviewListData} count={inReviewListData?.length} />;
      case "rejected":
        return <FacilityRejected data={rejectedListData} count={rejectedListData?.length} />;
      default:
        return null;
    }
  };

  useEffect (() => {
    getFacilityData();
  },[])

  const getFacilityData = () => {
    GET_REQUEST(facilityEndPoints.ADMIN_FACILITY_LIST + "/" + pageInfo.page + "/" + pageInfo.pageSize)
      .then((response) => {
        if (response.data.statusCode == 200) {
          const filteredApprovedData = response.data.data.rows.filter(item => item.facility_id_submission_status == 5);
          setApprovedDataList(filteredApprovedData);
          const filteredInReviewData = response.data.data.rows.filter(item => item.facility_id_submission_status == 3);
          setInReviewList(filteredInReviewData);
          const filteredRejectedData = response.data.data.rows.filter(item => item.facility_id_submission_status == 6);
          setRejectedList(filteredRejectedData);
          setTableData(response.data.data);
        }
      })
      .catch((error) => {
      });
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <Typography
        variant="h2"
        sx={{
          color: "#242424",
          fontWeight: "500",
          fontSize: "1.25rem !important",
          fontStyle: "italic",
          lineHeight: "106.815%",
          letterSpacing: "-0.01125rem",
        }}
      >
        Facilities Management
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "200",
          fontSize: ".725rem",
        }}
      >
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </Typography>
          </Grid>
      <Grid
          item
          xs={12}
          sm={6}
          display="flex"
          alignItems="center"
          justifyContent="right"
        >
          <Button
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            disableRipple
            endIcon={
              <AddCircleIcon
                style={{
                  color: "text.primary",
                  fontSize: "2rem",
                }}
              />
            }
            onClick={() => navigate("/admin/add-facility")}
          >
            Add Facility
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8}>
        <Tabs
          className="theme-tabs-list"
          value={tabValue}
          onChange={handleChange}
          sx={{ display: "inline-flex" }}
        >
          <Tab value="overview" label="Overview" sx={{ minWidth: "10rem" }} />
          <Tab value="approved" label="Approved" sx={{ minWidth: "10rem" }} />
          <Tab
            value="underreview"
            label="Under Review"
            sx={{ minWidth: "10rem" }}
          />
          <Tab value="rejected" label="Rejected" sx={{ minWidth: "10rem" }} />
        </Tabs>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderTabContent()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityPage;