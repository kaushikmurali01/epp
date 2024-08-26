import {
  Button,
  FormLabel,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputField from "components/FormBuilder/InputField";
import TextAreaField from "components/FormBuilder/TextAreaField";
import { nonRoutineEventValidationSchema } from "utils/validations/formValidation";
import {
  addAdminNonRoutineEvent,
  getAdminNonRoutineEventDetails,
  getAdminNonRoutineEventList,
  updateAdminNonRoutineEvent,
} from "../../../../redux/admin/actions/adminPerformanceActions";

const AddNonRoutineEventModal = ({
  meter_type,
  closeAddNonRoutineEventModal,
  openAddNonRoutineDataModal,
  editMode,
}) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const dispatch = useDispatch();
  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );

  const [initialValues, setInitialValues] = useState({
    event_to_period: null,
    event_from_period: null,
    event_name: "",
    event_description: "",
  });

  const { adminNonRoutineEventDetails } = useSelector(
    (state) => state?.adminPerformanceReducer
  );

  useEffect(() => {
    if (editMode.isEditing && editMode.eventId) {
      dispatch(getAdminNonRoutineEventDetails(editMode.eventId))
        .then(() => {
          setInitialValues({
            event_to_period: new Date(adminNonRoutineEventDetails.event_to_period),
            event_from_period: new Date(
              adminNonRoutineEventDetails.event_from_period
            ),
            event_name: adminNonRoutineEventDetails.event_name,
            event_description: adminNonRoutineEventDetails.event_description,
          });
        })
        .catch((error) => {
          console.error("Error fetching event details:", error);
        });
    }
  }, [editMode]);

  const handleSubmit = (values) => {
    const payload = { ...values, facility_id, meter_type };
    const action = editMode.isEditing
      ? updateAdminNonRoutineEvent(editMode.eventId, payload)
      : addAdminNonRoutineEvent(payload);

    dispatch(action)
      .then((response) => {
        const event_id = response?.data?.id || editMode.eventId;
        const event_to_period = response?.data?.event_to_period;
        const event_from_period = response?.data?.event_from_period;
        closeAddNonRoutineEventModal();
        dispatch(getAdminNonRoutineEventList(facility_id, meter_type, page, itemsPerPage));
        if (!editMode.isEditing) {
          openAddNonRoutineDataModal(
            event_id,
            event_to_period,
            event_from_period,
            false // isEditing is false when adding new data
          );
        }
      })
      .catch(console.error);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={nonRoutineEventValidationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({
        values,
        isValid,
        dirty,
        setFieldValue,
        setFieldTouched,
        touched,
        errors,
      }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormLabel htmlFor="event_from_period">
                Event period from<span className="asterisk">*</span>
              </FormLabel>
              <DatePicker
                id="event_from_period"
                name="event_from_period"
                value={values.event_from_period}
                onChange={(date) => {
                  setFieldValue("event_from_period", date);
                  setFieldTouched("event_from_period", true, false);
                }}
                onBlur={() => setFieldTouched("event_from_period", true)}
                sx={{
                  width: "100%",
                  input: { color: "#111" },
                }}
                disableFuture
                format="MM/dd/yyyy"
                slotProps={{
                  textField: {
                    readOnly: true,
                    helperText:
                      touched.event_from_period && errors.event_from_period,
                    error:
                      touched.event_from_period &&
                      Boolean(errors.event_from_period),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormLabel htmlFor="event_to_period">
                Event period to<span className="asterisk">*</span>
              </FormLabel>
              <DatePicker
                id="event_to_period"
                name="event_to_period"
                value={values.event_to_period}
                onChange={(date) => {
                  setFieldValue("event_to_period", date);
                  setFieldTouched("event_to_period", true, false);
                }}
                onBlur={() => setFieldTouched("event_to_period", true)}
                sx={{
                  width: "100%",
                  input: { color: "#111" },
                }}
                disableFuture
                minDate={values.event_from_period}
                format="MM/dd/yyyy"
                slotProps={{
                  textField: {
                    readOnly: true,
                    helperText:
                      touched.event_to_period && errors.event_to_period,
                    error:
                      touched.event_to_period &&
                      Boolean(errors.event_to_period),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputField name="event_name" label="Event name*" type="text" />
            </Grid>

            <Grid item container>
              <Grid item xs={12} md={6}>
                <FormLabel htmlFor="event_description">Comment</FormLabel>
                <TextAreaField name="event_description" type="text" rows={8} />
              </Grid>
            </Grid>

            <Grid item xs={12} md={12}>
              {editMode.isEditing ? (
                <Grid display={"flex"} gap={"1.5rem"} flexWrap={"wrap"}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid || !dirty}
                  >
                    Save changes
                  </Button>
                  <Button
                    variant="contained"
                    disabled={dirty}
                    onClick={() => {
                      openAddNonRoutineDataModal(
                        editMode.eventId,
                        adminNonRoutineEventDetails.event_to_period,
                        adminNonRoutineEventDetails.event_from_period,
                        true // isEditing is true when editing existing data
                      );
                      closeAddNonRoutineEventModal();
                    }}
                  >
                    Edit non-routine data
                  </Button>
                </Grid>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!isValid || !dirty}
                >
                  Create non-routine event
                </Button>
              )}
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default AddNonRoutineEventModal;
