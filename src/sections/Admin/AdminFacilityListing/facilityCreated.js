import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Box, Button } from "@mui/material";
import Table from "../../../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAdminFacility,
  fetchAdminFacilityListing,
} from "../../../redux/admin/actions/adminFacilityActions";
import AdminFacilityStatus from "components/AdminFacilityStatus";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EvModal from "utils/modal/EvModal";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { format } from "date-fns";

const FacilityCreated = ({ searchVal, companyFilter }) => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [facilityToDelete, setFacilityToDelete] = useState("");

  const debouncedSearch = debounce((pageInfo, searchString, company_filter) => {
    dispatch(
      fetchAdminFacilityListing(pageInfo, "", searchString, company_filter)
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
  const openDeleteFacilityModal = (facilityId) => {
    setFacilityToDelete(facilityId);
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
    }));
  };

  const handleDeleteFacility = (id) => {
    if (id) {
      dispatch(deleteAdminFacility(id))
        .then(() => {
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          dispatch(fetchAdminFacilityListing(pageInfo, 0));
        })
        .catch((error) => {
          console.error("Error deleting facility:", error);
        });
    }
  };

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
      saveButton: true,
      cancelButton: true,
      saveButtonName: "Delete",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "Delete facility",
    headerSubText: "Are you sure you want to delete this facility?",
    modalBodyContent: "",
    saveButtonAction: handleDeleteFacility,
  });
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
            onClick={() =>
              navigate(`/facility-list/facility-details/${item?.id}`)
            }
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
            onClick={() => navigate(`/facility-list/edit-facility/${item?.id}`)}
          >
            Edit
          </Button>
          <Button
            color="error"
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
            }}
            onClick={() => openDeleteFacilityModal(item.id)}
          >
            Delete
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
                List of all facilities
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
            onClick={(id) => navigate(`/facility-list/facility-details/${id}`)}
          />
        </Grid>
      </Grid>
      <EvModal
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        actionButtonData={facilityToDelete}
      />
    </Container>
  );
};

export default FacilityCreated;
