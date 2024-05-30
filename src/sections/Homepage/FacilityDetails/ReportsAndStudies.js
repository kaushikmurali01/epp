import {
  Box,
  Button,
  Grid,
  InputLabel,
  Link,
  Tab,
  Tabs,
  ToggleButton,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import React, { useRef, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EvModal from "utils/modal/EvModal";
import { Formik, Form } from "formik";
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";
import SelectBox from "components/FormBuilder/Select";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { fileUploadAction } from "../../../redux/global/actions/fileUploadAction";
import MesureReportCard from "components/MesureReportCard";
import DocumentCard from "components/DocumentCard";
const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: "1.5rem",
  margin: theme.spacing(1),
  minWidth: "48px",
  minHeight: "48px",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));
const ReportsAndStudies = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState("measureReport");
  const measureFileInputRef = useRef(null);
  const [measureImgUrl, setMeasureImgUrl] = useState("");
  const [measureSelectedFile, setMeasureSelectedFile] = useState();
  const documentFileInputRef = useRef(null);
  const [documentImgUrl, setDocumentImgUrl] = useState("");
  const [documentSelectedFile, setDocumentSelectedFile] = useState();
  const dispatch = useDispatch();
  const [selectedDocsFilter, setSelectedDocsFilter] = useState([]);
  const filterOptionsDocs = [
    "All",
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
  ];

  const handleDocsFilterChange = (event, newSelected) => {
    if (newSelected.includes("All") && !selectedDocsFilter.includes("All")) {
      setSelectedDocsFilter(["All"]);
    } else {
      const filteredSelected = newSelected.filter((option) => option !== "All");
      setSelectedDocsFilter(filteredSelected);
    }
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
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

  const handleMeasureFileChange = (event) => {
    const acceptedDocTypes = [".pdf"];
    const selectedFile = event.target.files[0];
    const fileExtension = `.${selectedFile.name
      .split(".")
      .pop()
      .toLowerCase()}`;

    if (!acceptedDocTypes.includes(fileExtension)) {
      alert(`Selected file type is not supported. Please select a PDF file.`);
      event.target.value = "";
      return;
    }
    setMeasureSelectedFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile))
      .then((data) => {
        setMeasureImgUrl(data?.sasTokenUrl);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleMeasureButtonClick = () => {
    measureFileInputRef.current.click();
  };

  const deleteMeasurePicture = () => {
    setMeasureSelectedFile("");
    setMeasureImgUrl("");
  };
  const MeasureReportForm = () => {
    const initialValues = {};
    const handleFormSubmit = (values) => {};

    return (
      <>
        <Formik
          initialValues={{ ...initialValues }}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Grid container rowGap={4}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      name="measure_name"
                      label="Measure name *"
                      type="text"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <SelectBox
                      name="measure_category"
                      label="Measure category"
                      valueKey="value"
                      labelKey="label"
                      // options={FLOOR_AREA_ARRAY}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      name="measure_installation_cost"
                      label="Measure installation cost "
                      type="number"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault()
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <InputField
                      name="baseline_conditional_details"
                      label="Baseline conditional details"
                      type="text"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <InputField
                      name="measure_description"
                      label="Measure description"
                      type="text"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="measure_installation_start_date"
                      label="Measure installation start date"
                      type="date"
                      inputProps={{
                        max: format(new Date(), "yyyy-MM-dd"),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="measure_completion_date"
                      label="Measure completion date"
                      type="date"
                      inputProps={{
                        max: format(new Date(), "yyyy-MM-dd"),
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={4}>
                    <InputLabel style={{ whiteSpace: "initial" }}>
                      Measure detail
                    </InputLabel>
                    {!measureSelectedFile ? (
                      <>
                        <Typography
                          my={1}
                          sx={{
                            color: "#696969",
                            fontWeight: "500",
                            fontSize: "18px",
                            border: "1px solid #D0D0D0",
                            backgroundColor: "#D1FFDA",
                            padding: "6px 34px",
                            borderRadius: "8px",
                            width: "140px",
                            height: "40px",
                            cursor: "pointer",
                          }}
                          onClick={handleMeasureButtonClick}
                        >
                          Upload
                        </Typography>
                        <input
                          type="file"
                          ref={measureFileInputRef}
                          style={{ display: "none" }}
                          onChange={handleMeasureFileChange}
                          accept={".pdf"}
                        />
                      </>
                    ) : (
                      <div style={{ display: "flex" }}>
                        <Link
                          target="_blank"
                          href={measureSelectedFile}
                          sx={{
                            textDecoration: "none",
                            fontSize: "2rem",
                            marginTop: "1.7rem",
                          }}
                          variant="h5"
                        >
                          Uploaded meter specification
                        </Link>
                        <div style={{ marginLeft: "20px" }}>
                          <Typography
                            my={1}
                            sx={{
                              color: "#2C77E9",
                              fontWeight: "500",
                              fontSize: "16px !important",
                              cursor: "pointer",
                            }}
                            onClick={handleMeasureButtonClick}
                          >
                            Change File
                          </Typography>
                          <input
                            type="file"
                            ref={measureFileInputRef}
                            style={{ display: "none" }}
                            onChange={handleMeasureFileChange}
                            accept={".pdf"}
                          />
                          <Typography
                            my={1}
                            sx={{
                              color: "#FF5858",
                              fontWeight: "500",
                              fontSize: "16px !important",
                              cursor: "pointer",
                            }}
                            onClick={deleteMeasurePicture}
                          >
                            Delete File
                          </Typography>
                        </div>
                      </div>
                    )}
                  </Grid>
                  <Grid item sx={12} sm={8}>
                    <InputField
                      name="file_description"
                      label="File description"
                      type="text"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid display="flex" sx={{ marginTop: "1rem" }}>
                <ButtonWrapper type="submit" variant="contained">
                  {true ? "Add" : "Save"}
                </ButtonWrapper>
              </Grid>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  const openAddMeasureModal = () => {
    setAddMeasureModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: true ? "Add measure" : "Edit measure",
      modalBodyContent: <MeasureReportForm />,
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
    // saveButtonAction: handleDeleteFacility,
  });
  const handleDocumentFileChange = (event) => {
    const acceptedDocTypes = [".pdf"];
    const selectedFile = event.target.files[0];
    const fileExtension = `.${selectedFile.name
      .split(".")
      .pop()
      .toLowerCase()}`;

    if (!acceptedDocTypes.includes(fileExtension)) {
      alert(`Selected file type is not supported. Please select a PDF file.`);
      event.target.value = "";
      return;
    }
    setDocumentSelectedFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile))
      .then((data) => {
        setDocumentImgUrl(data?.sasTokenUrl);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleDocumentButtonClick = () => {
    documentFileInputRef.current.click();
  };

  const deleteDocumentPicture = () => {
    setDocumentSelectedFile("");
    setDocumentImgUrl("");
  };
  const DocumentForm = () => {
    const initialValues = {};
    const handleFormSubmit = (values) => {};

    return (
      <>
        <Formik
          initialValues={{ ...initialValues }}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Grid container rowGap={4}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={4}>
                    <InputLabel style={{ whiteSpace: "initial" }}>
                      Select file
                    </InputLabel>
                    {!documentSelectedFile ? (
                      <>
                        <Typography
                          my={1}
                          sx={{
                            color: "#696969",
                            fontWeight: "500",
                            fontSize: "18px",
                            border: "1px solid #D0D0D0",
                            backgroundColor: "#D1FFDA",
                            padding: "6px 34px",
                            borderRadius: "8px",
                            width: "140px",
                            height: "40px",
                            cursor: "pointer",
                          }}
                          onClick={handleDocumentButtonClick}
                        >
                          Upload
                        </Typography>
                        <input
                          type="file"
                          ref={documentFileInputRef}
                          style={{ display: "none" }}
                          onChange={handleDocumentFileChange}
                          accept={".pdf"}
                        />
                      </>
                    ) : (
                      <div style={{ display: "flex" }}>
                        <Link
                          target="_blank"
                          href={documentSelectedFile}
                          sx={{
                            textDecoration: "none",
                            fontSize: "2rem",
                            marginTop: "1.7rem",
                          }}
                          variant="h5"
                        >
                          Uploaded meter specification
                        </Link>
                        <div style={{ marginLeft: "20px" }}>
                          <Typography
                            my={1}
                            sx={{
                              color: "#2C77E9",
                              fontWeight: "500",
                              fontSize: "16px !important",
                              cursor: "pointer",
                            }}
                            onClick={handleDocumentButtonClick}
                          >
                            Change File
                          </Typography>
                          <input
                            type="file"
                            ref={documentFileInputRef}
                            style={{ display: "none" }}
                            onChange={handleDocumentFileChange}
                            accept={".pdf"}
                          />
                          <Typography
                            my={1}
                            sx={{
                              color: "#FF5858",
                              fontWeight: "500",
                              fontSize: "16px !important",
                              cursor: "pointer",
                            }}
                            onClick={deleteDocumentPicture}
                          >
                            Delete File
                          </Typography>
                        </div>
                      </div>
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      name="document_name"
                      label="Document name"
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SelectBox
                      name="document_description"
                      label="Document description"
                      valueKey="value"
                      labelKey="label"
                      // options={FLOOR_AREA_ARRAY}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid display="flex" sx={{ marginTop: "1rem" }}>
                <ButtonWrapper type="submit" variant="contained">
                  {true ? "Add" : "Save"}
                </ButtonWrapper>
              </Grid>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  const openAddDocumentModal = () => {
    setAddDocumentModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: true ? "Add measure" : "Edit measure",
      modalBodyContent: <DocumentForm />,
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
            sx={{ display: !isSmallScreen && "inline-flex" }}
            scrollButtons
          >
            <Tab
              value="measureReport"
              label="Measure Report"
              sx={{ minWidth: "10rem" }}
            />
            <Tab value="document" label="Document" sx={{ minWidth: "10rem" }} />
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
              onClick={openAddMeasureModal}
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
              {[1, 2, 3, 4].map((item) => (
                <MesureReportCard onOpenEdit={openAddMeasureModal} />
              ))}
            </Grid>
          ) : (
            <Grid container>
              {filterOptionsDocs.map((option) => (
                <CustomToggleButton
                  key={option}
                  value={option}
                  selected={selectedDocsFilter.includes(option)}
                  onChange={() =>
                    handleDocsFilterChange(
                      null,
                      selectedDocsFilter.includes(option)
                        ? selectedDocsFilter.filter((item) => item !== option)
                        : [...selectedDocsFilter, option]
                    )
                  }
                >
                  {option}
                </CustomToggleButton>
              ))}
              <Grid container rowGap={4} mt={4} columnGap={4}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <DocumentCard />
                ))}
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
    </Box>
  );
};

export default ReportsAndStudies;
