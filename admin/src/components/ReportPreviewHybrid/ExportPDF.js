import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportPDF = (
  {
    reportName,
    companyName,
    companyLocation,
    reportType,
    tables,
    orientation
  }
) => {
  alert(reportName+" * "+companyName+" * "+companyLocation+" * "+reportType+" * "+tables+" * "+orientation);
  // alert(orientation);
  const doc = new jsPDF(orientation);
  const tw = orientation === 'portrait' ? '60%' : '40%';

  // Add title with background
  const styles = {
    headStyles: {
      // fillColor: [142, 2, 2],
      textColor: 0,
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
        // data.cell.styles.fillColor = [89, 53, 33];
        // data.cell.styles.textColor = [255, 255, 255];
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

    alert("Hello");

  tables.map(table => {

    switch (table.type) {
      case 'Tabular':
        return PDFTabular(table.columns,doc); // Pass additional data
      case 'Toggle':
        return PDFToggle(table.columns,doc);
      case 'Document':
        return PDFDocument(table.columns,doc); // Use 'content' for Document type
      default:
        console.warn(`Unknown table type: ${table.type}`);
        return null; // Handle unknown types gracefully
    }
  });

  // Save the PDF
  doc.save('custom.pdf');

  const PDFTabular = (columns,doc) => {
    const styles1 = {
        headStyles: {
          // fillColor: [89, 53, 33],
          // textColor: [255, 255, 255],
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
        body: [], // Replace with actual data if available
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

      // doc.setFillColor(89, 53, 33);
      doc.rect(xCoordinate, rowIndex * 10 - 7, columnWidth, 10, 'F');
      // doc.setTextColor(255, 255, 255);
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

    }


};

export default ExportPDF;
