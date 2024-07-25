import React, { useState, useCallback, useEffect } from "react";
import {
  TextField,
  Chip,
  Autocomplete,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import debounce from "lodash/debounce";
import { GET_REQUEST } from "utils/HTTPRequests";
import { PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS } from "constants/apiEndPoints";

const EmailAutoCompleteWithChip = ({
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  name,
  isDisabled,
  withoutChip = false,
  facility_id,
  ...otherProps
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [labelText, setLabelText] = useState("");
  const [asterisk, setIsAsterisk] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (label?.includes("*")) {
      setLabelText(label.split("*")[0]);
      setIsAsterisk(true);
    } else {
      setLabelText(label);
    }
  }, [label]);

  const emailValues = Array.isArray(value) ? value : [];

  const fetchOptions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) return;
      setLoading(true);
      let searchLimit = 10;
      const apiUrl = `${PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.CRUD_CONTACTS}/${facility_id}/contact-suggestions?q=${query}&limit=${searchLimit}`;
      try {
        const response = await GET_REQUEST(apiUrl);
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching email suggestions:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    fetchOptions(newInputValue);

    if (withoutChip) {
      validateEmail(newInputValue);
    }
  };

  const handleChange = (event, newValue) => {
    if (withoutChip) {
      // For single email input
      const email =
        typeof newValue === "string" ? newValue : newValue?.email || "";
      onChange([{ email }]);
      validateEmail(email);
    } else {
      // For multiple email input
      const updatedValue = newValue.map((item) =>
        typeof item === "string" ? { email: item } : item
      );
      onChange(updatedValue);
      // Validate all emails
      const invalidEmails = updatedValue.filter(
        (item) => !isValidEmail(item.email)
      );
      if (invalidEmails.length > 0) {
        setError(
          `Invalid email${invalidEmails.length > 1 ? "s" : ""}: ${invalidEmails
            .map((item) => item.email)
            .join(", ")}`
        );
      } else {
        setError("");
      }
    }
  };

  const handleDelete = (emailToDelete) => {
    const updatedValue = value.filter((item) => item.email !== emailToDelete);
    onChange(updatedValue);
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateEmail = (email) => {
    if (!isValidEmail(email)) {
      setError("Invalid email address");
    } else {
      setError("");
    }
  };

  return (
    <FormControl fullWidth variant="outlined" error={!!error}>
      <FormLabel htmlFor={name}>
        {labelText}
        {asterisk && <span className="asterisk">*</span>}
      </FormLabel>
      <Autocomplete
        multiple={!withoutChip}
        freeSolo
        options={options}
        value={withoutChip ? emailValues[0]?.email || "" : emailValues}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        getOptionLabel={(option) => option.email || option}
        isOptionEqualToValue={(option, value) => {
          if (typeof option === "string" && typeof value === "string") {
            return option === value;
          }
          return option.email === value || option.email === value.email;
        }}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            placeholder={placeholder}
            disabled={isDisabled}
            error={!!error}
            InputProps={{
              ...params.InputProps,
              style: { color: "#242424" },
            }}
            {...otherProps}
          />
        )}
        renderTags={(value, getTagProps) =>
          !withoutChip &&
          value.map((option, index) => {
            const email = option.email || option;
            return (
              <Chip
                key={email}
                label={email}
                {...getTagProps({ index })}
                color="primary"
                variant="outlined"
                onDelete={() => handleDelete(email)}
                style={{
                  backgroundColor: isValidEmail(email) ? undefined : "#ffcccb",
                }}
              />
            );
          })
        }
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default EmailAutoCompleteWithChip;
