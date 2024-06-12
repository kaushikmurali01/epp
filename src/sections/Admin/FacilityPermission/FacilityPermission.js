import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { validationSchemaFacilityPermissions } from "utils/validations/formValidation";

const FacilityPermission = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const permissionsList = useSelector(
    (state) => state?.permissionsReducer?.permissions
  );

  const [initialValues, setInitialValues] = useState({
    username: "",
    bussiness_email: "",
    role_type: "",
    permissions: [],
  });

  // useEffect(() => {
  //   dispatch(fetchPermissions());
  // }, [dispatch]);

  useEffect(() => {
    if (permissionsList?.length > 0) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        permissions: permissionsList?.map((permission) => ({
          desc: permission?.desc,
          is_assigned: permission?.is_assigned,
        })),
      }));
    }
  }, [permissionsList]);

  const handleSubmit = ({ values }) => {
    console.log(values);
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Typography
          variant="h4"
          sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
        >
          Manage permission
        </Typography>
      </Grid>
      <Box sx={{ marginTop: "2rem" }}>
        <Formik
          initialValues={{ ...initialValues }}
          validationSchema={validationSchemaFacilityPermissions}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ handleBlur, values, setFieldValue, errors }) => {
            const handlePermissionToggle = (index, newValue) => {
              const newPermissions = values?.permissions?.map(
                (perm, permIndex) =>
                  permIndex === index
                    ? { ...perm, is_assigned: newValue }
                    : perm
              );
              setFieldValue("permissions", newPermissions);
            };
            return (
              <Form>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={4}>
                    <SelectBox
                      name="username"
                      label="Username *"
                      valueKey="value"
                      labelKey="label"
                      //   options={SOURCE_ARRAY}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="bussiness_email"
                      label="Bussiness email *"
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SelectBox
                      name="role_type"
                      label="Role type *"
                      valueKey="value"
                      labelKey="label"
                      //   options={SOURCE_ARRAY}
                    />
                  </Grid>
                </Grid>
                <Grid container rowGap={2} mt={3} xs={9}>
                  <Grid
                    container
                    spacing={!isSmallScreen && 12}
                    alignItems="center"
                    justifyContent={!isSmallScreen && "space-between"}
                  >
                    <Grid item>
                      <Typography variant="small">
                        List of Permissions
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="small">Toggle to grant</Typography>
                    </Grid>
                  </Grid>
                  {permissionsList &&
                    permissionsList?.map((permItem, index) => (
                      <Grid
                        container
                        spacing={!isSmallScreen && 12}
                        alignItems="center"
                        justifyContent={!isSmallScreen && "space-between"}
                        key={permItem.desc}
                      >
                        <Grid item>
                          <InputLabel
                            htmlFor={permItem.desc}
                            style={{ whiteSpace: "initial" }}
                          >
                            {permItem?.desc}
                          </InputLabel>
                        </Grid>
                        <Grid item>
                          <FormControl>
                            <Field name="">
                              {({ field, form }) => (
                                <ToggleButtonGroup
                                  id={permItem.desc}
                                  exclusive
                                  value={permItem.is_assigned}
                                  onChange={(event, newAlignment) =>
                                    handlePermissionToggle(index, newAlignment)
                                  }
                                >
                                  <ToggleButton
                                    value={true}
                                    sx={{ fontSize: "0.875rem" }}
                                  >
                                    Yes
                                  </ToggleButton>
                                  <ToggleButton
                                    value={false}
                                    sx={{ fontSize: "0.875rem" }}
                                  >
                                    No
                                  </ToggleButton>
                                </ToggleButtonGroup>
                              )}
                            </Field>
                          </FormControl>
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Container>
  );
};

export default FacilityPermission;
