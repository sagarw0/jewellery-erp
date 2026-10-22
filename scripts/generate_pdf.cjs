const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: false,
});

const mdPath = path.resolve(__dirname, '../docs/SWARNA_JEWELLERY_ERP_FUNCTIONAL_BLUEPRINT.md');
const htmlOutputPath = path.resolve(__dirname, '../docs/blueprint_print.html');
const pdfOutputPath = path.resolve(__dirname, '../docs/SWARNA_JEWELLERY_ERP_FUNCTIONAL_BLUEPRINT.pdf');
const artifactPdfPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e778fe8e-15f3-46a3-9e8f-f17bebb032ae\\SWARNA_JEWELLERY_ERP_FUNCTIONAL_BLUEPRINT.pdf';

console.log('Reading markdown from:', mdPath);
let mdContent = fs.readFileSync(mdPath, 'utf8');

// Protect code blocks before math processing
const codeBlocks = [];

mdContent = mdContent.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
  const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
  codeBlocks.push(match);
  return placeholder;
});

function cleanLatexMath(formula) {
  return formula.trim()
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\max/g, 'max')
    .replace(/\\Big\(/g, '(')
    .replace(/\\Big\)/g, ')')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 ÷ $2)')
    .replace(/\\times/g, ' × ')
    .replace(/\\le/g, ' ≤ ')
    .replace(/\\ge/g, ' ≥ ')
    .replace(/\\ne/g, ' ≠ ')
    .replace(/\\sum/g, '∑')
    .replace(/\\quad/g, '   ')
    .replace(/\\_/g, '_')
    .replace(/\\%/g, '%')
    .replace(/\\leftarrow/g, ' ← ')
    .replace(/\\/g, '');
}

// Convert display math
mdContent = mdContent.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
  const clean = cleanLatexMath(formula);
  return `<div class="math-block"><div class="math-tag">FORMULA</div>${clean}</div>`;
});

// Convert inline math
mdContent = mdContent.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
  const clean = cleanLatexMath(formula);
  return `<span class="math-inline">${clean}</span>`;
});

// Restore protected code blocks
mdContent = mdContent.replace(/__CODE_BLOCK_(\d+)__/g, (match, idx) => {
  return codeBlocks[parseInt(idx, 10)];
});

const bodyHtml = marked(mdContent);


const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swarna Jewellery ERP - Functional Blueprint</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #0f172a;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Cover / Header Banner */
    .blueprint-header {
      border-bottom: 3px solid #b45309;
      padding-bottom: 18px;
      margin-bottom: 28px;
    }

    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 22pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin-top: 0;
      margin-bottom: 8px;
      line-height: 1.25;
      border-left: 6px solid #b45309;
      padding-left: 14px;
    }

    h2 {
      font-size: 15pt;
      font-weight: 700;
      color: #1e3a8a;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 32px;
      margin-bottom: 14px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 12.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 24px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    h4 {
      font-size: 11.5pt;
      font-weight: 700;
      color: #334155;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }

    p {
      margin-top: 0;
      margin-bottom: 12px;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 12px;
      padding-left: 24px;
    }

    li {
      margin-bottom: 4px;
    }

    strong {
      color: #020617;
      font-weight: 700;
    }

    hr {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 28px 0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0 24px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }

    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-bottom: 2px solid #94a3b8;
    }

    td {
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Code Blocks and Pre */
    pre {
      background-color: #090d16;
      color: #f1f5f9;
      padding: 14px 16px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', 'Cascadia Code', monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      overflow-x: auto;
      border: 1px solid #1e293b;
      margin: 14px 0;
      page-break-inside: avoid;
    }

    code {
      font-family: 'JetBrains Mono', 'Cascadia Code', monospace;
      font-size: 8.5pt;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 1.5px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre code {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
    }

    /* Math Formula Blocks */
    .math-block {
      background-color: #fffdf5;
      border-left: 4px solid #d97706;
      border-top: 1px solid #fef3c7;
      border-right: 1px solid #fef3c7;
      border-bottom: 1px solid #fef3c7;
      border-radius: 6px;
      padding: 9px 15px;
      margin: 12px 0 16px 0;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      font-size: 9.5pt;
      color: #78350f;
      page-break-inside: avoid;
    }

    .math-tag {
      font-size: 7pt;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #b45309;
      margin-bottom: 3px;
    }

    .math-inline {
      background-color: #fef3c7;
      color: #92400e;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      font-size: 9pt;
      padding: 1px 4px;
      border-radius: 3px;
    }

    /* Badges & Tags */
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }

    /* Section Page Break rules */
    h2 {
      break-before: auto;
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>
`;

console.log('Writing styled HTML to:', htmlOutputPath);
fs.writeFileSync(htmlOutputPath, fullHtml, 'utf8');

// Find browser executable
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log('Using browser engine:', browserExe);

const fileUrl = 'file:///' + htmlOutputPath.replace(/\\/g, '/');

// Run headless Chrome/Edge to generate PDF
const cmd = `"${browserExe}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="${pdfOutputPath}" "${fileUrl}"`;
console.log('Executing PDF generation command...');
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(pdfOutputPath)) {
  const stats = fs.statSync(pdfOutputPath);
  console.log(`\u2713 PDF successfully created at: ${pdfOutputPath} (${Math.round(stats.size / 1024)} KB)`);
  
  // Copy to brain artifacts directory as well
  fs.copyFileSync(pdfOutputPath, artifactPdfPath);
  console.log(`\u2713 Also copied to artifact path: ${artifactPdfPath}`);
} else {
  console.error('Failed to generate PDF');
  process.exit(1);
}
