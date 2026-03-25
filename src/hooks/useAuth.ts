/**
 * useAuth Hook
 * 
 * Custom hook for authentication operations.
 * Provides easy access to auth API methods and auth state.
 */

import { useMemo } from "react";

import { ApiClient } from "@services/api/client/apiClient";
import { useAppSelector } from "@store/hooks";
import {
	selectError,
	selectIsAuthenticated,
	selectIsLoading,
	selectUser,
} from "@store/UserSlice";

/**
 * Authentication hook
 * @returns Auth API client and auth state
 */
export const useAuth = () => {
	const user = useAppSelector(selectUser);
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const isLoading = useAppSelector(selectIsLoading);
	const error = useAppSelector(selectError);

	// Create API client instance (memoized)
	const apiClient = useMemo(() => new ApiClient(), []);

	// Memoize auth methods to prevent infinite loops in useEffect
	const authMethods = useMemo(() => ({
		signUp: apiClient.auth.signUp.bind(apiClient.auth),
		signIn: apiClient.auth.signIn.bind(apiClient.auth),
		logout: apiClient.auth.logout.bind(apiClient.auth),
		forgotPassword: apiClient.auth.forgotPassword.bind(apiClient.auth),
		updatePassword: apiClient.auth.updatePassword.bind(apiClient.auth),
		getUserProfile: apiClient.auth.getUserProfile.bind(apiClient.auth),
	}), [apiClient]);

	return {
		// Auth API methods
		...authMethods,

		// Auth state
		user,
		isAuthenticated,
		isLoading,
		error,
	};
};

export default useAuth;
