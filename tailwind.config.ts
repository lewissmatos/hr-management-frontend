import { heroui } from "@heroui/react";
import { generateColorPalette } from "./src/components/ui/ui.util";
const baseLayout = {
	disabledOpacity: "0.3",
	radius: {
		small: "12px",
		medium: "12px",
		large: "12px",
	},

	borderWidth: {
		small: "1px",
		medium: "2px",
		large: "3px",
	},
};
const basePrimaryColors = {
	...generateColorPalette("#794ea9"),
};

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/components/[object Object].js",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
		"./src/(app|pages|components|hooks)/**/*.{js,ts,jsx,tsx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	plugins: [
		heroui({
			themes: {
				"app-light": {
					extend: "light",
					layout: baseLayout,
					colors: {
						foreground: "#272727",
						primary: {
							...basePrimaryColors.primary,
							foreground: "#272727",
						},
					},
				},
				"app-dark": {
					extend: "dark",
					layout: baseLayout,
					colors: {
						background: "#272727",
						foreground: "#ffffff",
						primary: {
							...basePrimaryColors.primary,
							foreground: "#ffffff",
						},
					},
				},
			},
		}),
	],
};
