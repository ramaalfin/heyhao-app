module.exports = {
	presets: ["module:@react-native/babel-preset"],
	plugins: [
		[
			"module-resolver",
			{
				root: ["./"],
				alias: {
					"@services": "./src/services",
					"@features": "./src/features",
					"@components": "./src/components",
					"@navigation": "./src/navigation",
					"@store": "./src/store",
					"@assets": "./src/assets",
					"@hooks": "./src/hooks",
					"@utils": "./src/utils",
				},
			},
		],
		"@babel/plugin-proposal-export-namespace-from",
		"nativewind/babel",
		"react-native-reanimated/plugin",
	],
};
