# 📱 `React Native Template (Enhanced)`

<p align="center">
  <img src="https://user-images.githubusercontent.com/30089055/199875237-07f734d0-4f60-4f9c-a66e-2e82a33aa410.png" width="100%" />
  <a href="https://buymeacoffee.com/ghigaredr" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</p>

This is an enhanced version of the original template by [Gabriel Higareda (@daboigbae)](https://github.com/daboigbae/react-native-template), refactored for **Feature-Driven Architecture** and strict TypeScript standards. It provides a scalable foundation with integrated navigation, state management, and styling.

---

## 🚀 Key Enhancements
- **Feature-Driven Architecture**: Code is grouped by domain (e.g., `features/auth`, `features/profile`) for maximum scalability.
- **Strict TypeScript**: Full type safety for Redux (hooks/slices) and Navigation.
- **Optimized Performance**: Cleaned-up runtime hooks and removed production debug logs.
- **Improved Aliases**: Clean path aliases (`@features`, `@components`, `@store`, `@services`) for cleaner imports.

## 📦 Installed Packages
- **State**: [@reduxjs/toolkit](https://redux-toolkit.js.org/), [redux-persist](https://github.com/rt2zz/redux-persist)
- **Navigation**: [react-navigation](https://reactnavigation.org/) (Stack, Tab, Drawer)
- **Styling**: [NativeWind (TailwindCSS)](https://www.nativewind.dev/)
- **Logic**: [axios](https://github.com/axios/axios), [i18n-js](https://www.npmjs.com/package/i18n-js), [lodash](https://lodash.com/), [moment](https://momentjs.com/)
- **UI/UX**: [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native), [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)

---

## 🏃‍♀️ Running the App

### 📦 Installation
```bash
npm install
# or
yarn install
```

### 📱 iOS
```bash
cd ios && pod install && cd ..
npm run ios
```

### 📱 Android
```bash
npm run android
```

---

## 🏗️ Folder Structure (Feature-Driven)
```text
src/
├── assets/         # Global images & animations
├── components/     # Globally shared generic UI
├── features/       # 🚀 Core functionality grouped by domain
├── hooks/          # Global React hooks
├── navigation/     # Stacks and Route definitions
├── services/       # API clients and data providers
├── store/          # Redux Toolkit setup
└── utils/          # Constants and help functions
```

---

## 🙏 Original Credits & Support
Original Template created by **Gabriel Higareda**.
Sponsored by **Digital Art Dealers**.

Please give this project a ⭐️ to show your support!

- [Original Template Repository](https://github.com/daboigbae/react-native-template)
- [Follow @daboigbae on Twitter](https://twitter.com/daboigbae)
- [Digital Art Dealers Website](https://digitalartdealers.net/)

---

### License
MIT License - Copyright (c) 2022 Gabriel Higareda
