const puppeteerCore = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer');

const parseRequest = (req) => {
    return new Promise((resolve, reject) => {
        const BusBoy = require("busboy");
        const busboy = BusBoy({headers: req.headers});

        const files = [] // create an empty array to hold the processed files
        const buffers = {} // create an empty object to contain the buffers

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
        busboy.on('error', err => {
            reject(err)
        })
        busboy.on('finish', () => {
            resolve(files)
        })
        busboy.end(req.rawBody)
    });
}

async function generatePdf(req, res) {

    if (req.method !== 'POST') {
        return res.status(400).send({error: 'Invalid request method'});
    }
    const files = await parseRequest(req)

    const headerJson = files.find(file => file.fieldname === "headerJson");
    const dataJson = files.find(file => file.fieldname === "dataJson");
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
            
                .document-wrapper {
                    margin-bottom: 20px;
                }
            
                .document-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    align-items: center;
                }
            
                .document-row.full-width {
                    flex-direction: column;
                    align-items: flex-start;
                }
            
                .document-row span {
                    margin: 0;
                    display: inline-block;
                    width: 45%; /* Adjust width to leave some space between columns */
                }
            
                .document-row .full-width span {
                    width: 100%; /* Full width for single-column rows */
                }
            
                .document-row span strong {
                    display: inline-block;
                    width: 50%; /* Adjust width to make titles and data aligned */
                    background-color: #613b11; /* Background color for headers */
                    color: #fff; /* Text color for headers */
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
            
                .document-wrapper h3 {
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    color: #613b11;
                    border-bottom: 2px solid #613b11;
                    padding-bottom: 5px;
                }
            
                .document-row img {
                    max-width: 200px;
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
                    table-layout: auto;
                }
            
                th, td {
                    padding: 8px 12px;
                    border: 1px solid #000;
                    text-align: left;
                    vertical-align: top;
                    word-wrap: break-word;
                }
            
                th {
                    background-color: #613b11;
                    color: #fff;
                }
            
                td {
                    background-color: #f5f5f5;
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

            if (table.type === 'Document') {
                // Generate document-style layout
                return `
                    <div class="document-wrapper">
                        <h3>${table.name || 'Unnamed Table'}</h3>
                        ${matchingDataTable.table.map(row => {
                    let rowHtml = ''; // Initialize an empty string for the row HTML
                    let columnGroup = []; // Array to store columns that will be displayed side by side

                    row.row.forEach((cell, cellIndex) => {
                        const column = table.columns[cellIndex];

                        if (cell && cell.format === 'photo' && Array.isArray(cell.value)) {
                            // Render photos if the cell format is 'photo'
                            rowHtml += `
                                        <div class="document-row full-width">
                                            <span><strong>${capitalizeFirstLetter(cell.title)}:</strong></span>
                                            ${cell.value.map(imageUrl => `<img src="${imageUrl}" alt="photo">`).join('')}
                                        </div>
                                    `;
                        } else {
                            if (column.width === '100%') {
                                // If column width is 100%, display it in full width
                                if (columnGroup.length > 0) {
                                    // If there is data in the column group, add them side by side first
                                    rowHtml += `<div class="document-row">${columnGroup.join('')}</div>`;
                                    columnGroup = []; // Reset the column group
                                }

                                // Add full-width column
                                rowHtml += `
                                            <div class="document-row full-width">
                                                <span><strong>${capitalizeFirstLetter(cell.title)}:</strong></span>
                                                <span>${formatValue(cell.value)}</span>
                                            </div>
                                        `;
                            } else {
                                // If column width is not 100%, prepare data to display side by side
                                columnGroup.push(`
                                            <span><strong>${capitalizeFirstLetter(cell.title)}:</strong> ${cell.value || '-'}</span>
                                        `);

                                // If there are two items in the group, display them side by side
                                if (columnGroup.length === 2) {
                                    rowHtml += `<div class="document-row">${columnGroup.join('')}</div>`;
                                    columnGroup = []; // Reset the column group after displaying
                                }
                            }
                        }
                    });

                    // If there is remaining data in the column group (odd number of columns), display it
                    if (columnGroup.length > 0) {
                        rowHtml += `<div class="document-row">${columnGroup.join('')}</div>`;
                    }

                    return rowHtml; // Return the constructed row HTML
                }).join('')}
                    </div>
                `;
            } else if (table.type === 'Tabular') {
                // Generate tabular-style layout
                return `
                        <div class="table-wrapper">
                            <h3 style="color: #613b11;">${table.name || 'Unnamed Table'}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        ${table.columns.map(column => `<th>${capitalizeFirstLetter(column.title)}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${matchingDataTable.table.map((rowGroup, rowIndex) => `
                                        <tr>
                                            ${rowGroup.row.map((cell, cellIndex) => {
                    const column = table.columns[cellIndex];
                    if (column.format === 'fixed value' && column.fixed) {
                        // If column has fixed values, use them
                        return `<td>${column.fixed[rowIndex] || '-'}</td>`;
                    } else {
                        // Regular cell rendering
                        return `
                                                        <td>
                                                            ${cell && cell.format === 'photo' && Array.isArray(cell.value)
                            ? cell.value.map(imageUrl => `<img src="${imageUrl}" alt="photo">`).join('')
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
            
            ${orientation === 'landscape' ? "Landscape Mode" : "Portrait Mode"}
            
            </body>
            </html>`;

        function formatValue(value) {
            if (value === 'true') {
                return "Yes";
            } else if (value === 'false') {
                return "No";
            } else {
                return value || '-';
            }

        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        console.log('HTML content generated');

        // Generate PDF using Puppeteer
        chromium.setHeadlessMode = true;
        let browser;
        if (process.env.NODE_ENV === 'production') {
            console.log("Production mode");
            browser = await puppeteerCore.launch({
                executablePath: await chromium.executablePath(),
                args: chromium.args,
                headless: chromium.headless,
                defaultViewport: chromium.defaultViewport,
            });

        } else {
            console.log("local mode");
            browser = await puppeteer.launch();
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

    } catch (e) {
        console.error('Error generating PDF:', e);
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

