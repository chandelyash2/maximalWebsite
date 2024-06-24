import React from 'react';

const TabularTable = ({ table }) => {
  // Determine the maximum number of rows needed based on the longest fixed array
  let maxRows = Math.max(
    ...table.columns
      .filter(column => column.fixed) // Filter to only include columns with `fixed` property
      .map(column => column.fixed.length)
  );

  const allFixedEmpty = table.columns.every(column => !column.fixed || column.fixed.length === 0);

  // Ensure maxRows is at least 1 if there are no columns with `fixed` or all `fixed` arrays have length 0
  if (maxRows === 0 || allFixedEmpty) {
    maxRows = 1;
  }
  
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
                  <td className='text-center py-1' width={`${column.width}%`} key={colIndex}>
                        {!allFixedEmpty && column.fixed && column.fixed.length > 0 && column.fixed[rowIndex] ? column.fixed[rowIndex] : '.'}
        
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}

export default TabularTable;
