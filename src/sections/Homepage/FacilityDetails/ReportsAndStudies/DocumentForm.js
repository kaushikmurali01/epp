import { Grid, InputLabel, Link, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";
import SelectBox from "components/FormBuilder/Select";
import { fileUploadAction } from "../../../../redux/global/actions/fileUploadAction";
import { useDispatch } from "react-redux";
import { DOCUMENT_CATEGORY } from "utils/dropdownConstants/dropdownConstants";
import { validationSchemaDocument } from "utils/validations/formValidation";
import { useParams } from "react-router-dom";
import {
  addFacilityDocument,
  fetchFacilityDocumentListing,
  fetchFacilityStatus,
} from "../../../../redux/superAdmin/actions/facilityActions";
import TextAreaField from "components/FormBuilder/TextAreaField";
import { downloadFileFromUrl } from "utils/helper/helper";

const DocumentForm = ({ pageInfo, setAddDocumentModalConfig, docsFilter }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const documentFileInputRef = useRef(null);
  const [documentImgUrl, setDocumentImgUrl] = useState("");
  const [documentSelectedFile, setDocumentSelectedFile] = useState(null);
  const [urlError, setUrlError] = useState(false);
  const [initialValues, setInitialValues] = useState({
    document_name: "",
    document_desc: "",
  });

  const handleDocumentFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setDocumentSelectedFile(selectedFile);
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
    setDocumentSelectedFile(null);
    setDocumentImgUrl("");
  };

  const handleFormSubmit = (values) => {
    if (!documentImgUrl) {
      setUrlError(true);
      return;
    }
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
      file_upload: documentImgUrl,
    };
    dispatch(addFacilityDocument(newValues))
      .then(() => {
        dispatch(fetchFacilityDocumentListing(pageInfo, id, docsFilter));
        dispatch(fetchFacilityStatus(id));
        setAddDocumentModalConfig((prevState) => ({
          ...prevState,
          modalVisible: false,
        }));
      })
      .error(() => {
        setAddDocumentModalConfig((prevState) => ({
          ...prevState,
          modalVisible: false,
        }));
      });
  };

  return (
    <>
      <Formik
        initialValues={{ ...initialValues }}
        validationSchema={validationSchemaDocument}
        enableReinitialize={true}
        onSubmit={handleFormSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container rowGap={4}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <InputLabel style={{ whiteSpace: "initial" }}>
                    Select file
                  </InputLabel>
                  {documentSelectedFile ? (
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
                            documentSelectedFile,
                            documentSelectedFile.name ||
                              `${values?.document_name}_document`
                          )
                        }
                      >
                        {documentSelectedFile.name ||
                          `${values?.document_name}_document`}
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
                          onClick={handleDocumentButtonClick}
                        >
                          Change File
                        </Typography>
                        <input
                          type="file"
                          ref={documentFileInputRef}
                          style={{ display: "none" }}
                          onChange={handleDocumentFileChange}
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
                        onClick={handleDocumentButtonClick}
                      >
                        Upload
                      </Typography>
                      <input
                        type="file"
                        ref={documentFileInputRef}
                        style={{ display: "none" }}
                        onChange={handleDocumentFileChange}
                      />
                    </>
                  )}
                  {!documentSelectedFile && (
                    <Typography
                      variant="small"
                      sx={{ color: urlError ? "#FF5858" : "#2E813E" }}
                    >
                      Please upload a file before submitting this document.
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <InputField
                    name="document_name"
                    label="Document name *"
                    type="text"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectBox
                    name="document_type"
                    label="Document type"
                    valueKey="value"
                    labelKey="label"
                    options={DOCUMENT_CATEGORY}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextAreaField
                    name="document_desc"
                    label="Document description"
                    textAreaStyle={{ fontSize: "1.125rem", height: "7rem" }}
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

export default DocumentForm;
