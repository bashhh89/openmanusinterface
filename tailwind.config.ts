import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'slow-spin': 'spin 20s linear infinite',
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'gradient-shift': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'slow-spin': {
          'from': {
            transform: 'rotate(0deg)',
          },
          'to': {
            transform: 'rotate(360deg)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'gradient-size': '200% 200%',
      },
      container: {
        center: true,
        padding: '2rem',
      },
    },
  },
  plugins: [],
}

export default config 