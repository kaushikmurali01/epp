import React, { useEffect, useState } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { Box, Grid, InputLabel, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { format } from 'date-fns';
import * as Yup from 'yup';
import { validationSchemaDeleteMeterEntries } from 'utils/validations/formValidation';
import { BASELINE_ENDPOINTS, adminHourlyEndPoints } from 'constants/apiEndPoints';
import { GET_REQUEST, POST_REQUEST } from 'utils/HTTPRequests';
import { useDispatch } from 'react-redux';
import NotificationsToast from 'utils/notification/NotificationsToast';

const DeleteEntriesModal = ({
    meterId,
    meterType,
    facilityId,
    independentVariableId,
    setModalConfig,
    setRefreshPageData
}) => {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const [baseLinePeriod, setBaseLinePeriod] = useState(null);

    const getMinMaxRangeData = (item) => {
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
        // const params = {"facility_id"}
        // const apiURL = adminHourlyEndPoints.MIN_MAX_PERIOD;
        const endPointIndependentVariableURL =  `${BASELINE_ENDPOINTS.BASELINE_PERIOD}?facility_id=${facilityId}&iv_id=${independentVariableId}`
        const endPointEnergyURL =  `${BASELINE_ENDPOINTS.BASELINE_PERIOD}?facility_id=${facilityId}&meter_id=${meterId}&meter_type=${meterType}`
      
        const apiURL = independentVariableId ? endPointIndependentVariableURL : endPointEnergyURL;
      
        GET_REQUEST(apiURL)
            .then((res) => {
                console.log(res, "min max range data")
                setBaseLinePeriod(res.data);
                console.log(res.data, "check min max range data")
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });

            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
                setModalConfig((prevState) => ({
                    ...prevState,
                    modalVisible: false,
                   
                  }));

                  NotificationsToast({
                    message: error?.response?.data.error || "Something went wrong!",
                    type: "error",
                  });
            });
    };

    const handleFormSubmit = (data) => {
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
        const formattedStartDate = data.startDate ? format(data.startDate, 'yyyy-MM-dd') : null;
        const formattedEndDate = data.endDate ? format(data.endDate, 'yyyy-MM-dd') : null;
        const apiURL = adminHourlyEndPoints.DELETE_HOURLY_ENTRIES;

        const payload = {
            "start_date": formattedStartDate,
            "end_date": formattedEndDate,
            "meter_id": meterId,
            "facility_id": facilityId
        }

       
          if(independentVariableId){
            payload.independent_variable_id =  independentVariableId
          } else{
            payload.meter_id = meterId;
            payload.meter_type = meterType;
          }

        console.log(payload, 'payload');

        POST_REQUEST(apiURL,payload)
        .then((res) => {
          console.log(res, "checking result");
          if(res.data?.statusCode === 200){
                NotificationsToast({
                    message: "Entry deleted successfully!",
                    type: "success",
                });
                setRefreshPageData(prevState => prevState + 1);
          }else {
            NotificationsToast({
                message: res?.data.message || "Something went wrong!",
                type: "error",
              });
          }

          dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          
          }));
        }).catch((error) => {
          console.log(error)
          dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
          NotificationsToast({
            message: "Something went wrong !",
            type: "error",
          });
        });
    }


    useEffect(()=>{
        getMinMaxRangeData();
    }, [])

    console.log(baseLinePeriod, "baseLinePeriod");

    return (
        <React.Fragment>
           { baseLinePeriod && 
            <Formik
                initialValues={{ startDate: null, endDate: null }}
                validationSchema={validationSchemaDeleteMeterEntries}
                onSubmit={handleFormSubmit}
            >
                {({ values, setFieldValue, errors, touched }) => (
                    
                    <Form>
                        <Box sx={{ maxWidth: '336px' }}>
                            <Typography variant="h4" gutterBottom>
                                Delete entries
                            </Typography>
                            <Typography variant="body2" gutterBottom sx={{ color: 'dark.light', marginBottom: '0.5rem' }}>
                                Enter the specific dates to delete entries
                            </Typography>
                            
                                <>
                                <Grid container spacing={3} direction="column" >
                                    <Grid item xs={12}>
                                        <InputLabel
                                            htmlFor="startDate"
                                            style={{ whiteSpace: "initial", textAlign: 'left' }}
                                        >
                                            Start date
                                        </InputLabel>
                                        <Field name="startDate">
                                            {({ field }) => (
                                                <DatePicker
                                                    id="startDate"
                                                    name="startDate"
                                                    sx={{
                                                        width: "100%",
                                                        input: { color: "#242424" },
                                                    }}
                                                    value={field.value}
                                                    onChange={(date) => {
                                                        setFieldValue('startDate', date);
                                                        setStartDate(date);
                                                        if (values.endDate && date && date > values.endDate) {
                                                            setFieldValue('endDate', null);
                                                        }
                                                    }}
                                                    minDate={new Date(baseLinePeriod?.start_date)}
                                                    maxDate={new Date(baseLinePeriod?.end_date)}
                                                    disableFuture
                                                    format="dd/MM/yyyy"
                                                    slotProps={{
                                                        textField: {
                                                            readOnly: true, // Make the input field read-only
                                                            helperText: errors.startDate && touched.startDate ? errors.startDate : "",
                                                            FormHelperTextProps: { style: { color: '#FF5858' } }
                                                        },
                                                        // actionBar: {
                                                        //     actions: ["clear", "accept"],
                                                        //     className: "my-datepicker-actionbar",
                                                        // },
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <InputLabel
                                            htmlFor="endDate"
                                            style={{ whiteSpace: "initial", textAlign: 'left' }}
                                        >
                                            End date
                                        </InputLabel>
                                        <Field name="endDate">
                                            {({ field }) => (
                                                <DatePicker
                                                    id="endDate"
                                                    name="endDate"
                                                    sx={{
                                                        width: "100%",
                                                        input: { color: "#242424", },
                                                    }}
                                                    value={field.value}
                                                    onChange={(date) => setFieldValue('endDate', date)}
                                                    minDate={new Date(baseLinePeriod?.start_date)}
                                                    maxDate={new Date(baseLinePeriod?.end_date)}
                                                    
                                                    disableFuture
                                                    format="dd/MM/yyyy"
                                                    slotProps={{
                                                        textField: {
                                                             readOnly: true, // Make the input field read-only
                                                            helperText: errors.endDate && touched.endDate ? errors.endDate : "",
                                                            FormHelperTextProps: { style: { color: '#FF5858' } }
                                                        },
                                                        // actionBar: {
                                                        //     actions: ["clear", "accept"],
                                                        //     className: "my-datepicker-actionbar",
                                                        // },
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                </Grid>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="error" 
                                    sx={{ marginTop: 3, padding: '0.5rem 0.75rem', borderRadius: '8px' }}
                                >
                                    Delete entries
                                </Button>
                                </>
                            
                        </Box>
                    </Form>
                )}
            </Formik>
             }   
             
        </React.Fragment>
    );
}

export default DeleteEntriesModal;
