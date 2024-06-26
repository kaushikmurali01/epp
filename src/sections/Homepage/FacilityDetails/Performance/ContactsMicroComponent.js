import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import Table from "components/Table";
import EvModal from 'utils/modal/EvModal';
import { Formik, Form } from 'formik'; // Import Form from Formik
import InputField from 'components/FormBuilder/InputField';
import SelectBox from 'components/FormBuilder/Select';

const ContactsMicroComponent = () => {

  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });

  const canceButtonStyle = {
    marginRight: "15px",
    backgroundColor: "#ffffff",
    color: "#2E813E",
    border: "1px solid #2E813E",
    "&:hover": {
      backgroundColor: "#ffffff",
      border: "1px solid #2E813E",
    },
  };

  const [initialValues, setInitialValues] = useState({
    name: "",
    company_name: "",
    email: "",
    role: "",
    phone: "",
    unit_number: "",
    street_number: "",
    street_name: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
  });

  const [addContactModalConfig, setAddContactModalConfig] = useState({
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

  const RolesArray = [
    {
      id: 1,
      name: 1,
      label: 1,
      value: 1,
    },
    {
      id: 2,
      name: 2,
      label: 2,
      value: 2
    },
  ];

  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Company",
      accessor: "company",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Phone",
      accessor: "phone",
    },
    {
      Header: "Address",
      accessor: "address",
    },
    {
      Header: "Actions",
      accessor: (item) => (
        <Box display="flex" onClick={(e) => e.stopPropagation()} justifyContent="flex-end">
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
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const contactListingData = [
    {
      id: 1,
      name: "John Doe",
      company: "ABC company",
      role: "Manager",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 street",
    },
    {
      id: 2,
      name: "John Doe",
      company: "ABC company",
      role: "Manager",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 street",
    },
    {
      id: 3,
      name: "John Doe",
      company: "ABC company",
      role: "Manager",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 street",
    },
    {
      id: 4,
      name: "John Doe",
      company: "ABC company",
      role: "Manager",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 street",
    },
  ];

  const contactListCount = contactListingData?.length;

  const handleSubmit = (values) => {
    console.log(values);
  };

  const openAddContactModal = () => {
    setAddContactModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: 'Add Contact',
      modalBodyContent: "",
    }));
    setTimeout(() => {
      setAddContactModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <AddContact />,
      }));
    }, 10);
  };

  const closeAddContactModal = () => { 
    setAddContactModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
    setTimeout(() => {
      setAddContactModalConfig((prevState) => ({
        ...prevState,
        modalVisible: false,
      }));
    }, 10);
  }

  const AddContact = () => {
    return (
      <Formik
        initialValues={{ ...initialValues }}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Grid container spacing={2}>

              <Grid item xs={6}>
                <InputField
                  name="name"
                  label="Name*"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="company_name"
                  label="Company name*"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="email"
                  label="Email*"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
              <SelectBox
                  name="role"
                  label="Role*"
                  options={RolesArray} 
                  />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="phone"
                  label="Phone"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="unit_number"
                  label="Unit number"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="street_number"
                  label="Street number*"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="street_name"
                  label="Street name*"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="city"
                  label="City*"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="province"
                  label="Province*"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="country"
                  label="Country*"
                  type="text"
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="postal_code"
                  label="Postal code*"
                  type="text"
                />
              </Grid>

            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
              <Grid item>
                <Button type="button" sx={canceButtonStyle} variant="contained" onClick={() => closeAddContactModal()}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" variant="contained" sx={{ marginRight: '10px' }}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <>
      <Grid item>
        <Typography
          variant="contained"
          color="blue.main"
          sx={{
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 400,
          }}
          onClick={() => openAddContactModal()}
        >
          Add Contact
        </Typography>
      </Grid>
      <Box sx={{ marginTop: "2rem" }}>
        <Table
          columns={columns}
          data={contactListingData}
          count={contactListCount}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          cursorStyle="pointer"
        />
      </Box>
      <EvModal
        modalConfig={addContactModalConfig}
        setModalConfig={setAddContactModalConfig} />
    </>
  );
};

export default ContactsMicroComponent;
