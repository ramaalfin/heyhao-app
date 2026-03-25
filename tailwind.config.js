/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./App.{js,jsx,ts,tsx}",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				white: "#ffffff",
				"blue-400": "#60a5fa",
				"heyhao-black": "#080c1a",
				"heyhao-secondary": "#6a7686",
				"heyhao-blue": "#165dff",
				"heyhao-orange": "#f97316",
				"heyhao-coral": "#ed6b60",
				"heyhao-border": "#f3f4f3",
				"heyhao-grey": "#eff2f7",
				"heyhao-darkgrey": "#6a7686",
				"heyhao-green": "#30b22d",
				"heyhao-yellow": "#fed71f",
				"heyhao-cardgrey": "#f1f3f6",
				"heyhao-cardmessage": "#c9e6fc",
				"heyhao-purple": "#442462",
			},
		},
	},
	plugins: [],
};
