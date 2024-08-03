import { Grid, InputLabel, Link, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";
import SelectBox from "components/FormBuilder/Select";
import { format } from "date-fns";
import { fileUploadAction } from "../../../../redux/global/actions/fileUploadAction";
import { useDispatch } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import { validationSchemaAddMeasureReport } from "utils/validations/formValidation";
import TextAreaField from "components/FormBuilder/TextAreaField";
import { useParams } from "react-router-dom";
import {
  addFacilityMeasureReport,
  fetchFacilityMeasureReportDetails,
  fetchFacilityMeasureReportListing,
  updateFacilityMeasureReport,
} from "../../../../redux/superAdmin/actions/facilityActions";
import { MEASURE_REPORT_CATEGORY } from "utils/dropdownConstants/dropdownConstants";
import { downloadFileFromUrl } from "utils/helper/helper";

const MeasureReportForm = ({
  isEdit,
  measureId,
  pageInfo,
  setAddMeasureModalConfig,
  openAlertMessageModal,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const measureFileInputRef = useRef(null);
  const [measureImgUrl, setMeasureImgUrl] = useState("");
  const [measureSelectedFile, setMeasureSelectedFile] = useState(null);

  const [initialValues, setInitialValues] = useState({
    measure_name: "",
    measure_category: "",
    measure_install_cost: "",
    baseline_detail: "",
    measure_description: "",
    start_date: null,
    end_date: null,
    file_description: "",
  });

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchFacilityMeasureReportDetails(measureId))
        .then((response) => {
          const measureReportDetails = response?.data;
          setInitialValues({
            ...initialValues,
            ...measureReportDetails,
            start_date: measureReportDetails?.start_date
              ? new Date(measureReportDetails?.start_date)
              : null,
            end_date: measureReportDetails?.end_date
              ? new Date(measureReportDetails?.end_date)
              : null,
          });
          setMeasureSelectedFile(measureReportDetails?.file_upload);
          setMeasureImgUrl(measureReportDetails?.file_upload);
        })
        .catch((error) => {
          console.error("Error fetching meter details:", error);
        });
    }
  }, [dispatch, measureId, isEdit]);

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
    setMeasureSelectedFile(selectedFile);
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
    setMeasureSelectedFile(null);
    setMeasureImgUrl("");
  };

  const handleFormSubmit = (values) => {
    const updatedValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (typeof value === "string" && value.trim() === "") {
        delete acc[key];
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    const newValues = {
      ...updatedValues,
      facility_id: id,
      file_upload: measureImgUrl,
    };
    if (isEdit) {
      dispatch(updateFacilityMeasureReport(measureId, newValues))
        .then(() => {
          dispatch(fetchFacilityMeasureReportListing(pageInfo, id));
          setAddMeasureModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
        })
        .error(() => {
          setAddMeasureModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
        });
    } else {
      dispatch(addFacilityMeasureReport(newValues))
        .then(() => {
          dispatch(fetchFacilityMeasureReportListing(pageInfo, id));
          setAddMeasureModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
        })
        .error(() => {
          setAddMeasureModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
        });
    }
  };

  return (
    <>
      <Formik
        initialValues={{ ...initialValues }}
        validationSchema={validationSchemaAddMeasureReport}
        enableReinitialize={true}
        onSubmit={handleFormSubmit}
      >
        {({ values, setFieldValue, errors }) => {
          const handleMeasureCategoryChange = (event) => {
            const newValue = event.target.value;
            setFieldValue("measure_category", newValue);
            if (
              newValue === "onSiteGeneration" ||
              newValue === "fuelSwitching"
            ) {
              openAlertMessageModal(
                newValue === "onSiteGeneration"
                  ? "Behind-the-meter generation projects are not eligible measures."
                  : "To avoid penalizing for the increase in electricity consumption, a non-routine adjustment to the baseline energy model is required. Please contact us for more details."
              );
            }
          };
          return (
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
                      options={MEASURE_REPORT_CATEGORY}
                      onChange={handleMeasureCategoryChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      name="measure_install_cost"
                      label="Measure installation costs "
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
                      name="baseline_detail"
                      label="Baseline conditional details"
                      type="text"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <TextAreaField
                      name="measure_description"
                      label="Measure description"
                      textAreaStyle={{ fontSize: "1.125rem", height: "7rem" }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <InputLabel
                      htmlFor="start_date"
                      style={{ whiteSpace: "initial" }}
                    >
                      Measure installation start date
                    </InputLabel>
                    <DatePicker
                      id="start_date"
                      name="start_date"
                      sx={{
                        width: "100%",
                        input: { color: "#111" },
                      }}
                      value={values.start_date}
                      onChange={(date) => {
                        setFieldValue("start_date", date);
                      }}
                      disableFuture
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          helperText: errors.start_date && errors.start_date,
                          FormHelperTextProps: {
                            style: {
                              color: errors.start_date ? "red" : "green",
                            },
                          },
                        },
                        actionBar: {
                          actions: ["clear", "accept"],
                          className: "my-datepicker-actionbar",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel
                      htmlFor="end_date"
                      style={{ whiteSpace: "initial" }}
                    >
                      Measure completion date
                    </InputLabel>
                    <DatePicker
                      id="end_date"
                      name="end_date"
                      sx={{
                        width: "100%",
                        input: { color: "#111" },
                      }}
                      value={values.end_date}
                      onChange={(date) => {
                        setFieldValue("end_date", date);
                      }}
                      minDate={values?.start_date}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          helperText: errors.end_date && errors.end_date,
                          FormHelperTextProps: {
                            style: {
                              color: errors.end_date ? "red" : "green",
                            },
                          },
                        },
                        actionBar: {
                          actions: ["clear", "accept"],
                          className: "my-datepicker-actionbar",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <InputLabel style={{ whiteSpace: "initial" }}>
                      Measure details
                    </InputLabel>
                    {measureSelectedFile ? (
                      <div style={{ display: "flex" }}>
                        <Typography
                          sx={{
                            fontSize: "2rem",
                            marginTop: "1.7rem",
                            cursor: "pointer",
                            color: "#2E813E",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            maxWidth: "100%",
                          }}
                          variant="h5"
                          onClick={() =>
                            downloadFileFromUrl(
                              measureSelectedFile,
                              measureSelectedFile.name ||
                                `${values?.measure_name}_measure_report`
                            )
                          }
                        >
                          {measureSelectedFile.name ||
                            `${values?.measure_name}_measure_report`}
                        </Typography>
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
                    ) : (
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
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                  {!isEdit ? "Add" : "Save"}
                </ButtonWrapper>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default MeasureReportForm;
