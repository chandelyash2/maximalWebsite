import React from 'react';

const Document = ({ tableIndex, column, columnIndex, handleChange, handleDeleteRow }) => {
  return (
    <tr>
      <td><input type="text" className="form-control btn-danger  my-1 text-center" value={column.sequence} onChange={(e) => handleChange(tableIndex, columnIndex, 'sequence', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger  my-1 text-center" value={column.title} onChange={(e) => handleChange(tableIndex, columnIndex, 'title', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger  my-1 text-center" value={column.height} onChange={(e) => handleChange(tableIndex, columnIndex, 'height', e.target.value)} /></td>
      <td>
        <select className="form-control btn-danger  my-1 text-center" 
                value={column.width} 
                onChange={(e) => handleChange(tableIndex, columnIndex, 'width', e.target.value)} >
  <option value="50%">50%</option>
  <option value="100%">100%</option>
</select>
</td>
      <td>
      <select className="form-control btn-danger  my-1 text-center w-100"
              value={column.format}
              onChange={(e) => handleChange(tableIndex, columnIndex, 'format', e.target.value)} >
        <option value="input">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
        <option value="textarea">Long Text</option>
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
      <td className="text-center">
        <button className="btn btn-warning text-dark " onClick={() => handleDeleteRow(tableIndex, columnIndex)}>
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default Document;
