import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          '.text-color': {
            color: 'white',
          },
          'accent-content': '#FFFFFF',

          error: '#aa0b56',

          primary: '#8A13A4',

          'primary-content': '#FFFFFF',
        },
        light: {
          ...require('daisyui/src/theming/themes')['light'],
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
