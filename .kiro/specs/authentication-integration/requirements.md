# Requirements Document

## Introduction

This document specifies the requirements for integrating comprehensive authentication functionality between the heyhao-app (React Native mobile application) and heyhao-be (Express.js backend). The integration includes user registration with photo upload, sign-in, token-based authentication with automatic refresh, password reset flow, logout, and secure session management using Redux Toolkit with Redux Persist.

## Glossary

- **Auth_API_Client**: The API client service responsible for making HTTP requests to authentication endpoints
- **Token_Manager**: The service responsible for managing access tokens and refresh tokens, including automatic refresh logic
- **User_Store**: The Redux store slice that manages user data and authentication state
- **Navigation_Controller**: The navigation system that controls routing between authenticated and unauthenticated screens
- **Form_Validator**: The validation service that ensures user input matches backend schema requirements
- **Photo_Uploader**: The service that handles image selection and multipart/form-data upload for user photos
- **Session_Manager**: The service that manages user sessions, including token storage and cleanup
- **Backend_API**: The Express.js backend server providing authentication endpoints
- **Access_Token**: Short-lived JWT token used for authenticating API requests (expires based on backend configuration)
- **Refresh_Token**: Long-lived JWT token used to obtain new access tokens without re-authentication
- **Token_Interceptor**: Axios interceptor that automatically attaches tokens to requests and handles token refresh on 401 errors

## Requirements

### Requirement 1: User Registration with Photo Upload

**User Story:** As a new user, I want to register an account with my name, email, password, and profile photo, so that I can access the application with a personalized profile.

#### Acceptance Criteria

1. THE Auth_API_Client SHALL provide a signUp method that accepts name, email, password, and photo file
2. WHEN the user submits valid registration data, THE Auth_API_Client SHALL send a multipart/form-data POST request to /sign-up endpoint
3. THE Form_Validator SHALL validate that name is at least 1 character long
4. THE Form_Validator SHALL validate that email is a valid email format
5. THE Form_Validator SHALL validate that password is at least 6 characters long
6. THE Photo_Uploader SHALL allow users to select an image from their device gallery or camera
7. WHEN the Backend_API returns success, THE User_Store SHALL store the user data (id, name, email, photo)
8. WHEN the Backend_API returns success, THE Session_Manager SHALL store both access token and refresh token
9. WHEN registration is successful, THE Navigation_Controller SHALL navigate to the authenticated stack
10. IF the Backend_API returns a 409 Conflict error, THEN THE Auth_API_Client SHALL display "Email already exists" message
11. IF the Backend_API returns validation errors, THEN THE Form_Validator SHALL display field-specific error messages
12. WHILE the registration request is pending, THE SignUpScreen SHALL display a loading indicator

### Requirement 2: User Sign In

**User Story:** As a registered user, I want to sign in with my email and password, so that I can access my account and use the application.

#### Acceptance Criteria

1. THE Auth_API_Client SHALL provide a signIn method that accepts email and password
2. WHEN the user submits valid credentials, THE Auth_API_Client SHALL send a POST request to /sign-in endpoint
3. THE Form_Validator SHALL validate that email is a valid email format
4. THE Form_Validator SHALL validate that password is at least 1 character long
5. WHEN the Backend_API returns success, THE User_Store SHALL store the user data (id, name, email, photo)
6. WHEN the Backend_API returns success, THE Session_Manager SHALL store both access token and refresh token
7. WHEN sign-in is successful, THE Navigation_Controller SHALL navigate to the authenticated stack
8. IF the Backend_API returns a 401 Unauthorized error, THEN THE Auth_API_Client SHALL display "Invalid email or password" message
9. IF the Backend_API returns validation errors, THEN THE Form_Validator SHALL display field-specific error messages
10. WHILE the sign-in request is pending, THE SignInScreen SHALL display a loading indicator

### Requirement 3: Automatic Token Refresh

**User Story:** As an authenticated user, I want my session to remain active without manual re-authentication, so that I can use the application seamlessly without interruptions.

#### Acceptance Criteria

1. THE Token_Manager SHALL provide a refreshToken method that accepts a refresh token
2. WHEN an API request receives a 401 Unauthorized response, THE Token_Interceptor SHALL automatically attempt to refresh the access token
3. THE Token_Interceptor SHALL send a POST request to /refresh-token endpoint with the current refresh token
4. WHEN the Backend_API returns new tokens, THE Session_Manager SHALL update both access token and refresh token in storage
5. WHEN token refresh is successful, THE Token_Interceptor SHALL retry the original failed request with the new access token
6. IF token refresh fails with 401 error, THEN THE Session_Manager SHALL clear all stored tokens and user data
7. IF token refresh fails, THEN THE Navigation_Controller SHALL navigate to the unauthenticated stack
8. THE Token_Interceptor SHALL prevent multiple simultaneous token refresh requests by queuing subsequent requests
9. THE Token_Interceptor SHALL attach the current access token to all authenticated API requests via Authorization header
10. WHEN the application starts, THE Session_Manager SHALL load persisted tokens from AsyncStorage

### Requirement 4: User Logout

**User Story:** As an authenticated user, I want to log out of my account, so that I can secure my session and switch accounts if needed.

#### Acceptance Criteria

1. THE Auth_API_Client SHALL provide a logout method that accepts userId
2. WHEN the user initiates logout, THE Auth_API_Client SHALL send a POST request to /logout endpoint with userId
3. WHEN the Backend_API confirms logout, THE Session_Manager SHALL clear all stored tokens from memory and AsyncStorage
4. WHEN the Backend_API confirms logout, THE User_Store SHALL clear all user data from Redux state
5. WHEN logout is complete, THE Navigation_Controller SHALL navigate to the unauthenticated stack
6. IF the logout request fails, THEN THE Session_Manager SHALL still clear local tokens and user data
7. IF the logout request fails, THEN THE Navigation_Controller SHALL still navigate to the unauthenticated stack
8. THE Session_Manager SHALL revoke the refresh token on the backend to prevent reuse

### Requirement 5: Password Reset Request

**User Story:** As a user who forgot my password, I want to request a password reset email, so that I can regain access to my account.

#### Acceptance Criteria

1. THE Auth_API_Client SHALL provide a forgotPassword method that accepts an email address
2. WHEN the user submits a valid email, THE Auth_API_Client SHALL send a POST request to /forgot-password endpoint
3. THE Form_Validator SHALL validate that email is a valid email format
4. WHEN the Backend_API returns success, THE ForgotPasswordScreen SHALL display "Password reset email sent successfully" message
5. IF the Backend_API returns a 404 Not Found error, THEN THE Auth_API_Client SHALL display "Email not found" message
6. IF the Backend_API returns validation errors, THEN THE Form_Validator SHALL display field-specific error messages
7. WHILE the request is pending, THE ForgotPasswordScreen SHALL display a loading indicator
8. WHEN the request is successful, THE ForgotPasswordScreen SHALL provide navigation back to sign-in screen

### Requirement 6: Password Reset Completion

**User Story:** As a user who requested a password reset, I want to set a new password using the reset token, so that I can regain access to my account with a new password.

#### Acceptance Criteria

1. THE Auth_API_Client SHALL provide an updatePassword method that accepts tokenId, password, and confirmPassword
2. WHEN the user submits valid password data, THE Auth_API_Client SHALL send a PUT request to /forgot-password/:tokenId endpoint
3. THE Form_Validator SHALL validate that password is at least 6 characters long
4. THE Form_Validator SHALL validate that confirmPassword matches password
5. WHEN the Backend_API returns success, THE UpdatePasswordScreen SHALL display "Password updated successfully" message
6. WHEN password update is successful, THE Navigation_Controller SHALL navigate to the sign-in screen
7. IF the Backend_API returns a 404 Not Found error, THEN THE Auth_API_Client SHALL display "Invalid or expired token" message
8. IF the Backend_API returns validation errors, THEN THE Form_Validator SHALL display field-specific error messages
9. WHILE the request is pending, THE UpdatePasswordScreen SHALL display a loading indicator

### Requirement 7: Type-Safe API Request and Response Handling

**User Story:** As a developer, I want type-safe API methods with proper TypeScript interfaces, so that I can prevent runtime errors and improve code maintainability.

#### Acceptance Criteria

1. THE Auth_API_Client SHALL define TypeScript interfaces for all authentication request payloads
2. THE Auth_API_Client SHALL define TypeScript interfaces for all authentication response data structures
3. THE Auth_API_Client SHALL define a SignUpRequest interface with name, email, password, and photo properties
4. THE Auth_API_Client SHALL define a SignInRequest interface with email and password properties
5. THE Auth_API_Client SHALL define a RefreshTokenRequest interface with refreshToken property
6. THE Auth_API_Client SHALL define a LogoutRequest interface with userId property
7. THE Auth_API_Client SHALL define a ForgotPasswordRequest interface with email property
8. THE Auth_API_Client SHALL define an UpdatePasswordRequest interface with password and confirmPassword properties
9. THE Auth_API_Client SHALL define an AuthResponse interface matching the backend response structure with success, message, and data properties
10. THE Auth_API_Client SHALL define a UserData interface with id, name, email, photo, token, and refreshToken properties
11. THE Auth_API_Client SHALL use generic types to ensure type safety for all API method return values
12. THE User_Store SHALL use typed interfaces for user state to ensure type safety in Redux

### Requirement 8: Secure Token Storage and Persistence

**User Story:** As a user, I want my authentication session to persist across app restarts, so that I don't have to sign in every time I open the application.

#### Acceptance Criteria

1. THE Session_Manager SHALL store access tokens in Redux state for runtime access
2. THE Session_Manager SHALL store refresh tokens in Redux state for runtime access
3. THE Session_Manager SHALL persist tokens to AsyncStorage using Redux Persist
4. THE Session_Manager SHALL persist user data to AsyncStorage using Redux Persist
5. WHEN the application starts, THE Session_Manager SHALL rehydrate tokens from AsyncStorage
6. WHEN the application starts, THE Session_Manager SHALL rehydrate user data from AsyncStorage
7. IF valid tokens exist on startup, THEN THE Navigation_Controller SHALL navigate to the authenticated stack
8. IF no valid tokens exist on startup, THEN THE Navigation_Controller SHALL navigate to the landing screen
9. THE Session_Manager SHALL configure Redux Persist to whitelist UserSlice for persistence
10. THE Session_Manager SHALL handle AsyncStorage errors gracefully without crashing the application

### Requirement 9: Error Handling and User Feedback

**User Story:** As a user, I want clear and helpful error messages when authentication fails, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN the Backend_API returns a 400 Bad Request error, THE Auth_API_Client SHALL extract and display validation error messages
2. WHEN the Backend_API returns a 401 Unauthorized error, THE Auth_API_Client SHALL display authentication failure messages
3. WHEN the Backend_API returns a 404 Not Found error, THE Auth_API_Client SHALL display resource not found messages
4. WHEN the Backend_API returns a 409 Conflict error, THE Auth_API_Client SHALL display conflict messages
5. WHEN the Backend_API returns a 500 Internal Server Error, THE Auth_API_Client SHALL display "An unexpected error occurred. Please try again" message
6. WHEN a network error occurs, THE Auth_API_Client SHALL display "Network error. Please check your connection" message
7. WHEN a timeout error occurs, THE Auth_API_Client SHALL display "Request timeout. Please try again" message
8. THE Auth_API_Client SHALL parse backend validation errors and map them to specific form fields
9. THE Auth_API_Client SHALL log detailed error information for debugging purposes
10. THE Auth_API_Client SHALL provide user-friendly error messages that do not expose sensitive technical details

### Requirement 10: Navigation Flow Management

**User Story:** As a user, I want the application to automatically show the correct screens based on my authentication status, so that I have a seamless experience.

#### Acceptance Criteria

1. WHEN the application starts with no stored tokens, THE Navigation_Controller SHALL display the LandingScreen
2. WHEN the application starts with valid stored tokens, THE Navigation_Controller SHALL display the SignedInStack
3. WHEN sign-up is successful, THE Navigation_Controller SHALL navigate from SignedOutStack to SignedInStack
4. WHEN sign-in is successful, THE Navigation_Controller SHALL navigate from SignedOutStack to SignedInStack
5. WHEN logout is complete, THE Navigation_Controller SHALL navigate from SignedInStack to LandingScreen
6. WHEN token refresh fails, THE Navigation_Controller SHALL navigate from SignedInStack to LandingScreen
7. THE Navigation_Controller SHALL prevent navigation back to authentication screens when user is authenticated
8. THE Navigation_Controller SHALL prevent navigation to authenticated screens when user is not authenticated
9. THE Navigation_Controller SHALL reset navigation stack when transitioning between authenticated and unauthenticated states
10. THE Navigation_Controller SHALL maintain navigation history within authenticated and unauthenticated stacks independently

### Requirement 11: Loading States and User Experience

**User Story:** As a user, I want visual feedback during authentication operations, so that I know the application is processing my request.

#### Acceptance Criteria

1. WHEN an authentication request is initiated, THE authentication screen SHALL display a loading indicator
2. WHEN an authentication request is initiated, THE authentication screen SHALL disable form submission buttons
3. WHEN an authentication request completes, THE authentication screen SHALL hide the loading indicator
4. WHEN an authentication request completes, THE authentication screen SHALL re-enable form submission buttons
5. THE loading indicator SHALL be visually distinct and clearly indicate processing state
6. WHILE token refresh is in progress, THE application SHALL queue subsequent API requests
7. WHILE token refresh is in progress, THE application SHALL not display loading indicators for queued requests
8. WHEN token refresh completes, THE application SHALL process queued requests automatically
9. THE authentication screens SHALL prevent multiple simultaneous submissions of the same form
10. THE authentication screens SHALL provide immediate visual feedback for form validation errors

### Requirement 12: Redux State Management Integration

**User Story:** As a developer, I want centralized state management for authentication data, so that all components can access user information consistently.

#### Acceptance Criteria

1. THE User_Store SHALL provide a setUser action to update user data
2. THE User_Store SHALL provide a setAuthToken action to update the access token
3. THE User_Store SHALL provide a setRefreshToken action to update the refresh token
4. THE User_Store SHALL provide a clearAuth action to clear all authentication data
5. THE User_Store SHALL define a UserState interface with user, authToken, and refreshToken properties
6. THE User_Store SHALL initialize state with null values for user, authToken, and refreshToken
7. THE User_Store SHALL export typed selectors for accessing user data
8. THE User_Store SHALL export typed selectors for accessing authentication tokens
9. WHEN authentication succeeds, THE Auth_API_Client SHALL dispatch setUser and token actions
10. WHEN logout occurs, THE Auth_API_Client SHALL dispatch clearAuth action
11. THE User_Store SHALL be compatible with Redux Persist for state persistence
12. THE User_Store SHALL use TypeScript for type safety across all actions and state

