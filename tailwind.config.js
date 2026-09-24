/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          soft: '#6366f1',
          light: '#eef2ff',
        },
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 25px -5px rgb(148 163 184 / 0.35)',
        'soft-lg': '0 20px 40px -10px rgb(148 163 184 / 0.4)',
        'soft-primary': '0 12px 28px -6px rgb(79 70 229 / 0.28)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
