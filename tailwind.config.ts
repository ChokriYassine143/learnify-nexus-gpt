
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#3C99DC',
					foreground: 'hsl(var(--primary-foreground))',
					100: '#D5F3FE',
					200: '#AEE6FD',
					300: '#66D3FA',
					400: '#3C99DC',
					500: '#3C99DC',
					600: '#2565AE',
					700: '#0F5298',
					800: '#0F5298',
					900: '#0F5298',
				},
				secondary: {
					DEFAULT: '#66D3FA',
					foreground: 'hsl(var(--secondary-foreground))',
					100: '#D5F3FE',
					200: '#AEE6FD',
					300: '#7DDBFC',
					400: '#66D3FA',
					500: '#66D3FA',
					600: '#47C1F5',
					700: '#2DB0F0',
					800: '#0F5298',
					900: '#0F5298',
				},
				accent: {
					DEFAULT: '#8B5CF6',
					foreground: 'hsl(var(--accent-foreground))',
					100: '#EDE9FE',
					200: '#DDD6FE',
					300: '#C4B5FD',
					400: '#A78BFA',
					500: '#8B5CF6',
					600: '#7C3AED',
					700: '#6D28D9',
					800: '#5B21B6',
					900: '#4C1D95',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				learnup: {
					blue1: '#3C99DC',
					blue2: '#66D3FA',
					blue3: '#D5F3FE',
					blue4: '#2565AE',
					blue5: '#0F5298',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			backgroundImage: {
				'gradient-learnup': 'linear-gradient(90deg, #3C99DC 0%, #66D3FA 50%, #D5F3FE 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
