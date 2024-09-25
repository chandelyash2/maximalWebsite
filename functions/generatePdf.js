const puppeteerCore = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const axios = require('axios');

const parseRequest = (req) => {
    return new Promise((resolve, reject) => {
        const BusBoy = require("busboy");
        const busboy = BusBoy({headers: req.headers});

        const files = [] // create an empty array to hold the processed files
        const buffers = {} // create an empty object to contain the buffers
        const fields = {};

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            buffers[fieldname] = [] // add a new key to the buffers object
            file.on('data', data => {
                buffers[fieldname].push(data)
            })
            file.on('end', () => {
                files.push({
                    buffer: Buffer.concat(buffers[fieldname]),
                    ...filename,
                    fieldname
                })
            })
        });
        busboy.on('field', (fieldname, val) => {
            fields[fieldname] = val;
        });
        busboy.on('error', err => {
            reject(err)
        })
        busboy.on('finish', () => {
            resolve({files, fields});
        })
        busboy.end(req.rawBody)
    });
}

const formatValue = (value) => {
    if (value === 'true') {
        return "Yes";
    } else if (value === 'false') {
        return "No";
    } else {
        return value || '-';
    }
}

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const stringToBoolean = (str) => {
    if (!str) return false;
    return str.toLowerCase() === "true";
}

const downloadAndConvertImageToBase64 = async (url) => {
    try {
        const response = await axios.get(url, {responseType: 'arraybuffer'});
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        console.error(`Error downloading image: ${url}`, error);
        return null;
    }
}

const createAndSendExcel = async (headerData, rowData, blackAndWhiteBool, res) => {
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add header information
    const headerTitle = headerData.name || 'Report';
    worksheet.addRow([headerTitle]).font = {bold: true, size: 16};
    worksheet.addRow(['Company Name:', headerData.companyName || '-']);
    worksheet.addRow(['Location:', headerData.companyLocation || '-']);
    worksheet.addRow([]); // Empty row for spacing

    // Process each table
    for (const [tableIndex, table] of headerData.tables.entries()) {
        const matchingDataTable = rowData.tables[tableIndex];
        if (!matchingDataTable) continue;

        // Add table title
        const tableTitle = table.name || `Table ${tableIndex + 1}`;
        worksheet.addRow([]); // Space before the table
        worksheet.addRow([tableTitle]).font = {bold: true, size: 12};

        // Process columns
        const sortedColumns = table.columns.sort((a, b) => a.sequence - b.sequence);
        worksheet.columns = sortedColumns.map(column => ({
            key: column.title.toLowerCase().replace(/\s+/g, '_'),
            width: Math.max(parseInt(column.width * 2) || 10, 20), // Minimum width for better visibility
        }));

        // Add column headers
        const columnHeaders = sortedColumns.map(column => column.title || '');
        worksheet.addRow(columnHeaders).font = {bold: true};

        // Process rows
        for (const [rowIndex, rowGroup] of matchingDataTable.table.entries()) {
            const rowValues = rowGroup.row.map((cell, cellIndex) => {
                const column = sortedColumns[cellIndex];
                if (column.format === 'fixed value' && column.fixed) {
                    return column.fixed[rowIndex] || '-';
                } else if (cell.format.toLowerCase().includes('photo') && Array.isArray(cell.value)) {
                    return ''; // Placeholder for image
                } else {
                    return cell.value || '-';
                }
            });

            const addedRow = worksheet.addRow(rowValues);

            // Embed images
            for (const [cellIndex, cell] of rowGroup.row.entries()) {
                if (cell.format.toLowerCase().includes('photo') && Array.isArray(cell.value)) {
                    const startRow = addedRow.number;
                    const startCol = cellIndex + 1;

                    for (const [imgIndex, imageUrl] of cell.value.entries()) {
                        try {
                            const base64Image = await downloadAndConvertImageToBase64(imageUrl);
                            if (base64Image) {
                                const image = workbook.addImage({
                                    base64: base64Image,
                                    extension: 'png',
                                });

                                // Determine image dimensions and position
                                const imgWidth = 100; // Adjust as needed
                                const imgHeight = 100; // Adjust as needed
                                const imgPositionRow = startRow + imgIndex; // Increment row for each image

                                // Adjust the column width and row height
                                worksheet.getColumn(startCol).width = Math.max(imgWidth / 8, 20); // Adjust column width
                                worksheet.getRow(imgPositionRow).height = Math.max(imgHeight, 20); // Adjust row height

                                // Add image at unique position
                                worksheet.addImage(image, {
                                    tl: {col: startCol - 1, row: imgPositionRow - 1}, // Unique row for each image
                                    ext: {width: imgWidth, height: imgHeight}, // Adjust image size
                                });
                            }
                        } catch (error) {
                            console.error(`Failed to process image:`, error);
                        }
                    }
                }
            }
        }

        worksheet.addRow([]); // Blank row between tables
    }

    // Apply styling if requested
    if (blackAndWhiteBool) {
        worksheet.eachRow({includeEmpty: true}, row => {
            row.eachCell(cell => {
                cell.font = {color: {argb: 'FF000000'}};
                cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: '000000'}};
            });
        });
    }

    /*await workbook.xlsx.write(res);*/
    const buffer = await workbook.xlsx.writeBuffer();
    // Set response headers and write the Excel file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${headerData.name.replace(/\s+/g, '_')}.xlsx"`);
    res.end(buffer, 'binary');
}

const createAndSendPdf = async (headerData, rowData, orientation, blackAndWhiteBool, res) => {
    // Log the parsed data
    // console.log('Header Data:', headerData);
    // console.log('Row Data:', rowData);
    const sortedTables = headerData.tables.sort((a, b) => a.sequence - b.sequence);
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
    }

    .document-wrapper {
        margin-bottom: 20px;
    }

    .document-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        align-items: center;
        flex-wrap: wrap;
    }

    .document-row.full-width {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }

    .document-row span {
        margin: 0;
        display: inline-block;
        width: 45%; /* Adjust width to leave some space between columns */
        word-wrap: break-word;
    }

     .document-row100 {
        margin: 0;
        display: inline-block;
        width: 100%; /* Adjust width to leave some space between columns */
        word-wrap: break-word;
    }

    .document-row .full-width span {
        width: 100%; /* Full width for single-column rows */
        word-wrap: break-word;
    }

    .document-row span strong {
        display: inline-block;
        width: 50%; /* Adjust width to make titles and data aligned */
        ${blackAndWhiteBool ? 'background-color: #00000000; color: #000;' : 'background-color: #613b11; color: #fff;'}
        padding: 5px; /* Padding for headers */
        margin-right: 10px; /* Adds space between titles and data */
    }

    .document-row span:first-child {
        margin-right: 10px; /* Adds space between pairs of columns */
    }

    .document-title {
        margin-top: 0;
        margin-bottom: 10px;
        font-weight: bold;
        font-size: 16px;
    }

     h3 {
        margin: 0 0 15px 0;
        font-size: 18px;
        ${blackAndWhiteBool ? 'color: #000;' : 'color: #613b11;'}
        border-bottom: 2px solid ${blackAndWhiteBool ? '#000;' : '#613b11;'};
        padding-bottom: 5px;
    }

    .document-row img {
        max-width: 100px;
        height: auto;
        margin-right: 10px;
        margin-top: 10px;
        
    }

    .table-wrapper {
        page-break-inside: auto;
        margin-bottom: 20px;
        padding: 0;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        page-break-inside: auto;
        page-break-before: auto;
        page-break-after: auto;
        overflow: hidden;
        table-layout: fixed; /* Use fixed layout to maintain column width */
        word-wrap: break-word;
    }

    th, td {
        padding: 8px 12px;
        border: 1px solid #000;
        text-align: left;
        align: center;
        vertical-align: top;
        word-wrap: break-word;
        overflow: hidden;
    }

    th {
        ${blackAndWhiteBool ? 'background-color: #00000000; color: #000;' : 'background-color: #613b11; color: #fff;'}
        text-align: center;
        }

    td {
        background-color: ${blackAndWhiteBool ? '#fff;' : '#f5f5f5;'}
    }

    thead {
        display: table-header-group;
    }

    tbody {
        display: table-row-group;
    }

    h3 {
        margin-top: 0;
        margin-bottom: 10px;
        page-break-after: avoid;
    }

    img {
        max-width: 100%;
        height:  100%;
        object-fit: cover; 
        display: block;
        align:center;
        margin-bottom: 5px;
    }

    .inline-image {
        max-width: 200px;
        height: auto;
        margin-right: 10px;
        margin-top: 10px;
        display: inline-block;
    }

    .photo-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        margin-bottom: 8px;
    }

    .photo-container span.title {
        font-weight: bold;
        color: ${blackAndWhiteBool ? '#000' : '#fff'};
        padding: 5px;
        margin-bottom: 5px;
        background-color: ${blackAndWhiteBool ? '#00000000' : '#613b11'};
    }

    .photo-container span.images {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    </style>
</head>
<body>
<div class="header">
    <div class="info">
        <p><strong>Company Name:</strong> ${headerData.companyName || '-'}</p>
        <p><strong>Location:</strong> ${headerData.companyLocation || '-'}</p>
        <p><strong>Report Name:</strong> ${headerData.name || '-'}</p>
    </div>
</div>

${sortedTables.map((table, tableIndex) => {
        const matchingDataTable = rowData.tables[tableIndex];
        if (!matchingDataTable) return '';  // Skip if no matching data table

        // Sort the columns by sequence before rendering
        const sortedColumns = table.columns.sort((a, b) => a.sequence - b.sequence);

        if (table.type === 'Document') {
            // Generate document-style layout
            return `
        <div class="document-wrapper">
            <h3>${table.name || 'Unnamed Table'}</h3>
            ${matchingDataTable.table.map(row => {
                let rowHtml = ''; // Initialize an empty string for the row HTML
                let columnGroup = []; // Array to store columns that will be displayed side by side

                row.row.forEach((cell, cellIndex) => {
                    const column = sortedColumns[cellIndex];

                    if (cell && cell.format.toLowerCase().includes('photo') && Array.isArray(cell.value)) {
                        // Render photos if the cell format is 'photo'
                        rowHtml += `
                            <div class="photo-container">
                                <span class="title">${capitalizeFirstLetter(cell.title)}:</span>
                                <span class="images">
                                    ${cell.value.map(imageUrl => `<img src="${imageUrl}" alt="photo" class="inline-image">`).join('')}
                                </span>
                            </div>
                        `;
                    } else {
                        if (column.width === '100%') {
                            if (columnGroup.length > 0) {
                                rowHtml += `<div class="document-row">${columnGroup.join('')}</div>`;
                                columnGroup = [];
                            }

                            rowHtml += `
                                <div class="document-row full-width">
                                    <span><strong>${capitalizeFirstLetter(cell.title)}:</strong></span>
                                    <div style="border: ${column.border === 'Yes' ? (blackAndWhite ? '2px solid black' : '2px solid #613b11') : 'none'};
                                                padding: ${column.border === 'Yes' ? '10px' : '0px 0px 0px 5px'}; 
                                                margin: ${column.border === 'Yes' ? '10px 10px 10px 0' : '10px 10px 10px 0'}; 
                                                box-sizing: border-box;">
                                        ${formatValue(cell.value)}
                                    </div>
                                </div>
                            `;
                        } else {
                            columnGroup.push(`
                                <span><strong>${capitalizeFirstLetter(cell.title)}:</strong> ${cell.value || '-'}</span>
                            `);

                            if (columnGroup.length === 2) {
                                rowHtml += `<div class="document-row">${columnGroup.join('')}</div>`;
                                columnGroup = [];
                            }
                        }
                    }
                });

                if (columnGroup.length > 0) {
                    rowHtml += `<div class="document-row">${columnGroup.join('')}</div>`;
                }

                return rowHtml;
            }).join('')}
        </div>
        `;
        } else if (table.type === 'Tabular') {
            return `
        <div class="table-wrapper">
            <h3>${table.name || 'Unnamed Table'}</h3>
            <table>
                <thead>
                    <tr>
                        ${sortedColumns.map(column => `
                            <th style="width: ${column.width}%">${capitalizeFirstLetter(column.title)}</th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${matchingDataTable.table.map((rowGroup, rowIndex) => `
                        <tr>
                            ${rowGroup.row.map((cell, cellIndex) => {
                const column = sortedColumns[cellIndex];
                if (column.format === 'fixed value' && column.fixed) {

                    return `<td>${column.fixed[rowIndex] || '-'}</td>`;
                } else if (column.format === 'Yes/No') {
                    return ` <td style="text-align: center; vertical-align: middle;">
                                ${formatValue(cell && cell.value) || '-'}
                            </td>`
                } else if (column.format === 'f/c') {
                    return ` <td style="text-align: center; vertical-align: middle;">
                                ${formatValue(cell && cell.value) || '-'}
                            </td>`
                } else {
                    return `
                                        <td>
                                            ${cell && cell.format.includes('photo') && Array.isArray(cell.value)
                        ? cell.value.map(imageUrl => `<img src="${imageUrl}" alt="photo" class="inline-image">`).join('')
                        : formatValue(cell && cell.value) || '-'}
                                        </td>
                                    `;
                }
            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        `;
        }
    }).join('')}

</body>
</html>
`;

    console.log('HTML content generated');

    // Generate PDF using Puppeteer
    chromium.setHeadlessMode = true;
    console.log("process.env.NODE_ENV = ", process.env.NODE_ENV)
    let browser;
    if (process.env.NODE_ENV === 'local') {
        console.log("local mode");
        browser = await puppeteer.launch();
    } else {
        console.log("Production mode");
        browser = await puppeteerCore.launch({
            executablePath: await chromium.executablePath(),
            args: chromium.args,
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport,
        });
    }

    const page = await browser.newPage();
    console.log('Puppeteer launched');
    await page.setContent(htmlContent, {waitUntil: 'networkidle0'});
    console.log('Content set on Puppeteer page');

    const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: orientation === 'landscape',
        printBackground: true,
        margin: {
            top: '5mm',
            right: '5mm',
            bottom: '5mm',
            left: '5mm'
        },
        scale: 0.8
    });
    await page.close();
    await browser.close();

    console.log('PDF generated');

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('content-transfer-encoding', 'binary');
    res.setHeader('Content-Disposition', `attachment; filename="${headerData.name.replace(/\s+/g, '_')}.pdf"`);
    res.end(pdfBuffer, 'binary');
}

async function generatePdf(req, res) {

    if (req.method !== 'POST') {
        return res.status(400).send({error: 'Invalid request method'});
    }
    const {files, fields} = await parseRequest(req)

    const headerJson = files.find(file => file.fieldname === "headerJson");
    const dataJson = files.find(file => file.fieldname === "dataJson");
    const {orientation = 'portrait', blackAndWhite, generateType} = fields;

    if (!headerJson || !dataJson) {
        return res.status(400).json({error: 'Invalid JSON files'});
    }

    try {
        const blackAndWhiteBool = stringToBoolean(blackAndWhite)
        const headerData = JSON.parse(headerJson.buffer.toString());
        const rowData = JSON.parse(dataJson.buffer.toString());

        console.log("generateType = ", generateType)
        if (generateType === 'pdf') {
            console.log("pdf generate")
            await createAndSendPdf(headerData, rowData, orientation, blackAndWhiteBool, res);
        } else if (generateType === 'excel') {
            console.log("excel generate")
            await createAndSendExcel(headerData, rowData, blackAndWhiteBool, res);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({error: 'provide generate type'});
        }

    } catch (e) {
        console.error('Error generating PDF:', e);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: 'Failed to generate PDF'});
    }
}


/*
const app = express();
app.use(fileParser);
app.use(bodyParser.json());

app.post('/', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({error: 'No files were uploaded.'});
    }

    const headerJson = req.files.find(file => file.fieldname === "headerJson");
    const dataJson = req.files.find(file => file.fieldname === "dataJson");
    const {orientation = 'portrait'} = req.body;

    if (!headerJson || !dataJson) {
        return res.status(400).json({error: 'Invalid JSON files'});
    }

    try {
        const headerData = JSON.parse(headerJson.buffer.toString());
        const rowData = JSON.parse(dataJson.buffer.toString());
        // Log the parsed data
        console.log('Header Data:', headerData);
        console.log('Row Data:', rowData);

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }
                .table-wrapper {
                    page-break-inside: auto;
                    margin-bottom: 20px;
                    padding: 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    border-spacing: 0;
                    page-break-inside: auto;
                    page-break-before: auto;
                    page-break-after: auto;
                    overflow: hidden;
                    table-layout: auto;

                }
                th, td {
                    padding: 8px 12px;
                    border: 1px solid #000;
                    text-align: left;
                    vertical-align: top;
                    word-wrap: break-word;
                }
                thead {
                    display: table-header-group;
                }
                tbody {
                    display: table-row-group;
                }
                h3 {
                    margin-top: 0;
                    margin-bottom: 10px;
                    page-break-after: avoid;
                }
                img {
                    max-width: 100px;
                    height: auto;
                    display: block;
                    margin-bottom: 5px;
                }
            </style>
        </head>
        <body>
        <div class="header">
            <div class="info">
                <p><strong>Company Name:</strong> ${headerData.companyName || '-'}</p>
                <p><strong>Location:</strong> ${headerData.companyLocation || '-'}</p>
                <p><strong>Report Name:</strong> ${headerData.name || '-'}</p>
            </div>
        </div>
        ${headerData.tables.map((table, tableIndex) => {
            const matchingDataTable = rowData.tables[tableIndex];
            if (!matchingDataTable) return '';  // Skip if no matching data table

            return `
                <div class="table-wrapper">
                    <h3>${table.name || 'Unnamed Table'}</h3>
                    <table>
                        <thead>
                            <tr>
                                ${table.columns.map(column => `<th>${column.title}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${matchingDataTable.table.map(rowGroup => `
                                <tr>
                                    ${rowGroup.row.map((cell, index) => {
                const column = table.columns[index];
                return `
                                            <td>
                                                ${cell && cell.format === 'photo' && Array.isArray(cell.value)
                    ? cell.value.map(imageUrl => `<img src="${imageUrl}" alt="photo">`).join('')
                    : (cell && cell.value) || '-'}
                                            </td>
                                        `;
            }).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }).join('')}

        ${orientation === 'landscape' ? "Landscape Mode" : "Portrait Mode"}

        </body>
        </html>
        `;

        console.log('HTML content generated');

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        console.log('Puppeteer launched');
        await page.setContent(htmlContent, {waitUntil: 'networkidle0'});
        console.log('Content set on Puppeteer page');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: orientation === 'landscape',
            printBackground: true,
            margin: {
                top: '5mm',
                right: '5mm',
                bottom: '5mm',
                left: '5mm'
            },
            scale: 0.8
        });
        await browser.close();
        console.log('PDF generated');

        // Send PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('content-transfer-encoding', 'binary');
        res.setHeader('Content-Disposition', `attachment; filename="${headerData.name.replace(/\s+/g, '_')}.pdf"`);
        res.end(pdfBuffer, 'binary');
    } catch (e) {
        console.error('Error generating PDF:', e);
        res.status(500).json({error: 'Failed to generate PDF'});
    }
})
*/

module.exports = {generatePdf};

