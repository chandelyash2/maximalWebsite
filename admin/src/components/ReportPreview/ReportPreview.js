import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../../firebaseconfig';
import TabularTable from './TabularTable'; 
import DocumentTable from './DocumentTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportPreviewHybrid = () => {
  const { reportTempId } = useParams();
  const [reportName, setReportName] = useState('');
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


    const PDFTabular = (columns,doc) => 
      {
        const styles1 = {
          table: { // Add a class name for the table
            borderCollapse: 'collapse', // Ensure borders don't overlap (optional)
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 10,
            fontStyle: 'bold',
            lineWidth: 0.3,
            lineColor: [0, 0, 0],
            tableLineColor: [0, 0, 0],
            tableLineWidth: 10,
          },
          bodyStyles: {
            textColor: 0,
            fontSize: 10,
            lineWidth: 0.3,
            lineColor: [0, 0, 0],
            tableLineColor: [0, 0, 0],
            tableLineWidth: 10,
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
          });
           headData.push(headData1);

          let maxRows = Math.max(
            ...columns
              .filter(column => column.fixed) // Filter to only include columns with `fixed` property
              .map(column => column.fixed.length)
          );
        
          const allFixedEmpty = columns.every(column => !column.fixed || column.fixed.length === 0);
          // Ensure maxRows is at least 1 if there are no columns with `fixed` or all `fixed` arrays have length 0
          
          if (maxRows === 0 || allFixedEmpty) {
            maxRows = 1;
          }

        const bodyData = [];

          Array.from({ length: maxRows }).forEach((_, rowIndex) => {
            const bodyRow = []; // Create an empty row array for each iteration

            columns
              .sort((a, b) => a.sequence - b.sequence)
              .forEach((column, colIndex) => {
                bodyRow.push(!allFixedEmpty && column.fixed && column.fixed.length > 0 && column.fixed[rowIndex] ? column.fixed[rowIndex] : ' '); 
              
              });

            bodyData.push(bodyRow); // Add the populated row to bodyData
          });
        
        // Generate the table of DocumentPDF
        doc.autoTable({
          head: headData,
          body: bodyData,
          ...styles1
        });

      }

    const PDFDocument = (columns, doc) => {
      const styles1 = {
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 10,
          fontStyle: 'bold',
          lineWidth: 0.3,
          lineColor: [0, 0, 0],
          backgroundColor: 'transparent',
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: 0,
          fontSize: 10,
          lineWidth: 0.3,
          lineColor: [0, 0, 0],
        },
        columnStyles: columns.reduce((acc, column, index) => {
          acc[index] = { cellWidth: column.width };
          return acc;
        }, {}),
      };
    
      const bodyData = [];
    
      columns.sort((a, b) => a.sequence - b.sequence).forEach((column, index, columns) => {
        let elements = [];
        let round = 0;
        let p1 = '';
        const prevSequence = index > 0 ? parseInt(columns[index - 1].sequence, 10) : null;
        let expectedSequence = prevSequence !== null ? prevSequence + 1 : parseInt(column.sequence, 10);
    
        // Add blank divs for missing sequences
        while (expectedSequence < column.sequence) {
          elements.push({ content: '..blank..', colspan: 1 }); // Example of colspan for a blank cell
          expectedSequence++;
        }
    
        // Add the actual column
        if (column.width === '100%') {
          elements.push({ content: column.title, colspan: 4 }); // Example of colspan for a header cell
          bodyData.push(elements);
          elements = []; // Clear elements array for the next row
          elements.push({ content: '..value...', colspan: 4 }); // Example of colspan for a value cell
          round = 0;
        } else {
          if (round === 0) {
            p1 = column.title;
            round = 1;
          } else {
            elements.push({ content: p1, colspan: 1 }, { content: '..value...', colspan: 1 }, { content: column.title, colspan: 1 }, { content: '..value...', colspan: 1 });
            round = 0;
          }
        }
        if (round === 1) {
          elements.push({ content: p1, colspan: 1 }, { content: '..value...', colspan: 1 }, { content: '', colspan: 1 }, { content: '', colspan: 1 });
        }
        bodyData.push(elements);
      });
    
      // Example of using autoTable with bodyData and styles
      doc.autoTable({
        body: bodyData,
        ...styles1,
      });
    
      // Save the document
      doc.save('table.pdf');
    };

    //
    // * **** * * * * * * *  main function start from here ** * * * * ************
    //
    const doc = new jsPDF(orientation);
    const tw = orientation === 'portrait' ? '60%' : '40%';
  
    // Add title with background
    const styles = {
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 10,
        fontStyle: 'bold',
        border: '1px solid black',
        tableLineColor: [0, 0, 0],
              tableLineWidth: 10,
      },
      bodyStyles: {
        textColor: 0,
        fontSize: 10,
        border: '1px solid black',
        tableLineColor: [0, 0, 0],
              tableLineWidth: 10,
      },
      didParseCell: (data) => {
        if ((data.section === 'body' && data.column.index === 0) ||
            (data.section === 'body' && data.column.index === 2 && data.cell.raw !== ' ')) {
          data.cell.styles.fillColor = [255, 255, 255];
          data.cell.styles.textColor = [0, 0, 0];
          data.cell.styles.fontStyle = 'bold';
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
      1: { cellWidth: 120 },
    };
  
    // Add centered heading
    doc.setFontSize(18);
    doc.text(reportName, xPosition, 20);
   
  
    const headerData = [
      ['Company Name', companyName, ],
      ['Company Location', companyLocation, ]
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
        [table.name, ' '],
        ];
    
      doc.autoTable({
        body: headerData,
        tableWidth: tw,
        theme: 'plain',
        ...styles,
        columnStyles: columnStyles,
      });

      switch (table.type) {
        case 'Tabular':
          return PDFTabular(table.columns,doc); // Pass additional data
        case 'Document':
          return PDFDocument(table.columns,doc); // Use 'content' for Document type
        default:
          console.warn(`Unknown table type: ${table.type}`);
          return null; // Handle unknown types gracefully
      }
    });
  
    // Save the PDF
    doc.save('Report.pdf');
  

 
  };

  const generateExcel = () => {
    // Implementation for generating Excel
  };

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="ol-xl-10 col-lg-12 py-4 p-0 py-4" style={{ color: '#735744', maxHeight: '680px', overflowY: 'auto' }}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4  px-5">
                <h3>ADMINISTRATOR PORTAL</h3>
              </button>
            </Link>
          </div>
          <div className="text-center">
            <button className="btn w-25 btn-danger text-center m-auto mb-3">{reportName}</button>
            <Link className="btn btn-danger text-center m-auto  mb-3 ms-2"
                  to={`/ReportCustomize/${reportTempId}`}
                   title='Edit'><i className="bi bi-pencil-square"></i></Link>
            <br />
            <select className='btn btn-danger' value={orientation} onChange={handleOrientationChange} title='Orientation'>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
            <button className="btn btn-warning text-center m-auto me-1" onClick={generatePDF}>Export PDF <i className="bi bi-filetype-pdf"></i></button>
            <button className="btn btn-success text-center m-auto " onClick={generateExcel}>Export Excel <i className="bi bi-filetype-xls"></i></button>
          </div>
          <div className='p-0 m-0 py-1 overflow-auto'>
            <div className="py-1 w-25 float-start my-1 btn-danger text-center m-auto ">Company Name</div>
            <div className="py-1 w-75 float-start my-1 m-auto text-start ps-5">{companyName}</div>
            <div className="py-1 w-25 float-start my-1 btn-danger text-center m-auto ">Company Location</div>
            <div className="py-1 w-75 float-start my-1 m-auto text-start ps-5">{companyLocation}</div>
          </div>

          {tables.map((table, tableIndex) => (
            <div key={tableIndex} className='my-2'>
              <h4 className='mt-4 text-dark'>{table.name}</h4>
              
           
              {table.type === "Tabular" && table.columns && <TabularTable table={table} />}
              {table.type === "Document" && table.columns && <DocumentTable columns={table.columns} />}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ReportPreviewHybrid;
