// src/components/ReportCustomizeHybrid/ColumnRow.js
import React from 'react';

const ColumnRow = ({ column, index, handleChange, handleDeleteRow }) => (
  <tr>
    <td>
      <input
        className="form-control btn-danger rounded my-1 text-center"
        type="number"
        value={column.sequence}
        onChange={(e) => handleChange(index, 'sequence', e.target.value)}
        size="5"
      />
    </td>
    <td>
      <input
        className="form-control btn-danger rounded my-1 text-center w-100"
        type="text"
        value={column.title}
        onChange={(e) => handleChange(index, 'title', e.target.value)}
      />
    </td>
    <td>
      <input
        className="form-control btn-danger rounded my-1 text-center w-100"
        type="text"
        value={column.height}
        onChange={(e) => handleChange(index, 'height', e.target.value)}
      />
    </td>
    <td>
    <input
        className="form-control btn-danger rounded my-1 text-center w-100"
        type="number"
        value={column.width}
        onChange={(e) => handleChange(index, 'width', e.target.value)}
      />
    </td>
    <td>
      <select
        className="form-control btn-danger rounded my-1 text-center w-100"
        value={column.format}
        onChange={(e) => handleChange(index, 'format', e.target.value)}
      >
        <option value="input">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
        <option value="textarea">Long Text</option>
        <option value="photo">Photo Upload</option>
      </select>
    </td>
    <td>
      <select
        className="form-control btn-danger rounded my-1 text-center w-100"
        value={column.border}
        onChange={(e) => handleChange(index, 'border', e.target.value)}
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </td>
    <td>
      <button
        className="form-control btn btn-warning rounded my-1 text-center"
        onClick={() => handleDeleteRow(index)}
      >
        <i className="bi bi-trash3"></i>
      </button>
    </td>
  </tr>
);

export default ColumnRow;
