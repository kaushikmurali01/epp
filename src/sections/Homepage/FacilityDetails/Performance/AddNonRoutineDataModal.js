import {
  Button,
  Grid,
  Tab,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Table as MuiTable,
  TextField,
  Box,
  TableBody,
  Link,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Formik, Form, FieldArray } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { documentFileUploadAction, fileUploadAction } from "../../../../redux/global/actions/fileUploadAction";
import {
  addNonRoutineEventData,
  deleteNonRoutineEventData,
  getNonRoutineEventDetails,
  getNonRoutineEventList,
} from "../../../../redux/superAdmin/actions/performanceAction";
import { format, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { nonRoutineDataValidationSchema } from "utils/validations/formValidation";
import { downloadFileFromUrl } from "utils/helper/helper";

const AddNonRoutineDataModal = ({
  event_id,
  event_to_period,
  event_from_period,
  closeAddNonRoutineDataModal,
  editMode,
  meter_type
}) => {
  const dispatch = useDispatch();
  const [modalNonRoutineTabs, setModalNonRoutineTabs] = useState("filledData");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [nonRoutineFile, setNonRoutineFile] = useState(null);
  const fileInputRef = useRef(null);
  const [initialData, setInitialData] = useState([]);
  const [dataType, setDataType] = useState(1);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const facility_id = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data?.id
  );

  const { nonRoutineEventDetails, loading } = useSelector(
    (state) => state?.performanceReducer
  );

  useEffect(() => {
    if (editMode.isEditing && editMode.eventId) {
      dispatch(getNonRoutineEventDetails(editMode.eventId))
        .then(() => {
          if (
            nonRoutineEventDetails.dataEntries &&
            nonRoutineEventDetails.dataEntries.length > 0
          ) {
            const firstEntry = nonRoutineEventDetails.dataEntries[0];

            if (firstEntry.type === 1) {
              // Handle filled data (type 1)
              setDataType(1);
              setModalNonRoutineTabs("filledData");
              setInitialData(
                nonRoutineEventDetails.dataEntries.map((entry) => ({
                  id: entry.id,
                  start_date: entry.start_date
                    ? parseISO(entry.start_date)
                    : null,
                  end_date: entry.end_date ? parseISO(entry.end_date) : null,
                  non_routine_adjustment: entry.non_routine_adjustment || "",
                }))
              );
            } else if (firstEntry.type === 2) {
              // Handle file upload (type 2)
              setDataType(2);
              setModalNonRoutineTabs("uploadData");
              setUploadedFiles(
                nonRoutineEventDetails.dataEntries.map((entry, index) => {
                  const extension = entry.file_url.split("/").pop().split(".").pop().split("?")[0];
                  return {
                    id: entry.id,
                    file_url: entry.file_url,
                    name: `non-routine-data-file-${index + 1}`,
                    fullName: `non-routine-data-file-${index + 1}.${extension}`,
                  };
                })
              );
              setInitialData([]);
            }
          } else {
            // No data entries, set defaults
            setDataType(1);
            setInitialData([]);
            setUploadedFiles([]);
            setFileUrl("");
            setModalNonRoutineTabs("filledData");
          }
        })
        .catch((error) => {
          console.error("Error fetching event details:", error);
        });
    } else {
      // Not in edit mode, set defaults
      setDataType(1);
      setInitialData([]);
      setUploadedFiles([]);
      setFileUrl("");
      setModalNonRoutineTabs("filledData");
    }
  }, [editMode]);

  const initialValues = {
    id: null,
    data_entries: initialData,
    non_routine_id: event_id,
    file_url: "",
    type: dataType,
  };

  const handleNonRoutineTabs = (event, newValue, setFieldValue) => {
    setModalNonRoutineTabs(newValue);
    setFieldValue("type", newValue === "filledData" ? 1 : 2);
    setDataType(newValue === "filledData" ? 1 : 2);
  };

  const handleButtonClickForUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event, setFieldValue) => {
    const acceptedDocTypes = [".xlsx", ".csv"];
    const selectedFile = event.target.files[0];
    const fileExtension = `.${selectedFile.name
      .split(".")
      .pop()
      .toLowerCase()}`;

    if (!acceptedDocTypes.includes(fileExtension)) {
      alert(
        `Selected file type is not supported. Please select a xlsx or csv file.`
      );
      event.target.value = "";
      return;
    }
    
    dispatch(fileUploadAction(selectedFile))
      .then((data) => {
        const newFile = {
          id: null,
          file_url: data?.sasTokenUrl,
          name: `non-routine-data-file-${
            uploadedFiles.length + 1
          }`,
          fullName: `non-routine-data-file-${
            uploadedFiles.length + 1
          }${fileExtension}`,
        };
        setFieldValue("type", 2);
        setNonRoutineFile(selectedFile);
        setIsFileUploaded(true);
        setUploadedFiles([...uploadedFiles, newFile]);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };


  const deleteFile = (setFieldValue) => {
    setNonRoutineFile(null);
    setIsFileUploaded(false);
    setFieldValue("file_url", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={nonRoutineDataValidationSchema}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting }) => {
        let nonRoutineDataPayload;
        if (values.type === 1) {
          // For filled data
          nonRoutineDataPayload = {
            ...values,
            data_entries: values.data_entries.map((entry) => ({
              id: entry.id || null,
              start_date: entry.start_date
                ? format(entry.start_date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
                : null,
              end_date: entry.end_date
                ? format(entry.end_date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
                : null,
              non_routine_adjustment: entry.non_routine_adjustment,
            })),
          };
        } else if (values.type === 2) {
          // For file upload
          const newFile = uploadedFiles.find((file) => file.id === null);
          nonRoutineDataPayload = {
            ...values,
            file_url: newFile ? newFile.file_url : "",
          };
        }

        dispatch(addNonRoutineEventData(nonRoutineDataPayload))
          .then(() => {
            closeAddNonRoutineDataModal();
            dispatch(
              getNonRoutineEventList(
                facility_id,
                meter_type,
                page,
                itemsPerPage
              )
            );
          })
          .catch(console.error());
        setSubmitting(false);
      }}
    >
      {({
        values,
        setFieldValue,
        isSubmitting,
        errors,
        touched,
        dirty,
        isValid,
      }) => (
        <Form>
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
              marginBottom: "2rem",
            }}
          >
            <Grid item xs={12} md={12}>
              <Tabs
                className="theme-tabs-list"
                value={modalNonRoutineTabs}
                onChange={(event, newValue) =>
                  handleNonRoutineTabs(event, newValue, setFieldValue)
                }
                sx={{ display: "inline-flex", flexWrap: "wrap" }}
              >
                <Tab
                  value="filledData"
                  label="Filled data"
                  sx={{ minWidth: "10rem", textTransform: "revert" }}
                />
                <Tab
                  value="uploadData"
                  label="Upload data in bulk"
                  sx={{ minWidth: "10rem", textTransform: "revert" }}
                />
              </Tabs>
            </Grid>
          </Grid>
          {modalNonRoutineTabs === "filledData" && (
            <>
              <TableContainer>
                <MuiTable size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#D9D9D9" }}>
                      <TableCell>
                        Start date<span className="asterisk">*</span>
                      </TableCell>
                      <TableCell>
                        End date<span className="asterisk">*</span>
                      </TableCell>
                      <TableCell>
                        Non-routine adjustment
                        <span className="asterisk">*</span>
                      </TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <FieldArray name="data_entries">
                      {({ remove, push }) => (
                        <>
                          {values.data_entries.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <DatePicker
                                  value={entry.start_date}
                                  onChange={(newDate) => {
                                    setFieldValue(
                                      `data_entries[${index}].start_date`,
                                      newDate
                                    );
                                  }}
                                  sx={{
                                    width: "100%",
                                    input: { color: "#111" },
                                  }}
                                  disableFuture
                                  format="MM/dd/yyyy"
                                  minDate={parseISO(event_from_period)}
                                  maxDate={parseISO(event_to_period)}
                                />
                                {touched.data_entries?.[index]?.start_date &&
                                  errors.data_entries?.[index]?.start_date && (
                                    <div>
                                      {errors.data_entries[index].start_date}
                                    </div>
                                  )}
                              </TableCell>
                              <TableCell>
                                <DatePicker
                                  value={entry.end_date}
                                  onChange={(newDate) => {
                                    setFieldValue(
                                      `data_entries[${index}].end_date`,
                                      newDate
                                    );
                                  }}
                                  sx={{
                                    width: "100%",
                                    input: { color: "#111" },
                                  }}
                                  minDate={parseISO(event_from_period)}
                                  maxDate={parseISO(event_to_period)}
                                  format="MM/dd/yyyy"
                                />
                                {touched.data_entries?.[index]?.end_date &&
                                  errors.data_entries?.[index]?.end_date && (
                                    <div>
                                      {errors.data_entries[index].end_date}
                                    </div>
                                  )}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  sx={{
                                    "& .MuiInputBase-input": {
                                      color: "#242424",
                                    },
                                  }}
                                  value={entry.non_routine_adjustment}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  onChange={(e) => {
                                    setFieldValue(
                                      `data_entries[${index}].non_routine_adjustment`,
                                      e.target.value
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Link
                                  underline="hover"
                                  sx={{
                                    color: "#FF5858",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    padding: 0,
                                  }}
                                  onClick={() => {
                                    let data_entry_id = entry?.id;
                                    if (data_entry_id) {
                                      dispatch(
                                        deleteNonRoutineEventData(data_entry_id)
                                      )
                                        .then(() => {
                                          remove(index);
                                        })
                                        .catch(console.error());
                                    } else {
                                      remove(index);
                                    }
                                  }}
                                >
                                  Delete
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  </TableBody>
                </MuiTable>
              </TableContainer>
              <Grid item container sx={{ marginTop: "20px" }}>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    Object.keys(errors).length > 0 ||
                    !isValid ||
                    !dirty
                  }
                  sx={{
                    backgroundColor: "primary.main",
                    color: "#ffffff",
                    marginRight: "20px",
                    "&:hover": { backgroundColor: "primary.mainDarkShade" },
                  }}
                >
                  Done
                </Button>
                <FieldArray name="data_entries">
                  {({ push }) => (
                    <Button
                      type="button"
                      sx={{ border: "2px solid #2E813E" }}
                      onClick={() =>
                        push({
                          id: null,
                          start_date: null,
                          end_date: null,
                          non_routine_adjustment: "",
                        })
                      }
                    >
                      Add more row
                    </Button>
                  )}
                </FieldArray>
              </Grid>
            </>
          )}
          {modalNonRoutineTabs === "uploadData" && (
            <Box>
              <Typography variant="h5">Upload data in bulk</Typography>
              {!nonRoutineFile && (
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ color: "#242424", fontStyle: "italic" }}
                >
                  Upload the excel file, and refer to{" "}
                  <Link
                    href="https://eppdevstorage.blob.core.windows.net/agreement-docs/meter_spreadsheet.xlsx"
                    underline="hover"
                    color={"blue.main"}
                    sx={{ cursor: "pointer" }}
                  >
                    non-routine adjustment spreadsheet
                  </Link>{" "}
                  for the formatting details.
                </Typography>
              )}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {nonRoutineFile ? (
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: "blue.main", cursor: "pointer" }}
                    >
                      {nonRoutineFile.name}
                    </Typography>
                    <Link
                      underline="hover"
                      sx={{
                        color: "#FF5858",
                        cursor: "pointer",
                      }}
                      onClick={() => deleteFile(setFieldValue)}
                    >
                      Delete
                    </Link>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      color: "#2E813E",
                      fontWeight: "500",
                      fontSize: "18px",
                      backgroundColor: "#D1FFDA",
                      padding: "7px 33px",
                      borderRadius: "8px",
                      height: "40px",
                      marginTop: "20px",
                      cursor: "pointer",
                      maxWidth: "fit-content",
                      ":hover": { backgroundColor: "primary.light" },
                    }}
                    onClick={handleButtonClickForUpload}
                  >
                    Select File
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(event) =>
                    handleFileChange(event, setFieldValue, values)
                  }
                  accept=".xlsx,.csv"
                />
              </Box>
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting || !nonRoutineFile}
                style={{
                  padding: "0.2rem 1rem",
                  minWidth: "unset",
                  width: "165px",
                  height: "40px",
                  marginTop: "20px",
                }}
              >
                Upload
              </Button>
              {uploadedFiles.length > 0 && (
                <Box sx={{ marginTop: "1rem" }}>
                  <Typography variant="h6">Uploaded Files:</Typography>
                  {uploadedFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0.5rem",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: "blue.main", cursor: "pointer" }}
                        onClick={() =>
                          downloadFileFromUrl(
                            file.file_url,
                            file.name || `non_routine_file_${index + 1}`
                          )
                        }
                      >
                        {file.fullName}
                      </Typography>
                      <Link
                        underline="hover"
                        sx={{
                          color: "#FF5858",
                          marginLeft: "1rem",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (file?.id) {
                            dispatch(deleteNonRoutineEventData(file.id))
                              .then(() => {
                                closeAddNonRoutineDataModal();
                              })
                              .catch(console.error());
                          }
                        }}
                      >
                        Delete
                      </Link>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default AddNonRoutineDataModal;
