import React from 'react';

const Document = ({ tableIndex, column, columnIndex, handleChange, handleDeleteRow }) => {
  return (
    <tr>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.sequence} onChange={(e) => handleChange(tableIndex, columnIndex, 'sequence', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.title} onChange={(e) => handleChange(tableIndex, columnIndex, 'title', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.height} onChange={(e) => handleChange(tableIndex, columnIndex, 'height', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.width} onChange={(e) => handleChange(tableIndex, columnIndex, 'width', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.format} onChange={(e) => handleChange(tableIndex, columnIndex, 'format', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.border} onChange={(e) => handleChange(tableIndex, columnIndex, 'border', e.target.value)} /></td>
      <td className="text-center">
        <button className="btn btn-danger rounded-pill" onClick={() => handleDeleteRow(tableIndex, columnIndex)}>
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default Document;
