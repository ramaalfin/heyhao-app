/**
 * Session Manager
 * 
 * Manages user session lifecycle including initialization, validation, and cleanup.
 * Handles token rehydration from AsyncStorage on app start.
 */

import store from "@store/store";
import {
	clearAuth,
	selectAuthToken,
	selectIsAuthenticated,
	selectRefreshToken,
	setLoading,
} from "@store/UserSlice";

/**
 * Session Manager class
 */
class SessionManager {
	/**
	 * Checks authentication status on app start
	 * Verifies that stored tokens exist and are valid
	 * @returns Promise resolving to authentication status
	 */
	async checkAuthStatus(): Promise<boolean> {
		try {
			store.dispatch(setLoading(false));

			const state = store.getState();
			const authToken = selectAuthToken(state);
			const refreshToken = selectRefreshToken(state);
			const isAuthenticated = selectIsAuthenticated(state);

			// If no tokens, user is not authenticated
			if (!authToken || !refreshToken) {
				return false;
			}

			// Tokens exist and isAuthenticated flag is set
			return isAuthenticated;
		} catch (error) {
			console.warn("Error checking auth status:", error);
			return false;
		}
	}

	/**
	 * Clears all session data
	 * Removes tokens and user data from Redux and AsyncStorage
	 */
	clearSession(): void {
		store.dispatch(clearAuth());
	}

	/**
	 * Checks if user has valid session
	 * @returns True if user is authenticated with valid tokens
	 */
	hasValidSession(): boolean {
		const state = store.getState();
		return selectIsAuthenticated(state);
	}
}

// Export singleton instance
export const sessionManager = new SessionManager();
