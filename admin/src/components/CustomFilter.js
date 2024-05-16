// CustomFilter.js
import React, { useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

const CheckboxOption = ({ children, ...props }) => {
  return (
    <components.Option {...props}>
      <Checkbox
        checked={props.isSelected}
        onChange={() => null}
        style={{ marginRight: 8 }}
      />
      {children}
    </components.Option>
  );
};

const CustomFilter = ({ options, value, onChange, searchPlaceholder }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <>
      <TextField
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder={searchPlaceholder || 'Search...'}
        variant="outlined"
        size="small"
        fullWidth
        margin="dense"
      />
      <Select
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option: CheckboxOption }}
        value={value}
        onChange={onChange}
        options={filteredOptions}
        placeholder="Select values..."
      />
    </>
  );
};

export default CustomFilter;
