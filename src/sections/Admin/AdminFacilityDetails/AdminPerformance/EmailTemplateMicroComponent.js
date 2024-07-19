import React, { useState, useRef, useMemo } from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Table from "components/Table";
import EvModal from "utils/modal/EvModal";
import { useDispatch, useSelector } from "react-redux";
import { parseUTCDateToLocalDateTime } from "utils/dateFormat/ConvertIntoDateMonth";
import { Form, Formik } from "formik";
import InputField from "components/FormBuilder/InputField";
import ReactQuill from "react-quill";
import { deleteEmailTemplate, getEmailTemplate, updateEmailTemplate } from "../../../../redux/admin/actions/adminPerformanceActions";
import Loader from "pages/Loader";

const EmailTemplateMicroComponent = () => {
  const dispatch = useDispatch();
  const { emailTemplateList = [], loading, error } = useSelector(
    (state) => state.adminPerformanceReducer
  );

  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );
  
  const [editTemplateModalConfig, setEditTemplateModalConfig] = useState({
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
    modalBodyContent: "",
  });
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [searchString, setSearchString] = useState("");
  const inputRef = useRef(null);

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleDeleteTemplate = (template_id) => {
    if (template_id) {
      dispatch(deleteEmailTemplate(template_id))
        .then(() => {
          dispatch(getEmailTemplate(facility_id));
        })
        .catch((error) => {
          console.error("Error getting email templates", error);
        });
    }
  };

  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Subject",
      accessor: "subject",
    },
    {
      Header: "Date modified",
      accessor: "updated_at",
      Cell: ({ value }) => parseUTCDateToLocalDateTime(value),
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
              marginLeft: "1rem",
              fontSize: "0.875rem",
              color: "#027397",
            }}
            onClick={() => {
              handleEditTemplateModal(item?.id);
            }}
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
            onClick={() => handleDeleteTemplate(item?.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Search function
 const filteredData = useMemo(() => {
   return Object.values(emailTemplateList).filter((item) =>
     item.name.toLowerCase().includes(searchString.toLowerCase())
   );
 }, [emailTemplateList, searchString]);

  const emailTemplateListCount = emailTemplateList?.length;

 const handleEditTemplateModal = (id) => {
   const selectedEmailTemplate = emailTemplateList?.find(
     (template) => template.id === id
   );

   if (!selectedEmailTemplate) {
     console.error("Template not found");
     return;
   }
   
   setEditTemplateModalConfig((prevState) => ({
     ...prevState,
     modalVisible: true,
     file: selectedEmailTemplate,
     modalBodyContent: <EditEmailTemplateForm selectedEmailTemplate={selectedEmailTemplate}/>,
   }));
 };
  
  const EditEmailTemplateForm = ({ selectedEmailTemplate }) => {
    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, true] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
        ["table"],
      ],
    };

    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "table",
    ];

    const handleEmailUpdate = (emailData) => {
      if (emailData && Object?.keys(emailData)?.length > 0) {
        dispatch(
          updateEmailTemplate({
            ...emailData,
            template_id: selectedEmailTemplate?.id,
          })
        )
          .then(() => {
            dispatch(getEmailTemplate(facility_id));
            setEditTemplateModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
            }));
          })
          .catch(() => {
            console.log("error getting the email templates", error);
          });
      } else {
        console.error("No email data to update");
      }
    };

    return (
      <Formik
        initialValues={{
          name: selectedEmailTemplate?.name,
          subject: selectedEmailTemplate?.subject,
          body: selectedEmailTemplate?.body,
        }}
        onSubmit={(values) => handleEmailUpdate(values)}
        enableReinitialize={true}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Box
              sx={{
                maxWidth: 600,
                margin: "auto",
                display: "grid",
                gap: "1rem",
              }}
            >
              <InputField
                type="text"
                fullWidth
                name="name"
                label="Name"
                required
              />
              <InputField
                type="text"
                fullWidth
                name="subject"
                label="Subject"
                required
              />
              <Box sx={{ mt: 2, mb: 2 }}>
                <ReactQuill
                  theme="snow"
                  value={values.body}
                  onChange={(content) => setFieldValue("body", content)}
                  modules={modules}
                  formats={formats}
                  placeholder="Compose your email..."
                  className="rc-quill-editor"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Update email template
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="danger"
                  sx={{ color: "#FFF" }}
                  onClick={() => {
                    setEditTemplateModalConfig((prevState) => ({
                      ...prevState,
                      modalVisible: false,
                    }));
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <FormGroup>
        <FormControl
          fullWidth
          sx={{
            position: "relative",
            bgcolor: "#fff",
            borderRadius: "8px",
            color: "dark.main",
          }}
        >
          <TextField
            inputRef={inputRef}
            value={searchString}
            placeholder="Search by file name"
            inputProps={{
              style: {
                color: "#242424",
                fontSize: "1rem",
                paddingRight: "2rem",
              },
            }}
            onChange={(e) => setSearchString(e.target.value)}
          />
          {searchString?.length > 0 ? (
            <ClearIcon
              onClick={() => setSearchString("")}
              sx={{
                color: "#333",
                fontSize: "1.25rem",
                position: "absolute",
                right: "0.75rem",
                top: "0",
                bottom: "0",
                margin: "auto",
                zIndex: "1",
                cursor: "pointer",
              }}
            />
          ) : (
            <SearchIcon
              onClick={handleSearchIconClick}
              sx={{
                color: "#333",
                fontSize: "1.25rem",
                position: "absolute",
                right: "0.75rem",
                top: "0",
                bottom: "0",
                margin: "auto",
                zIndex: "1",
                cursor: "pointer",
              }}
            />
          )}
        </FormControl>
      </FormGroup>

      <Grid container>
        <Table
          columns={columns}
          data={filteredData}
          count={emailTemplateListCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          headbgColor="rgba(217, 217, 217, 0.2)"
        />
      </Grid>
      <EvModal
        modalConfig={editTemplateModalConfig}
        setModalConfig={setEditTemplateModalConfig}
      />
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />
    </Box>
  );
};

export default EmailTemplateMicroComponent;