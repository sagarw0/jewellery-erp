const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');

marked.setOptions({
  gfm: true,
  breaks: false,
});

const mdPath = path.resolve(__dirname, '../docs/SWARNA_JEWELLERY_ERP_FUNCTIONAL_BLUEPRINT.md');
const htmlOutputPath = path.resolve(__dirname, '../docs/blueprint_print.html');
const pdfOutputPath = path.resolve(__dirname, '../docs/SWARNA_JEWELLERY_ERP_FUNCTIONAL_BLUEPRINT.pdf');
const artifactPdfPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e778fe8e-15f3-46a3-9e8f-f17bebb032ae\\SWARNA_JEWELLERY_ERP_FUNCTIONAL_BLUEPRINT.pdf';
const artifactMdPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e778fe8e-15f3-46a3-9e8f-f17bebb032ae\\application_functional_blueprint.md';

console.log('Reading markdown from:', mdPath);
let mdContent = fs.readFileSync(mdPath, 'utf8');

// Wrap long SQL lines in markdown so they never clip
mdContent = mdContent.replace(
  "role VARCHAR(50) NOT NULL CHECK (role IN ('Owner', 'Manager', 'Cashier', 'Accountant', 'Karagir')),",
  "role VARCHAR(50) NOT NULL \n        CHECK (role IN ('Owner', 'Manager', 'Cashier', 'Accountant', 'Karagir')),"
);
mdContent = mdContent.replace(
  "account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('Assets', 'Liabilities', 'Income', 'Expense')),",
  "account_type VARCHAR(50) NOT NULL \n        CHECK (account_type IN ('Assets', 'Liabilities', 'Income', 'Expense')),"
);
mdContent = mdContent.replace(
  "status VARCHAR(30) DEFAULT 'In Stock' CHECK (status IN ('In Stock', 'Sold', 'In Workshop', 'Refining', 'Consignment')),",
  "status VARCHAR(30) DEFAULT 'In Stock' \n        CHECK (status IN ('In Stock', 'Sold', 'In Workshop', 'Refining', 'Consignment')),"
);
mdContent = mdContent.replace(
  "status VARCHAR(50) DEFAULT 'Booked' CHECK (status IN ('Booked', 'Assigned', 'In Progress', 'Received', 'Ready', 'Delivered', 'Cancelled')),",
  "status VARCHAR(50) DEFAULT 'Booked' \n        CHECK (status IN ('Booked', 'Assigned', 'In Progress', 'Received', 'Ready', 'Delivered', 'Cancelled')),"
);
mdContent = mdContent.replace(
  "status VARCHAR(50) DEFAULT 'Assigned' CHECK (status IN ('Assigned', 'In Progress', 'Received', 'Cancelled')),",
  "status VARCHAR(50) DEFAULT 'Assigned' \n        CHECK (status IN ('Assigned', 'In Progress', 'Received', 'Cancelled')),"
);
mdContent = mdContent.replace(
  "bill_mode VARCHAR(20) NOT NULL CHECK (bill_mode IN ('Tax Invoice', 'Estimate')),",
  "bill_mode VARCHAR(20) NOT NULL \n        CHECK (bill_mode IN ('Tax Invoice', 'Estimate')),"
);
mdContent = mdContent.replace(
  "status VARCHAR(20) DEFAULT 'adequate' CHECK (status IN ('critical', 'low', 'adequate', 'surplus')),",
  "status VARCHAR(20) DEFAULT 'adequate' \n        CHECK (status IN ('critical', 'low', 'adequate', 'surplus')),"
);
mdContent = mdContent.replace(
  "urgency VARCHAR(20) DEFAULT 'NORMAL' CHECK (urgency IN ('HIGH', 'MEDIUM', 'NORMAL')),",
  "urgency VARCHAR(20) DEFAULT 'NORMAL' \n        CHECK (urgency IN ('HIGH', 'MEDIUM', 'NORMAL')),"
);
mdContent = mdContent.replace(
  "status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Matured - Ready for Jewellery Redemption', 'Redeemed', 'Defaulted')),",
  "status VARCHAR(50) DEFAULT 'Active' \n        CHECK (status IN ('Active', 'Matured - Ready for Jewellery Redemption', 'Redeemed', 'Defaulted')),"
);

// Save updated clean markdown back to file
fs.writeFileSync(mdPath, mdContent, 'utf8');
fs.writeFileSync(artifactMdPath, mdContent, 'utf8');

const bodyHtml = marked(mdContent);

// Build clean, high-contrast, executive-level print HTML
const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swarna Jewellery ERP - Complete Functional Blueprint</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
      @bottom-right {
        content: "Page " counter(page);
        font-family: Arial, sans-serif;
        font-size: 9pt;
        color: #475569;
        font-weight: bold;
      }
      @bottom-left {
        content: "SWARNA JEWELLERY ERP — FUNCTIONAL BLUEPRINT";
        font-family: Arial, sans-serif;
        font-size: 8pt;
        color: #64748b;
        letter-spacing: 0.05em;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #09090b;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Document Header Banner */
    .doc-banner {
      border-bottom: 3px solid #b45309;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 22pt;
      font-weight: 800;
      color: #09090b;
      letter-spacing: -0.01em;
      margin-top: 0;
      margin-bottom: 6px;
      line-height: 1.2;
      border-left: 6px solid #b45309;
      padding-left: 12px;
    }

    h2 {
      font-size: 15pt;
      font-weight: 700;
      color: #1e3a8a;
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 5px;
      margin-top: 32px;
      margin-bottom: 14px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 12.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 22px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    h4 {
      font-size: 11.5pt;
      font-weight: 700;
      color: #334155;
      margin-top: 16px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }

    p {
      margin-top: 0;
      margin-bottom: 11px;
      color: #09090b;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 12px;
      padding-left: 24px;
    }

    li {
      margin-bottom: 4px;
      color: #09090b;
    }

    strong {
      color: #000000;
      font-weight: 700;
    }

    hr {
      border: 0;
      border-top: 1.5px solid #e2e8f0;
      margin: 26px 0;
    }

    /* High-Contrast Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0 22px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }

    th {
      background-color: #1e293b;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 9px 12px;
      border: 1px solid #334155;
    }

    td {
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      color: #09090b;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Working Formula Cards (Blockquotes) */
    blockquote {
      margin: 14px 0 18px 0;
      padding: 12px 18px;
      background-color: #f8fafc;
      border: 1.5px solid #94a3b8;
      border-left: 6px solid #2563eb;
      border-radius: 6px;
      color: #09090b;
      font-size: 10.5pt;
      line-height: 1.55;
      page-break-inside: avoid;
    }

    blockquote p {
      margin: 0;
      color: #09090b;
    }

    blockquote strong {
      color: #000000;
    }

    /* Code Blocks & DDL - Technical Light Paper Theme */
    pre {
      background-color: #f8fafc;
      color: #0f172a;
      padding: 14px 16px;
      border-radius: 6px;
      font-family: Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 9pt;
      font-weight: 500;
      line-height: 1.45;
      border: 1.5px solid #94a3b8;
      margin: 14px 0;
      page-break-inside: avoid;
      white-space: pre-wrap !important;
      word-break: break-word !important;
    }

    code {
      font-family: Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 9.5pt;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      font-weight: 600;
    }

    pre code {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font-weight: 500;
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>
`;

console.log('Writing styled print HTML to:', htmlOutputPath);
fs.writeFileSync(htmlOutputPath, fullHtml, 'utf8');

// Browser executable
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log('Using browser engine:', browserExe);

const fileUrl = 'file:///' + htmlOutputPath.replace(/\\/g, '/');

// Run headless Chrome/Edge to generate high-contrast PDF
const cmd = `"${browserExe}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="${pdfOutputPath}" "${fileUrl}"`;
console.log('Executing PDF generation command...');
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(pdfOutputPath)) {
  const stats = fs.statSync(pdfOutputPath);
  console.log(`\u2713 High-contrast PDF successfully created at: ${pdfOutputPath} (${Math.round(stats.size / 1024)} KB)`);
  
  // Copy to brain artifacts directory
  fs.copyFileSync(pdfOutputPath, artifactPdfPath);
  console.log(`\u2713 Also copied to artifact path: ${artifactPdfPath}`);
} else {
  console.error('Failed to generate PDF');
  process.exit(1);
}
