import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          '.text-color': {
            color: 'white',
          },
          'accent-content': '#FFFFFF',

          error: '#aa0b56',

          primary: '#8A13A4',
        },
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          '.text-color': {
            color: 'black',
          },

          error: '#aa0b56',

          'accent-content': '#000000',
        },
      },
    ],
    darkTheme: 'dark',
  },
};
export default config;
