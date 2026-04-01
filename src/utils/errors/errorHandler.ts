/**
 * Error Handler Utilities
 * 
 * Functions for parsing, formatting, and handling API errors.
 * Provides user-friendly error messages and field-specific validation errors.
 */

import { AxiosError } from "axios";

import { ApiErrorResponse, ErrorType, FieldError, ParsedApiError } from "./errorTypes";

/**
 * Checks if an error is retryable (network or timeout errors)
 */
export const isRetryableError = (error: any): boolean => {
	return (
		error.code === "ECONNABORTED" ||
		error.code === "ETIMEDOUT" ||
		error.message === "Network Error" ||
		!error.response
	);
};

/**
 * Parses an Axios error into a user-friendly error object
 * @param error - Axios error object
 * @returns Parsed error with type, message, and field errors
 */
export const parseApiError = (error: unknown): ParsedApiError => {
	// Handle non-Error objects (including mock AxiosError objects in tests)
	if (!(error instanceof Error) && typeof error !== "object") {
		return {
			type: ErrorType.UNKNOWN_ERROR,
			message: "An unexpected error occurred",
		};
	}

	// Check if error has response property (AxiosError structure)
	const hasResponse = error && typeof error === "object" && "response" in error;

	// Handle network errors (no response)
	if (!hasResponse || !(error as any).response) {
		const rawMessage = error instanceof Error ? error.message : "Unknown error";

		// Check for timeout errors
		if ((error as any).code === "ECONNABORTED" || (error as any).code === "ETIMEDOUT") {
			return {
				type: ErrorType.NETWORK_ERROR,
				message: `Time out (koneksi lambat). Error: ${rawMessage}`,
			};
		}

		return {
			type: ErrorType.NETWORK_ERROR,
			message: `Gagal terhubung ke server (Network Error). Detail: ${rawMessage}`,
		};
	}

	const axiosError = error as AxiosError<ApiErrorResponse>;
	const response = axiosError.response;

	if (!response) {
		return {
			type: ErrorType.NETWORK_ERROR,
			message: "Network error. Please check your connection.",
		};
	}

	const statusCode = response.status;
	const data = response.data;

	// Handle different status codes
	switch (statusCode) {
		case 400:
			return {
				type: ErrorType.VALIDATION_ERROR,
				message: data?.message || "Validation failed",
				fieldErrors: mapValidationErrors(data?.errors),
				statusCode,
			};

		case 401:
			return {
				type: ErrorType.AUTH_ERROR,
				message: data?.message || "Invalid email or password",
				statusCode,
			};

		case 404:
			return {
				type: ErrorType.NOT_FOUND_ERROR,
				message: data?.message || "Resource not found",
				statusCode,
			};

		case 409:
			return {
				type: ErrorType.CONFLICT_ERROR,
				message: data?.message || "Email already exists",
				statusCode,
			};

		case 429:
			const retryAfter = parseInt(response.headers["retry-after"] || "60", 10);
			return {
				type: ErrorType.RATE_LIMIT_ERROR,
				message: `Too many attempts. Please try again in ${retryAfter} seconds.`,
				statusCode,
				retryAfter,
			};

		case 500:
		case 502:
		case 503:
		case 504:
			return {
				type: ErrorType.SERVER_ERROR,
				message: "An unexpected error occurred. Please try again later.",
				statusCode,
			};

		default:
			return {
				type: ErrorType.UNKNOWN_ERROR,
				message: data?.message || "An unexpected error occurred",
				statusCode,
			};
	}
};

/**
 * Maps backend validation errors to field-specific error object
 * @param errors - Array of field errors from backend
 * @returns Object mapping field names to error messages
 */
export const mapValidationErrors = (
	errors?: FieldError[]
): Record<string, string> | undefined => {
	if (!errors || errors.length === 0) {
		return undefined;
	}

	return errors.reduce((acc, error) => {
		if (error.field) {
			acc[error.field] = error.message;
		}
		return acc;
	}, {} as Record<string, string>);
};

/**
 * Sanitizes error message to remove sensitive information
 * @param message - Original error message
 * @returns Sanitized error message
 */
export const sanitizeErrorMessage = (message: string): string => {
	// Remove stack traces
	const stackTracePattern = /at\s+.*\(.*:\d+:\d+\)/g;
	let sanitized = message.replace(stackTracePattern, "");

	// Remove file paths
	const filePathPattern = /\/[^\s]+\.(ts|js|tsx|jsx)/g;
	sanitized = sanitized.replace(filePathPattern, "");

	// Remove SQL queries
	const sqlPattern = /SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN/gi;
	if (sqlPattern.test(sanitized)) {
		return "An unexpected error occurred";
	}

	// Remove internal error codes
	const internalCodePattern = /ERR_[A-Z_]+/g;
	sanitized = sanitized.replace(internalCodePattern, "");

	return sanitized.trim() || "An unexpected error occurred";
};

/**
 * Logs error details for debugging (development only)
 * @param error - Error object
 * @param context - Additional context information
 */
export const logError = (error: unknown, context?: Record<string, any>): void => {
	if (__DEV__) {
		console.warn("API Error:", {
			error,
			context,
			timestamp: new Date().toISOString(),
		});
	}
};

/**
 * Gets user-friendly error message for display
 * @param error - Error object
 * @returns User-friendly error message
 */
export const getUserErrorMessage = (error: unknown): string => {
	const parsed = parseApiError(error);
	return sanitizeErrorMessage(parsed.message);
};

/**
 * Gets field-specific validation errors for forms
 * @param error - Error object
 * @returns Object mapping field names to error messages, or undefined
 */
export const getFieldErrors = (error: unknown): Record<string, string> | undefined => {
	const parsed = parseApiError(error);
	return parsed.fieldErrors;
};
