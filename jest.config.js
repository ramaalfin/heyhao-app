module.exports = {
	preset: "react-native",
	transformIgnorePatterns: [
		"node_modules/(?!(react-native|@react-native|@reduxjs/toolkit|immer|redux-persist|@react-native-async-storage)/)",
	],
	moduleNameMapper: {
		"^@services/(.*)$": "<rootDir>/src/services/$1",
		"^@store/(.*)$": "<rootDir>/src/store/$1",
		"^@components/(.*)$": "<rootDir>/src/components/$1",
		"^@features/(.*)$": "<rootDir>/src/features/$1",
		"^@navigation/(.*)$": "<rootDir>/src/navigation/$1",
		"^@utils/(.*)$": "<rootDir>/src/utils/$1",
		"^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
		"^@assets/(.*)$": "<rootDir>/src/assets/$1",
	},
};
