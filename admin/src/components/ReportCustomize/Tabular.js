// src/components/ReportCustomizeHybrid/Tabular.js
import React from 'react';

const Tabular = ({ tableIndex, columnIndex, column, handleChange, handleDeleteRow }) => (
  <tr>
    <td>
      <input
        className="form-control btn-danger  my-1 text-center"
        type="number"
        value={column.sequence}
        onChange={(e) => handleChange(tableIndex, columnIndex, 'sequence', e.target.value)}
        size="5"
      />
    </td>
    <td>
      <input
        className="form-control btn-danger  my-1 text-center w-100"
        type="text"
        value={column.title}
        onChange={(e) => handleChange(tableIndex, columnIndex, 'title', e.target.value)}
      />
    </td>
    <td>
      <input
        className="form-control btn-danger  my-1 text-center w-100"
        type="text"
        value={column.height}
        onChange={(e) => handleChange(tableIndex, columnIndex, 'height', e.target.value)}
      />
    </td>
    <td>
    <input
        className="form-control btn-danger  my-1 text-center w-100"
        type="number"
        value={column.width}
        onChange={(e) => handleChange(tableIndex, columnIndex, 'width', e.target.value)}
      />
    </td>
    <td>
      <select
        className="form-control btn-danger  my-1 text-center w-100"
        value={column.format}
        onChange={(e) => handleChange(tableIndex, columnIndex, 'format', e.target.value)}
      >
        <option value="input">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
        <option value="textarea">Long Text</option>
        <option value="fixed value">Fixed Value</option>
        <option value="Yes/No">Yes/No</option>
        <option value="photo">Photo Upload</option>
        <option value="photo">Photo Capture</option>
        <option value="photo">F&C</option>
      </select>
    </td>
    <td>
      <select
        className="form-control btn-danger  my-1 text-center w-100"
        value={column.border}
        onChange={(e) => handleChange(tableIndex, columnIndex, 'border', e.target.value)}
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </td>
    <td>
      <button
        className="form-control btn btn-warning  my-1 text-center"
        onClick={() => handleDeleteRow(columnIndex)}
      >
        <i className="bi bi-trash3"></i>
      </button>
    </td>
  </tr>
);

export default Tabular;
