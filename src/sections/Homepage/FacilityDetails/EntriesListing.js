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
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const columns = [
      {
        Header: "Start date",
        accessor: "start_date",
      },
      {
        Header: "End date",
        accessor: "end_date",
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
        accessor: "updated_at",
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
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
        </Box>
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
  