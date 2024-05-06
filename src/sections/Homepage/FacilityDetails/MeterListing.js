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
import { fetchMeterListing } from "./../../../redux/actions/metersActions";
import FacilityStatus from "components/FacilityStatus";
import { format } from "date-fns";

const MeterListing = ({
  onAddButtonClick,
  onEntriesListClick,
  OnEditMeterButton,
}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const columns = [
    {
      Header: "Meter name",
      accessor: "meter_name",
    },
    {
      Header: "Meter type",
      accessor: "meter_type",
    },
    {
      Header: "Meter ID",
      accessor: "meter_id",
    },
    {
      Header: "Status",
      accessor: (item) => <>{item.stil_in_use ? "Active" : "Inactive"}</>,
    },
    {
      Header: "Most recent update",
      accessor: (item) => <>{format(item.updated_at, "MM/dd/yyyy")}</>,
    },
    {
      Header: "In use(inactive date)",
      accessor: (item) => <>{format(item.meter_inactive, "MM/dd/yyyy")}</>,
    },
    {
      Header: "Action",
      accessor: (item) => (
        <Box display="flex" onClick={(e) => e.stopPropagation()}>
          <Button
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
            }}
            onClick={() => handleEditButtonClick(item.id)}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];
  const meterData = [
    { meterType: "Electricity", currentEnergyDate: "05/01/2024", value: 1 },
    { meterType: "Natural Gas", currentEnergyDate: "05/01/2024", value: 1 },
    { meterType: "Water", currentEnergyDate: "05/01/2024", value: 1 },
  ];

  const meterListingData = useSelector(
    (state) => state?.meterReducer?.meterList?.data?.rows || []
  );
  useEffect(() => {
    dispatch(fetchMeterListing(pageInfo, id));
  }, [dispatch, pageInfo, id]);

  const handleAddButtonClick = () => {
    onAddButtonClick();
  };

  const handleEntriesListClick = (id, meter_id) => {
    console.log(id, meter_id)
    onEntriesListClick(id, meter_id);
  };

  const handleEditButtonClick = (id) => {
    OnEditMeterButton(id);
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
        <Box>
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: "#2E813E20",
              boxShadow: "none",
              border: "1px solid #2E813E",
            }}
          >
            <MuiTable size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                    Meter Type
                  </TableCell>
                  {meterData.map((type, index) => (
                    <TableCell
                      key={type.meterType}
                      sx={{ color: "#111", fontStyle: "italic" }}
                    >
                      {type.meterType}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                    Total Meter
                  </TableCell>
                  {meterData.map((count, index) => (
                    <TableCell key={index} sx={{ color: "#111" }}>
                      {count.value}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                    Current Date
                  </TableCell>
                  {meterData.map((date, index) => (
                    <TableCell key={index} sx={{ color: "#111" }}>
                      {date.currentEnergyDate}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </MuiTable>
          </TableContainer>
        </Box>
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
          onClick={handleAddButtonClick}
        >
          Add Meter
        </Button>
      </Box>
      <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={meterListingData}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          onClick={(id, res) => handleEntriesListClick(id, res?.meter_id)}
        />
      </Box>
    </>
  );
};

export default MeterListing;
