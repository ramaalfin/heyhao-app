/**
 * Authentication API Client
 * 
 * Provides type-safe methods for all authentication operations.
 * Handles API requests, Redux state updates, and error handling.
 */

import { photoUploader } from "@services/media/photoUploader";
import store from "@store/store";
import {
	clearAuth,
	setAuthToken,
	setError,
	setLoading,
	setRefreshToken,
	setUser,
} from "@store/UserSlice";
import { AxiosInstance } from "axios";

import { logError, parseApiError } from "@utils/errors/errorHandler";

import type {
	ApiResponse,
	AuthResponse,
	ForgotPasswordRequest,
	SignInRequest,
	SignUpData,
	SignUpRequest,
	TokenResponse,
	UpdatePasswordRequest,
	User,
} from "./types";

/**
 * Authentication API Client
 */
export class AuthApi {
	private client: AxiosInstance;

	constructor(client: AxiosInstance) {
		this.client = client;
	}

	/**
	 * Sign up a new user with photo upload
	 * @param data - Sign up request data
	 * @returns Promise resolving to authentication response
	 * @throws Error with user-friendly message for network, validation, conflict, rate limit, or server errors
	 */
	async signUp(data: SignUpRequest): Promise<AuthResponse> {
		store.dispatch(setLoading(true));
		store.dispatch(setError(null));

		try {
			// Validate photo
			const photoValidation = photoUploader.validatePhoto(data.photo);
			if (!photoValidation.isValid) {
				throw new Error(photoValidation.error);
			}

			// Prepare form data
			const userData: SignUpData = {
				name: data.name,
				email: data.email,
				password: data.password,
			};

			const formData = photoUploader.prepareFormData(data.photo, userData);

			// Send request
			const response = await this.client.post<AuthResponse>(
				"/auth/sign-up",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			// Update Redux state
			const { id, name, email, photo, photo_url, token, refreshToken } = response.data.data;

			store.dispatch(setUser({ id, name, email, photo, photo_url }));
			store.dispatch(setAuthToken(token));
			store.dispatch(setRefreshToken(refreshToken));
			store.dispatch(setLoading(false));

			return response.data;
		} catch (error) {
			const parsedError = parseApiError(error);
			store.dispatch(setError(parsedError.message));
			store.dispatch(setLoading(false));
			logError(error, { method: "signUp", email: data.email });
			throw parsedError;
		}
	}

	/**
	 * Sign in an existing user
	 * @param data - Sign in request data
	 * @returns Promise resolving to authentication response
	 * @throws Error with user-friendly message for network, validation, authentication, rate limit, or server errors
	 */
	async signIn(data: SignInRequest): Promise<AuthResponse> {
		store.dispatch(setLoading(true));
		store.dispatch(setError(null));

		try {
			const response = await this.client.post<AuthResponse>(
				"/auth/sign-in",
				data
			);

			// Update Redux state
			const { id, name, email, photo, photo_url, token, refreshToken } = response.data.data;

			store.dispatch(setUser({ id, name, email, photo, photo_url }));
			store.dispatch(setAuthToken(token));
			store.dispatch(setRefreshToken(refreshToken));
			store.dispatch(setLoading(false));

			return response.data;
		} catch (error) {
			const parsedError = parseApiError(error);
			store.dispatch(setError(parsedError.message));
			store.dispatch(setLoading(false));
			logError(error, { method: "signIn", email: data.email });
			throw parsedError;
		}
	}

	/**
	 * Refresh access token using refresh token
	 * @param refreshToken - Current refresh token
	 * @returns Promise resolving to new tokens
	 * @throws Error with user-friendly message for network, authentication, or server errors
	 */
	async refreshToken(refreshToken: string): Promise<TokenResponse> {
		try {
			const response = await this.client.post<TokenResponse>(
				"/auth/refresh-token",
				{ refreshToken }
			);

			// Update tokens in Redux state
			const { token, refreshToken: newRefreshToken } = response.data.data;
			store.dispatch(setAuthToken(token));
			store.dispatch(setRefreshToken(newRefreshToken));

			return response.data;
		} catch (error) {
			const parsedError = parseApiError(error);
			logError(error, { method: "refreshToken" });
			throw parsedError;
		}
	}

	/**
	 * Log out the current user
	 * @param userId - User ID to logout
	 * @returns Promise resolving when logout completes
	 * @note Always clears local auth state, even if the API request fails
	 */
	async logout(userId: string): Promise<void> {
		try {
			await this.client.post("/auth/logout", { userId });
		} catch (error) {
			// Parse error for logging but don't throw - we still want to clear local state
			const parsedError = parseApiError(error);
			logError(error, { method: "logout", userId, errorMessage: parsedError.message });
		} finally {
			// Always clear auth state, even if request fails
			store.dispatch(clearAuth());
		}
	}

	/**
	 * Request password reset email
	 * @param email - User's email address
	 * @returns Promise resolving when email is sent
	 * @throws Error with user-friendly message for network, validation, not found, rate limit, or server errors
	 */
	async forgotPassword(email: string): Promise<void> {
		store.dispatch(setLoading(true));
		store.dispatch(setError(null));

		try {
			await this.client.post<ApiResponse>(
				"/auth/forgot-password",
				{ email }
			);

			store.dispatch(setLoading(false));
		} catch (error) {
			const parsedError = parseApiError(error);
			store.dispatch(setError(parsedError.message));
			store.dispatch(setLoading(false));
			logError(error, { method: "forgotPassword", email });
			throw parsedError;
		}
	}

	/**
	 * Update password using reset token
	 * @param tokenId - Password reset token ID
	 * @param data - New password data
	 * @returns Promise resolving when password is updated
	 * @throws Error with user-friendly message for network, validation, not found, rate limit, or server errors
	 */
	async updatePassword(
		tokenId: string,
		data: UpdatePasswordRequest
	): Promise<void> {
		store.dispatch(setLoading(true));
		store.dispatch(setError(null));

		try {
			await this.client.put<ApiResponse>(
				`/auth/forgot-password/${tokenId}`,
				data
			);

			store.dispatch(setLoading(false));
		} catch (error) {
			const parsedError = parseApiError(error);
			store.dispatch(setError(parsedError.message));
			store.dispatch(setLoading(false));
			logError(error, { method: "updatePassword", tokenId });
			throw parsedError;
		}
	}

	/**
	 * Get user personal info
	 * @param userId - User ID
	 * @returns Promise resolving to user data
	 * @throws Error with user-friendly message for network, authentication, not found, or server errors
	 */
	async getUserProfile(userId: string): Promise<User> {
		store.dispatch(setLoading(true));
		store.dispatch(setError(null));

		try {
			const response = await this.client.get<ApiResponse<User>>(
				`/users/personal-info/${userId}`
			);

			const userData = response.data.data;
			if (userData) {
				store.dispatch(setUser(userData));
			}

			store.dispatch(setLoading(false));
			return userData!;
		} catch (error) {
			const parsedError = parseApiError(error);
			store.dispatch(setError(parsedError.message));
			store.dispatch(setLoading(false));
			logError(error, { method: "getUserProfile", userId });
			throw parsedError;
		}
	}
}

export default AuthApi;
