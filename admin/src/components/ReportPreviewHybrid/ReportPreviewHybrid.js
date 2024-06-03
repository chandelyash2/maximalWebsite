import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../../firebaseconfig';
import ToggleTable from './ToggleTable'; 
import DocumentTable from './DocumentTable';
// import ExportPDF from './ExportPDF';
import jsPDF from 'jspdf';

const ReportPreviewHybrid = () => {
  const { reportTempId } = useParams();
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Hybrid Report');
  const [tables, setTables] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    if (reportTempId) {
      const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
      get(reportTemplateRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setReportName(data.name);
            setReportType(data.type);
            setTables(data.tables || []);
            setCompanyName(data.companyName || '..data..' );
            setCompanyLocation(data.companyLocation || '..data..');
          } else {
            alert('Report template not found');
          }
        })
        .catch((error) => {
          alert(`Error fetching report template: ${error.message}`);
        });
    }
  }, [reportTempId]);

  const handleOrientationChange = (event) => {
    setOrientation(event.target.value);
  };
  
  const generatePDF = () => { 
  

    const PDFTabular = (columns,doc) => {
      const styles1 = {
          headStyles: {
            fillColor: [89, 53, 33],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
          },
          bodyStyles: {
            textColor: 0,
            fontSize: 10,
          },
          columnStyles: columns.reduce((acc, column, index) => {
            acc[index] = { cellWidth: column.width };
            return acc;
          }, {}),
        };
    
        doc.autoTable({
          head: [columns.map(column => column.title)],
          body: [columns.map(column => '..data..')], // Replace with actual data if available
          ...styles1,
        });
    }
    const PDFDocument = (columns,doc) => 
      {
        let lastSpecialCaseHandled = false;
        let rowIndex = 7;
    
        doc.setFontSize(10);
    
        columns.forEach((column) => {
          if (column.title === 'blank') {
            lastSpecialCaseHandled = !lastSpecialCaseHandled;
            return;
          }
    
          rowIndex++;
    
          let xCoordinate;
          if (column.width === '100%') {
            xCoordinate = 10;
          } else {
            xCoordinate = lastSpecialCaseHandled ? 100 : 10;
          }
    
          const columnWidth = column.width === '100%' ? 190 : 45;
    
          doc.setFillColor(89, 53, 33);
          doc.rect(xCoordinate, rowIndex * 10 - 7, columnWidth, 10, 'F');
          doc.setTextColor(255, 255, 255);
          doc.text(' ' + column.title, xCoordinate, rowIndex * 10);
          doc.setTextColor(0, 0, 0);
    
          if (column.width !== '100%') {
            doc.text('..value..', xCoordinate + 50, rowIndex * 10);
            lastSpecialCaseHandled = !lastSpecialCaseHandled;
          }
        });
      }
    
      const PDFToggle = (columns,doc) => 
        {
          const styles1 = {
            headStyles: {
              fillColor: [89, 53, 33],
              textColor: [255, 255, 255],
              fontSize: 10,
              fontStyle: 'bold',
            },
            bodyStyles: {
              textColor: 0,
              fontSize: 10,
            },
            columnStyles: columns.reduce((acc, column, index) => {
              acc[index] = { cellWidth: column.width };
              return acc;
            }, {}),
          };

          const headData = [];
          const headData1 = [];
          columns
            .sort((a, b) => a.sequence - b.sequence)
            .map((column, index) => {
              headData1.push(column.title);
              headData1.push('Yes/No');
              if (column.description === 'Yes') {
                headData1.push('Description');
              }
            });
             headData.push(headData1);

          //    const maxRows = Math.max(...columns.map(column => column.options.length));
          //    const bodyData = [];
          //    let bodyData1 = [];
          //    Array.from({ length: maxRows }).map((_, rowIndex) => {
          //    columns
          //       .sort((a, b) => a.sequence - b.sequence)
          //       .map((column, rowIndex) => {
          //             bodyData1.push(column.options[rowIndex] || "");
          //             bodyData1.push(" ");
          //             if (column.description === 'Yes') {
          //               bodyData1.push(" ");
          //             } 
          //           });
          //           bodyData.push(bodyData1);
          //           bodyData1 = [];
                
          // });


          const maxRows = Math.max(...columns.map(column => column.options.length));
const bodyData = [];

Array.from({ length: maxRows }).forEach((_, rowIndex) => {
  const bodyRow = []; // Create an empty row array for each iteration

  columns
    .sort((a, b) => a.sequence - b.sequence)
    .forEach((column, colIndex) => {
      bodyRow.push(column.options[rowIndex] || "", " "); // Cell value & placeholder for "Yes/No"
      if (column.description === 'Yes') {
        bodyRow.push(" "); // Placeholder for "Description"
      }
    });

  bodyData.push(bodyRow); // Add the populated row to bodyData
});
          
          // Generate the table with jsPDF-autoTable
          doc.autoTable({
            head: headData,
            body: bodyData,
            ...styles1
          });

        }

    const doc = new jsPDF(orientation);
    const tw = orientation === 'portrait' ? '60%' : '40%';
  
    // Add title with background
    const styles = {
      headStyles: {
        fillColor: [142, 2, 2],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: {
        textColor: 0,
        fontSize: 10,
      },
      didParseCell: (data) => {
        if ((data.section === 'body' && data.column.index === 0) ||
            (data.section === 'body' && data.column.index === 2 && data.cell.raw !== ' ')) {
          data.cell.styles.fillColor = [89, 53, 33];
          data.cell.styles.textColor = [255, 255, 255];
        }
      },
      drawRow: (row, data) => {
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.5);
        const startY = row.y + row.height;
        const endY = startY;
        doc.line(row.x, startY, row.x + row.width, endY);
      },
    };
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getStringUnitWidth(reportName) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const xPosition = (pageWidth - textWidth) / 2;
    const columnStyles = {
      0: { cellWidth: 50 },
      1: { cellWidth: 50 },
      2: { cellWidth: 50 },
      3: { cellWidth: 50 },
    };
  
    // Add centered heading
    doc.setFontSize(18);
    doc.text(reportName, xPosition, 20);
   
  
    const headerData = [
      ['Company Name', companyName, ' ', ' '],
      ['Company Location', companyLocation, ' ', ' ']
    ];
  
    doc.autoTable({
      body: headerData,
      startY: 30,
      tableWidth: tw,
      theme: 'plain',
      ...styles,
      columnStyles: columnStyles,
    });
  
    tables.map(table => {


      const headerData = [
        [table.name, ' ', ' '],
      ];
    
      doc.autoTable({
        body: headerData,
        tableWidth: tw,
        theme: 'plain',
        // ...styles,
        columnStyles: columnStyles,
      });

      switch (table.type) {
        case 'Tabular':
          return PDFTabular(table.columns,doc); // Pass additional data
        case 'Toggle':
          return PDFToggle(table.columns,doc);
        // case 'Document':
        //   return PDFDocument(table.columns,doc); // Use 'content' for Document type
        default:
          console.warn(`Unknown table type: ${table.type}`);
          return null; // Handle unknown types gracefully
      }
    });
  
    // Save the PDF
    doc.save('custom.pdf');
  

 
  };

  const generateExcel = () => {
    // Implementation for generating Excel
  };

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 py-4" style={{ color: '#735744', maxHeight: '680px', overflowY: 'auto' }}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4 rounded-pill px-5">
                <h3>ADMINISTRATOR PORTAL</h3>
              </button>
            </Link>
          </div>
          <div className="text-center">
            <button className="btn w-25 btn-danger text-center m-auto rounded-pill mb-3">{reportName}</button>
            <Link className="btn btn-danger text-center m-auto rounded-pill mb-3 ms-2"
                  to={`/ReportCustomizeHybrid/${reportTempId}`}
                   title='Edit'><i className="bi bi-pencil-square"></i></Link>
            <br />
            <select className='btn rounded-pill btn-danger' value={orientation} onChange={handleOrientationChange} title='Orientation'>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
            <button className="btn btn-warning text-center m-auto rounded-pill me-1" onClick={generatePDF}>Export PDF <i className="bi bi-filetype-pdf"></i></button>
            <button className="btn btn-success text-center m-auto rounded-pill" onClick={generateExcel}>Export Excel <i className="bi bi-filetype-xls"></i></button>
          </div>
          <div>
            <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Name</button>
            <button className="btn w-75 my-1 m-auto rounded-pill text-start ps-5">{companyName}</button>
            <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Location</button>
            <button className="btn w-75 my-1 m-auto rounded-pill text-start ps-5">{companyLocation}</button>
          </div>

          {tables.map((table, tableIndex) => (
            <div key={tableIndex} className='my-2'>
              <h4 className='mt-4 text-dark'>{table.name}</h4>
              {table.type === "Tabular" && (
                <div>
                  <table class="table-bordered" style={{ width: '100%' }}>
                    <thead className="thead-dark">
                    {/* className="w-100 d-flex justify-content-start" */}
                      <tr >
                        {table.columns && table.columns
                          .sort((a, b) => a.sequence - b.sequence)
                          .map((column, index) => (
                            <th scope="col" className='text-center py-1' width={column.width + "%"} key={index}>
                              {column.title}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                    {table.columns && table.columns
                          .sort((a, b) => a.sequence - b.sequence)
                          .map((column, index) => (
                            <td className='text-center py-1' width={column.width + "%"} key={index}>
                              ..data..
                            </td>
                          ))}
                          </tr>
                    </tbody>
                  </table>
                  {/* <hr /> */}
                </div>
              )}

              {table.type === "Document" && table.columns && <DocumentTable columns={table.columns} />}
              {table.type === "Toggle" && (<ToggleTable key={tableIndex} table={table} />)}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ReportPreviewHybrid;
