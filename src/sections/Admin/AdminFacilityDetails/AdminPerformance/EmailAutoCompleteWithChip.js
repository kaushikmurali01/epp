import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
import { debounce } from "lodash";
import { PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS } from "constants/apiEndPoints";
import { GET_REQUEST } from "utils/HTTPRequests";
import { useField } from "formik";

const EmailAutoCompleteWithChip = ({
  label,
  multiple,
  excludeEmails = [],
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const { setValue, setTouched } = helpers;

  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [labelText, setLabelText] = useState("");
  const [asterisk, setIsAsterisk] = useState(false);

  useEffect(() => {
    if (label?.includes("*")) {
      setLabelText(label.split("*")[0]);
      setIsAsterisk(true);
    } else {
      setLabelText(label);
    }
  }, [label]);

  // Initialize field.value as an empty array for multiple mode
  useEffect(() => {
    if (multiple && !Array.isArray(field.value)) {
      setValue([]);
    }
  }, [multiple, field.value, setValue]);

  const fetchSuggestions = useCallback(
    async (query) => {
      if (query.length <= 2) {
        setOptions([]);
        return;
      }

      const searchLimit = 10;
      const apiUrl = `${PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.CRUD_CONTACTS}/${props.facility_id}/contact-suggestions?q=${query}&limit=${searchLimit}`;

      try {
        const response = await GET_REQUEST(apiUrl);
        const filteredOptions = response.data.filter(
          (option) => !excludeEmails.includes(option.email)
        );
        setOptions(filteredOptions);
      } catch (error) {
        console.error("Error fetching email suggestions:", error);
      }
    },
    [props.facility_id, excludeEmails]
  );

  const debouncedFetchSuggestions = useCallback(
    debounce((query) => fetchSuggestions(query), 300),
    [fetchSuggestions]
  );

  useEffect(() => {
    if (inputValue) {
      debouncedFetchSuggestions(inputValue);
    } else {
      setOptions([]);
    }
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [inputValue, excludeEmails, debouncedFetchSuggestions]);

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (
      !multiple &&
      isValidEmail(newInputValue) &&
      !excludeEmails.includes(newInputValue)
    ) {
      setValue(newInputValue);
      props.onSelectContact({ email: newInputValue });
    }
  };

  const handleChange = (event, newValue) => {
    if (multiple) {
      const validEmails = newValue
        .map((item) => (typeof item === "string" ? item : item.email))
        .filter(
          (email) => isValidEmail(email) && !excludeEmails.includes(email)
        );
      setValue(validEmails);
    } else {
      if (typeof newValue === "string") {
        if (isValidEmail(newValue) && !excludeEmails.includes(newValue)) {
          setValue(newValue);
          props.onSelectContact({ email: newValue });
        } else {
          setValue("");
          props.onSelectContact(null);
        }
      } else if (
        newValue &&
        newValue.email &&
        !excludeEmails.includes(newValue.email)
      ) {
        setValue(newValue.email);
        props.onSelectContact(newValue);
      } else {
        setValue("");
        props.onSelectContact(null);
      }
    }
    setInputValue("");
    setOptions([]);
  };

  const handleBlur = () => {
    setTouched(true);
    if (multiple) {
      const currentValue = Array.isArray(field.value) ? field.value : [];
      const newValues = currentValue.filter(
        (email) => !excludeEmails.includes(email)
      );
      if (newValues.length !== currentValue.length) {
        setValue(newValues);
      }
    } else if (field.value && excludeEmails.includes(field.value)) {
      setValue("");
      props.onSelectContact(null);
    }
    setOptions([]);
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={!!(meta.touched && meta.error)}
    >
      <FormLabel htmlFor={props.name}>
        {labelText}
        {asterisk && <span className="asterisk">*</span>}
      </FormLabel>
      <Autocomplete
        {...field}
        multiple={multiple}
        options={options}
        value={multiple ? field.value || [] : field.value}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.email
        }
        onChange={handleChange}
        onInputChange={handleInputChange}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            name={props.name}
            variant="outlined"
            fullWidth
            error={!!(meta.touched && meta.error)}
            helperText={meta.touched && meta.error ? meta.error : null}
            onBlur={handleBlur}
            sx={{
              "& .MuiInputBase-input": {
                color: "#242424",
              },
            }}
          />
        )}
        renderOption={(props, option) => <li {...props}>{option.email}</li>}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              variant="outlined"
              color="primary"
              sx={{ fontSize: "1rem" }}
              label={option}
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
        filterOptions={(options, params) => {
          const filtered = options.filter(
            (option) =>
              !excludeEmails.includes(
                typeof option === "string" ? option : option.email
              )
          );
          return filtered;
        }}
      />
    </FormControl>
  );
};

export default EmailAutoCompleteWithChip;
