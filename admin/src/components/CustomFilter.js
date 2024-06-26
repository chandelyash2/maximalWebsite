import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const CustomFilter = ({ options, value, onChange, sortCallback }) => {
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

  const handleSort = (type) => {
    // Sort logic
    const sortedOptions = [...options];
    sortedOptions.sort((a, b) => {
      const labelA = a.label || ''; // Handle undefined or null values
      const labelB = b.label || ''; // Handle undefined or null values
      if (type === 'asc') {
        return labelA.localeCompare(labelB);
      } else if (type === 'desc') {
        return labelB.localeCompare(labelA);
      }
      return 0;
    });
  
    // Update state or pass sortedOptions to parent component
    // Example: onChange function to update state with sortedOptions
    onChange(sortedOptions.map(option => option.value));
  };
  

  return (
    <FormGroup>
      <ButtonGroup>
        <Button onClick={() => handleSort('asc')}>Sort A-Z</Button>
        <Button onClick={() => handleSort('desc')}>Sort Z-A</Button>
      </ButtonGroup>
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
    </FormGroup>
  );
};

export default CustomFilter;
