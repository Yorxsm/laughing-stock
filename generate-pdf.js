const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    const htmlPath = path.join(__dirname, 'public/deliverables/exhibot-event-overview.html');
    const pdfPath = path.join(__dirname, 'public/deliverables/Exhibot 2.0 Event Overview.pdf');

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log('Opening new page...');
    const page = await browser.newPage();

    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    console.log('Setting HTML content...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    console.log('Generating PDF...');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    console.log(`PDF generated successfully at: ${pdfPath}`);

    await browser.close();
}

generatePDF().catch(console.error);
