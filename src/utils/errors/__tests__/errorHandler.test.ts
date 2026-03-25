/**
 * Error Handler Tests
 * 
 * Tests for error parsing, formatting, and handling utilities.
 * Validates Requirements 9.1-9.7 for comprehensive error handling.
 */

import { AxiosError } from "axios";

import {
    getFieldErrors,
    getUserErrorMessage,
    isRetryableError,
    logError,
    mapValidationErrors,
    parseApiError,
    sanitizeErrorMessage,
} from "../errorHandler";
import { ApiErrorResponse, ErrorType, FieldError } from "../errorTypes";

describe("errorHandler", () => {
    describe("parseApiError", () => {
        // Requirement 9.6: Network errors
        it("should handle network errors with user-friendly messages", () => {
            const networkError = new Error("Network Error") as any;
            networkError.code = "ERR_NETWORK";

            const result = parseApiError(networkError);

            expect(result.type).toBe(ErrorType.NETWORK_ERROR);
            expect(result.message).toBe("Network error. Please check your connection.");
        });

        // Requirement 9.7: Timeout errors
        it("should handle timeout errors", () => {
            const timeoutError = new Error("timeout of 10000ms exceeded") as any;
            timeoutError.code = "ECONNABORTED";

            const result = parseApiError(timeoutError);

            expect(result.type).toBe(ErrorType.NETWORK_ERROR);
            expect(result.message).toBe("Request timeout. Please try again.");
        });

        it("should handle ETIMEDOUT errors", () => {
            const timeoutError = new Error("timeout") as any;
            timeoutError.code = "ETIMEDOUT";

            const result = parseApiError(timeoutError);

            expect(result.type).toBe(ErrorType.NETWORK_ERROR);
            expect(result.message).toBe("Request timeout. Please try again.");
        });

        // Requirement 9.1: Validation errors (400)
        it("should handle validation errors with field-specific messages", () => {
            const validationError = {
                response: {
                    status: 400,
                    data: {
                        success: false,
                        message: "Validation failed",
                        errors: [
                            { field: "email", message: "Invalid email format" },
                            { field: "password", message: "Password too short" },
                        ],
                    },
                    statusText: "Bad Request",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 400",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(validationError);

            expect(result.type).toBe(ErrorType.VALIDATION_ERROR);
            expect(result.message).toBe("Validation failed");
            expect(result.fieldErrors).toEqual({
                email: "Invalid email format",
                password: "Password too short",
            });
            expect(result.statusCode).toBe(400);
        });

        // Requirement 9.2: Authentication errors (401)
        it("should handle authentication errors", () => {
            const authError = {
                response: {
                    status: 401,
                    data: {
                        success: false,
                        message: "Invalid email or password",
                    },
                    statusText: "Unauthorized",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 401",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(authError);

            expect(result.type).toBe(ErrorType.AUTH_ERROR);
            expect(result.message).toBe("Invalid email or password");
            expect(result.statusCode).toBe(401);
        });

        // Requirement 9.3: Not found errors (404)
        it("should handle not found errors", () => {
            const notFoundError = {
                response: {
                    status: 404,
                    data: {
                        success: false,
                        message: "Email not found",
                    },
                    statusText: "Not Found",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 404",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(notFoundError);

            expect(result.type).toBe(ErrorType.NOT_FOUND_ERROR);
            expect(result.message).toBe("Email not found");
            expect(result.statusCode).toBe(404);
        });

        // Requirement 9.4: Conflict errors (409)
        it("should handle conflict errors", () => {
            const conflictError = {
                response: {
                    status: 409,
                    data: {
                        success: false,
                        message: "Email already exists",
                    },
                    statusText: "Conflict",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 409",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(conflictError);

            expect(result.type).toBe(ErrorType.CONFLICT_ERROR);
            expect(result.message).toBe("Email already exists");
            expect(result.statusCode).toBe(409);
        });

        // Requirement 9.5: Rate limiting errors (429)
        it("should handle rate limiting errors", () => {
            const rateLimitError = {
                response: {
                    status: 429,
                    data: {
                        success: false,
                        message: "Too many requests",
                    },
                    statusText: "Too Many Requests",
                    headers: {
                        "retry-after": "60",
                    },
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 429",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(rateLimitError);

            expect(result.type).toBe(ErrorType.RATE_LIMIT_ERROR);
            expect(result.message).toContain("Too many attempts");
            expect(result.message).toContain("60 seconds");
            expect(result.statusCode).toBe(429);
            expect(result.retryAfter).toBe(60);
        });

        it("should handle rate limiting errors without retry-after header", () => {
            const rateLimitError = {
                response: {
                    status: 429,
                    data: {
                        success: false,
                        message: "Too many requests",
                    },
                    statusText: "Too Many Requests",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 429",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(rateLimitError);

            expect(result.type).toBe(ErrorType.RATE_LIMIT_ERROR);
            expect(result.retryAfter).toBe(60); // Default value
        });

        // Requirement 9.7: Server errors (500)
        it("should handle server errors", () => {
            const serverError = {
                response: {
                    status: 500,
                    data: {
                        success: false,
                        message: "Internal server error",
                    },
                    statusText: "Internal Server Error",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 500",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(serverError);

            expect(result.type).toBe(ErrorType.SERVER_ERROR);
            expect(result.message).toBe("An unexpected error occurred. Please try again later.");
            expect(result.statusCode).toBe(500);
        });

        it("should handle 502 Bad Gateway errors", () => {
            const error = {
                response: {
                    status: 502,
                    data: {
                        success: false,
                        message: "Bad Gateway",
                    },
                    statusText: "Bad Gateway",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 502",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(error);

            expect(result.type).toBe(ErrorType.SERVER_ERROR);
            expect(result.message).toBe("An unexpected error occurred. Please try again later.");
        });

        it("should handle 503 Service Unavailable errors", () => {
            const error = {
                response: {
                    status: 503,
                    data: {
                        success: false,
                        message: "Service Unavailable",
                    },
                    statusText: "Service Unavailable",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 503",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(error);

            expect(result.type).toBe(ErrorType.SERVER_ERROR);
            expect(result.message).toBe("An unexpected error occurred. Please try again later.");
        });

        it("should handle 504 Gateway Timeout errors", () => {
            const error = {
                response: {
                    status: 504,
                    data: {
                        success: false,
                        message: "Gateway Timeout",
                    },
                    statusText: "Gateway Timeout",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 504",
            } as AxiosError<ApiErrorResponse>;

            const result = parseApiError(error);

            expect(result.type).toBe(ErrorType.SERVER_ERROR);
            expect(result.message).toBe("An unexpected error occurred. Please try again later.");
        });

        it("should handle unknown errors", () => {
            const unknownError = new Error("Something went wrong");

            const result = parseApiError(unknownError);

            expect(result.type).toBe(ErrorType.NETWORK_ERROR);
            expect(result.message).toBe("Network error. Please check your connection.");
        });

        it("should handle non-Error objects", () => {
            const result = parseApiError("string error");

            expect(result.type).toBe(ErrorType.UNKNOWN_ERROR);
            expect(result.message).toBe("An unexpected error occurred");
        });
    });

    describe("mapValidationErrors", () => {
        it("should map field errors to object", () => {
            const errors: FieldError[] = [
                { field: "email", message: "Invalid email" },
                { field: "password", message: "Too short" },
            ];

            const result = mapValidationErrors(errors);

            expect(result).toEqual({
                email: "Invalid email",
                password: "Too short",
            });
        });

        it("should handle empty errors array", () => {
            const result = mapValidationErrors([]);

            expect(result).toBeUndefined();
        });

        it("should handle undefined errors", () => {
            const result = mapValidationErrors(undefined);

            expect(result).toBeUndefined();
        });

        it("should skip errors without field property", () => {
            const errors: FieldError[] = [
                { field: "email", message: "Invalid email" },
                { message: "General error" },
            ];

            const result = mapValidationErrors(errors);

            expect(result).toEqual({
                email: "Invalid email",
            });
        });
    });

    describe("sanitizeErrorMessage", () => {
        it("should remove stack traces", () => {
            const message = "Error occurred at someFunction (file.ts:10:5)";
            const result = sanitizeErrorMessage(message);

            expect(result).not.toContain("at someFunction");
            expect(result).not.toContain("file.ts:10:5");
        });

        it("should remove file paths", () => {
            const message = "Error in /path/to/file.ts";
            const result = sanitizeErrorMessage(message);

            expect(result).not.toContain("/path/to/file.ts");
        });

        it("should remove SQL queries", () => {
            const message = "SELECT * FROM users WHERE id = 1";
            const result = sanitizeErrorMessage(message);

            expect(result).toBe("An unexpected error occurred");
        });

        it("should remove internal error codes", () => {
            const message = "ERR_INTERNAL_SERVER_ERROR occurred";
            const result = sanitizeErrorMessage(message);

            expect(result).not.toContain("ERR_INTERNAL_SERVER_ERROR");
        });

        it("should return generic message for empty result", () => {
            const message = "   ";
            const result = sanitizeErrorMessage(message);

            expect(result).toBe("An unexpected error occurred");
        });

        it("should preserve safe error messages", () => {
            const message = "Invalid email format";
            const result = sanitizeErrorMessage(message);

            expect(result).toBe("Invalid email format");
        });
    });

    describe("isRetryableError", () => {
        it("should identify connection aborted errors as retryable", () => {
            const error = { code: "ECONNABORTED" };
            expect(isRetryableError(error)).toBe(true);
        });

        it("should identify timeout errors as retryable", () => {
            const error = { code: "ETIMEDOUT" };
            expect(isRetryableError(error)).toBe(true);
        });

        it("should identify network errors as retryable", () => {
            const error = { message: "Network Error" };
            expect(isRetryableError(error)).toBe(true);
        });

        it("should identify errors without response as retryable", () => {
            const error = { message: "Some error" };
            expect(isRetryableError(error)).toBe(true);
        });

        it("should not identify errors with response as retryable", () => {
            const error = { response: { status: 400 } };
            expect(isRetryableError(error)).toBe(false);
        });
    });

    describe("getUserErrorMessage", () => {
        it("should return sanitized user-friendly message", () => {
            const error = {
                response: {
                    status: 401,
                    data: {
                        success: false,
                        message: "Invalid credentials at someFunction (file.ts:10:5)",
                    },
                    statusText: "Unauthorized",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 401",
            } as AxiosError<ApiErrorResponse>;

            const result = getUserErrorMessage(error);

            expect(result).not.toContain("at someFunction");
            expect(result).toContain("Invalid credentials");
        });
    });

    describe("getFieldErrors", () => {
        it("should extract field errors from validation error", () => {
            const error = {
                response: {
                    status: 400,
                    data: {
                        success: false,
                        message: "Validation failed",
                        errors: [
                            { field: "email", message: "Invalid email" },
                        ],
                    },
                    statusText: "Bad Request",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 400",
            } as AxiosError<ApiErrorResponse>;

            const result = getFieldErrors(error);

            expect(result).toEqual({
                email: "Invalid email",
            });
        });

        it("should return undefined for non-validation errors", () => {
            const error = {
                response: {
                    status: 401,
                    data: {
                        success: false,
                        message: "Unauthorized",
                    },
                    statusText: "Unauthorized",
                    headers: {},
                    config: {} as any,
                },
                isAxiosError: true,
                toJSON: () => ({}),
                name: "AxiosError",
                message: "Request failed with status code 401",
            } as AxiosError<ApiErrorResponse>;

            const result = getFieldErrors(error);

            expect(result).toBeUndefined();
        });
    });

    describe("logError", () => {
        const originalDev = __DEV__;
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

        afterEach(() => {
            consoleErrorSpy.mockClear();
        });

        afterAll(() => {
            consoleErrorSpy.mockRestore();
            (global as any).__DEV__ = originalDev;
        });

        it("should log errors in development mode", () => {
            (global as any).__DEV__ = true;

            const error = new Error("Test error");
            const context = { method: "signIn" };

            logError(error, context);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "API Error:",
                expect.objectContaining({
                    error,
                    context,
                    timestamp: expect.any(String),
                })
            );
        });

        it("should not log errors in production mode", () => {
            (global as any).__DEV__ = false;

            const error = new Error("Test error");
            logError(error);

            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });
});
