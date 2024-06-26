import { DatePicker } from "@mui/x-date-pickers";
import { MiniTable } from "components/MiniTable";
import { Formik, Field, Form, useFormikContext } from "formik";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TextField, Select, MenuItem } from "@mui/material";

const DatePickerField = ({ field, form: { setFieldValue }, ...props }) => {
  return (
    <DatePicker
      {...props}
      value={field.value}
      onChange={(date) => {
        setFieldValue(field.name, date);
        props.onSubmit();
      }}
      slots={{ openPickerIcon: ExpandMoreIcon }}
    />
  );
};

const InputField = ({ field, form: { setFieldValue }, ...props }) => {

  const handleChange = (event) => {
    const { value } = event.target;
    const numericValue = value.replace(/[^0-9.]/g, "");
    setFieldValue(field.name, numericValue);
  };

  return (
    <TextField
      {...field}
      {...props}
      type="text"
      defaultValue={field.value}
      inputProps={{
        inputMode: "numeric",
        pattern: "[0-9]*",
      }}
      onKeyDown={(evt) =>
        ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
      }
      onChange={handleChange}
    />
  );
};

const SelectField = ({ field, ...props }) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    if (!field.value) {
      setFieldValue(field.name, "option1");
    }
  }, [field.name, field.value, setFieldValue]);

  return (
    <Select
      {...field}
      {...props}
      onChange={(e) => {
        const value = e.target.value;
        setFieldValue(field.name, value);
        if (props.onSubmit) {
          props.onSubmit();
        }
      }}
      displayEmpty={true}
      fullWidth
    >
      <MenuItem value="option1">In-process</MenuItem>
      <MenuItem value="option2">Option 2</MenuItem>
      <MenuItem value="option3">Option 3</MenuItem>
    </Select>
  );
};

const SettingMicroComponent = () => {
  const userColumn = [
    { Header: "", accessor: "id" },
    { Header: "", accessor: "first_column" },
    { Header: "1st P4P", accessor: "first_p4p" },
    { Header: "2nd P4P", accessor: "second_p4p" },
    { Header: "3rd P4P", accessor: "third_p4p" },
  ];

  const initialValues = [
    {
      id: "Pay-for-performance start",
      first_column: null,
      first_p4p: new Date(),
      second_p4p: new Date(),
      third_p4p: new Date(),
    },
    {
      id: "Pay-for-performance end",
      first_column: null,
      first_p4p: new Date(),
      second_p4p: new Date(),
      third_p4p: new Date(),
    },
    {
      id: "Pre-Project incentive ($)",
      first_column: "50",
      first_p4p: null,
      second_p4p: null,
      third_p4p: null,
    },
    {
      id: "Pre-Project incentive status",
      first_column: "",
      first_p4p: null,
      second_p4p: null,
      third_p4p: null,
    },
    {
      id: "Pay-for-performance incentive status",
      first_column: null,
      first_p4p: "",
      second_p4p: "",
      third_p4p: "",
    },
    {
      id: "On-peak Pay-for-performance incentive rate ($/kWh)",
      first_column: null,
      first_p4p: "20",
      second_p4p: null,
      third_p4p: null,
    },
    {
      id: "Off-peak Pay-for-performance incentive rate ($/kWh)",
      first_column: null,
      first_p4p: "20",
      second_p4p: null,
      third_p4p: null,
    },
    {
      id: "Minimum savings (%)",
      first_column: "5",
      first_p4p: null,
      second_p4p: null,
      third_p4p: null,
    },
  ];

  const renderField = (row, index, columnName, submitForm) => {
    const fieldName = `rows[${index}].${columnName}`;

    if (columnName === "first_column") {
      if (
        row.id === "Pre-Project incentive ($)" ||
        row.id === "Minimum savings (%)"
      ) {
        return (
          <Field name={fieldName} component={InputField} onBlur={submitForm} />
        );
      } else if (row.id === "Pre-Project incentive status") {
        return (
          <Field
            name={fieldName}
            component={SelectField}
            onSubmit={submitForm}
          />
        );
      }
    } else if (["first_p4p", "second_p4p", "third_p4p"].includes(columnName)) {
      if (
        row.id.includes("Pay-for-performance") &&
        (row.id.includes("start") || row.id.includes("end"))
      ) {
        return (
          <Field
            name={fieldName}
            component={DatePickerField}
            onSubmit={submitForm}
          />
        );
      } else if (row.id === "Pay-for-performance incentive status") {
        return (
          <Field
            name={fieldName}
            component={SelectField}
            onSubmit={submitForm}
          />
        );
      } else if (
        columnName === "first_p4p" &&
        row.id.includes("incentive rate") &&
        row[columnName] !== null
      ) {
        return (
          <Field
            name={fieldName}
            component={InputField}
            onBlur={submitForm}
          />
        );
      }
    }

    return null;
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Formik initialValues={{ rows: initialValues }} onSubmit={handleSubmit}>
      {({ values, submitForm }) => (
        <Form>
          <MiniTable
            columns={userColumn}
            data={values.rows.map((row, index) => ({
              id: row.id,
              first_column: renderField(row, index, "first_column", submitForm),
              first_p4p: renderField(row, index, "first_p4p", submitForm),
              second_p4p: renderField(row, index, "second_p4p", submitForm),
              third_p4p: renderField(row, index, "third_p4p", submitForm),
            }))}
          />
        </Form>
      )}
    </Formik>
  );
};

export default SettingMicroComponent;
