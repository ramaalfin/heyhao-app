# Implementation Plan: Authentication Integration

## Overview

This implementation plan breaks down the authentication integration feature into discrete, sequential tasks. The plan follows a bottom-up approach, starting with foundational types and utilities, then building core services, state management, and finally integrating with UI components. Each task builds on previous work to ensure incremental progress and early validation.

The implementation covers JWT-based authentication with automatic token refresh, secure session management using Redux Toolkit with Redux Persist, and a complete authentication flow including registration, sign-in, password reset, and logout.

## Tasks

- [x] 1. Set up TypeScript types and interfaces
  - Create `heyhao-app/src/services/api/auth/types.ts` with all authentication request/response interfaces
  - Define SignUpRequest, SignInRequest, RefreshTokenRequest, LogoutRequest, ForgotPasswordRequest, UpdatePasswordRequest interfaces
  - Define AuthResponse, TokenResponse, User, ApiResponse interfaces matching backend structure
  - Define UserState interface for Redux state
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12_

- [-] 2. Implement form validators
  - [x] 2.1 Create validation functions in `heyhao-app/src/utils/validators/authValidators.ts`
    - Implement validateEmail, validatePassword, validateName, validatePasswordMatch functions
    - Each validator returns null for valid input or error message string for invalid input
    - _Requirements: 1.3, 1.4, 1.5, 2.3, 2.4, 5.3, 6.3, 6.4_

  - [ ] 2.2 Write property test for email validation
    - **Property 2: Form Validation - Email Format**
    - **Validates: Requirements 1.4, 2.3, 5.3**

  - [ ] 2.3 Write property test for password validation (registration)
    - **Property 3: Form Validation - Password Length (Registration)**
    - **Validates: Requirements 1.5, 6.3**

  - [ ] 2.4 Write property test for password validation (sign-in)
    - **Property 4: Form Validation - Password Length (Sign In)**
    - **Validates: Requirements 2.4**

  - [ ] 2.5 Write property test for password confirmation match
    - **Property 5: Form Validation - Password Confirmation Match**
    - **Validates: Requirements 6.4**

  - [ ] 2.6 Write property test for name validation
    - **Property 1: Form Validation - Name Length**
    - **Validates: Requirements 1.3**

- [x] 3. Implement error handling utilities
  - Create `heyhao-app/src/utils/errors/errorTypes.ts` with error type definitions
  - Create `heyhao-app/src/utils/errors/errorHandler.ts` with error parsing and formatting functions
  - Implement parseApiError function to extract user-friendly messages from backend errors
  - Implement mapValidationErrors function to map backend field errors to form fields
  - Implement error classification for network, validation, auth, not found, conflict, rate limit, and server errors
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

- [x] 4. Enhance Redux UserSlice
  - [x] 4.1 Update `heyhao-app/src/store/UserSlice.ts` with new state and actions
    - Add refreshToken, isAuthenticated, isLoading, error fields to UserState
    - Update User interface with proper types (id, name, email, photo)
    - Implement setUser, setAuthToken, setRefreshToken, setLoading, setError, clearAuth actions
    - Export typed selectors: selectUser, selectAuthToken, selectRefreshToken, selectIsAuthenticated, selectIsLoading, selectError
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10, 12.11, 12.12_

  - [x] 4.2 Write unit tests for UserSlice reducers
    - Test setUser action updates user and sets isAuthenticated to true
    - Test clearAuth action clears all authentication data
    - Test setAuthToken and setRefreshToken actions
    - Test setLoading and setError actions
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 5. Update Redux store configuration for persistence
  - Update `heyhao-app/src/store/store.ts` to persist UserSlice
  - Add 'UserSlice' to whitelist in persistConfig
  - Configure serializableCheck to ignore persist actions
  - _Requirements: 8.3, 8.4, 8.9, 8.10_

- [x] 6. Implement Token Manager
  - [x] 6.1 Create `heyhao-app/src/services/auth/tokenManager.ts`
    - Implement getAccessToken, getRefreshToken methods that read from Redux store
    - Implement setTokens method that dispatches Redux actions
    - Implement clearTokens method that clears tokens from Redux
    - Implement refreshAccessToken method that calls refresh endpoint and updates tokens
    - Implement isRefreshing flag and request queue mechanism
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.8_

  - [x] 6.2 Write unit tests for Token Manager
    - Test token retrieval from Redux store
    - Test token update dispatches correct actions
    - Test clearTokens clears all tokens
    - Test request queue during refresh
    - _Requirements: 3.1, 3.4_

- [x] 7. Implement Photo Uploader service
  - Create `heyhao-app/src/services/media/photoUploader.ts`
  - Implement selectPhoto method using react-native-image-picker
  - Implement prepareFormData method to create FormData with photo and user data
  - Implement validatePhoto method to check file size and type
  - Handle camera and gallery selection
  - _Requirements: 1.6_

- [-] 8. Implement Auth API Client
  - [x] 8.1 Create `heyhao-app/src/services/api/auth/authApi.ts` extending ApiClient
    - Implement signUp method with multipart/form-data support
    - Implement signIn method with JSON payload
    - Implement logout method
    - Implement refreshToken method
    - Implement forgotPassword method
    - Implement updatePassword method
    - Each method dispatches appropriate Redux actions on success
    - Each method handles errors using errorHandler utilities
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2_

  - [ ] 8.2 Write property test for multipart form data encoding
    - **Property 6: Multipart Form Data Encoding**
    - **Validates: Requirements 1.2**

  - [ ] 8.3 Write property test for authentication success - user data storage
    - **Property 7: Authentication Success - User Data Storage**
    - **Validates: Requirements 1.7, 2.5**

  - [ ] 8.4 Write property test for authentication success - token storage
    - **Property 8: Authentication Success - Token Storage**
    - **Validates: Requirements 1.8, 2.6**

  - [ ] 8.5 Write property test for backend error mapping
    - **Property 9: Backend Error Mapping**
    - **Validates: Requirements 1.11, 2.9, 5.6, 6.8, 9.8**

  - [ ] 8.6 Write unit tests for Auth API Client
    - Test signUp sends POST to /sign-up with multipart/form-data
    - Test signIn sends POST to /sign-in with credentials
    - Test logout sends POST to /logout with userId
    - Test forgotPassword sends POST to /forgot-password with email
    - Test updatePassword sends PUT to /forgot-password/:tokenId
    - Test error handling for 400, 401, 404, 409, 429, 500 responses
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2_

- [x] 9. Checkpoint - Verify core services
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Axios interceptors for token management
  - [x] 10.1 Create `heyhao-app/src/services/api/interceptors/authInterceptor.ts`
    - Implement request interceptor to attach Authorization header with access token
    - Implement response interceptor to catch 401 errors and trigger token refresh
    - Implement request queue mechanism during token refresh
    - Implement retry logic for failed requests after successful token refresh
    - Handle token refresh failures by clearing auth state
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [ ] 10.2 Write property test for token refresh on 401
    - **Property 13: Token Refresh on 401**
    - **Validates: Requirements 3.2**

  - [ ] 10.3 Write property test for token update after refresh
    - **Property 15: Token Update After Refresh**
    - **Validates: Requirements 3.4**

  - [ ] 10.4 Write property test for request retry after token refresh
    - **Property 16: Request Retry After Token Refresh**
    - **Validates: Requirements 3.5**

  - [ ] 10.5 Write property test for authorization header attachment
    - **Property 18: Authorization Header Attachment**
    - **Validates: Requirements 3.9**

  - [ ] 10.6 Write unit tests for Axios interceptors
    - Test request interceptor attaches Bearer token
    - Test response interceptor catches 401 and triggers refresh
    - Test request queue during token refresh
    - Test retry logic after successful refresh
    - Test auth state clearing on refresh failure
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.9_

- [x] 11. Integrate interceptors with API client
  - Update `heyhao-app/src/services/api/client/client.ts` to register auth interceptors
  - Configure axios instance with interceptors on initialization
  - Ensure interceptors have access to Redux store for token management
  - _Requirements: 3.2, 3.9_

- [x] 12. Implement Session Manager
  - Create `heyhao-app/src/services/auth/sessionManager.ts`
  - Implement checkAuthStatus method to verify stored tokens on app start
  - Implement clearSession method to clear all auth data
  - Implement rehydration logic to load tokens from AsyncStorage
  - _Requirements: 8.1, 8.2, 8.5, 8.6, 8.10_

- [-] 13. Update Navigation component for auth state management
  - [x] 13.1 Enhance `heyhao-app/src/navigation/Navigation.tsx`
    - Add useSelector hook to read isAuthenticated from Redux
    - Implement initial auth check on app start using Session Manager
    - Conditionally render SignedInStack or LandingScreen based on auth state
    - Add splash screen while checking auth status
    - Implement navigation stack reset on auth state changes
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_

  - [ ] 13.2 Write property test for navigation guards - authenticated access
    - **Property 28: Navigation Guards - Authenticated Access**
    - **Validates: Requirements 10.8**

  - [ ] 13.3 Write property test for navigation guards - unauthenticated access
    - **Property 29: Navigation Guards - Unauthenticated Access**
    - **Validates: Requirements 10.7**

  - [ ] 13.4 Write property test for navigation stack reset
    - **Property 30: Navigation Stack Reset**
    - **Validates: Requirements 10.9**

  - [ ] 13.5 Write integration tests for navigation flows
    - Test navigation to SignedInStack after successful sign-in
    - Test navigation to LandingScreen after logout
    - Test navigation to LandingScreen after token refresh failure
    - _Requirements: 10.3, 10.4, 10.5, 10.6_

- [ ] 14. Update SignUpScreen
  - [x] 14.1 Enhance `heyhao-app/src/features/auth/screens/SignUpScreen.tsx`
    - Add photo state and photo picker integration
    - Add form validation using authValidators
    - Add error state for displaying validation and API errors
    - Add loading state from Redux
    - Integrate with Auth API Client signUp method
    - Display field-specific error messages
    - Disable submit button while loading or form invalid
    - Handle successful registration by navigating to SignedInStack
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12_

  - [ ] 14.2 Write property test for loading state management
    - **Property 10: Loading State Management**
    - **Validates: Requirements 1.12, 2.10, 5.7, 6.9, 11.1, 11.3**

  - [ ] 14.3 Write property test for button state during requests
    - **Property 11: Button State During Requests**
    - **Validates: Requirements 11.2, 11.4**

  - [ ] 14.4 Write unit tests for SignUpScreen
    - Test form validation before submission
    - Test photo picker integration
    - Test error display for validation errors
    - Test error display for API errors
    - Test loading state during submission
    - Test navigation after successful registration
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.11, 1.12_

- [ ] 15. Update SignInScreen
  - [x] 15.1 Enhance `heyhao-app/src/features/auth/screens/SignInScreen.tsx`
    - Add form validation using authValidators
    - Add error state for displaying validation and API errors
    - Add loading state from Redux
    - Integrate with Auth API Client signIn method
    - Display field-specific error messages
    - Disable submit button while loading or form invalid
    - Handle successful sign-in by navigating to SignedInStack
    - Wire up forgot password navigation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [ ] 15.2 Write property test for API request format - sign in
    - **Property 12: API Request Format - Sign In**
    - **Validates: Requirements 2.2**

  - [ ] 15.3 Write unit tests for SignInScreen
    - Test form validation before submission
    - Test error display for validation errors
    - Test error display for API errors (401, validation)
    - Test loading state during submission
    - Test navigation after successful sign-in
    - Test forgot password navigation
    - _Requirements: 2.3, 2.4, 2.8, 2.9, 2.10_

- [ ] 16. Update ForgotPasswordScreen
  - [x] 16.1 Enhance `heyhao-app/src/features/auth/screens/ForgotPasswordScreen.tsx`
    - Add form validation using authValidators
    - Add error state for displaying validation and API errors
    - Add loading state from Redux
    - Integrate with Auth API Client forgotPassword method
    - Display success message after email sent
    - Display field-specific error messages
    - Disable submit button while loading or form invalid
    - Provide navigation back to sign-in screen after success
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [ ] 16.2 Write property test for password reset request format
    - **Property 21: Password Reset Request Format**
    - **Validates: Requirements 5.2**

  - [ ] 16.3 Write unit tests for ForgotPasswordScreen
    - Test email validation before submission
    - Test error display for validation errors
    - Test error display for API errors (404)
    - Test success message display
    - Test loading state during submission
    - Test navigation to sign-in after success
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [ ] 17. Create UpdatePasswordScreen
  - [x] 17.1 Create `heyhao-app/src/features/auth/screens/UpdatePasswordScreen.tsx`
    - Extract tokenId from route params
    - Add password and confirmPassword form fields
    - Add form validation using authValidators
    - Add error state for displaying validation and API errors
    - Add loading state from Redux
    - Integrate with Auth API Client updatePassword method
    - Display success message after password updated
    - Display field-specific error messages
    - Disable submit button while loading or form invalid
    - Navigate to sign-in screen after successful password update
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_

  - [ ] 17.2 Write property test for password update request format
    - **Property 22: Password Update Request Format**
    - **Validates: Requirements 6.2**

  - [ ] 17.3 Write unit tests for UpdatePasswordScreen
    - Test password validation before submission
    - Test password confirmation match validation
    - Test error display for validation errors
    - Test error display for API errors (404, validation)
    - Test success message display
    - Test loading state during submission
    - Test navigation to sign-in after success
    - _Requirements: 6.3, 6.4, 6.5, 6.7, 6.8, 6.9_

- [x] 18. Add UpdatePasswordScreen to navigation
  - Update `heyhao-app/src/navigation/stacks/SignedOutStack.tsx` to include UpdatePasswordScreen route
  - Define route params type for tokenId
  - Configure header options for UpdatePasswordScreen
  - _Requirements: 6.6_

- [ ] 19. Implement logout functionality
  - [x] 19.1 Add logout method to Auth API Client
    - Implement logout method that calls /logout endpoint
    - Clear tokens and user data from Redux on success or failure
    - Navigate to LandingScreen after logout
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [ ] 19.2 Write property test for logout request format
    - **Property 19: Logout Request Format**
    - **Validates: Requirements 4.2**

  - [ ] 19.3 Write property test for logout cleanup
    - **Property 20: Logout Cleanup**
    - **Validates: Requirements 4.3, 4.4, 4.6**

  - [ ] 19.4 Write unit tests for logout functionality
    - Test logout sends POST to /logout with userId
    - Test tokens cleared from Redux after logout
    - Test user data cleared from Redux after logout
    - Test navigation to LandingScreen after logout
    - Test cleanup even if logout request fails
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 20. Checkpoint - Verify UI integration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 21. Add logout button to authenticated screens
  - Add logout button to appropriate screens (e.g., ProfileScreen, SettingsScreen)
  - Wire up logout button to Auth API Client logout method
  - Display confirmation dialog before logout (optional enhancement)
  - _Requirements: 4.1_

- [ ] 22. Implement token persistence and rehydration
  - [x] 22.1 Verify Redux Persist configuration
    - Ensure tokens are persisted to AsyncStorage
    - Ensure user data is persisted to AsyncStorage
    - Test rehydration on app restart
    - _Requirements: 8.3, 8.4, 8.5, 8.6_

  - [ ] 22.2 Write property test for token persistence
    - **Property 23: Token Persistence**
    - **Validates: Requirements 8.3**

  - [ ] 22.3 Write property test for user data persistence
    - **Property 24: User Data Persistence**
    - **Validates: Requirements 8.4**

  - [ ] 22.4 Write property test for AsyncStorage error resilience
    - **Property 25: AsyncStorage Error Resilience**
    - **Validates: Requirements 8.10**

  - [ ] 22.5 Write integration tests for persistence
    - Test tokens persist across app restarts
    - Test user data persists across app restarts
    - Test navigation to SignedInStack when valid tokens exist on startup
    - Test navigation to LandingScreen when no tokens exist on startup
    - _Requirements: 8.5, 8.6, 8.7, 8.8_

- [ ] 23. Implement comprehensive error handling
  - [x] 23.1 Add error handling for all API methods
    - Handle network errors with user-friendly messages
    - Handle validation errors with field-specific messages
    - Handle authentication errors (401)
    - Handle not found errors (404)
    - Handle conflict errors (409)
    - Handle rate limiting errors (429)
    - Handle server errors (500)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [ ] 23.2 Write property test for error logging
    - **Property 26: Error Logging**
    - **Validates: Requirements 9.9**

  - [ ] 23.3 Write property test for error message sanitization
    - **Property 27: Error Message Sanitization**
    - **Validates: Requirements 9.10**

  - [ ] 23.4 Write unit tests for error handling
    - Test network error handling
    - Test validation error mapping
    - Test authentication error handling
    - Test not found error handling
    - Test conflict error handling
    - Test rate limiting error handling
    - Test server error handling
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 24. Add loading indicators and user feedback
  - [x] 24.1 Implement loading indicators on all auth screens
    - Add loading spinner during API requests
    - Disable form inputs during loading
    - Disable submit buttons during loading
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 24.2 Write property test for request queue processing
    - **Property 32: Request Queue Processing**
    - **Validates: Requirements 11.8**

  - [ ] 24.3 Write property test for form submission prevention
    - **Property 33: Form Submission Prevention**
    - **Validates: Requirements 11.9**

  - [ ] 24.4 Write property test for validation error feedback
    - **Property 34: Validation Error Feedback**
    - **Validates: Requirements 11.10**

  - [ ] 24.5 Write unit tests for loading states
    - Test loading indicator visibility during requests
    - Test button disabled state during requests
    - Test form input disabled state during requests
    - Test queued requests during token refresh
    - Test immediate validation error display
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.9, 11.10_

- [ ] 25. Integration testing
  - [ ] 25.1 Write integration test for complete sign-up flow
    - Test photo selection → form submission → token storage → navigation
    - _Requirements: 1.1, 1.6, 1.7, 1.8, 1.9_

  - [ ] 25.2 Write integration test for complete sign-in flow
    - Test form submission → token storage → navigation
    - _Requirements: 2.1, 2.5, 2.6, 2.7_

  - [ ] 25.3 Write integration test for token refresh flow
    - Test API request → 401 response → token refresh → request retry
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [ ] 25.4 Write integration test for password reset flow
    - Test forgot password → email sent → update password → sign in
    - _Requirements: 5.1, 5.4, 6.1, 6.5, 6.6_

  - [ ] 25.5 Write integration test for logout flow
    - Test logout → clear data → navigation
    - _Requirements: 4.1, 4.3, 4.4, 4.5_

  - [ ] 25.6 Write property test for token refresh serialization
    - **Property 17: Token Refresh Serialization**
    - **Validates: Requirements 3.8, 11.6**

  - [ ] 25.7 Write property test for navigation history isolation
    - **Property 31: Navigation History Isolation**
    - **Validates: Requirements 10.10**

- [ ] 26. Final checkpoint - Comprehensive testing
  - Ensure all tests pass, ask the user if questions arise.

- [x] 27. Documentation
  - Update `heyhao-app/src/services/api/client/README.md` with authentication integration details
  - Document Auth API Client methods and usage examples
  - Document Token Manager and Session Manager usage
  - Document error handling patterns
  - Document testing approach and property-based tests
  - Add inline code comments for complex logic (token refresh, request queue)

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end flows
- The implementation follows a bottom-up approach: types → utilities → services → state → UI
- All authentication screens are enhanced versions of existing screens, not complete rewrites
- Token refresh mechanism is transparent to users and handles concurrent requests
- Redux Persist ensures session persistence across app restarts
- Comprehensive error handling provides user-friendly messages for all error scenarios
