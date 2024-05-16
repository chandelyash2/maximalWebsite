import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import CustomFilter from './CustomFilter';

const FilterButton = ({ options, value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton className="text-light" aria-describedby={id} onClick={handleClick}>
        <FilterListIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: { maxHeight: 400, width: 250 }, // Adjust the height and width here
        }}
      >
        <div style={{ padding: '1rem' }}>
          <CustomFilter options={options} value={value} onChange={onChange} />
        </div>
      </Popover>
    </div>
  );
};

export default FilterButton;
