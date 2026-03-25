import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * User data structure
 */
export interface User {
	id: string;
	name: string;
	email: string;
	photo: string;
	photo_url?: string; // Optional for backward compatibility
}

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

const initialState: UserState = {
	user: null,
	authToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

export const UserSlice = createSlice({
	name: "UserSlice",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.error = null;
		},
		setAuthToken: (state, action: PayloadAction<string>) => {
			state.authToken = action.payload;
		},
		setRefreshToken: (state, action: PayloadAction<string>) => {
			state.refreshToken = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
			state.isLoading = false;
		},
		clearAuth: (state) => {
			state.user = null;
			state.authToken = null;
			state.refreshToken = null;
			state.isAuthenticated = false;
			state.isLoading = false;
			state.error = null;
		},
	},
});

export const {
	setUser,
	setAuthToken,
	setRefreshToken,
	setLoading,
	setError,
	clearAuth,
} = UserSlice.actions;

// Selectors
export const selectUser = (state: { UserSlice: UserState }) => state.UserSlice.user;
export const selectAuthToken = (state: { UserSlice: UserState }) => state.UserSlice.authToken;
export const selectRefreshToken = (state: { UserSlice: UserState }) => state.UserSlice.refreshToken;
export const selectIsAuthenticated = (state: { UserSlice: UserState }) => state.UserSlice.isAuthenticated;
export const selectIsLoading = (state: { UserSlice: UserState }) => state.UserSlice.isLoading;
export const selectError = (state: { UserSlice: UserState }) => state.UserSlice.error;

export default UserSlice.reducer;

