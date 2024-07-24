import React, { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, FormGroup, FormLabel, Typography } from "@mui/material";
import debounce from "lodash.debounce";
import { useField, useFormikContext } from "formik";

const FreeSoloAutoCompleteInput = ({
  optionsArray,
  inputFieldLabel,
  optionKey,
  optionLabel,
  name,
  onChange,
  onBlur,
  value,
  allowCustomValue = false,
}) => {
  const [selectValue, setSelectValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [labelText, setLabelText] = useState("");
  const [isAsterisk, setIsAsterisk] = useState(false);

  useEffect(() => {
    if (inputFieldLabel?.includes("*")) {
      setLabelText(inputFieldLabel.split("*")[0]);
      setIsAsterisk(true);
    } else {
      setLabelText(inputFieldLabel);
      setIsAsterisk(false);
    }
  }, [inputFieldLabel]);

  const { setFieldValue, setFieldTouched } = useFormikContext();
  const formikProps = useFormikContext();
  const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...meta,
  };

  // Handle the initial value when editing a contact
  // useEffect(() => {
  //   if (value) {
  //     const selectedOption = optionList.find(
  //       (option) => option.id === value.id
  //     );
  //     if (selectedOption) {
  //       setSelectValue(selectedOption);
  //       setInputValue(selectedOption.label);
  //       setFieldValue(name, selectedOption.id);
  //     }
  //   }
  // }, [value, optionList, setFieldValue, name]);

  useEffect(() => {
    if (value) {
      const selectedOption = optionList.find(
        (option) =>
          option.id === value.id || option.label === value.company_name
      );
      if (selectedOption) {
        setSelectValue(selectedOption);
        setInputValue(selectedOption.label);
        setFieldValue(name, selectedOption.id || selectedOption.label);
      } else if (typeof value === "object" && value.company_name) {
        // If it's a custom value not in the list
        setSelectValue({ id: value.id, label: value.company_name });
        setInputValue(value.company_name);
        setFieldValue(name, value.company_name);
      }
    }
  }, [value, optionList, setFieldValue, name]);

  if (meta && meta.touched && meta.error) {
    const errorMsg =
      typeof meta.error === "object" && meta.error !== null
        ? meta.error.id
        : meta.error;
    configTextfield.error = true;
    configTextfield.helperText = errorMsg;
  }

  // Function to handle exact match search with debounce
  const handleSearch = useMemo(
    () =>
      debounce((newValue) => {
        const trimValue = newValue?.trim() || "";
        setSearchTerm(trimValue);
      }, 1000),
    []
  );

  const handleOnChange = (event, newValue) => {
    setSelectValue(newValue);
    if (newValue && typeof newValue === "object") {
      setFieldValue(name, newValue.id);
      setInputValue(newValue.label);
    } else {
      setFieldValue(name, newValue);
      setInputValue(newValue || "");
    }
    if (onChange) {
      onChange(event, newValue);
    }
  };

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
    handleSearch(newValue);
    if (allowCustomValue) {
      setFieldValue(name, newValue);
    }
  };

  const handleBlur = (event) => {
    formikProps.handleBlur(event);
    setFieldTouched(name, true);
    if (allowCustomValue && inputValue) {
      setFieldValue(name, inputValue);
    }
    // Call the onBlur prop if it exists
    if (onBlur) {
      onBlur(event, inputValue);
    }
  };

  useEffect(() => {
    const modifyList = optionsArray.map((company) => ({
      id: company[optionKey],
      label: company[optionLabel],
    }));
    setOptionList(modifyList);
  }, [optionsArray, optionKey, optionLabel]);

  useEffect(() => {
    if (searchTerm?.length > 0) {
      // Filter the option item list based on exact match
      const exactMatched = optionList.filter(
        (item) => item.label.toLowerCase() === searchTerm.toLowerCase()
      );
      setFilteredItems(exactMatched);
    } else {
      setFilteredItems([]);
    }
  }, [searchTerm, optionList]);

  return (
    <FormGroup className="theme-form-group">
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={filteredItems}
        sx={{ width: "100%", display: "flex", flexDirection: "column" }}
        value={selectValue}
        onChange={handleOnChange}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        onBlur={handleBlur}
        freeSolo={allowCustomValue}
        noOptionsText={
          <Typography variant="body2">
            {searchTerm.length === 0
              ? "Please enter company name"
              : "No results found"}
          </Typography>
        }
        renderInput={(params) => (
          <React.Fragment>
            {labelText && (
              <FormLabel>
                {labelText}
                {isAsterisk && <span style={{ color: "red" }}>*</span>}
              </FormLabel>
            )}
            <FormControl className="theme-form-control">
              <TextField {...configTextfield} {...params} />
            </FormControl>
          </React.Fragment>
        )}
      />
    </FormGroup>
  );
};

export default FreeSoloAutoCompleteInput;
