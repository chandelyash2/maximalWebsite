const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const { Readable } = require('stream');

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

        /*const options = {
            format: 'A4',
            orientation: orientation,
            scale: 0.8,
            type: "pdf",
            border: {
                top: '5mm',
                right: '5mm',
                bottom: '5mm',
                left: '5mm'
            }
        };
        pdf.create(htmlContent, options).toStream((err, stream) => {
            if (err) {
                return res.status(500).send('Error generating PDF');
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('content-transfer-encoding', 'binary');
            res.setHeader('Content-Disposition', `attachment; filename="${headerData.name.replace(/\s+/g, '_')}.pdf"`);
            stream.pipe(res);
        });*/


        // Generate PDF using Puppeteer
        chromium.setHeadlessMode = true;
        const browser = await puppeteer.launch({
            executablePath: await chromium.executablePath(),
            args: chromium.args,
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport,
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

