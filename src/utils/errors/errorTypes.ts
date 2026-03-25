/**
 * Error Type Definitions
 * 
 * Defines error types and structures for consistent error handling across the application.
 */

/**
 * Error type classification
 */
export enum ErrorType {
    NETWORK_ERROR = "NETWORK_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    AUTH_ERROR = "AUTH_ERROR",
    NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
    CONFLICT_ERROR = "CONFLICT_ERROR",
    RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Validation error for a specific field
 */
export interface FieldError {
    field?: string;
    message: string;
}

/**
 * Parsed API error with user-friendly message
 */
export interface ParsedApiError {
    type: ErrorType;
    message: string;
    fieldErrors?: Record<string, string>;
    statusCode?: number;
    retryAfter?: number;
}

/**
 * Raw API error response from backend
 */
export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: FieldError[];
    code?: string;
    statusCode?: number;
}
