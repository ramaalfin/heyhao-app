/**
 * Token Manager
 * 
 * Manages authentication tokens including storage, retrieval, and refresh logic.
 * Coordinates with Redux store for token persistence and provides token refresh mechanism.
 */

import store from "@store/store";
import {
	clearAuth,
	selectAuthToken,
	selectRefreshToken,
	setAuthToken,
	setRefreshToken,
} from "@store/UserSlice";
import axios from "axios";

import type { TokenResponse } from "../api/auth/types";

/**
 * Token Manager class for handling token operations
 */
class TokenManager {
	private isRefreshing: boolean = false;
	private refreshSubscribers: Array<(token: string) => void> = [];

	/**
	 * Gets the current access token from Redux store
	 * @returns Access token or null if not available
	 */
	getAccessToken(): string | null {
		const state = store.getState();
		return selectAuthToken(state);
	}

	/**
	 * Gets the current refresh token from Redux store
	 * @returns Refresh token or null if not available
	 */
	getRefreshToken(): string | null {
		const state = store.getState();
		return selectRefreshToken(state);
	}

	/**
	 * Sets both access and refresh tokens in Redux store
	 * @param accessToken - JWT access token
	 * @param refreshToken - JWT refresh token
	 */
	setTokens(accessToken: string, refreshToken: string): void {
		store.dispatch(setAuthToken(accessToken));
		store.dispatch(setRefreshToken(refreshToken));
	}

	/**
	 * Clears all tokens from Redux store
	 */
	clearTokens(): void {
		store.dispatch(clearAuth());
	}

	/**
	 * Checks if a token refresh is currently in progress
	 * @returns True if refreshing, false otherwise
	 */
	isRefreshingToken(): boolean {
		return this.isRefreshing;
	}

	/**
	 * Subscribes to token refresh completion
	 * @param callback - Function to call when refresh completes with new token
	 */
	subscribeTokenRefresh(callback: (token: string) => void): void {
		this.refreshSubscribers.push(callback);
	}

	/**
	 * Notifies all subscribers that token refresh completed
	 * @param token - New access token
	 */
	private onRefreshComplete(token: string): void {
		this.refreshSubscribers.forEach(callback => callback(token));
		this.refreshSubscribers = [];
	}

	/**
	 * Notifies all subscribers that token refresh failed
	 */
	private onRefreshFailed(): void {
		this.refreshSubscribers = [];
	}

	/**
	 * Refreshes the access token using the refresh token
	 * 
	 * This method implements a sophisticated token refresh mechanism with request queuing:
	 * 1. If a refresh is already in progress, queue the request and wait for completion
	 * 2. Otherwise, initiate a new refresh request
	 * 3. Notify all queued requests when refresh completes
	 * 4. Clear auth state if refresh fails
	 * 
	 * @returns Promise resolving to new access token
	 * @throws Error if refresh fails
	 */
	async refreshAccessToken(): Promise<string> {
		// CRITICAL: Prevent multiple simultaneous refresh requests
		// If already refreshing, return a promise that resolves when the current refresh completes
		// This ensures only ONE refresh request is made at a time, even with concurrent 401 responses
		if (this.isRefreshing) {
			return new Promise((resolve, reject) => {
				// Subscribe to refresh completion - this request will be resolved when refresh finishes
				this.subscribeTokenRefresh((token: string) => {
					resolve(token);
				});
			});
		}

		// Set flag to indicate refresh is in progress
		this.isRefreshing = true;

		try {
			// Get current refresh token from Redux store
			const refreshToken = this.getRefreshToken();

			if (!refreshToken) {
				throw new Error("No refresh token available");
			}

			// Call refresh token endpoint using absolute URL
			// NOTE: We use axios directly here (not the configured client) to avoid interceptor loops
			const baseURL = (process.env as any).BASE_URL_API || "http://localhost:3000/api/v1";
			const response = await axios.post<TokenResponse>(
				`${baseURL}/auth/refresh-token`,
				{ refreshToken }
			);

			const { token, refreshToken: newRefreshToken } = response.data.data;

			// Update tokens in Redux store (which also persists to AsyncStorage via Redux Persist)
			this.setTokens(token, newRefreshToken);

			// Notify all queued requests that refresh completed successfully
			// Each queued request will receive the new token and retry
			this.onRefreshComplete(token);

			return token;
		} catch (error) {
			// CRITICAL: Clear all auth state on refresh failure
			// This ensures user is logged out if refresh token is invalid/expired
			this.clearTokens();

			// Notify all queued requests that refresh failed
			// Each queued request will be rejected
			this.onRefreshFailed();

			throw error;
		} finally {
			// Always reset the refreshing flag, regardless of success or failure
			this.isRefreshing = false;
		}
	}
}

// Export singleton instance
export const tokenManager = new TokenManager();
