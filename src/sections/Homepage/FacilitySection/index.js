import React, { useEffect, useMemo, useState } from "react";
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
import { FACILITY_COLUMNS } from "../../../utils/tableColumns";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacilityListing } from "./../../../redux/actions/facilityActions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";

const Facility = () => {
  const columns = useMemo(() => FACILITY_COLUMNS, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const facilityListData = useSelector(
    (state) => state.facilityReducer.facilityList.data || []
  );
  const loading = useSelector((state) => state.facilityReducer.loading);
  const error = useSelector((state) => state.facilityReducer.error);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: "" });

  useEffect(() => {
    dispatch(fetchFacilityListing());
  }, [dispatch, pageInfo]);

  console.log(facilityListData);
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
            onClick={() => navigate('/admin/add-facility')}
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
        />
      </Box>
    </Container>
  );
};

export default Facility;
