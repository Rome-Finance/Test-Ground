/* eslint-disable no-unused-vars */
module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			backgroundImage: (theme) => ({
				'rf-hero': 'url(/src/assets/images/bg-hero.png)',
				'rf-content-top': 'url(/src/assets/images/bg-content-top.png)',
				'rf-right-arrow': 'url(/src/assets/images/icon-right-arrow.png)'
			})
		},
		fontFamily: {
			body: ['"Inter"'],
			sans: ['"Alegreya Sans"'],
			sc: ['"Alegreya SC"'],
			'sans-sc': ['"Alegreya Sans SC"']
		},
		gradientColorStops: (theme) => ({
			...theme('colors'),
			'rf-yellow-100': '#CD8B29',
			'rf-red-100': '#BB170B',
			'rf-black-100': '#200C0A',
			'rf-black-200': '#322B2B',
			'rf-black-300': '#060606'
		}),
		borderColor: (theme) => ({
			...theme('colors'),
			'rf-yellow-100': '#C5A033',
			'rf-yellow-200': '#F2BA14',
			'rf-black-100': '#282525',
			'rf-black-200': '#1C1414',
			'rf-black-300': '#111111',
			'rf-gray-100': '#363636'
		}),
		backgroundColor: (theme) => ({
			...theme('colors'),
			'rf-black-100': '#0C0A0A',
			'rf-black-200': '#0F0F0F',
			'rf-gray-100': '#363636',
			'rf-green-100': '#05210C'
		}),
		textColor: (theme) => ({
			...theme('colors'),
			'rf-yellow-100': '#C5A033',
			'rf-yellow-200': '#D9BA51',
			'rf-gray-100': '#C0BA9F',
			'rf-gray-200': '#403227'
		}),
		divideColor: (theme) => ({
			...theme('colors'),
			'rf-gray-100': '#403227'
		}),
		scale: {
			'100-1': '-1'
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
