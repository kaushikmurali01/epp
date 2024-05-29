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
import { format } from "date-fns";
import EvModal from "utils/modal/EvModal";
import { array } from "yup";
import {
  deleteAdminMeter,
  fetchAdminMeterListing,
  fetchAdminMeterStatistics,
} from "../../../redux/admin/actions/adminMeterActions";

const AdminMeterListing = ({
  onAddButtonClick,
  onEntriesListClick,
  OnEditMeterButton,
}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [meterToDelete, setMeterToDelete] = useState("");

  useEffect(() => {
    dispatch(fetchAdminMeterStatistics(id));
  }, [dispatch]);

  const meterStatistics = useSelector(
    (state) => state?.adminMeterReducer?.meterStatistics?.data
  );

  const METER_TYPE_ARRAY = [
    { id: 1, value: "Electricity" },
    { id: 2, value: "Water" },
    { id: 3, value: "Natural Gas" },
  ];
  const getMeterTypeValue = (array, meter_type) => {
    const foundType = array.find((type) => type.id === meter_type);
    return foundType ? foundType.value : null;
  };

  const handleDeleteMeter = (mId) => {
    if (mId) {
      dispatch(deleteAdminMeter(mId))
        .then(() => {
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          dispatch(fetchAdminMeterListing(pageInfo, id));
        })
        .catch((error) => {
          console.error("Error deleting facility:", error);
        });
    }
  };

  const openDeleteMeterModal = (meterId) => {
    setMeterToDelete(meterId);
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
    }));
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
    headerText: "Delete Meter",
    headerSubText: "Are you sure you want to delete this meter?",
    modalBodyContent: "",
    saveButtonAction: handleDeleteMeter,
  });

  const columns = [
    {
      Header: "Meter name",
      accessor: "meter_name",
    },
    {
      Header: "Meter type",
      accessor: (item) => {
        return getMeterTypeValue(METER_TYPE_ARRAY, item?.meter_type);
      },
    },
    {
      Header: "Meter ID",
      accessor: "meter_id",
    },
    {
      Header: "Status",
      accessor: (item) => <>{item?.stil_in_use ? "Active" : "Inactive"}</>,
    },
    {
      Header: "Most recent update",
      accessor: (item) => (
        <>{item?.updated_at && format(item?.updated_at, "MM/dd/yyyy")}</>
      ),
    },
    {
      Header: "In use(inactive date)",
      accessor: (item) => (
        <>
          {!item?.stil_in_use &&
            item?.meter_inactive &&
            format(item?.meter_inactive, "MM/dd/yyyy")}
        </>
      ),
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box
          display="flex"
          onClick={(e) => e.stopPropagation()}
          justifyContent="flex-end"
        >
          <Button
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
              textWrap: "nowrap",
            }}
            onClick={() => handleEntriesListClick(item.id, item?.meter_id)}
          >
            Add data
          </Button>
          <Button
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
              fontSize: "0.875rem",
              color: "#027397",
            }}
            onClick={() => handleEditButtonClick(item.id)}
          >
            Edit
          </Button>
          <Button
            color="error"
            disableRipple
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              marginLeft: "1rem",
              fontSize: "0.875rem",
            }}
            onClick={() => openDeleteMeterModal(item.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const meterListingData = useSelector(
    (state) => state?.adminMeterReducer?.meterList?.data?.rows || []
  );
  const meterCount = useSelector(
    (state) => state?.adminMeterReducer?.meterList?.data?.count || []
  );

  useEffect(() => {
    dispatch(fetchAdminMeterListing(pageInfo, id));
  }, [dispatch, pageInfo.page, pageInfo.pageSize, id]);

  const handleAddButtonClick = () => {
    onAddButtonClick();
  };

  const handleEntriesListClick = (id, meter_id) => {
    console.log(id, meter_id);
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
                    Meter type
                  </TableCell>
                  {Array.isArray(meterStatistics) &&
                    meterStatistics?.map((type, index) => (
                      <TableCell
                        key={type.meterType}
                        sx={{ color: "#111", fontStyle: "italic" }}
                      >
                        {type?.["Meter type"]}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                    Total meters
                  </TableCell>
                  {Array.isArray(meterStatistics) &&
                    meterStatistics?.map((count, index) => (
                      <TableCell key={index} sx={{ color: "#111" }}>
                        {count?.["Total meters"]}
                      </TableCell>
                    ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                    Current date
                  </TableCell>
                  {Array.isArray(meterStatistics) &&
                    meterStatistics?.map((date, index) => (
                      <TableCell key={index} sx={{ color: "#111" }}>
                        {date?.["Current energy date"] &&
                          format(
                            new Date(date?.["Current energy date"]),
                            "yyyy-MM-dd"
                          )}
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
          count={meterCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          onClick={(id, res) => handleEntriesListClick(id, res?.meter_id)}
          cursorStyle="pointer"
        />
      </Box>
      <EvModal
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        actionButtonData={meterToDelete}
      />
    </>
  );
};

export default AdminMeterListing;
