import React from 'react';
import ComboBox from './ComboBox';
import { Modal } from 'react-bootstrap';

const FixedValue = ({ tableIndex, column, columnIndex, handleChange, handleDeleteRow, handleAddOption,  }) => (
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Output Modal</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <table>
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
      <div key={columnIndex}>
        <ComboBox
          tableIndex={tableIndex}
          columnIndex={columnIndex}
          options={column.options}
          value={column.item}
          onChange={(value) => handleChange(tableIndex, columnIndex, 'item', value)}
          onAddOption={(newOption) => handleAddOption(tableIndex, columnIndex, newOption)}
        />
      </div>
    </td>
    <td>
      <select
        className="form-control btn-danger  my-1 text-center w-100"
        value={column.description}
        onChange={(e) => handleChange(tableIndex, columnIndex, 'description', e.target.value)}
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </td>
    <td>
      <button
        className="form-control btn btn-warning  my-1 text-center"
        onClick={() => handleDeleteRow(tableIndex, columnIndex)}
      >
        <i className="bi bi-trash3"></i>
      </button>
    </td>
  </tr>
  </table> 
  </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
);

export default FixedValue;
