import {
  FormControl,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import ButtonWrapper from "components/FormBuilder/Button";
import React, { useState } from "react";
import { fetchAdminCompanyDetails } from "../../../redux/admin/actions/adminCompanyAction";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { validationSchemaAssignFacility } from "utils/validations/formValidation";
import InputField from "components/FormBuilder/InputField";
import { adminAssignFacilities } from "../../../redux/admin/actions/adminFacilityActions";

const RequestToJoinModal = ({ setModalConfig }) => {
  const dispatch = useDispatch();
  const emailToAvoid = useSelector(
    (state) => state?.facilityReducer?.userDetails?.user?.email || ""
  );
  const adminCompaniesDropdownData = useSelector(
    (state) => state?.adminCompanyReducer?.companiesDropdown?.data || []
  );
  const [facilityDropdownData, setFacilityDropdownData] = useState([]);

  const initialValues = {
    email: "",
    facilityId: [],
    companyId: null,
  };
  const formSubmit = (values) => {
    dispatch(adminAssignFacilities(values)).then(() => {
      setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: false,
      }));
      setFacilityDropdownData([]);
    });
  };
  return (
    <Formik
      initialValues={{
        ...initialValues,
      }}
      validationSchema={validationSchemaAssignFacility(emailToAvoid)}
      onSubmit={formSubmit}
      enableReinitialize={true}
    >
      {({ values, setFieldValue }) => {
        const handleCompanyChange = (event) => {
          setFieldValue("companyId", event.target.value);
          dispatch(fetchAdminCompanyDetails(event.target.value)).then((res) => {
            if (res?.facilities) {
              setFacilityDropdownData(res?.facilities);
            }
          });
        };

        return (
          <Form>
            <Stack sx={{ marginBottom: "1rem" }}>
              <InputField
                name="email"
                label="User email ID*"
                placeholder="email1, email2, ..."
              />
            </Stack>
            <Stack sx={{ marginBottom: "1rem", width: "300px" }}>
              <FormGroup className="theme-form-group theme-select-form-group">
                <InputLabel>
                  Select Company<span className="asterisk">*</span>
                </InputLabel>
                <FormControl sx={{ color: "primary.main" }}>
                  <Select
                    fullWidth
                    name="companyId"
                    value={values.companyId}
                    onChange={(e) => handleCompanyChange(e)}
                  >
                    {adminCompaniesDropdownData?.map((item) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.company_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
            </Stack>
            <Stack sx={{ marginBottom: "1rem", width: "300px" }}>
              <FormGroup className="theme-form-group theme-select-form-group">
                <InputLabel>
                  Assign Facility<span className="asterisk">*</span>
                </InputLabel>
                <FormControl sx={{ color: "primary.main" }}>
                  <Select
                    fullWidth
                    name="facilityId"
                    multiple
                    value={values.facilityId}
                    onChange={(e) => {
                      setFieldValue("facilityId", e.target.value);
                    }}
                  >
                    {facilityDropdownData?.map((item) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.facility_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
            </Stack>
            <Grid display="flex" sx={{ marginTop: "1rem" }}>
              <ButtonWrapper type="submit" variant="contained">
                Submit
              </ButtonWrapper>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RequestToJoinModal;
