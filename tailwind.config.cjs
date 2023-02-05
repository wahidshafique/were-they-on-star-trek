const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [...defaultTheme.fontFamily.sans],
			},
			colors: {
				sciencesUniform: '#29394d',
			},
		},
	},
	plugins: [],
};
