// llm.ts
// Implementation for the LLM (Large Language Model) logic will go here.
import fetch from 'node-fetch';
import type { Failure, AnalysisResult } from './types.js';

export async function analyzeFailure(failure: Failure): Promise<AnalysisResult> {
  const prompt = `
You are a senior QA automation architect.

Analyze the failure and classify STRICTLY into ONE of:
1. Script Issue (locator, timing, automation code issue)
2. Environment Issue (server down, network issue, infra problem)
3. Data Issue (invalid/missing test data)
4. Product Bug (actual defect in application)

Rules:
- If API returns 4xx/5xx → Product Bug (unless clearly environment down)
- Timeout + element not found → Script Issue
- Be precise and confident

Failure:
Test: ${failure.testName}
Error: ${failure.error}

Respond ONLY in JSON:
{
  "category": "",
  "reason": "",
  "suggestion": ""
}
`;

  const response = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3',
      prompt: prompt,
      stream: false
    })
  });

  const data: any = await response.json();

  try {
    const parsed = JSON.parse(data.response);
    return {
      testName: failure.testName,
      ...parsed
    };
  } catch {
    return {
      testName: failure.testName,
      category: 'Unknown',
      reason: data.response,
      suggestion: 'Manual review required'
    };
  }
}