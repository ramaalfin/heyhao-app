# HeyHao App - Architecture Documentation

## 📋 Overview

HeyHao is a **React Native mobile application** built with a **Feature-Driven Architecture** using TypeScript, Redux Toolkit, React Navigation, and NativeWind (TailwindCSS). The app is designed for scalability, maintainability, and strict type safety.

**App Version**: 3.0.1  
**React Native**: 0.78.0  
**React**: 19.0.0  
**Node**: >=18

---

## 🏗️ Architecture Principles

### Feature-Driven Architecture
Code is organized by **business domain** rather than technical layers. Each feature is self-contained with its own screens, components, and logic.

### Type Safety
Full TypeScript implementation with strict type checking for:
- Redux state and actions
- Navigation parameters
- Component props
- API responses

### Separation of Concerns
- **Navigation**: Handles routing and screen transitions
- **Features**: Domain-specific screens and logic
- **Components**: Reusable UI elements
- **Store**: Centralized state management
- **Services**: API communication and external integrations
- **Hooks**: Encapsulated business logic
- **Utils**: Constants and helper functions

---

## 📁 Project Structure

```
src/
├── assets/                 # Static resources
│   └── lottie/            # Lottie animation JSON files
│
├── components/            # Global reusable UI components
│   ├── Avatar/
│   ├── Button/
│   ├── Header/
│   ├── TextInput/
│   ├── Loader/
│   ├── AwareView/
│   └── modals/
│
├── features/              # 🚀 Feature-driven modules (by domain)
│   ├── auth/              # Authentication flows
│   ├── home/              # Main home screen
│   ├── chat/              # Messaging functionality
│   ├── discover/          # Discovery/exploration
│   ├── profile/           # User profile
│   ├── payment/           # Payment processing
│   ├── revenue/           # Revenue management
│   └── settings/          # App settings
│
├── hooks/                 # Custom React hooks
│   ├── useAPI.ts
│   ├── useLocalize.ts
│   ├── usePermissions.ts
│   ├── useImage.ts
│   └── useExample.ts
│
├── navigation/            # Navigation configuration
│   ├── Navigation.tsx     # Root navigator
│   ├── types.ts           # Navigation type definitions
│   └── stacks/
│       ├── SignedInStack.tsx
│       ├── SignedOutStack.tsx
│       ├── HomeStack.tsx
│       ├── DrawerStack.tsx
│       └── ModalStack.tsx
│
├── services/              # External services & API
│   └── api/
│       └── client/
│           ├── client.ts  # Axios HTTP client
│           └── example/   # Example endpoints
│
├── store/                 # Redux state management
│   ├── store.ts           # Store configuration
│   ├── UserSlice.ts       # User state slice
│   ├── hooks.ts           # Typed Redux hooks
│   └── types.ts           # Type definitions
│
└── utils/                 # Utilities & constants
    ├── screens.ts         # Screen name constants
    └── translations/      # i18n translation files
```

---

## 🧭 Navigation Architecture

### Navigation Hierarchy

```
Root Navigation (Navigation.tsx)
│
├── Landing Screen (unauthenticated entry)
│
├── Signed Out Stack (authentication flows)
│   ├── Sign In
│   ├── Sign Up
│   └── Forgot Password
│
├── Signed In Stack (authenticated user)
│   ├── Home Stack (Bottom Tab Navigator)
│   │   ├── Home Screen
│   │   ├── Profile Screen
│   │   ├── Discover Screen
│   │   ├── Chat Screen
│   │   └── Settings Screen
│   │
│   ├── Drawer Stack (side menu)
│   │
│   └── Modal Screens (overlays)
│       ├── Detail Group Screen
│       ├── Withdraw Screen
│       ├── Payouts Screen
│       ├── Account Settings Screen
│       ├── Manage/Create Group Screen
│       ├── Success Payment Screen
│       ├── Active Chat Screen
│       └── Permission Screens
│
└── Modal Stack (full-screen modals)
    ├── Permission Screen
    └── Permission Denied Screen
```

### Navigation Files

#### `Navigation.tsx` (Root Navigator)
- Manages 4 main stacks: Landing, SignedIn, SignedOut, Modal
- Wraps app with `NavigationContainer`
- Handles authentication state transitions

#### `SignedOutStack.tsx`
- **Screens**: Sign In, Sign Up, Forgot Password
- **Type**: Native Stack Navigator
- **Header**: Back button on Sign Up and Forgot Password

#### `SignedInStack.tsx`
- **Screens**: Home Stack (drawer), Detail Group, Withdraw, Payouts, Account Settings, Manage Group (Create/Edit), Success Payment, Profile, Revenue, Active Chat
- **Type**: Native Stack Navigator
- **Parameters**: Passes IDs for detail screens (e.g., `{id: string}` for Detail Group)

#### `HomeStack.tsx` (Bottom Tab Navigator)
- **Tabs**: Home, Profile, Discover, Chat, Settings
- **Icons**: Custom vector icons for each tab
- **Styling**: NativeWind for tab styling

#### `DrawerStack.tsx`
- Side menu navigation
- Wraps Home Stack

#### `ModalStack.tsx`
- Full-screen modal presentations
- Permission-related screens

### Screen Constants (`utils/screens.ts`)

All screen names are defined as constants for type safety:

```typescript
NAVIGATOR_BOTTOM_TAB = "Bottom Tab"
NAVIGATOR_LANDING = "Landing Stack"
NAVIGATOR_SIGNED_IN_STACK = "Signed In Stack"
NAVIGATOR_SIGNED_OUT_STACK = "Signed Out Stack"
NAVIGATOR_HOME_STACK = "Home"
NAVIGATOR_MODAL_STACK = "Modal"
NAVIGATOR_DRAWER_STACK = "Drawer"

HOME_SCREENS = {
  MAIN_SCREEN, PROFILE_SCREEN, DISCOVER_SCREEN, 
  CHAT_SCREEN, REVENUE_SCREEN, SETTINGS_SCREEN
}

DISCOVER_SCREENS = { DETAIL_GROUP }
REVENUE_SCREENS = { WITHDRAW, PAYOUTS }
SETTINGS_SCREENS = { ACCOUNT, MY_GROUPS, MANAGE_GROUP }
PAYMENT_SCREENS = { SUCCESS }
SIGNED_OUT_SCREENS = { SIGN_IN_SCREEN, SIGN_UP_SCREEN, FORGOT_PASSWORD_SCREEN }
MODAL_SCREENS = { PERMISSION_SCREEN, PERMISSION_DENIED_SCREEN }
```

---

## 🎯 Feature Modules

Each feature is a self-contained domain with its own screens and components.

### Feature Structure

```
features/[feature-name]/
├── screens/           # Feature screens
│   └── [ScreenName].tsx
└── components/        # Feature-specific components (optional)
    └── [ComponentName].tsx
```

### Available Features

#### **auth/** - Authentication
- `LandingScreen.tsx` - Initial entry point
- `SignInScreen.tsx` - User login
- `SignUpScreen.tsx` - User registration
- `ForgotPasswordScreen.tsx` - Password recovery
- `UpdatePasswordScreen.tsx` - Password change

#### **home/** - Main Feed
- `HomeScreen.tsx` - Primary home/feed screen

#### **chat/** - Messaging
- `ChatScreen.tsx` - Chat list/overview
- `ActiveChatScreen.tsx` - Individual chat conversation

#### **discover/** - Discovery
- `DiscoverScreen.tsx` - Browse/discover content

#### **profile/** - User Profile
- `ProfileScreen.tsx` - User profile display
- `ProfileSelectableItem.tsx` - Profile list item component

#### **payment/** - Payment Processing
- `SuccessPaymentScreen.tsx` - Payment confirmation

#### **revenue/** - Revenue Management
- `RevenueScreen.tsx` - Revenue overview
- `WithdrawScreen.tsx` - Withdrawal request
- `PayoutScreen.tsx` - Payout history

#### **settings/** - App Settings
- `SettingsScreen.tsx` - Settings overview
- `AccountSettingsScreen.tsx` - Account configuration
- `ManageGroupScreen.tsx` - Combined screen for creating and updating groups

---

## 🎨 Global Components

Reusable UI components located in `src/components/`:

### Core Components
- **Avatar** - User avatar display with fallback
- **Button** - Styled button with variants
- **Header** - Navigation header with title and actions
- **HeaderBackButton** - Back navigation button
- **TextInput** - Custom text input field
- **Loader** - Loading spinner/indicator
- **AwareView** - Safe area aware container

### Modal Components
- **PermissionScreen** - Permission request UI
- **PermissionDeniedScreen** - Permission denied message

---

## 🔄 State Management (Redux)

### Store Configuration (`store/store.ts`)

```typescript
// Redux Toolkit store with Redux Persist
- Combines reducers: UserSlice
- Persists to AsyncStorage
- Serializable check disabled for async operations
- Whitelist: [] (add reducers to persist)
```

### User Slice (`store/UserSlice.ts`)

**State**:
```typescript
{
  user: unknown | null,
  authToken: string | null
}
```

**Actions**:
- `setUser(payload)` - Update user data
- `setAuthToken(payload)` - Update authentication token

### Redux Hooks (`store/hooks.ts`)

```typescript
useAppDispatch()    // Typed dispatch hook
useAppSelector()    // Typed selector hook
```

### Type Definitions

```typescript
RootState = ReturnType<typeof store.getState>
AppDispatch = typeof store.dispatch
```

---

## 🪝 Custom Hooks

Located in `src/hooks/`:

### `useAPI`
- Initializes and manages API client
- Handles bearer token setup
- Provides typed API methods

### `useLocalize`
- i18n configuration and language switching
- Locale detection and persistence
- Translation key management

### `usePermissions`
- Platform-specific permission handling
- iOS/Android permission requests
- Permission status checking

### `useImage`
- Image picker functionality
- Camera/gallery access
- Image compression and formatting

### `useExample`
- Template hook for reference

---

## 🌐 API & Services

### API Client (`services/api/client/client.ts`)

**Features**:
- Axios-based HTTP client
- Bearer token authentication
- Request/response interceptors
- Error handling
- Response parsing

**Methods**:
```typescript
new ApiClient(authToken?, config?)
setBearerToken(token)
client.example.get()  // Example endpoint
```

### API Endpoints (`services/api/client/example/`)

Example endpoint implementations for reference. Replace with actual API methods.

---

## 📦 Dependencies

### Core Framework
- `react` (19.0.0)
- `react-native` (0.78.0)
- `react-native-gesture-handler` (2.12.0)

### Navigation
- `@react-navigation/native` (6.1.14)
- `@react-navigation/native-stack` (6.9.22)
- `@react-navigation/bottom-tabs` (6.5.16)
- `@react-navigation/drawer` (6.6.11)

### State Management
- `@reduxjs/toolkit` (2.2.3)
- `react-redux` (9.1.0)
- `redux-persist` (6.0.0)
- `redux-thunk` (3.1.0)

### Styling
- `nativewind` (2.0.11)
- `tailwindcss` (3.3.2)

### API & Data
- `axios` (1.6.7)
- `lodash` (4.17.21)
- `moment` (2.30.1)

### Internationalization
- `i18n-js` (3.9.2)
- `react-native-localize` (2.2.4)

### UI/UX
- `lottie-react-native` (7.2.4)
- `react-native-vector-icons` (9.2.0)
- `react-native-image-picker` (8.2.1)
- `react-native-permissions` (4.1.4)
- `react-native-reanimated` (3.7.2)
- `react-native-screens` (3.29.0)
- `react-native-safe-area-context` (5.5.2)

### Storage
- `@react-native-async-storage/async-storage` (1.18.2)

### Development
- `typescript` (5.8.3)
- `eslint` (8.56.0)
- `prettier` (3.6.2)
- `jest` (30.0.5)
- `@react-native/metro-config` (0.78.0)

---

## 🚀 Running the App

### Installation
```bash
npm install
# or
yarn install
```

### iOS
```bash
cd ios && pod install && cd ..
npm run ios
```

### Android
```bash
npm run android
```

### Development
```bash
npm start
```

### Scripts
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run build:ios` - Build iOS app
- `npm run build:android` - Build Android app

---

## 🔧 Configuration Files

### `tsconfig.json`
TypeScript configuration with strict mode enabled.

### `babel.config.js`
Babel configuration for React Native with module resolver for path aliases.

### `app.json`
React Native app configuration (name, version, icon, splash screen).

### `.eslintrc.js`
ESLint rules for code quality and consistency.

### `jest.config.js`
Jest testing configuration.

### Path Aliases
```
@features    → src/features
@components  → src/components
@store       → src/store
@services    → src/services
@hooks       → src/hooks
@utils       → src/utils
@assets      → src/assets
```

---

## 🔐 Authentication Flow

1. **Landing Screen** - Initial entry point
2. **Sign In/Sign Up** - User authentication
3. **Token Storage** - Auth token saved to Redux + persisted
4. **Navigation Switch** - Route to Signed In Stack
5. **API Requests** - Bearer token attached to all requests
6. **Token Refresh** - Handle token expiration and refresh
7. **Logout** - Clear token and return to Signed Out Stack

---

## 📊 Data Flow

```
User Action
    ↓
Component/Screen
    ↓
Redux Action (useAppDispatch)
    ↓
Reducer (UserSlice)
    ↓
Store Update
    ↓
Component Re-render (useAppSelector)
    ↓
UI Update
```

### API Data Flow

```
Component
    ↓
useAPI Hook
    ↓
ApiClient (Axios)
    ↓
HTTP Request (with Bearer Token)
    ↓
API Response
    ↓
Parse Response
    ↓
Dispatch Redux Action
    ↓
Update Store
    ↓
Component Re-render
```

---

## 🎯 Best Practices

### Navigation
- Use screen name constants from `utils/screens.ts`
- Define typed parameters in stack type definitions
- Use `navigation.navigate()` for same-stack navigation
- Use `navigation.push()` for stack navigation

### State Management
- Use Redux for global app state (user, auth)
- Use local component state for UI state (form inputs, toggles)
- Use Redux Persist for data that survives app restart
- Type all Redux actions and selectors

### Components
- Keep components focused and reusable
- Pass data via props, not global state
- Use TypeScript interfaces for prop types
- Memoize expensive components with `React.memo()`

### API Calls
- Use custom hooks to encapsulate API logic
- Handle loading, error, and success states
- Use bearer token for authenticated requests
- Implement request/response interceptors

### Code Organization
- Group code by feature domain
- Keep feature modules self-contained
- Use barrel exports (index.ts) for clean imports
- Follow naming conventions (PascalCase for components, camelCase for functions)

---

## 🔄 Internationalization (i18n)

- Configured with `i18n-js`
- Locale detection via `react-native-localize`
- Translation files in `src/utils/translations/`
- Language switching via `useLocalize` hook

---

## 📱 Platform-Specific Code

- iOS configuration in `ios/` directory
- Android configuration in `android/` directory
- Platform-specific permissions via `usePermissions` hook
- Safe area handling via `react-native-safe-area-context`

---

## 🧪 Testing

- Jest configuration for unit tests
- Test files in `__tests__/` directory
- Example test: `__tests__/App.test.tsx`

---

## 📝 Summary

HeyHao is a well-structured React Native application following modern best practices:

- **Feature-driven architecture** for scalability
- **Type-safe Redux** for predictable state management
- **Modular navigation** with clear authentication flows
- **Reusable components** for consistent UI
- **Custom hooks** for encapsulated logic
- **Axios API client** for backend communication
- **i18n support** for multiple languages
- **Persistent state** for seamless user experience

The architecture supports rapid feature development while maintaining code quality and type safety.
