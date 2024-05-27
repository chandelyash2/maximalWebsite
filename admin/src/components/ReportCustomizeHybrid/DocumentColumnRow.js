import React from 'react';

const DocumentColumnRow = ({ column, index, handleChange, handleDeleteRow }) => {
  const onFieldChange = (fieldName, value) => {
    handleChange(index, fieldName, value);
  };

  return (
    <tr>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.sequence} onChange={(e) => onFieldChange('sequence', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.title} onChange={(e) => onFieldChange('title', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.height} onChange={(e) => onFieldChange('height', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.width} onChange={(e) => onFieldChange('width', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.format} onChange={(e) => onFieldChange('format', e.target.value)} /></td>
      <td><input type="text" className="form-control btn-danger rounded my-1 text-center" value={column.border} onChange={(e) => onFieldChange('border', e.target.value)} /></td>
      <td className="text-center">
        <button className="btn btn-danger rounded-pill" onClick={handleDeleteRow}>
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default DocumentColumnRow;
