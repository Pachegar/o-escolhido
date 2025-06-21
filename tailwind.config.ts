
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sora': ['Sora', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#14110E',
				foreground: '#FAFAFA',
				primary: {
					DEFAULT: '#0152F8',
					foreground: '#FAFAFA'
				},
				secondary: {
					DEFAULT: '#2A2621',
					foreground: '#FAFAFA'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FAFAFA'
				},
				muted: {
					DEFAULT: '#2A2621',
					foreground: '#A3A3A3'
				},
				accent: {
					DEFAULT: '#2A2621',
					foreground: '#FAFAFA'
				},
				popover: {
					DEFAULT: '#1F1C18',
					foreground: '#FAFAFA'
				},
				card: {
					DEFAULT: '#1F1C18',
					foreground: '#FAFAFA'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'hover-scale': {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.02)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'hover-scale': 'hover-scale 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
