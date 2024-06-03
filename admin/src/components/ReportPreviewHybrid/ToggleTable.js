import React from 'react';

const ToggleTable = ({ table }) => {
  // Determine the maximum number of rows needed based on the longest options array
  const maxRows = Math.max(...table.columns.map(column => column.options.length));

  return (
    <div>
      <table className="table-bordered" width="100%">
        <thead className="thead-dark">
          <tr>
            {table.columns && table.columns
              .sort((a, b) => a.sequence - b.sequence)
              .map((column, index) => (
                <React.Fragment key={index}>
                  <th 
                    scope="col" 
                    className='text-center py-1' 
                    width={column.width + "%"}
                  >
                    {column.title}
                  </th>
                  <th 
                    scope="col" 
                    className='text-center py-1' 
                    width={column.width + "%"}
                  >
                    Yes/No
                  </th>
                  {column.description === 'Yes' && (
                    <th 
                      scope="col" 
                      className='text-center py-1' 
                      width="30%"
                    >
                      Description
                    </th>
                  )}
                </React.Fragment>
              ))}
          </tr>
        </thead>
        <tbody>
          {/* Render each row */}
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {table.columns && table.columns
                .sort((a, b) => a.sequence - b.sequence)
                .map((column, colIndex) => (
                  <React.Fragment key={colIndex}>
                    <td 
                      className="text-start ps-3 py-1" 
                      width={column.width + "%"}
                    >
                      {column.options[rowIndex] || ""}
                    </td>
                    <td 
                      className="text-center py-1" 
                      width={column.width + "%"}
                    >
                      {/* Add your Yes/No logic here if applicable */}
                    </td>
                    {column.description === 'Yes' && (
                      <td 
                        className="text-center py-1" 
                        width={column.width + "%"}
                      >
                        {/* Add your Description logic here if applicable */}
                      </td>
                    )}
                  </React.Fragment>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <hr /> */}
    </div>
  );
}

export default ToggleTable;
