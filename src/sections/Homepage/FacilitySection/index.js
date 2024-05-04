import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacilityListing } from "./../../../redux/actions/facilityActions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import FacilityStatus from "components/FacilityStatus";
import CustomSlider from "components/CustomSlider";

const Facility = () => {
  const columns = [
    {
      Header: "Name/Nick Name",
      accessor: (item) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textWrap: "nowrap",
            alignItems: "flex-start",
          }}
          gap={2}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography>{item.facility_name}</Typography>
          <Button variant="contained">Submit for approval</Button>
          <Link
            href="#"
            variant="small"
            sx={{ color: "#2C77E9", cursor: "pointer" }}
            underline="none"
          >
            Update energy savings calculation
          </Link>
        </Box>
      ),
    },
    {
      Header: "Total Electicity Savings",
      accessor: "total_electicity_savings",
    },
    {
      Header: "% Energy Savings",
      accessor: (item) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>{item.energy_savings}%</Typography>
          <CustomSlider value={item.energy_savings} />
        </Box>
      ),
    },
    {
      Header: "Total Incentive Earned",
      accessor: "total_Incentive_earned",
    },
    {
      Header: "Benchmarking EUI",
      accessor: "benchmarking_eui",
    },
    {
      Header: "Facility Status",
      accessor: (item) => (
        <FacilityStatus>{item.facility_status}</FacilityStatus>
      ),
    },
    {
      Header: "View/Edit",
      accessor: (item) => (
        <Box display="flex" onClick={(e) => e.stopPropagation()}>
          <Button
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
            }}
            // onClick={() =>
            //   navigate(`/admin/add-facility${id}` })
            // }
            onClick={(id) => navigate(`/admin/edit-facility/${item?.id}`)}
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
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const facilityListData = useSelector(
    (state) => state.facilityReducer.facilityList.data || []
  );
  const loading = useSelector((state) => state.facilityReducer.loading);
  const error = useSelector((state) => state.facilityReducer.error);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  useEffect(() => {
    dispatch(fetchFacilityListing(pageInfo));
  }, [dispatch, pageInfo]);

  return (
    <Container sx={{ mt: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h4"
            sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
          >
            Facility List
          </Typography>
          <Typography variant="small2">
            Please note that signing{" "}
            <Link
              href="#"
              variant="span2"
              sx={{ color: "#2C77E9", cursor: "pointer" }}
              underline="none"
            >
              {" "}
              Participant Agreement
            </Link>{" "}
            is mandatory before you enrol your facility
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            name="search"
            label="Search by Facility name & ID"
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
          xs={6}
          sm={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
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
      <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={facilityListData}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          onClick={(id) => navigate(`/admin/facility-details/${id}`)}
        />
      </Box>
    </Container>
  );
};

export default Facility;
