import { ButtonGroup, Container, FormLabel, Grid, Typography } from '@mui/material';
import InputField from 'components/FormBuilder/InputField';
import SelectBox from 'components/FormBuilder/Select';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import Button from '@mui/material/Button'; // Importing Material-UI Button
import TextAreaField from 'components/FormBuilder/TextAreaField';
import EvModal from 'utils/modal/EvModal';
import styled from '@emotion/styled';

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  "& .MuiButtonGroup-firstButton": {
    borderRadius: "20.8125rem 0rem 0rem 20.8125rem",
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-middleButton": {
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-lastButton": {
    borderRadius: "0 20.8125rem 20.8125rem 0",
  },
  "& .MuiButton-root": {
    "&:hover": {
      color: "#F7F7F5",
    },
  },
}));

const ComposeEmailMicroComponent = () => {

  const [initialValues, setInitialValues] = useState({
    select_template: "1",
    to: "test@test.com",
    subject: "Performance module",
    email_content: "We are pleased to inform you that your Application on behalf of [Participant] has been approved for participation in the Save on Energy – Energy Performance Program, 2021-2024 (EPP), offered by the Independent Electricity System Operator (IESO). Your EPP Participant Agreement (attached) is effective as of the date of this Notice of Approval.  Please be advised that any subsequent Facilities approved under the EPP will also be subject to your EPP Participant Agreement. Approval for any additional Facilities will need to be received by December 31, 2024 to be eligible.",
  });

  const [previewModalConfig, setPreviewModalConfig] = useState({
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
      saveButtonName: "Sent Request",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    modalBodyContent: "",
  });

  const [emailArchiveModalConfig, setEmailArchiveModalConfig] = useState({
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
      saveButtonName: "Sent Request",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    modalBodyContent: "",
  });

  const TemplateArray = [
    {
      id: 1,
      name: "template-1",
      label: "template-1",
      value: "template-1",
    },
    {
      id: 2,
      name: "template-2",
      label: "template-2",
      value: "template-2",
    },
  ];

  const previewButtonDesign = {
    marginLeft: "10px",
    backgroundColor: "#ffffff",
    color: "#2E813E",
    border: "1px solid #2E813E",
    "&:hover": {
      backgroundColor: "#ffffff",
      border: "1px solid #2E813E",
    },
  };

  const previewModalDesign = {
    border: "1px solid #2E813E",
    backgroundColor: "#EBFFEF",
    padding: "10px",
    borderRadius: "10px",
    color: "#242424",
  };

  const buttonStyle = {
    padding: "0.44rem 1.5rem",
    lineHeight: "1",
    height: "max-content",
    borderRadius: "50px",

    ".MuiButtonGroup-firstButton": {
      BorderRight: "10px"
    }
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2E813E",
    color: "#F7F7F5",
    '&:hover': {
      backgroundColor: '#2E813E',
    },
  };

  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#EBEBEB",
    color: "#696969",
  };

  const emailArchiveBoxStyle = {
    display: "block",
    backgroundColor: "#EBFFEF",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "10px"
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  const openPreviewModal = () => {
    setPreviewModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: 'Preview',
      modalBodyContent: "",
    }));
    setTimeout(() => {
      setPreviewModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <PreviewEmail />,
      }));
    }, 10);
  };

  const openEmailArchiveModal = () => {
    setEmailArchiveModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: 'Facility email archive',
      modalBodyContent: "",
    }));
    setTimeout(() => {
      setEmailArchiveModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <ArchiveEmail />,
      }));
    }, 10);
  };

  const PreviewEmail = () => {
    return (
      <>
        <Container sx={previewModalDesign}>
          <Typography sx={{ fontSize: "14px !important" }}>{initialValues?.email_content}</Typography>
        </Container>
      </>
    );
  };

  const ArchiveEmail = () => {

    const [activeButtonEmailArchive, setActiveButtonEmailArchive] = useState(0);

    const handleEmailArchiveButtonClick = (index) => {
      setActiveButtonEmailArchive(index);
    };

    return (
      <>
        <Grid container>

          <input type='search' style={{ width: "100%", height: "40px", borderRadius: "10px" }} />

          <StyledButtonGroup disableElevation variant="contained" color="primary" sx={{ marginTop: "15px", marginBottom: "10px" }}>
            <Button
              sx={activeButtonEmailArchive === 0 ? activeButtonStyle : inactiveButtonStyle}
              onClick={() => handleEmailArchiveButtonClick(0)}
            >
              All
            </Button>
            <Button
              sx={activeButtonEmailArchive === 1 ? activeButtonStyle : inactiveButtonStyle}
              onClick={() => handleEmailArchiveButtonClick(1)}
            >
              User send
            </Button>
            <Button
              sx={activeButtonEmailArchive === 2 ? activeButtonStyle : inactiveButtonStyle}
              onClick={() => handleEmailArchiveButtonClick(2)}
            >
              System generated
            </Button>
          </StyledButtonGroup>

          {activeButtonEmailArchive === 0 || activeButtonEmailArchive === 1 || activeButtonEmailArchive === 2 ?
            <>

              <Grid container sx={emailArchiveBoxStyle}>
                <Typography sx={{ color: "#54585A", fontSize: "12px !important", fontWeight: "400" }}>Email Subject</Typography>
                <Typography sx={{ color: "#242424", fontSize: "18px !important", fontWeight: "600" }}>Recipient’s email Address</Typography>
                <Typography sx={{ color: "#54585A", fontSize: "12px !important", fontWeight: "400" }}>Date sent</Typography>
                <Typography sx={{ color: "#242424", fontSize: "14px !important", fontWeight: "500" }}>6/14/2023</Typography>
              </Grid>

              <Grid container sx={emailArchiveBoxStyle}>
                <Typography sx={{ color: "#54585A", fontSize: "12px !important", fontWeight: "400" }}>Email Subject</Typography>
                <Typography sx={{ color: "#242424", fontSize: "18px !important", fontWeight: "600" }}>Recipient’s email Address</Typography>
                <Typography sx={{ color: "#54585A", fontSize: "12px !important", fontWeight: "400" }}>Date sent</Typography>
                <Typography sx={{ color: "#242424", fontSize: "14px !important", fontWeight: "500" }}>6/14/2023</Typography>
              </Grid>

              <Grid container sx={emailArchiveBoxStyle}>
                <Typography sx={{ color: "#54585A", fontSize: "12px !important", fontWeight: "400" }}>Email Subject</Typography>
                <Typography sx={{ color: "#242424", fontSize: "18px !important", fontWeight: "600" }}>Recipient’s email Address</Typography>
                <Typography sx={{ color: "#54585A", fontSize: "12px !important", fontWeight: "400" }}>Date sent</Typography>
                <Typography sx={{ color: "#242424", fontSize: "14px !important", fontWeight: "500" }}>6/14/2023</Typography>
              </Grid>
            </> : null}

        </Grid>
      </>
    );
  };

  return (
    <>
      <Formik
        initialValues={{ ...initialValues }}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid item xs={12}>
                <SelectBox
                  name="select_template"
                  label="Select Template"
                  options={TemplateArray} />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: "10px" }}>
                <InputField
                  name="to"
                  label="To"
                  type="text" />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: "10px" }}>
                <InputField
                  name="subject"
                  label="Subject"
                  type="text" />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: "10px" }}>
                <FormLabel>Email Content</FormLabel>
                <TextAreaField
                  name="email_content"
                  type="text"
                  rows={8} />
              </Grid>

            </Grid>

            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
              <Grid item>
                <Button type="submit" color="primary" variant="contained" onClick={() => openEmailArchiveModal()}>
                  Send email
                </Button>
                <Button type="button" sx={previewButtonDesign} variant="contained" onClick={() => openPreviewModal()}>
                  Preview
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <EvModal
        modalConfig={previewModalConfig}
        setModalConfig={setPreviewModalConfig} />

      <EvModal
        modalConfig={emailArchiveModalConfig}
        setModalConfig={setEmailArchiveModalConfig} />

    </>
  );
};

export default ComposeEmailMicroComponent;
