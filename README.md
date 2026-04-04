# 📱 HeyHao Mobile App

> Community Hub - Connect, Chat, and Grow Together

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# iOS
cd ios && pod install && cd ..
npm run ios

# Android
npm run android
```

## 📦 Tech Stack

- **React Native** 0.78.0
- **TypeScript** - Full type safety
- **Redux Toolkit** - State management
- **React Navigation** - Navigation
- **NativeWind** - TailwindCSS for React Native
- **Axios** - API client

## 🏗️ Project Structure

```
src/
├── features/        # Feature modules (auth, chat, groups, etc.)
├── components/      # Reusable UI components
├── navigation/      # Navigation configuration
├── services/        # API services
├── store/           # Redux store
├── hooks/           # Custom hooks
└── utils/           # Utilities & helpers
```

## 🎯 Key Features

- 🔐 Authentication (Sign In/Sign Up)
- 💬 Real-time Chat
- 👥 Group Management
- 💰 Revenue & Payments
- 🔍 Discover Communities
- ⚙️ Settings & Profile

## 📱 Screens

- **Auth**: Landing, Sign In, Sign Up, Forgot Password
- **Home**: Main feed, Discover, Chat, Settings
- **Groups**: All Groups, Group Detail, My Groups
- **Revenue**: Revenue Overview, Withdraw, Payouts
- **Chat**: Chat List, Active Chat

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```env
BASE_URL_API=http://localhost:3000/api/v1
```

### Path Aliases

```typescript
@features    → src/features
@components  → src/components
@store       → src/store
@services    → src/services
@hooks       → src/hooks
@utils       → src/utils
```

## 📝 Development

```bash
# Start Metro bundler
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## 📄 License

MIT License

---

Built with ❤️ for the community
