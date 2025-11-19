/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				status: {
					confirmed: '#16a34a',
					tentative: '#f59e0b',
					cancelled: '#ef4444'
				},
				neutralEvent: '#64748b'
			}
		}
	},
	plugins: []
}


