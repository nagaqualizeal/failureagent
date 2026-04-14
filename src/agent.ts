// agent.ts
// Implementation for the agent logic will go here.
import { parseFailures } from './parser';
import { analyzeFailure } from './llm';
import { generateHTMLReport } from './report';

async function runAgent() {
//   const reportPath = './playwright-report.json';
    const reportPath = './results.json';

  const failures = parseFailures(reportPath);

  if (failures.length === 0) {
    console.log('✅ No failures found');
    return;
  }

  console.log(`🔍 Found ${failures.length} failures\n`);

  let summary = {
    script: 0,
    env: 0,
    data: 0,
    bug: 0
  };
  const results = [];

  for (const failure of failures) {
    console.log(`Analyzing: ${failure.testName}`);

    const result = await analyzeFailure(failure);

    if (result.category.includes('Script')) summary.script++;
    else if (result.category.includes('Environment')) summary.env++;
    else if (result.category.includes('Data')) summary.data++;
    else if (result.category.includes('Product')) summary.bug++;

    results.push(result);

    console.log('------------------------------');
    console.log(`Test: ${result.testName}`);
    console.log(`Category: ${result.category}`);
    console.log(`Reason: ${result.reason}`);
    console.log(`Suggestion: ${result.suggestion}`);
    console.log('------------------------------\n');
  }

  console.log('📊 Summary:');
  console.log(summary);
  generateHTMLReport(results);
}

runAgent();