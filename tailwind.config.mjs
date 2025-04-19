const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'media', // Enable dark mode based on OS preference
  theme: {
    extend: {
      margin: {
        '-89': '-23rem',
      },
      screens: {
        xs: { min: '360px' },
      },
      colors: {
        ...defaultTheme.colors,

        gold: {
          '100': '#fff7cc',
          '200': '#fff3b3',
          '300': '#ffef99',
          '400': '#ffeb80',
          '500': '#ffe766',
          '600': '#ffe34d',
          '700': '#ffdf33',
          '800': '#ffdb1a',
          '900': '#FFD700',
        },
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
    },
  },
  variants: {},
  plugins: [],
}
