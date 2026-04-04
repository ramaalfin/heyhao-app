# HeyHao Mobile App — React Native Developer

**Stack:** React Native, TypeScript, Redux Toolkit, React Query (TanStack Query), Socket.IO Client, React Navigation, React Hook Form, NativeWind (TailwindCSS), react-native-gifted-charts

## Key Achievements

- **Architected cross-platform mobile application** for iOS and Android with 50+ screens and components, implementing feature-based folder structure with clear separation of concerns (features, services, hooks, components), enabling scalable codebase for community and group management platform.

- **Integrated real-time chat system** with Socket.IO client, implementing WebSocket connection management, typing indicators, online/offline presence tracking, and message delivery confirmation, reducing message latency to <50ms and improving user engagement with instant communication.

- **Built comprehensive revenue analytics dashboard** with react-native-gifted-charts, displaying monthly revenue trends with interactive bar charts, VIP group statistics, and latest member transactions, enabling group owners to track earnings and make data-driven decisions.

- **Implemented efficient state management architecture** combining Redux Toolkit for global state (user authentication, app settings) and React Query for server state with automatic caching and background refetching, reducing unnecessary API calls by ~60% and improving app responsiveness.

- **Engineered type-safe API integration layer** with 100% TypeScript coverage, implementing custom hooks (useAuth, useGroup, useChat, useTransaction) for data fetching, automatic JWT token refresh, and request/response interceptors, reducing runtime errors by ~40%.

- **Developed discovery and search features** with tabs for groups and people, implementing pull-to-refresh, infinite scrolling, search functionality, and smart suggestions, improving content discoverability and user engagement.

- **Built group management system** supporting free and paid groups with CRUD operations, member management, join/leave functionality, and revenue tracking, implementing optimistic updates for seamless user experience.

- **Implemented secure authentication flows** including sign in, sign up, password reset, and biometric authentication support, with JWT token management, secure storage using react-native-keychain, and automatic session handling.

## Technical Highlights

- Designed custom React hooks for WebSocket events (useSocket, useMessages, useTypingIndicator, useRoomPresence) with automatic cleanup and reconnection logic
- Implemented image caching and lazy loading strategies for optimal performance with large media content
- Created reusable UI component library with NativeWind (TailwindCSS), ensuring consistent design system across all screens
- Utilized React Navigation for seamless navigation with stack, tab, and drawer navigators, implementing deep linking support
- Implemented form validation with React Hook Form and Zod schema validation, reducing form boilerplate by ~50%
- Established comprehensive error handling with user-friendly error messages in Indonesian, displaying backend error responses directly to users
- Optimized list rendering with FlatList virtualization and proper key extraction for smooth scrolling with large datasets
- Implemented pull-to-refresh and loading states for better user feedback during data fetching operations
