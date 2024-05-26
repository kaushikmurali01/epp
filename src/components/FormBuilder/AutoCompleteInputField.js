import React, { useEffect, useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, FormControl, FormGroup, FormLabel } from '@mui/material';
import debounce from 'lodash.debounce';
import { useField, useFormikContext } from 'formik';


const AutoCompleteInputField = ({ optionsArray, inputFieldLabel, optionKey, optionLabel, name }) => {
  const [selectValue, setSelectValue] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [optionList, setOptionList] = useState([]);

  const formikProps = useFormikContext();
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(name);

  const configTextfield = {
    name: name,
  }




  if (meta && meta.touched && meta.error) {
    const errorMsg = typeof meta.error === 'object' && meta.error !== null ? meta.error.id : meta.error
    configTextfield.error = true;
    configTextfield.helperText = errorMsg;
  }


  // Function to handle exact match search with debounce
  const handleSearch = useMemo(() =>
    debounce((newValue) => {
      const trimValue = newValue?.trim() || '';
      setSearchTerm(trimValue)
    }, 1000), []);


  const handleOnChange = (event, newValue) => {

    setSelectValue(newValue);
    setFieldValue(name, newValue);
  };

  const handleInputChange = (event, newValue) => {
    handleSearch(newValue)

  };

  useEffect(() => {
    const modifyList = optionsArray.map((company) => ({
      id: company[optionKey],
      label: company[optionLabel]
    }));
    setOptionList(modifyList)

  }, [])


  useEffect(() => {

    if (searchTerm?.length > 0) {
      // Filter the option item list based on exact match
      const exactMatched = optionList.filter((item) =>
        item.label.toLowerCase() === searchTerm.toLowerCase()
      );
      setFilteredItems(exactMatched);
    } else {
      setFilteredItems([]);
    }
  }, [searchTerm, optionList]);


  return (
    <FormGroup className='theme-form-group'>
      <Autocomplete
        disablePortal
        name={name}
        id="combo-box-demo"
        options={filteredItems}
        sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
        value={selectValue}
        onChange={handleOnChange}
        onInputChange={handleInputChange}
        onBlur={formikProps.handleBlur}
        noOptionsText="No results found"
        renderInput={(params) => (
          <React.Fragment>
            {inputFieldLabel && <FormLabel>{inputFieldLabel}</FormLabel>}

            <FormControl className='theme-form-control'>
              <TextField {...configTextfield} {...params} />
            </FormControl>
          </React.Fragment>
        )}
      />

    </FormGroup>
  );
}


export default AutoCompleteInputField;