# API Client Usage Guide

This directory contains the configured Axios-based API client with comprehensive authentication integration, automatic JWT token management, and token refresh capabilities.

## Overview

The `apiClient` is a pre-configured Axios instance that:
- Automatically includes JWT tokens in the `Authorization` header
- Handles token expiration (401 responses) with automatic token refresh
- Queues concurrent requests during token refresh
- Retries failed requests after successful token refresh
- Integrates with Redux for state management and AsyncStorage for persistence
- Uses base URL `/api` with 30-second timeout
- Supports all standard HTTP methods (GET, POST, PUT, DELETE)

## Basic Usage

### Import the API Client

```typescript
import apiClient from '@services/api/client/apiClient';
```

### Making Requests

#### GET Request
```typescript
// Get user profile
const response = await apiClient.get('/user/profile/123');
console.log(response.data);
```

#### POST Request
```typescript
// Sign in
const response = await apiClient.post('/auth/sign-in', {
    email: 'user@example.com',
    password: 'password123'
});
console.log(response.data);
```

#### PUT Request
```typescript
// Reset password
const response = await apiClient.put('/auth/forgot-password/token123', {
    password: 'newpassword123',
    confirmPassword: 'newpassword123'
});
console.log(response.data);
```

#### DELETE Request
```typescript
// Delete resource
const response = await apiClient.delete('/resource/123');
console.log(response.data);
```

## Authentication

### Automatic Token Injection

The API client automatically retrieves the JWT token from AsyncStorage and includes it in the `Authorization` header:

```
Authorization: JWT {token}
```

You don't need to manually add the token to requests - it's handled automatically by the request interceptor.

### Token Expiration Handling

When the backend returns a 401 Unauthorized response:
1. The token is automatically cleared from AsyncStorage
2. The Redux auth state is cleared (user and token set to null)
3. The navigation will automatically redirect to the sign-in screen (based on auth state)

## Content-Type Handling

### JSON Requests (Default)

By default, all requests use `Content-Type: application/json`:

```typescript
const response = await apiClient.post('/auth/sign-in', {
    email: 'user@example.com',
    password: 'password123'
});
```

### Multipart Form Data (File Uploads)

For file uploads, override the Content-Type header:

```typescript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('password', 'password123');
formData.append('photo', {
    uri: photoUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
});

const response = await apiClient.post('/auth/sign-up', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
```

## Error Handling

### Standard Error Handling

```typescript
try {
    const response = await apiClient.post('/auth/sign-in', credentials);
    console.log('Success:', response.data);
} catch (error) {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with error
            console.error('Error:', error.response.data.message);
        } else if (error.request) {
            // Request made but no response
            console.error('Network error');
        }
    }
}
```

### 401 Unauthorized (Token Expiration)

401 errors are handled automatically by the response interceptor. The error will still be thrown, but the auth state will be cleared before the error reaches your code:

```typescript
try {
    const response = await apiClient.get('/protected-resource');
} catch (error) {
    // Auth state is already cleared at this point
    // Navigation will automatically redirect to sign-in
    console.error('Request failed:', error);
}
```

## Configuration

The API client is configured with:

- **Base URL**: `/api`
- **Timeout**: 30000ms (30 seconds)
- **Default Headers**: `Content-Type: application/json`

To modify the configuration, edit `src/services/api/client/apiClient.ts`.

## Testing

The API client includes comprehensive tests covering:
- Base configuration
- Request interceptor (token injection)
- Response interceptor (401 handling)
- HTTP methods (GET, POST, PUT, DELETE)
- Content-Type handling

Run tests with:
```bash
npm test -- apiClient.test.ts
```

## Authentication Integration

### Architecture Overview

The authentication system follows a layered architecture:

```
UI Components (Screens)
    ↓
Auth API Client (authApi.ts)
    ↓
Axios Instance + Interceptors (authInterceptor.ts)
    ↓
Token Manager (tokenManager.ts)
    ↓
Redux Store + Redux Persist
    ↓
AsyncStorage
```

### Core Components

#### 1. Auth API Client (`authApi.ts`)

The Auth API Client provides type-safe methods for all authentication operations.

**Available Methods:**

```typescript
import { authApi } from '@services/api/auth/authApi';

// Sign up with photo upload
await authApi.signUp({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    photo: photoAsset // from react-native-image-picker
});

// Sign in
await authApi.signIn({
    email: 'john@example.com',
    password: 'password123'
});

// Logout
await authApi.logout(userId);

// Request password reset
await authApi.forgotPassword('john@example.com');

// Update password with reset token
await authApi.updatePassword(tokenId, {
    password: 'newpassword123',
    confirmPassword: 'newpassword123'
});

// Get user profile
const user = await authApi.getUserProfile(userId);
```

**Key Features:**
- Automatic Redux state updates on success
- Comprehensive error handling with user-friendly messages
- Loading state management
- Multipart/form-data support for photo uploads
- Type-safe request/response interfaces

#### 2. Token Manager (`tokenManager.ts`)

The Token Manager handles all token-related operations.

**Key Methods:**

```typescript
import { tokenManager } from '@services/auth/tokenManager';

// Get current access token
const accessToken = tokenManager.getAccessToken();

// Get current refresh token
const refreshToken = tokenManager.getRefreshToken();

// Set both tokens (usually called by Auth API Client)
tokenManager.setTokens(accessToken, refreshToken);

// Clear all tokens
tokenManager.clearTokens();

// Refresh access token (usually called by interceptor)
const newToken = await tokenManager.refreshAccessToken();

// Check if refresh is in progress
const isRefreshing = tokenManager.isRefreshingToken();
```

**Token Refresh Mechanism:**

The Token Manager implements a sophisticated refresh mechanism:

1. **Single Refresh Request**: Only one refresh request is made at a time, even with concurrent 401 responses
2. **Request Queuing**: Subsequent requests are queued and resolved when refresh completes
3. **Subscriber Pattern**: Queued requests subscribe to refresh completion
4. **Automatic Retry**: Failed requests are automatically retried with new token
5. **Failure Handling**: Clears all auth state if refresh fails

**Implementation Details:**

```typescript
// Request queue during refresh
private refreshSubscribers: Array<(token: string) => void> = [];

// Subscribe to refresh completion
subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
}

// Notify all subscribers when refresh completes
private onRefreshComplete(token: string): void {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
}
```

#### 3. Session Manager (`sessionManager.ts`)

The Session Manager handles session lifecycle and validation.

**Key Methods:**

```typescript
import { sessionManager } from '@services/auth/sessionManager';

// Check auth status on app start
const isAuthenticated = await sessionManager.checkAuthStatus();

// Check if user has valid session
const hasSession = sessionManager.hasValidSession();

// Clear all session data
sessionManager.clearSession();
```

**Usage in Navigation:**

```typescript
const Navigation = () => {
    const [isReady, setIsReady] = useState(false);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        // Check auth status on app start
        sessionManager.checkAuthStatus().then(() => {
            setIsReady(true);
        });
    }, []);

    if (!isReady) return <SplashScreen />;

    return (
        <NavigationContainer>
            {isAuthenticated ? <SignedInStack /> : <LandingScreen />}
        </NavigationContainer>
    );
};
```

#### 4. Auth Interceptor (`authInterceptor.ts`)

The Auth Interceptor automatically manages token attachment and refresh.

**Request Interceptor:**

Automatically attaches the access token to all requests:

```typescript
axiosInstance.interceptors.request.use((config) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

**Response Interceptor:**

Handles 401 responses with automatic token refresh:

```typescript
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // If already refreshing, queue this request
            if (tokenManager.isRefreshingToken()) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                });
            }

            // Mark as retried and attempt refresh
            originalRequest._retry = true;
            const newToken = await tokenManager.refreshAccessToken();
            
            // Update header and retry
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
        }

        return Promise.reject(error);
    }
);
```

**Request Queue Processing:**

During token refresh, concurrent requests are queued:

```typescript
interface QueuedRequest {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

let failedQueue: QueuedRequest[] = [];

const processQueue = (error: any, token: string | null = null): void => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token!);
        }
    });
    failedQueue = [];
};
```

### Token Lifecycle Flow

```
1. User Signs In
   ↓
2. Backend Returns: { token, refreshToken, user }
   ↓
3. Auth API Client Dispatches Redux Actions:
   - setUser(user)
   - setAuthToken(token)
   - setRefreshToken(refreshToken)
   ↓
4. Redux Persist Saves to AsyncStorage
   ↓
5. Navigation Updates to SignedInStack
   ↓
6. User Makes API Request
   ↓
7. Request Interceptor Attaches Token
   ↓
8. Backend Returns 401 (Token Expired)
   ↓
9. Response Interceptor Catches 401
   ↓
10. Token Manager Refreshes Token
    ↓
11. New Tokens Saved to Redux + AsyncStorage
    ↓
12. Original Request Retried with New Token
    ↓
13. Success Response Returned
```

### Error Handling

The authentication system includes comprehensive error handling:

**Error Types:**

```typescript
export enum ErrorType {
    NETWORK = 'NETWORK',
    VALIDATION = 'VALIDATION',
    AUTHENTICATION = 'AUTHENTICATION',
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    RATE_LIMIT = 'RATE_LIMIT',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN',
}
```

**Error Parsing:**

```typescript
import { parseApiError } from '@utils/errors/errorHandler';

try {
    await authApi.signIn(credentials);
} catch (error) {
    const parsedError = parseApiError(error);
    // parsedError contains:
    // - type: ErrorType
    // - message: User-friendly message
    // - statusCode: HTTP status code
    // - fieldErrors: Field-specific validation errors
}
```

**Error Messages:**

- **Network Error**: "Network error. Please check your connection"
- **401 Unauthorized**: "Invalid email or password"
- **404 Not Found**: "Email not found" or "Invalid or expired token"
- **409 Conflict**: "Email already exists"
- **429 Rate Limit**: "Too many requests. Please try again later"
- **500 Server Error**: "An unexpected error occurred. Please try again"

**Field-Specific Errors:**

Validation errors are mapped to specific form fields:

```typescript
// Backend response
{
    success: false,
    errors: [
        { field: 'email', message: 'Invalid email format' },
        { field: 'password', message: 'Password too short' }
    ]
}

// Parsed error
{
    type: ErrorType.VALIDATION,
    message: 'Validation failed',
    fieldErrors: {
        email: 'Invalid email format',
        password: 'Password too short'
    }
}
```

### Redux State Management

**UserSlice State:**

```typescript
interface UserState {
    user: User | null;
    authToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
```

**Actions:**

```typescript
import { 
    setUser, 
    setAuthToken, 
    setRefreshToken, 
    clearAuth,
    setLoading,
    setError 
} from '@store/UserSlice';

// Set user data
dispatch(setUser({ id, name, email, photo }));

// Set tokens
dispatch(setAuthToken(token));
dispatch(setRefreshToken(refreshToken));

// Clear all auth data
dispatch(clearAuth());

// Set loading state
dispatch(setLoading(true));

// Set error message
dispatch(setError('Error message'));
```

**Selectors:**

```typescript
import { 
    selectUser,
    selectAuthToken,
    selectRefreshToken,
    selectIsAuthenticated,
    selectIsLoading,
    selectError
} from '@store/UserSlice';

const user = useSelector(selectUser);
const isAuthenticated = useSelector(selectIsAuthenticated);
const isLoading = useSelector(selectIsLoading);
const error = useSelector(selectError);
```

**Persistence Configuration:**

```typescript
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['UserSlice'], // Persist UserSlice
};

const persistedReducer = persistReducer(persistConfig, reducers);
```

### Form Validation

**Validation Functions:**

```typescript
import { 
    validateEmail,
    validatePassword,
    validateName,
    validatePasswordMatch
} from '@utils/validators/authValidators';

// Email validation
const emailError = validateEmail('user@example.com');
// Returns null if valid, error message if invalid

// Password validation (registration)
const passwordError = validatePassword('password123');
// Returns null if >= 6 characters, error message otherwise

// Name validation
const nameError = validateName('John Doe');
// Returns null if >= 1 character, error message otherwise

// Password match validation
const matchError = validatePasswordMatch('password123', 'password123');
// Returns null if match, error message if mismatch
```

**Validation Rules:**

- **Email**: Must match email format (contains @ and domain)
- **Password (Registration)**: Minimum 6 characters
- **Password (Sign In)**: Minimum 1 character (non-empty)
- **Name**: Minimum 1 character
- **Confirm Password**: Must match password field

### Photo Upload

**Photo Uploader Service:**

```typescript
import { photoUploader } from '@services/media/photoUploader';

// Select photo from gallery or camera
const photo = await photoUploader.selectPhoto();

// Validate photo
const validation = photoUploader.validatePhoto(photo);
if (!validation.isValid) {
    console.error(validation.error);
}

// Prepare form data (used internally by Auth API Client)
const formData = photoUploader.prepareFormData(photo, userData);
```

**Photo Validation:**

- **Max Size**: 10MB
- **Allowed Types**: image/jpeg, image/png, image/jpg

### Testing

The authentication system includes comprehensive tests:

**Unit Tests:**

```bash
# Test UserSlice reducers
npm test -- UserSlice.test.ts

# Test Token Manager
npm test -- tokenManager.test.ts

# Test Error Handler
npm test -- errorHandler.test.ts

# Test Redux Persistence
npm test -- persistence.test.ts
```

**Property-Based Tests:**

Property-based tests validate universal correctness properties:

- **Form Validation Properties**: Email format, password length, name length, password match
- **Token Management Properties**: Token refresh on 401, request retry, authorization header
- **State Management Properties**: Token persistence, user data persistence, loading states
- **Navigation Properties**: Auth guards, stack reset, history isolation

**Integration Tests:**

- Complete sign-up flow (photo → form → tokens → navigation)
- Complete sign-in flow (form → tokens → navigation)
- Token refresh flow (401 → refresh → retry)
- Password reset flow (forgot → email → update → sign in)
- Logout flow (logout → clear → navigation)

### Security Considerations

**Token Storage:**

- Access tokens stored in Redux state (memory)
- Refresh tokens stored in Redux state + AsyncStorage
- AsyncStorage is encrypted on iOS (Keychain)
- AsyncStorage uses Keystore on Android

**Token Refresh:**

- Only one refresh request at a time (prevents race conditions)
- Failed refresh clears all auth state
- Refresh token revoked on logout
- Automatic logout on refresh failure

**Error Handling:**

- User-friendly error messages (no sensitive details exposed)
- Detailed errors logged for debugging
- Network errors handled gracefully
- AsyncStorage errors don't crash app

**Request Security:**

- All authenticated requests include Bearer token
- Tokens automatically attached by interceptor
- 401 responses trigger automatic refresh
- Failed requests retried with new token

### Common Patterns

**Using Auth API Client in Components:**

```typescript
import { authApi } from '@services/api/auth/authApi';
import { useSelector } from 'react-redux';
import { selectIsLoading, selectError } from '@store/UserSlice';

const SignInScreen = () => {
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    const handleSignIn = async () => {
        try {
            await authApi.signIn({ email, password });
            // Navigation handled automatically by Navigation component
        } catch (error) {
            // Error already set in Redux by authApi
            // Display error from Redux state
        }
    };

    return (
        <View>
            {error && <Text>{error}</Text>}
            <Button 
                onPress={handleSignIn} 
                disabled={isLoading}
            />
            {isLoading && <ActivityIndicator />}
        </View>
    );
};
```

**Checking Auth Status:**

```typescript
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@store/UserSlice';

const MyComponent = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (!isAuthenticated) {
        return <Text>Please sign in</Text>;
    }

    return <Text>Welcome!</Text>;
};
```

**Handling Logout:**

```typescript
import { authApi } from '@services/api/auth/authApi';
import { useSelector } from 'react-redux';
import { selectUser } from '@store/UserSlice';

const ProfileScreen = () => {
    const user = useSelector(selectUser);

    const handleLogout = async () => {
        if (user) {
            await authApi.logout(user.id);
            // Navigation handled automatically
        }
    };

    return (
        <Button title="Logout" onPress={handleLogout} />
    );
};
```

### Troubleshooting

**Token Refresh Issues:**

If token refresh fails repeatedly:
1. Check that refresh token is valid and not expired
2. Verify backend `/auth/refresh-token` endpoint is working
3. Check network connectivity
4. Review error logs for detailed error messages

**AsyncStorage Issues:**

If tokens aren't persisting:
1. Verify Redux Persist configuration includes 'UserSlice' in whitelist
2. Check AsyncStorage permissions on device
3. Clear AsyncStorage and test fresh install
4. Review persistence tests for failures

**Navigation Issues:**

If navigation doesn't update after auth state changes:
1. Verify Navigation component subscribes to `selectIsAuthenticated`
2. Check that Redux state is updating correctly
3. Ensure navigation stack reset is working
4. Review navigation tests for failures

**401 Loop:**

If requests keep getting 401 responses:
1. Check that interceptor is properly configured
2. Verify token refresh is completing successfully
3. Check that new token is being saved to Redux
4. Ensure original request is being retried with new token

### Integration with Auth Service

The API client is designed to work seamlessly with the authentication system:

1. **Token Manager**: Retrieves tokens from Redux store
2. **Redux Store**: Manages auth state with persistence
3. **Navigation**: Automatically redirects based on auth state changes
4. **Interceptors**: Handle token attachment and refresh transparently

Example auth service integration:

```typescript
import apiClient from '@services/api/client/apiClient';

export const signIn = async (data: SignInData): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/auth/sign-in', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Sign in failed');
        }
        throw error;
    }
};
```

## Requirements Validation

This API client implementation validates the following requirements:

- **3.1**: JWT tokens are automatically included in the Authorization header
- **3.3**: Authorization header is configured when token is retrieved
- **4.1**: 401 Unauthorized responses are detected
- **4.2**: Auth state is cleared on token expiration
- **4.3**: Token is removed from AsyncStorage on expiration
- **4.4**: Navigation updates automatically based on state change
- **4.5**: Response interceptor handles 401 responses globally
- **12.1**: Base URL is configured as `/api`
- **12.2**: Default Content-Type is `application/json`
- **12.3**: Content-Type can be overridden for multipart/form-data
- **12.4**: Supports GET, POST, and PUT requests
- **12.5**: Request and response transformations are handled consistently
