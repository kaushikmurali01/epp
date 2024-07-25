import { Button, Grid } from '@mui/material';
import FreeSoloAutoCompleteInput from 'components/FormBuilder/FreeSoloAutoCompleteInput';
import InputField from 'components/FormBuilder/InputField';
import SelectBox from 'components/FormBuilder/Select';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createContact, getContacts, updateContact } from '../../../../redux/admin/actions/adminPerformanceActions';
import { addContactValidationSchema } from 'utils/validations/formValidation';

const AddEditContactModalForm = ({
  contactId,
  getAllCompanyList,
  contactList,
  facility_id,
  handleCloseAddContactModal,
}) => {
  const dispatch = useDispatch();
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
      value: 2,
    },
  ];

  const [initialValues, setInitialValues] = useState({
    name: "",
    company_name: null,
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

  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    if (contactId) {
      const existingContact = contactList.find(
        (contact) => contact.id === contactId
      );
      if (existingContact) {
        setInitialValues({
          name: existingContact.name || "",
          company_name: existingContact.company_name || "",
          email: existingContact.email || "",
          role: existingContact.role || "",
          phone: existingContact.phone || "",
          unit_number: existingContact.unit_number || "",
          street_number: existingContact.street_number || "",
          street_name: existingContact.street_name || "",
          city: existingContact.city || "",
          province: existingContact.province || existingContact.state || "",
          country: existingContact.country || "",
          postal_code: existingContact.postal_code || "",
        });

        // Find the matching company in getAllCompanyList
        const matchingCompany = getAllCompanyList.find(
          (company) => company.company_name === existingContact.company_name
        );

        setSelectedCompany(
          matchingCompany || {
            id: existingContact.id,
            company_name: existingContact.company_name,
          }
        );
      }
    }
  }, [contactId, contactList, getAllCompanyList]);

  const handleSubmit = (values) => {
    let contactPayload = { ...values };
    if (contactId) {
      dispatch(updateContact(contactId, contactPayload, facility_id))
        .then(() => {
          handleCloseAddContactModal();
          dispatch(getContacts(facility_id));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch(createContact(contactPayload, facility_id))
        .then(() => {
          handleCloseAddContactModal();
          dispatch(getContacts(facility_id));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addContactValidationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ values, dirty, isValid, setFieldValue }) => {
        const handleCompanyChange = (event, value) => {
          if (value) {
            let selectedCompany;
            if (typeof value === "string") {
              // If it's a custom value (string), create a new object
              selectedCompany = { id: null, company_name: value };
            } else {
              // If it's an object from the list, use it as is
              selectedCompany = getAllCompanyList?.find(
                (company) => company?.id === value?.id
              );
            }
            if (selectedCompany) {
              setFieldValue(
                "company_name",
                selectedCompany?.company_name || ""
              );
              setFieldValue("unit_number", selectedCompany?.unit_number || "");
              setFieldValue(
                "street_number",
                selectedCompany?.street_number || ""
              );
              setFieldValue("street_name", selectedCompany?.street_name || "");
              setFieldValue("city", selectedCompany?.city || "");
              setFieldValue(
                "province",
                selectedCompany?.province || selectedCompany?.state || ""
              );
              setFieldValue("country", selectedCompany?.country || "");
              setFieldValue("postal_code", selectedCompany?.postal_code || "");
              setSelectedCompany(selectedCompany);
            }
          } else {
            setSelectedCompany(null);
          }
        };

        return (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputField name="name" label="Name*" type="text" />
              </Grid>

              <Grid item xs={12} sm={6}>
                {getAllCompanyList && (
                  <FreeSoloAutoCompleteInput
                    name="company_name"
                    inputFieldLabel="Company Name*"
                    optionsArray={getAllCompanyList}
                    optionKey={"id"}
                    optionLabel={"company_name"}
                    onChange={handleCompanyChange}
                    allowCustomValue={true}
                    value={selectedCompany}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField name="email" label="Email*" type="text" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SelectBox name="role" label="Role*" options={RolesArray} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField name="phone" label="Phone*" type="text" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  name="unit_number"
                  label="Unit number"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  name="street_number"
                  label="Street number*"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  name="street_name"
                  label="Street name*"
                  type="text"
                />
              </Grid>

              <Grid item spacing={2} xs={12} sm={4}>
                <Grid item xs={12}>
                  <InputField name="city" label="City*" type="text" />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: "16px" }}>
                  <InputField name="country" label="Country*" type="text" />
                </Grid>
              </Grid>

              <Grid item spacing={2} xs={12} sm={4}>
                <Grid item xs={12}>
                  <InputField name="province" label="Province*" type="text" />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: "16px" }}>
                  <InputField
                    name="postal_code"
                    label="Postal code*"
                    type="text"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
              <Grid item>
                <Button
                  type="button"
                  sx={{
                    marginRight: "15px",
                    backgroundColor: "#ffffff",
                    color: "#242424",
                    border: "1px solid #242424",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      border: "1px solid #242424",
                    },
                  }}
                  variant="contained"
                  onClick={handleCloseAddContactModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{ marginRight: "10px" }}
                  disabled={!(isValid && dirty)}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEditContactModalForm;