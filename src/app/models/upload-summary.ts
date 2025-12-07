// src/app/models/upload-summary.ts
export interface RowError {
  lineNumber: number;
  message: string;
  errorType?: 'VALIDATION' | 'DUPLICATE' | 'OTHER' | string;
}

export interface UploadSummary {
  total: number;
  inserted: number;
  validationErrors: number;
  duplicateErrors: number;
  otherErrors: number;
  errors: RowError[];
}
