// Error handling utilities and types

export interface AppError {
  code: string;
  message: string;
  details?: string;
  recovery?: string;
}

export class ThemeError extends Error {
  code: string;
  details?: string;
  recovery?: string;

  constructor(code: string, message: string, details?: string, recovery?: string) {
    super(message);
    this.name = 'ThemeError';
    this.code = code;
    this.details = details;
    this.recovery = recovery;
  }
}

// Common error codes and messages
export const ERROR_CODES = {
  // File errors
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_CORRUPTED: 'FILE_CORRUPTED',
  FILE_READ_ERROR: 'FILE_READ_ERROR',

  // Theme validation errors
  INVALID_THEME_DATA: 'INVALID_THEME_DATA',
  MISSING_REQUIRED_ELEMENTS: 'MISSING_REQUIRED_ELEMENTS',
  INVALID_ELEMENT_PROPERTIES: 'INVALID_ELEMENT_PROPERTIES',

  // Export errors
  EXPORT_FAILED: 'EXPORT_FAILED',
  THEME_GENERATION_FAILED: 'THEME_GENERATION_FAILED',
  DOWNLOAD_FAILED: 'DOWNLOAD_FAILED',

  // Import errors
  IMPORT_FAILED: 'IMPORT_FAILED',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  PARSER_ERROR: 'PARSER_ERROR',

  // Storage errors
  LOCAL_STORAGE_FULL: 'LOCAL_STORAGE_FULL',
  SAVE_FAILED: 'SAVE_FAILED',
  LOAD_FAILED: 'LOAD_FAILED',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',

  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  OPERATION_CANCELLED: 'OPERATION_CANCELLED'
} as const;

export const getErrorMessage = (code: string): AppError => {
  switch (code) {
    case ERROR_CODES.INVALID_FILE_FORMAT:
      return {
        code,
        message: 'Invalid file format',
        details: 'The selected file is not a supported format. Please select a .json, .bflyt, or .nxtheme file.',
        recovery: 'Choose a different file or convert your theme to a supported format.'
      };

    case ERROR_CODES.FILE_TOO_LARGE:
      return {
        code,
        message: 'File too large',
        details: 'The selected file exceeds the maximum size limit of 50MB.',
        recovery: 'Please select a smaller file or compress your theme data.'
      };

    case ERROR_CODES.FILE_CORRUPTED:
      return {
        code,
        message: 'File appears to be corrupted',
        details: 'The file structure is damaged or incomplete.',
        recovery: 'Try re-downloading the theme file or use a backup copy.'
      };

    case ERROR_CODES.INVALID_THEME_DATA:
      return {
        code,
        message: 'Invalid theme data',
        details: 'The theme file contains invalid or missing data structures.',
        recovery: 'Verify the theme file was exported correctly or try importing a different theme.'
      };

    case ERROR_CODES.MISSING_REQUIRED_ELEMENTS:
      return {
        code,
        message: 'Missing required elements',
        details: 'The theme is missing elements that are required for proper Nintendo Switch functionality.',
        recovery: 'Add the missing elements or start with a complete template.'
      };

    case ERROR_CODES.EXPORT_FAILED:
      return {
        code,
        message: 'Export failed',
        details: 'Unable to generate the theme file due to an internal error.',
        recovery: 'Check that all required elements are present and try exporting again.'
      };

    case ERROR_CODES.LOCAL_STORAGE_FULL:
      return {
        code,
        message: 'Storage space full',
        details: 'Your browser storage is full and cannot save the project.',
        recovery: 'Clear some browser data or download your projects to free up space.'
      };

    case ERROR_CODES.NETWORK_ERROR:
      return {
        code,
        message: 'Network error',
        details: 'Unable to connect to the server or load required resources.',
        recovery: 'Check your internet connection and try again.'
      };

    default:
      return {
        code: ERROR_CODES.UNKNOWN_ERROR,
        message: 'An unexpected error occurred',
        details: 'The application encountered an unknown error.',
        recovery: 'Try refreshing the page or contact support if the problem persists.'
      };
  }
};

// Error handling utilities
export const handleFileError = (error: unknown, filename?: string): ThemeError => {
  if (error instanceof ThemeError) {
    return error;
  }

  if (error instanceof Error) {
    // Try to determine error type from message
    const message = error.message.toLowerCase();

    if (message.includes('json') || message.includes('parse')) {
      return new ThemeError(
        ERROR_CODES.INVALID_FILE_FORMAT,
        'Invalid JSON format',
        `File "${filename}" contains invalid JSON data.`,
        'Check the file format and try again.'
      );
    }

    if (message.includes('network') || message.includes('fetch')) {
      return new ThemeError(
        ERROR_CODES.NETWORK_ERROR,
        'Network error',
        error.message,
        'Check your internet connection and try again.'
      );
    }

    if (message.includes('quota') || message.includes('storage')) {
      return new ThemeError(
        ERROR_CODES.LOCAL_STORAGE_FULL,
        'Storage full',
        error.message,
        'Clear browser storage or download your projects.'
      );
    }
  }

  return new ThemeError(
    ERROR_CODES.UNKNOWN_ERROR,
    'Unknown error occurred',
    error?.toString() || 'No additional details available',
    'Try refreshing the page or contact support.'
  );
};

export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  errorCode: string,
  context?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const errorInfo = getErrorMessage(errorCode);
    throw new ThemeError(
      errorCode,
      errorInfo.message,
      context ? `${context}: ${error}` : error?.toString(),
      errorInfo.recovery
    );
  }
};

// Validation helpers
export const validateFile = (file: File): void => {
  // Check file size (50MB limit)
  if (file.size > 50 * 1024 * 1024) {
    throw new ThemeError(ERROR_CODES.FILE_TOO_LARGE, 'File too large', `File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }

  // Check file type
  const validExtensions = ['.json', '.bflyt', '.nxtheme'];
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

  if (!hasValidExtension) {
    throw new ThemeError(
      ERROR_CODES.INVALID_FILE_FORMAT,
      'Unsupported file format',
      `File: ${file.name}`,
      `Supported formats: ${validExtensions.join(', ')}`
    );
  }
};

export const validateThemeData = (data: unknown): void => {
  if (!data || typeof data !== 'object') {
    throw new ThemeError(ERROR_CODES.INVALID_THEME_DATA, 'Invalid theme data', 'Data is not a valid object');
  }

  // Add more specific validation based on your theme structure
  if (Array.isArray(data) && data.length === 0) {
    throw new ThemeError(ERROR_CODES.INVALID_THEME_DATA, 'Empty theme data', 'Theme contains no elements');
  }
};