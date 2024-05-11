import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ref, get, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';


const ReportPreview = () => {
  const { reportTempId } = useParams();
  const navigate = useNavigate();
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Document Report');
  const [columns, setColumns] = useState([]);
  const [employeeUserId, setEmployeeUserId] = useState('');
  const [customerUserId, setCustomerUserId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const htmlRef = useRef(null);
  const [orientation, setOrientation] = useState('portrait');
  const [scale, setScale] = useState(0.85); // Default scale

  const handleOrientationChange = (event) => {
    setOrientation(event.target.value);
  };

  const handleScaleChange = (event) => {
    const newScale = parseFloat(event.target.value);
    if (newScale >= 0.8 && newScale <= 1.2) { // Validate scale between 80% and 120%
      setScale(newScale);
    } else {
      console.warn('Invalid scale value. Please enter a value between 0.8 and 1.2.');
    }
  };

  useEffect(() => {
    if (reportTempId) {
      const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
      get(reportTemplateRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            if(data.type=="Tabular Report")
            {
            setReportName(data.name);
            setReportType(data.type);
            setColumns(data.columns || []); // Ensure columns is always initialized as an array
            setCompanyName(data.companyName);
            setCompanyLocation(data.companyLocation);
            setEmployeeUserId(data.employeeUserId);
            setCustomerUserId(data.customerUserId);
            setStartDate(data.startDate);
            setEndDate(data.endDate);
            }
            if(data.type=="Document Report")
            {
              setReportName(data.name);
              setReportType(data.type);
              // setColumns(data.columns || []); // Ensure columns is always initialized as an array
              setCompanyName(data.companyName);
              setCompanyLocation(data.companyLocation);
              setEmployeeUserId(data.employeeUserId);
              setCustomerUserId(data.customerUserId);
              setDate(data.date);

              const columnsData = data.columns || [];
              const sortedColumns = columnsData.sort((a, b) => a.sequence - b.sequence);
              const maxSequence = Math.max(...sortedColumns.map(column => column.sequence));
              for (let i = 1; i < maxSequence; i++) {
                const sequenceIndex = sortedColumns.findIndex(column => column.sequence === i);
                if (sequenceIndex === -1) {
                  sortedColumns.splice(i, 0, { sequence: i, title:'blank',border:'No',width: '100%', height: 50 });
                }
              }
              setColumns(sortedColumns);
            }
          } else {
            setErrorMessage('Report template not found');
          }
        })
        .catch((error) => {
          setErrorMessage(`Error fetching report template: ${error.message}`);
        });
    }
  }, [reportTempId]);

  
        // * * * * * * * * * * * * * * * * * * * *
        //
        // GENERATE PDF
        //
        // * * * * * * * * * * * * * * * * * * * *

        const generatePdf = async () => {
          const element = htmlRef.current;

          try {
            const canvas = await html2canvas(element,  {
              scale, // Optional: Try a slight scaling factor
              logging: true, // Enable logging for debugging
            });

            const imgData = canvas.toDataURL('image/png');
        
            const doc = new jsPDF(orientation);//'landscape'
            doc.addImage(imgData, 'PNG', 10, 10);
            doc.save('report.pdf');
            setPdfData(doc.output()); // Optional for displaying PDF data
          } catch (error) {
            console.error('Error generating PDF:', error);
          }
        };

        // * * * * * * * * * * * * * * * * * * * *
        //
        // GENERATE EXCEL FILES
        //
        // * * * * * * * * * * * * * * * * * * * *

        const generateExcel = async () => {

          const borderStyle = { style: 'thin', color: { argb: 'FFFFFF' }, };

          const setCellheaders = (worksheet, cellIndex, column, col) => 
          {
            const cell = worksheet.getCell(col + cellIndex); // Get cell reference
            cell.value = column.title; 
            cell.fill = {type: 'pattern',pattern: 'solid',fgColor: { argb: '593521' },};
            // const borderStyle = { style: 'thin', color: { argb: 'FFFFFF' }, };
            cell.font = { color: { argb: 'FFFFFF' }, bold: true }; // White font, bold
            cell.border = {top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle,};
            cell.alignment = { vertical: 'middle' };
          };

          const setCellBorders = (cell, borderStyle = { style: 'thin' }) =>
          { cell.border = {top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle,};};
          
          
          const workbook = new Workbook();
          const worksheet = workbook.addWorksheet('Sheet1');
          worksheet.pageSetup.orientation = orientation;
        
          // Handle "Tabular Report" case
          if (reportType === "Tabular Report") {
            const headerData = [
              ['Company Name', companyName],
              ['Company Location', companyLocation],
              ['Start Date', startDate],
              ['End Date', endDate],
              ['Start Time', '06:00 AM'],
              ['End Time', '06:00 PM']
            ];
        
            // Add headers
            for (let i = 0; i < headerData.length; i++) {
              worksheet.addRow(headerData[i]);
            }
        
            // Style first column (adjust as needed)
            worksheet.getColumn(1).eachCell((cell) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '593521' }, // Adjust color here
              };
              // const borderStyle = { style: 'thin', color: { argb: 'FFFFFF' }, };
              cell.font = { color: { argb: 'FFFFFF' }, bold: true }; // White font, bold
              cell.border = {top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle,};
              
            });
        
            // Set column widths (adjust as needed)

            let columnIndex = 1;
            columns.forEach((column, index) => {
              const headerCell = worksheet.getCell(`${String.fromCharCode(64 + columnIndex)}${8}`); // Use ASCII code for column letter
              worksheet.getColumn(columnIndex).width = column.width;
              headerCell.value = column.title;
              headerCell.border = {top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle,};
              headerCell.font = { color: { argb: 'FFFFFF' }, bold: true };
              headerCell.fill = {type: 'pattern',pattern: 'solid',fgColor: { argb: '593521' },};
              headerCell.alignment = { horizontal: 'center', vertical: 'middle' };

              columnIndex++; // Increment column index for next iteration
            });

          }
            // * * * * * * * * * * * * * * * * * * * * * * * * * * * 
            // * * * * * * * * * * * * * * * * * * * * * * * * * * * 
            // Handle "Document Report" case
            //  
            // * * * * * * * * * * * * * * * * * * * * * * * * * * * 
           else if (reportType === "Document Report") {
            const headerData = [
              ['Company Name', companyName],
              ['Company Location', companyLocation],
              ['Date', 'mm/dd/yyyyy'],
              ['Time', '06:00 AM']
            ];
        
            // Add headers
            for (let i = 0; i < headerData.length; i++) {
              worksheet.addRow(headerData[i]);
            }
        
            // Style first column (adjust as needed)
            worksheet.getColumn(1).eachCell((cell) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '593521' }, // Adjust color here
              };
              // const borderStyle = { style: 'thin', color: { argb: 'FFFFFF' }, };
              cell.font = { color: { argb: 'FFFFFF' }, bold: true }; // White font, bold
              cell.border = {top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle,};
            });
        
            // Set column widths (adjust as needed)

        
            // Handle special cases in "Document Report" (assuming "columns" data is available)
            let last,lr=0,i=5; // Keep track of last special case handled
            
     

            columns.forEach((column, index) => {
              i++;
              if (column.title === 'blank') { // Add a blank row only once
                if(lr==0)  
                { worksheet.mergeCells('A'+i+':B'+i);
                  lr=1;
                  
                }
                else
                { i--
                  worksheet.mergeCells('C'+i+':D'+i);
                  lr=0;
                }
              
              } 
              else if (column.width === '100%') 
                { // Add title and a placeholder row
                  worksheet.mergeCells('A'+i+':D'+i);
                  setCellheaders(worksheet, 'A'+i, column);
                  
                i++;
                worksheet.mergeCells('A'+i+':D'+i);
                worksheet.getCell('A'+i).value='..value...';
                worksheet.getRow(i).height = column.height;
                if(column.border='Yes') {setCellBorders(worksheet.getCell('A'+i));}
                lr=0;
                i++;
              }
              else
              {
                if(lr==0)  
                  { 
                    worksheet.getCell('A'+i).value=column.title;
                    setCellheaders(worksheet, 'A'+i, column);
                    worksheet.getCell('B'+i).value='..value...';
                    worksheet.getRow(i).height = column.height;

                    worksheet.getCell('A'+i).alignment = { vertical: 'middle' };
                    worksheet.getCell('B'+i).alignment = { vertical: 'middle' };
                    
                    lr=1;
                    
                  }
                  else
                  { 
                    i--
                    setCellheaders(worksheet, 'C'+i, column);
                    worksheet.getCell('D'+i).value='..value...';
                    worksheet.getCell('D'+i).alignment = { vertical: 'middle' };
                    worksheet.getRow(i).height = column.height;
                    lr=0;
                  }
              }
            });
            const col = worksheet.columns.slice(0, 4); // Columns A to D (inclusive)
            col.forEach(col => col.width = 20);
          }
   

          // Generate and save the Excel file
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, 'Report.xlsx');
        };
        

  const handleGoBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  const handleGoHome = () => {
    navigate('/home'); // This will navigate back to the previous page
  };

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 py-4" style={{ color: '#735744', height: '680px' }}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4 rounded-pill px-5 "><h3>ADMINISTRATOR PORTAL</h3></button>
            </Link>
          </div>
          <div className="text-center">
            <button className="btn w-25 btn-danger text-center m-auto rounded-pill mb-3">{reportName}</button><br/>
            <select className='btn rounded-pill btn-danger' value={orientation} onChange={handleOrientationChange}
            title='Orientation'>
      <option value="portrait">Portrait</option>
      <option value="landscape">Landscape</option>
    </select>
    <input
      type="number"
      title='Scale 0.80 to 1.20'
      id="scale"
      value={scale}
      min={0.8}
      max={1.2}
      className='btn btn-danger rounded-pill'
      step={0.01} // Optional: Set step for finer control (adjust as needed)
      onChange={handleScaleChange}
    />
           <button className="btn btn-warning text-center m-auto rounded-pill me-1" onClick={generatePdf}>Export PDF <i className="bi bi-filetype-pdf"></i></button>
           <button className="btn btn-success text-center m-auto rounded-pill" onClick={generateExcel}>Export Excel <i class="bi bi-filetype-xls"></i></button>
          </div>
  
          {/* Form inputs 
          'Company Name','','','','','','',
          */}
          <div ref={htmlRef}>
          {/* Report Name and Type inputs */}
          {reportType === "Tabular Report" && (
            <div>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Name</button>
              <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyName}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Location</button>
              <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyLocation}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Start Date</button>
              <button className="btn w-25 my-1  m-auto rounded-pill text-start ps-5">{startDate}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Start Time</button>
              <button className="btn w-25 my-1  m-auto rounded-pill text-start ps-5">06:00 AM</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">End Date</button>
              <button className="btn w-25 my-1  m-auto rounded-pill text-start ps-5">{endDate}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">End Time</button>
              <button className="btn w-25 my-1  m-auto rounded-pill text-start ps-5">06:00 PM</button>
  
              {/* Report Columns */}
              <hr />
              <table className="w-100" width="100%">
                <thead className="thead-dark">
                  <tr className="w-100 d-flex justify-content-start">
                    {/* <th width="10%" className='btn rounded-pill text-center d-flex justify-content-center align-items-center'></th> */}
                    {columns && columns
                      .filter(column => column.rowcol === "Column" || column.rowcol === "column")
                      .sort((a, b) => a.sequence - b.sequence)
                      .map((column, index) => (
                        <th scope="col" className='btn-danger rounded text-center d-flex justify-content-center align-items-center' width={column.width + "%"} key={index}>
                          {column.title}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {columns && columns
                    .filter(column => column.rowcol === "Row")
                    .sort((a, b) => a.sequence - b.sequence)
                    .map((column, index) => (
                      <tr key={index}>
                        <td  className='btn-danger my-1 rounded text-center' style={{'width':'20%',}}>
                          {column.title}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <hr />
            </div>
          )}
  
          {/* DOCUMENT REPORT SECTIONS */}
          {reportType === "Document Report" && (
            <div>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Name</button>
              <p className="w-75 d-inline-block my-1 m-auto text-start py-1 ps-5">{companyName}</p>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Location</button>
              <p className="w-75 d-inline-block my-1 m-auto text-start py-1 ps-5">{companyLocation}</p>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Date</button>
              <p className="w-75 d-inline-block my-1 m-auto text-start py-1 ps-5">{date}</p>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Time</button>
              <p className="w-75 d-inline-block my-1 m-auto text-start py-1 ps-5">hh:mm</p>
              {/* Report Columns */}
              {columns && columns
              .sort((a, b) => a.sequence - b.sequence)
              .map((column, index) => (
                column.title === 'blank' ? (
                  <div key={index} className="w-50 " style={{ display: 'inline-block', minHeight: column.height + "px" }}>
                    {/* {index} */}
                  </div>
                ) : (
                  <div key={index} className='' style={{ display: column.width === '100%' ? 'block' : 'inline-block', width: column.width === '100%' ? '100%' : '45%'  }}>
                    <button className="btn my-1 btn-danger text-center rounded" style={{ width: column.width === '100%' ? '24%' : '49%' }}>{column.title}</button>
                    <p className={`my-1 pt-3 text-start overflow-auto ps-5 ${column.border === "Yes" ? 'border border-1 border-dark' : ''}`} style={{ display: column.width === '100%' ? 'block' : 'inline-block', width: column.width === '100%' ? '100%' : '48%', minHeight: column.height + "px" }}>.....Values.....</p>
                  </div>
                )
              ))

              }

            </div>
          )}
          </div>
          <div className='text-center'>
            <button className="btn btn-danger px-5 m-auto my-2 me-5" onClick={handleGoHome}>Home</button>
            <button className="btn btn-danger px-5 m-auto my-2 me-5" onClick={handleGoBack}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );

}
  
export default ReportPreview;
