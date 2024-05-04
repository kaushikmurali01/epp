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
import React, { useEffect, useMemo, useState } from "react";
import { METER_LIST_COLUMNS } from "../../../utils/tableColumns";
import Table from "components/Table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeterListing } from "./../../../redux/actions/metersActions";

const MeterListing = ({ onAddButtonClick }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const columns = useMemo(() => METER_LIST_COLUMNS, []);
  const meterData = [
    { meterType: "Electricity", currentEnergyDate: "05/01/2024", value: 1 },
    { meterType: "Natural Gas", currentEnergyDate: "05/01/2024", value: 1 },
    { meterType: "Water", currentEnergyDate: "05/01/2024", value: 1 },
  ];

  const meterListingData = useSelector(
    (state) => state?.meterReducer?.meterList?.data || []
  );
  useEffect(() => {
    dispatch(fetchMeterListing(pageInfo));
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
        />
      </Box>
    </>
  );
};

export default MeterListing;
