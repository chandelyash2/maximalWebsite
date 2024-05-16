import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

const CustomFilter = ({ options, value, onChange }) => {
  const handleChange = (event) => {
    const newValue = [...value];
    const index = newValue.indexOf(event.target.name);
    if (index === -1) {
      newValue.push(event.target.name);
    } else {
      newValue.splice(index, 1);
    }
    onChange(newValue);
  };

  return (
    <FormGroup>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          control={
            <Checkbox
              checked={value.includes(option.value)}
              onChange={handleChange}
              name={option.value}
            />
          }
          label={option.label}
          style={{ margin: 0, padding: '4px 0' }} // Reduce padding
        />
      ))}
    </FormGroup>
  );
};

export default CustomFilter;
