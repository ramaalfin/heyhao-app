/**
 * Authentication Interceptor
 * 
 * Axios interceptors for automatic token management.
 * - Attaches access token to all requests
 * - Automatically refreshes token on 401 responses
 * - Queues requests during token refresh
 * - Retries failed requests after successful refresh
 */

import { tokenManager } from "@services/auth/tokenManager";
import store from "@store/store";
import { clearAuth } from "@store/UserSlice";
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Request queue item
 */
interface QueuedRequest {
	resolve: (token: string) => void;
	reject: (error: any) => void;
}

let failedQueue: QueuedRequest[] = [];

/**
 * Processes all queued requests after token refresh
 * 
 * This function is called after a token refresh attempt (success or failure).
 * It resolves or rejects all promises that were queued during the refresh.
 * 
 * @param error - Error if refresh failed, null if successful
 * @param token - New access token if refresh successful
 */
const processQueue = (error: any, token: string | null = null): void => {
	failedQueue.forEach(promise => {
		if (error) {
			// Refresh failed - reject all queued requests
			promise.reject(error);
		} else {
			// Refresh succeeded - resolve all queued requests with new token
			promise.resolve(token!);
		}
	});

	// Clear the queue after processing
	failedQueue = [];
};

/**
 * Sets up authentication interceptors on an Axios instance
 * @param axiosInstance - Axios instance to configure
 */
export const setupAuthInterceptors = (axiosInstance: AxiosInstance): void => {
	// Request interceptor - attach access token
	axiosInstance.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			const token = tokenManager.getAccessToken();

			if (token && config.headers) {
				config.headers.Authorization = `JWT ${token}`;
			}

			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	// Response interceptor - handle 401 and refresh token
	axiosInstance.interceptors.response.use(
		(response) => response,
		async (error: AxiosError) => {
			const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

			// Jangan lakukan intercept jika route adalah auth (sign-in, sign-up, dll) yang memang me-return 401 jika gagal
			const isAuthRoute = originalRequest.url?.includes("/auth/") ?? false;

			// CRITICAL: Check if error is 401 and request hasn't been retried yet
			// The _retry flag prevents infinite loops if refresh also returns 401
			if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
				// CASE 1: Token refresh already in progress
				// Queue this request and wait for refresh to complete
				if (tokenManager.isRefreshingToken()) {
					return new Promise((resolve, reject) => {
						// Add this request to the queue
						// It will be resolved/rejected when refresh completes
						failedQueue.push({ resolve, reject });
					})
						.then(token => {
							// Refresh succeeded - update header with new token and retry
							if (originalRequest.headers) {
								originalRequest.headers.Authorization = `JWT ${token}`;
							}
							return axiosInstance(originalRequest);
						})
						.catch(err => {
							// Refresh failed - reject this request
							return Promise.reject(err);
						});
				}

				// CASE 2: First 401 response - initiate token refresh
				// Mark request as retried to prevent infinite loops
				originalRequest._retry = true;

				try {
					// Attempt to refresh token
					// This will queue any concurrent 401 responses
					const newToken = await tokenManager.refreshAccessToken();

					// Update authorization header with new token
					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `JWT ${newToken}`;
					}

					// Process all queued requests with new token
					// Each queued request will be retried with the new token
					processQueue(null, newToken);

					// Retry the original request with new token
					return axiosInstance(originalRequest);
				} catch (refreshError) {
					// Token refresh failed - clear auth state and reject all queued requests
					processQueue(refreshError, null);

					// Clear auth state (user will be logged out)
					store.dispatch(clearAuth());

					return Promise.reject(refreshError);
				}
			}

			// Not a 401 or already retried - reject the error
			return Promise.reject(error);
		}
	);
};
