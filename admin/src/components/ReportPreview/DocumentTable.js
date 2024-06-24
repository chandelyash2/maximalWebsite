import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DocumentTable = ({ columns }) => {
  return (
      <div className="row p-0">
        {columns
          .sort((a, b) => a.sequence - b.sequence)
          .map((column, index, columns) => {
            let elements = [];
            const prevSequence = index > 0 ? parseInt(columns[index - 1].sequence, 10) : null;
            let expectedSequence = prevSequence !== null ? prevSequence + 1 : parseInt(column.sequence, 10);

            // Add blank divs for missing sequences
            while (expectedSequence < column.sequence) {
              elements.push(
                <div key={`blank-${expectedSequence}`} className="col-6 my-1 pt-2">
                  <div className="d-flex align-items-center justify-content-center border ">
                    &nbsp;
                  </div>
                </div>
              );
              expectedSequence++;
            }

            // Add the actual column
            elements.push(
              <div
                className={`p-0 m-0 col-${column.width === '100%' ? '12' : '6'} my-1`}
              
                key={index}
              >
                <div className={`d-flex ${column.width === '100%' ? 'flex-column' : 'flex-wrap'} align-items-start`}>
                  <div
                    className={`py-1 btn-danger text-center  mb-1 `}

                    style={{ width: column.width === '100%' ? '25%' : '50%' }}
                  >
                    {column.title}
                  </div>
                  <p
                    className={`text-start overflow-auto float-left ps-3 py-1 ${
                      column.border === 'Yes' ? 'border border-1 border-dark ' : ''
                    }`}
                    style={{
                      width: column.width === '100%' ? '100%' : '50%',
                      minHeight: column.height + 'px',
                    }}
                  >
                    .....data.....
                  </p>
                </div>
              </div>
            );
            return elements;
          })}
      </div>
  );
};

export default DocumentTable;
