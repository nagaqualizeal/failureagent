// types.ts
// Shared type definitions will go here.
export interface Failure {
  testName: string;
  error: string;
}

export interface AnalysisResult {
  testName: string;
  category: string;
  reason: string;
  suggestion: string;
}