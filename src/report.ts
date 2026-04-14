import fs from 'fs';
import type { AnalysisResult } from './types';

export function generateHTMLReport(results: AnalysisResult[]) {
  const rows = results.map(r => `
    <tr>
      <td>${r.testName}</td>
      <td>${r.category}</td>
      <td>${r.reason}</td>
      <td>${r.suggestion}</td>
    </tr>
  `).join('');

  const html = `
  <html>
    <head>
      <title>Failure Analysis Report</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 10px; }
        th { background-color: #f4f4f4; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>🤖 Failure Analysis Report</h1>
      <table>
        <tr>
          <th>Test Name</th>
          <th>Category</th>
          <th>Reason</th>
          <th>Suggestion</th>
        </tr>
        ${rows}
      </table>
    </body>
  </html>
  `;

  fs.writeFileSync('failure-report.html', html);
  console.log('📄 HTML report generated: failure-report.html');
}
