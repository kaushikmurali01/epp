import {
  Box,
  Button,
  Grid,
  Tab,
  Tabs,
  ToggleButton,
  styled,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EvModal from "utils/modal/EvModal";

import { useDispatch, useSelector } from "react-redux";
import MeasureReportCard from "./MeasureReportCard";
import DocumentCard from "./DocumentCard";
import DocumentForm from "./DocumentForm";
import MeasureReportForm from "./MeasureReportForm";
import { useParams } from "react-router-dom";
import {
  fetchFacilityDocumentListing,
  fetchFacilityMeasureReportListing,
} from "../../../../redux/superAdmin/actions/facilityActions";
import Loader from "pages/Loader";
import CustomPagination from "components/CustomPagination";

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: "1.5rem",
  margin: theme.spacing(1),
  minWidth: "48px",
  minHeight: "48px",
  textTransform: "none",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const ReportsAndStudies = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const dispatch = useDispatch();
  const loadingState = useSelector((state) => state?.facilityReducer?.loading);
  const uploadLoadingState = useSelector(
    (state) => state?.fileUploadReducer?.loading
  );
  const [tabValue, setTabValue] = useState("measureReport");
  const [selectedDocsFilter, setSelectedDocsFilter] = useState("");
  const [measurePageInfo, setMeasurePageInfo] = useState({
    page: 1,
    pageSize: 10,
  });
  const [documentPageInfo, setDocumentPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (tabValue === "measureReport") {
      dispatch(fetchFacilityMeasureReportListing(measurePageInfo, id));
    }
  }, [dispatch, tabValue, measurePageInfo, id]);

  useEffect(() => {
    if (tabValue === "document") {
      dispatch(
        fetchFacilityDocumentListing(documentPageInfo, id, selectedDocsFilter)
      );
    }
  }, [
    dispatch,
    tabValue,
    selectedDocsFilter,
    documentPageInfo,
    id,
    selectedDocsFilter,
  ]);

  const measureReportList = useSelector(
    (state) =>
      state?.facilityReducer?.facilityMeasureReportList?.data?.rows || []
  );
  const measureReportCount = useSelector(
    (state) => state?.facilityReducer?.facilityMeasureReportList?.data?.count
  );

  const documentList = useSelector(
    (state) => state?.facilityReducer?.facilityDocumentList?.data?.rows || []
  );

  const documentCount = useSelector(
    (state) => state?.facilityReducer?.facilityDocumentList?.data?.count
  );

  const filterOptionsDocs = [
    { label: "All", value: "" },
    { label: "Study Report", value: "Study Report" },
    { label: "Design Report", value: "Design Report" },
    { label: "Drawing", value: "Drawing" },
    { label: "Invoice", value: "Invoice" },
    { label: "Quotation", value: "Quotation" },
    { label: "Certification", value: "Certification" },
    { label: "Photo", value: "Photo" },
  ];

  const handleDocsFilterChange = (value) => {
    if (selectedDocsFilter === value) {
      setSelectedDocsFilter(null);
    } else {
      setSelectedDocsFilter(value);
    }
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedDocsFilter("");
  };

  const [addMeasureModalConfig, setAddMeasureModalConfig] = useState({
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
      saveButton: false,
      cancelButton: false,
      saveButtonName: "",
      cancelButtonName: "",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "",
    headerSubText: "",
    modalBodyContent: "",
  });

  const openAddMeasureModal = (isEdit, measureId) => {
    setAddMeasureModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: !isEdit ? "Add measure" : "Edit measure",
      modalBodyContent: (
        <MeasureReportForm
          isEdit={isEdit}
          measureId={measureId}
          pageInfo={measurePageInfo}
          setAddMeasureModalConfig={setAddMeasureModalConfig}
        />
      ),
    }));
  };

  const [addDocumentModalConfig, setAddDocumentModalConfig] = useState({
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
      saveButton: false,
      cancelButton: false,
      saveButtonName: "",
      cancelButtonName: "",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    headerText: "",
    headerSubText: "",
    modalBodyContent: "",
  });

  const openAddDocumentModal = () => {
    setAddDocumentModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "Add Document",
      modalBodyContent: (
        <DocumentForm
          pageInfo={documentPageInfo}
          setAddDocumentModalConfig={setAddDocumentModalConfig}
          docsFilter={selectedDocsFilter}
        />
      ),
    }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
      }}
    >
      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
          marginBottom: "3rem",
        }}
      >
        <Grid item xs={12} md={6}>
          <Tabs
            className="theme-tabs-list"
            value={tabValue}
            onChange={handleChange}
            variant={isSmallScreen && "scrollable"}
            sx={{
              display: !isSmallScreen && "inline-flex",
            }}
            scrollButtons
          >
            <Tab
              value="measureReport"
              label="Measure Report"
              sx={{ minWidth: "10rem", textTransform: "none" }}
            />
            <Tab
              value="document"
              label="Document"
              sx={{ minWidth: "10rem", textTransform: "none" }}
            />
          </Tabs>
        </Grid>
        <Grid item sx={{ justifyContent: "flex-end", mt: isSmallScreen && 2 }}>
          {tabValue === "measureReport" ? (
            <Button
              style={{
                backgroundColor: "transparent",
                padding: 0,
                minWidth: "unset",
                fontSize: "0.875rem",
              }}
              disableRipple
              startIcon={
                <AddCircleIcon
                  style={{
                    color: "text.primary",
                    fontSize: "2rem",
                  }}
                />
              }
              onClick={() => openAddMeasureModal(false)}
            >
              Add new measure
            </Button>
          ) : (
            <Button
              style={{
                backgroundColor: "transparent",
                padding: 0,
                minWidth: "unset",
                fontSize: "0.875rem",
              }}
              disableRipple
              startIcon={
                <AddCircleIcon
                  style={{
                    color: "text.primary",
                    fontSize: "2rem",
                  }}
                />
              }
              onClick={openAddDocumentModal}
            >
              Add document
            </Button>
          )}
        </Grid>
        <Grid container mt={2}>
          {tabValue === "measureReport" ? (
            <Grid container rowGap={4} mt={4}>
              {Array.isArray(measureReportList) &&
                measureReportList?.map((item) => (
                  <MeasureReportCard
                    key={item?.id}
                    onOpenEdit={() => openAddMeasureModal(true, item.id)}
                    data={item}
                    pageInfo={measurePageInfo}
                    setAddMeasureModalConfig={setAddMeasureModalConfig}
                  />
                ))}

              {measureReportCount > 0 && (
                <CustomPagination
                  count={measureReportCount}
                  pageInfo={measurePageInfo}
                  setPageInfo={setMeasurePageInfo}
                />
              )}
            </Grid>
          ) : (
            <Grid container>
              {filterOptionsDocs.map((option) => (
                <CustomToggleButton
                  key={option.value}
                  value={option.value}
                  selected={selectedDocsFilter === option.value}
                  onChange={() => handleDocsFilterChange(option.value)}
                >
                  {option.label}
                </CustomToggleButton>
              ))}
              <Grid container rowGap={4} mt={4} columnGap={4}>
                {Array.isArray(documentList) &&
                  documentList?.map((item) => (
                    <DocumentCard
                      key={item?.id}
                      data={item}
                      pageInfo={documentPageInfo}
                      setAddDocumentModalConfig={setAddDocumentModalConfig}
                      docsFilter={selectedDocsFilter}
                    />
                  ))}

                {documentCount > 0 && (
                  <CustomPagination
                    count={documentCount}
                    pageInfo={documentPageInfo}
                    setPageInfo={setDocumentPageInfo}
                  />
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <EvModal
        modalConfig={addMeasureModalConfig}
        setModalConfig={setAddMeasureModalConfig}
      />
      <EvModal
        modalConfig={addDocumentModalConfig}
        setModalConfig={setAddDocumentModalConfig}
      />
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState || uploadLoadingState}
        loaderPosition="fixed"
      />
    </Box>
  );
};

export default ReportsAndStudies;
