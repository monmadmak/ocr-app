export interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
}

export interface OCRResult {
  filename: string;
  status: 'success' | 'error';
  text?: string;
  message?: string;
}
