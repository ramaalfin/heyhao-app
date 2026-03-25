import UserSliceReducer, {
    User,
    UserState,
    setUser,
    setAuthToken,
    setRefreshToken,
    setLoading,
    setError,
    clearAuth,
} from '../UserSlice';

describe('UserSlice', () => {
    const initialState: UserState = {
        user: null,
        authToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    };

    const mockUser: User = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        photo: 'profile.jpg',
    };

    describe('setUser', () => {
        it('should update user and set isAuthenticated to true', () => {
            const state = UserSliceReducer(initialState, setUser(mockUser));

            expect(state.user).toEqual(mockUser);
            expect(state.isAuthenticated).toBe(true);
            expect(state.error).toBeNull();
        });

        it('should clear error when setting user', () => {
            const stateWithError: UserState = {
                ...initialState,
                error: 'Previous error',
            };

            const state = UserSliceReducer(stateWithError, setUser(mockUser));

            expect(state.error).toBeNull();
        });

        it('should preserve other state fields when setting user', () => {
            const stateWithTokens: UserState = {
                ...initialState,
                authToken: 'access-token',
                refreshToken: 'refresh-token',
                isLoading: true,
            };

            const state = UserSliceReducer(stateWithTokens, setUser(mockUser));

            expect(state.authToken).toBe('access-token');
            expect(state.refreshToken).toBe('refresh-token');
            expect(state.isLoading).toBe(true);
        });
    });

    describe('setAuthToken', () => {
        it('should update authToken', () => {
            const token = 'new-access-token';
            const state = UserSliceReducer(initialState, setAuthToken(token));

            expect(state.authToken).toBe(token);
        });

        it('should preserve other state fields when setting authToken', () => {
            const stateWithData: UserState = {
                ...initialState,
                user: mockUser,
                refreshToken: 'refresh-token',
                isAuthenticated: true,
            };

            const state = UserSliceReducer(stateWithData, setAuthToken('new-token'));

            expect(state.user).toEqual(mockUser);
            expect(state.refreshToken).toBe('refresh-token');
            expect(state.isAuthenticated).toBe(true);
        });

        it('should replace existing authToken', () => {
            const stateWithToken: UserState = {
                ...initialState,
                authToken: 'old-token',
            };

            const state = UserSliceReducer(stateWithToken, setAuthToken('new-token'));

            expect(state.authToken).toBe('new-token');
        });
    });

    describe('setRefreshToken', () => {
        it('should update refreshToken', () => {
            const token = 'new-refresh-token';
            const state = UserSliceReducer(initialState, setRefreshToken(token));

            expect(state.refreshToken).toBe(token);
        });

        it('should preserve other state fields when setting refreshToken', () => {
            const stateWithData: UserState = {
                ...initialState,
                user: mockUser,
                authToken: 'access-token',
                isAuthenticated: true,
            };

            const state = UserSliceReducer(stateWithData, setRefreshToken('new-refresh-token'));

            expect(state.user).toEqual(mockUser);
            expect(state.authToken).toBe('access-token');
            expect(state.isAuthenticated).toBe(true);
        });

        it('should replace existing refreshToken', () => {
            const stateWithToken: UserState = {
                ...initialState,
                refreshToken: 'old-refresh-token',
            };

            const state = UserSliceReducer(stateWithToken, setRefreshToken('new-refresh-token'));

            expect(state.refreshToken).toBe('new-refresh-token');
        });
    });

    describe('setLoading', () => {
        it('should set isLoading to true', () => {
            const state = UserSliceReducer(initialState, setLoading(true));

            expect(state.isLoading).toBe(true);
        });

        it('should set isLoading to false', () => {
            const stateWithLoading: UserState = {
                ...initialState,
                isLoading: true,
            };

            const state = UserSliceReducer(stateWithLoading, setLoading(false));

            expect(state.isLoading).toBe(false);
        });

        it('should preserve other state fields when setting loading', () => {
            const stateWithData: UserState = {
                ...initialState,
                user: mockUser,
                authToken: 'access-token',
                isAuthenticated: true,
                error: 'Some error',
            };

            const state = UserSliceReducer(stateWithData, setLoading(true));

            expect(state.user).toEqual(mockUser);
            expect(state.authToken).toBe('access-token');
            expect(state.isAuthenticated).toBe(true);
            expect(state.error).toBe('Some error');
        });
    });

    describe('setError', () => {
        it('should set error message', () => {
            const errorMessage = 'Authentication failed';
            const state = UserSliceReducer(initialState, setError(errorMessage));

            expect(state.error).toBe(errorMessage);
        });

        it('should set isLoading to false when setting error', () => {
            const stateWithLoading: UserState = {
                ...initialState,
                isLoading: true,
            };

            const state = UserSliceReducer(stateWithLoading, setError('Error occurred'));

            expect(state.isLoading).toBe(false);
            expect(state.error).toBe('Error occurred');
        });

        it('should clear error when setting null', () => {
            const stateWithError: UserState = {
                ...initialState,
                error: 'Previous error',
            };

            const state = UserSliceReducer(stateWithError, setError(null));

            expect(state.error).toBeNull();
        });

        it('should preserve other state fields when setting error', () => {
            const stateWithData: UserState = {
                ...initialState,
                user: mockUser,
                authToken: 'access-token',
                isAuthenticated: true,
            };

            const state = UserSliceReducer(stateWithData, setError('Error message'));

            expect(state.user).toEqual(mockUser);
            expect(state.authToken).toBe('access-token');
            expect(state.isAuthenticated).toBe(true);
        });
    });

    describe('clearAuth', () => {
        it('should clear all authentication data', () => {
            const authenticatedState: UserState = {
                user: mockUser,
                authToken: 'access-token',
                refreshToken: 'refresh-token',
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

            const state = UserSliceReducer(authenticatedState, clearAuth());

            expect(state.user).toBeNull();
            expect(state.authToken).toBeNull();
            expect(state.refreshToken).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });

        it('should clear error when clearing auth', () => {
            const stateWithError: UserState = {
                ...initialState,
                user: mockUser,
                authToken: 'access-token',
                error: 'Some error',
            };

            const state = UserSliceReducer(stateWithError, clearAuth());

            expect(state.error).toBeNull();
        });

        it('should reset loading state when clearing auth', () => {
            const stateWithLoading: UserState = {
                ...initialState,
                user: mockUser,
                isLoading: true,
            };

            const state = UserSliceReducer(stateWithLoading, clearAuth());

            expect(state.isLoading).toBe(false);
        });

        it('should return to initial state when clearing auth', () => {
            const authenticatedState: UserState = {
                user: mockUser,
                authToken: 'access-token',
                refreshToken: 'refresh-token',
                isAuthenticated: true,
                isLoading: true,
                error: 'Some error',
            };

            const state = UserSliceReducer(authenticatedState, clearAuth());

            expect(state).toEqual(initialState);
        });
    });

    describe('multiple actions sequence', () => {
        it('should handle authentication flow correctly', () => {
            let state = initialState;

            // Start loading
            state = UserSliceReducer(state, setLoading(true));
            expect(state.isLoading).toBe(true);

            // Set user
            state = UserSliceReducer(state, setUser(mockUser));
            expect(state.user).toEqual(mockUser);
            expect(state.isAuthenticated).toBe(true);

            // Set tokens
            state = UserSliceReducer(state, setAuthToken('access-token'));
            state = UserSliceReducer(state, setRefreshToken('refresh-token'));
            expect(state.authToken).toBe('access-token');
            expect(state.refreshToken).toBe('refresh-token');

            // Stop loading
            state = UserSliceReducer(state, setLoading(false));
            expect(state.isLoading).toBe(false);

            // Verify final state
            expect(state).toEqual({
                user: mockUser,
                authToken: 'access-token',
                refreshToken: 'refresh-token',
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        });

        it('should handle error flow correctly', () => {
            let state = initialState;

            // Start loading
            state = UserSliceReducer(state, setLoading(true));
            expect(state.isLoading).toBe(true);

            // Set error (should also stop loading)
            state = UserSliceReducer(state, setError('Authentication failed'));
            expect(state.error).toBe('Authentication failed');
            expect(state.isLoading).toBe(false);
            expect(state.isAuthenticated).toBe(false);
        });

        it('should handle logout flow correctly', () => {
            let state: UserState = {
                user: mockUser,
                authToken: 'access-token',
                refreshToken: 'refresh-token',
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

            // Clear auth
            state = UserSliceReducer(state, clearAuth());

            // Verify all data is cleared
            expect(state).toEqual(initialState);
        });
    });
});
