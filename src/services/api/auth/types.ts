/**
 * Authentication API Types
 * 
 * Type definitions for authentication requests, responses, and state management.
 * These types align with the heyhao-be backend API structure.
 */

import type { Asset } from "react-native-image-picker";

// ============================================================================
// Base API Response Types (matching backend structure)
// ============================================================================

/**
 * Standard API response wrapper from backend
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Array<{
        field?: string;
        message: string;
    }>;
}

// ============================================================================
// User Types
// ============================================================================

/**
 * User data structure
 */
export interface User {
    id: string;
    name: string;
    email: string;
    photo: string;
}

// ============================================================================
// Authentication Request Types
// ============================================================================

/**
 * Sign up request payload
 * Note: Photo is handled separately as multipart/form-data
 */
export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
    photo: Asset;
}

/**
 * Sign up request data (without photo, for FormData)
 */
export interface SignUpData {
    name: string;
    email: string;
    password: string;
}

/**
 * Sign in request payload
 */
export interface SignInRequest {
    email: string;
    password: string;
}

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Logout request payload
 */
export interface LogoutRequest {
    userId: string;
}

/**
 * Forgot password request payload
 */
export interface ForgotPasswordRequest {
    email: string;
}

/**
 * Update password request payload
 */
export interface UpdatePasswordRequest {
    password: string;
    confirmPassword: string;
}

// ============================================================================
// Authentication Response Types
// ============================================================================

/**
 * Authentication response data (sign up and sign in)
 */
export interface AuthResponseData {
    id: string;
    name: string;
    email: string;
    photo: string;
    token: string;
    refreshToken: string;
}

/**
 * Complete authentication response
 */
export interface AuthResponse extends ApiResponse<AuthResponseData> {
    success: true;
    message: string;
    data: AuthResponseData;
}

/**
 * Token refresh response data
 */
export interface TokenResponseData {
    token: string;
    refreshToken: string;
}

/**
 * Complete token refresh response
 */
export interface TokenResponse extends ApiResponse<TokenResponseData> {
    success: true;
    message: string;
    data: TokenResponseData;
}

// ============================================================================
// Redux State Types
// ============================================================================

/**
 * User state in Redux store
 */
export interface UserState {
    user: User | null;
    authToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// ============================================================================
// Form State Types
// ============================================================================

/**
 * Sign up form state
 */
export interface SignUpFormState {
    name: string;
    email: string;
    password: string;
    photo: Asset | null;
    errors: {
        name?: string;
        email?: string;
        password?: string;
        photo?: string;
    };
}

/**
 * Sign in form state
 */
export interface SignInFormState {
    email: string;
    password: string;
    errors: {
        email?: string;
        password?: string;
    };
}

/**
 * Forgot password form state
 */
export interface ForgotPasswordFormState {
    email: string;
    errors: {
        email?: string;
    };
}

/**
 * Update password form state
 */
export interface UpdatePasswordFormState {
    password: string;
    confirmPassword: string;
    errors: {
        password?: string;
        confirmPassword?: string;
    };
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Validation error for a specific field
 */
export interface FieldError {
    field: string;
    message: string;
}

/**
 * Parsed API error
 */
export interface ParsedApiError {
    message: string;
    fieldErrors?: Record<string, string>;
    statusCode?: number;
    type?: ErrorType;
}

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
