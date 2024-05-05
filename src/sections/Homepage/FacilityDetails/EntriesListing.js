import {
  Box,
  Button,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Grid,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { useEffect, useState } from "react";
import Table from "components/Table";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntriesListing } from "./../../../redux/actions/entriesAction";
import FacilityStatus from "components/FacilityStatus";
import { format } from "date-fns";

const EntriesListing = ({ onAddButtonClick, meterId }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [tabValue, setTabValue] = useState('monthlyEntries');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const columns = [
    {
      Header: "Start date",
      accessor: (item) => <>{format(item.start_date, "MM/dd/yyyy")}</>,
    },
    {
      Header: "End date",
      accessor: (item) => <>{format(item.end_date, "MM/dd/yyyy")}</>,
    },
    {
      Header: "Usage (KWh)",
      accessor: "usage",
    },
    {
      Header: "Demand (KW)",
      accessor: "demand",
    },
    {
      Header: "Total cost",
      accessor: "total_cost",
    },
    {
      Header: "Last updated",
      accessor: (item) => <>{format(item.updated_at, "MM/dd/yyyy")}</>,
    },
  ];

  const enteriesListingData = useSelector(
    (state) => state?.entriesReducer?.entriesList?.data?.rows || []
  );
  useEffect(() => {
    dispatch(fetchEntriesListing(pageInfo, meterId));
  }, [dispatch, pageInfo]);

  const handleAddButtonClick = () => {
    onAddButtonClick();
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center",
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >

      <Box sx={{
        borderRight: "1px solid black",
        padding: '0 20px 0 20px',
      }}>
        <Typography variant="small2">
          Meter Name
        </Typography>
        <Typography variant="h6" gutterBottom>
          Meter name 1
        </Typography>
      </Box>

      <Box sx={{
        borderRight: "1px solid black",
        padding: '0 20px 0 20px',
      }}>
        <Typography variant="small2">
          Meter ID
        </Typography>
        <Typography variant="h6" gutterBottom>
          345634756
        </Typography>
      </Box>

      <Box sx={{
        borderRight: "1px solid black",
        padding: '0 20px 0 20px',
      }}>
        <Typography variant="small2">
          Meter type
        </Typography>
        <Typography variant="h6" gutterBottom>
          Electricity
        </Typography>
      </Box>

      <Box sx={{
        borderRight: "1px solid black",
        padding: '0 20px 0 20px',
      }}>
        <Typography variant="small2">
          Date meter became active
        </Typography>
        <Typography variant="h6" gutterBottom>
          05/01/2024
        </Typography>
      </Box>

      <Box sx={{
        padding: '0 0 0 20px',
      }}>
        <Typography variant="h6" gutterBottom>
        Revenue-grade meter
        </Typography>
      </Box>

      <Box sx={{
        padding: '5px 0 0 20px',
      }}>
        <Typography variant='small' sx={{ color: 'blue.main', cursor: 'pointer' }}>
            Edit
          </Typography>
          <Typography variant='small' sx={{ color: 'danger.main', cursor: 'pointer', marginLeft: '20px' }}>
            Delete
          </Typography>
      </Box>

      </Box>

      <Grid container sx={{ alignItems: "center", justifyContent: 'space-between', marginTop: '1rem', marginBottom: '3rem' }}>
        <Grid item xs={12} md={8} >
          <Tabs
            className='theme-tabs-list'
            value={tabValue}
            onChange={handleChange}
            sx={{ display: 'inline-flex' }}
          >
            <Tab value="monthlyEntries" label="Monthly entries" sx={{ minWidth: '10rem' }} />
            <Tab value="hourlyOrSub-hourlyEntries" label="Hourly or Sub-hourly entries" sx={{ minWidth: '10rem' }} />
          </Tabs>
        </Grid>
        <Grid item sx={{ justifySelf: 'flex-end' }}>
          <Typography variant='small' sx={{ color: 'blue.main', cursor: 'pointer' }}>
            Downlod in excel
          </Typography>
          <Typography variant='small' sx={{ color: 'danger.main', cursor: 'pointer', marginLeft: '20px' }}>
            Delete entry
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={enteriesListingData}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
        />
      </Box>
    </>
  );
};

export default EntriesListing;
