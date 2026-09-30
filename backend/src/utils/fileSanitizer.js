import path from 'path';

export const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls', '.pdf'];
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

export function sanitizeFilename(filename) {
  // Remove dangerous path characters
  const basename = path.basename(filename);
  return basename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file uploaded.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File size exceeds 50MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).` };
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Unsupported file extension '${ext}'. Allowed: CSV, XLSX, XLS, PDF.` };
  }

  return { valid: true };
}
