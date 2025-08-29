/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  safelist: [
    // Holistic AI Brand Colors - ensure they're always included in production
    'text-holistic-blurple',
    'text-holistic-amethyst', 
    'text-holistic-cerulean',
    'text-holistic-deepblue',
    'bg-holistic-blurple',
    'bg-holistic-amethyst',
    'bg-holistic-cerulean', 
    'bg-holistic-deepblue',
    'border-holistic-blurple',
    'border-holistic-amethyst',
    'border-holistic-cerulean',
    'border-holistic-deepblue',
    'hover:bg-holistic-blurple',
    'hover:bg-holistic-deepblue',
    'hover:text-holistic-blurple',
    'hover:border-holistic-blurple',
    'focus:border-holistic-blurple',
    'focus:ring-holistic-blurple/10',
    'from-holistic-blurple',
    'to-holistic-amethyst',
    'from-holistic-cerulean/10',
    'to-holistic-amethyst/10',
    'bg-holistic-blurple/5',
    // Font families
    'font-roobert',
    'font-roboto-condensed'
  ],
  theme: {
    extend: {
      content: {
        'empty': '""',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Holistic AI Brand Colors
        'holistic': {
          'blurple': '#5049f9',
          'amethyst': '#AB5FCE',
          'cerulean': '#36B1FE',
          'deepblue': '#141E41',
        },
        // Updated blue palette to match brand
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#36B1FE', // Holistic AI Cerulean
          600: '#5049f9', // Holistic AI Blurple
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#141E41', // Holistic AI Deepblue
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#AB5FCE', // Holistic AI Amethyst
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'roobert': [
          'Roobert',
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        'roboto-condensed': [
          '"Roboto Condensed"',
          'Roboto',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
} 