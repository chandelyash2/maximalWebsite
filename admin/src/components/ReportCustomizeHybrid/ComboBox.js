import React, { useState } from 'react';

const ComboBox = ({ tableIndex, columnIndex, options = [], value = '', onChange = () => {}, onAddOption = () => {} }) => {
  const [newOption, setNewOption] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOption = () => {
    if (newOption && !options.includes(newOption)) {
      onAddOption(newOption);
      setNewOption(''); // Clear the input field
    }
  };

  const handleEditOption = (index) => {
    setEditIndex(index);
    setNewOption(options[index]); // Set the input field with the selected option for editing
  };

  const handleUpdateOption = () => {
    if (editIndex !== null && newOption && !options.includes(newOption)) {
      const updatedOptions = [...options];
      updatedOptions[editIndex] = newOption;
      onChange(newOption); // Update the value to the new option
      setNewOption(''); // Clear the input field
      setEditIndex(null);
    }
  };

  return (
    <div>
      <select
        className="form-control btn-danger rounded my-1 text-center w-100"
        value={value}
        size="5"
        onChange={(e) => {
          onChange(e.target.value);
          handleEditOption(e.target.selectedIndex); // Pass the index of the selected option to handleEditOption
        }}
      >
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Input and buttons for adding and editing options */}
      <div className="input-group mb-3">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          className="form-control w-75"
          placeholder={editIndex !== null ? 'Edit option' : 'Add new option'}
        />
        {editIndex !== null ? (
          <button className="btn btn-outline-secondary w-25" type="button" onClick={handleUpdateOption}>
            Update
          </button>
        ) : (
          <button className="btn btn-outline-secondary w-25" type="button" onClick={handleAddOption}>
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default ComboBox;
