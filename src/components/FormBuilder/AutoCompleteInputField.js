import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  FormLabel,
} from '@mui/material';
import { debounce } from 'lodash';

const AutoCompleteInputField = ({ companies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  // Function to handle exact match search with debounce
  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value?.trim() || '');
      }, 2000),
    []
  );

  const handleInputChange = (event, value) => {
    handleSearch(value);
  };

  const handleClose = (event, value) => {
    setSearchTerm('');
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      // Filter the company list based on exact match
      const exactMatchedCompanies = companies.filter((company) =>
        company.company_name.toLowerCase() === searchTerm.toLowerCase()
      );
      setFilteredCompanies(exactMatchedCompanies);
    } else {
      setFilteredCompanies([]);
    }
  }, [searchTerm, companies]);

  return (
    <Box>
      <Autocomplete
        value={searchTerm}
        onChange={(event, value) => handleInputChange(event, value)}
        onInputChange={handleInputChange}
        onClose={handleClose}
        options={filteredCompanies.map((company) => company.company_name)}
        getOptionLabel={(option) => option || ''}
        // getOptionKey={filteredCompanies.map((company) => company.id)}
        getOptionSelected={(option, value) => option.id === value.id}
        // noOptionsText="No search results"
        renderInput={(params) => (
          <React.Fragment>
            <FormLabel>{"Company name"}</FormLabel>
            <TextField {...params} fullWidth />
          </React.Fragment>
        )}
      />

      {filteredCompanies.length === 0 && searchTerm.length > 0 && (
        <Box sx={{ marginTop: 2 }}>No exact matches found.</Box>
      )}
    </Box>
  );
};

export default AutoCompleteInputField;