import { DatePicker } from "@mui/x-date-pickers";
import { MiniTable } from "components/MiniTable";
import { Formik, Field, Form } from "formik";
import React from "react";

const DatePickerField = ({ field, form: {setFieldValue}, ...props }) => {
  return (
    <DatePicker
      {...props}
      value={field.value}
      onChange={(date) => setFieldValue(field.name, date)}
    />
  );
};

const SettingMicroComponent = () => {
  const userColumn = [
    {
      Header: "",
      accessor: "id",
    },
    {
      Header: "",
      accessor: "progress",
    },
    {
      Header: "1st P4P",
      accessor: "first_p4p",
    },
    {
      Header: "2nd P4P",
      accessor: "second_p4p",
    },
    {
      Header: "3rd P4P",
      accessor: "third_p4p",
    },
  ];

  const initialValues = [
    {
      id: "Pay-for-performance start",
      progress: "",
      first_p4p: new Date(),
      second_p4p: null,
      third_p4p: new Date(),
    },
    {
      id: "Pay-for-performance end",
      progress: new Date(),
      first_p4p: null,
      second_p4p: null,
      third_p4p: new Date(),
    },
    {
      id: "Pre-Project incentive ($)",
      progress: null,
      first_p4p: new Date(),
      second_p4p: new Date(),
      third_p4p: null,
    },
    {
      id: "Pre-Project incentive status",
      progress: new Date(),
      first_p4p: new Date(),
      second_p4p: null,
      third_p4p: null,
    },
    {
      id: "Pay-for-performance incentive status",
      progress: null,
      first_p4p: null,
      second_p4p: new Date(),
      third_p4p: new Date(),
    },
    {
      id: "On-peak Pay-for-performance incentive rate ($/kWh)",
      progress: new Date(),
      first_p4p: new Date(),
      second_p4p: null,
      third_p4p: null,
    },
    {
      id: "Off-peak Pay-for-performance incentive rate",
      progress: null,
      first_p4p: null,
      second_p4p: new Date(),
      third_p4p: new Date(),
    },
  ];

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Formik initialValues={{ rows: initialValues }} onSubmit={handleSubmit}>
      {({ values }) => (
        <Form>
          <MiniTable
            columns={userColumn}
            data={values.rows.map((row, index) => ({
              id: row.id,
              progress: (
                <Field
                  name={`rows[${index}].progress`}
                  component={DatePickerField}
                />
              ),
              first_p4p: (
                <Field
                  name={`rows[${index}].first_p4p`}
                  component={DatePickerField}
                />
              ),
              second_p4p: (
                <Field
                  name={`rows[${index}].second_p4p`}
                  component={DatePickerField}
                />
              ),
              third_p4p: (
                <Field
                  name={`rows[${index}].third_p4p`}
                  component={DatePickerField}
                />
              ),
            }))}
          />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default SettingMicroComponent;
