import React from 'react';

const DocumentTable = ({ columns }) => {
  return (
    <>
      {columns
        .sort((a, b) => a.sequence - b.sequence)
        .map((column, index, columns) => {
          let elements = [];
          const prevSequence = index > 0 ? columns[index - 1].sequence : null;
          let expectedSequence = prevSequence ? prevSequence + 1 : column.sequence;

          // Add blank divs for missing sequences
          while (expectedSequence < column.sequence) {
            elements.push(
              <div key={`blank-${expectedSequence}`} style={{ display: 'inline-block', width: '50%' }}>Blank</div>
            );
            expectedSequence++;
          }

          // Add the actual column
          elements.push(
            <div
              key={index}
              style={{
                display: column.width === '100%' ? 'block' : 'inline-block',
                width: column.width === '100%' ? '100%' : '45%',
              }}
            >
              <button
                className="btn my-1 btn-danger text-center rounded"
                style={{ width: column.width === '100%' ? '24%' : '49%' }}
              >
                {column.title}
              </button>
              <p
                className={`my-1 pt-3 text-start overflow-auto ps-5 ${
                  column.border === 'Yes' ? 'border border-1 border-dark' : ''
                }`}
                style={{
                  display: column.width === '100%' ? 'block' : 'inline-block',
                  width: column.width === '100%' ? '100%' : '48%',
                  minHeight: column.height + 'px',
                }}
              >
                .....data.....
              </p>
            </div>
          );

          return elements;
        })}
    </>
  );
};

export default DocumentTable;
