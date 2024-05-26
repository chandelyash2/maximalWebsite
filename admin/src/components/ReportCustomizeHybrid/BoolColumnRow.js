// src/components/ReportCustomizeHybrid/BoolColumnRow.js
import React from 'react';
import ComboBox from './ComboBox';

const BoolColumnRow = ({ column, index, handleBoolChange, handleBChange, handleDeleteBoolRow, handleAddOption }) => (
  <tr>
    <td>
      <input
        className="form-control btn-danger rounded my-1 text-center"
        type="number"
        value={column.sequence}
        onChange={(e) => handleBoolChange(index, 'sequence', e.target.value)}
        size="5"
      />
    </td>
    <td>
      <input
        className="form-control btn-danger rounded my-1 text-center w-100"
        type="text"
        value={column.title}
        onChange={(e) => handleBoolChange(index, 'title', e.target.value)}
      />
    </td>
    <td>
      <div key={index}>
        <ComboBox
          options={column.options}
          onChange={(value) => handleBChange(index, 'item', value)}
          onAddOption={(newOption) => handleAddOption(index, newOption)}
        />
      </div>
    </td>
    <td>
      <select
        className="form-control btn-danger rounded my-1 text-center w-100"
        value={column.description}
        onChange={(e) => handleBoolChange(index, 'description', e.target.value)}
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </td>
    <td>
      <button
        className="form-control btn btn-warning rounded my-1 text-center"
        onClick={() => handleDeleteBoolRow(index)}
      >
        <i className="bi bi-trash3"></i>
      </button>
    </td>
  </tr>
);

export default BoolColumnRow;
