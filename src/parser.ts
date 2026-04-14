// parser.ts
// Implementation for the parser logic will go here.
import fs from 'fs';
import { Failure } from './types';

export function parseFailures(reportPath: string): Failure[] {
  const data = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  const failures: Failure[] = [];

  function traverseSuites(suites: any[]) {
    suites.forEach((suite) => {
      suite.specs?.forEach((spec: any) => {
        spec.tests?.forEach((test: any) => {
          test.results?.forEach((result: any) => {
            if (result.status === 'failed') {
              failures.push({
                testName: spec.title,
                error: result.error?.message || 'Unknown error'
              });
            }
          });
        });
      });

      if (suite.suites) {
        traverseSuites(suite.suites);
      }
    });
  }

  traverseSuites(data.suites || []);

  return failures;
}