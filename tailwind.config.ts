import type { Config } from 'tailwindcss';
import daisyTheme from 'daisyui/src/theming/themes';
const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/*.{js,ts,jsx,tsx,mdx}',
    './src/server/payload/components/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['chat-end', 'chat-start'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          ...daisyTheme.dark,
          error: '#aa0b56',
          primary: '#8A13A4',
          'accent-content': '#FFFFFF',
          'base-content': '#eeeeee',
          'primary-content': '#eeeeee',

          '.home': {
            background:
              'radial-gradient( circle at 50% 26%, rgba(65, 37, 76, 1) 0%, rgba(0, 0, 0, 0.7) 35%)',
          },
        },
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#8A13A4',
          error: '#aa0b56',
          'accent-content': '#000000',
          'neutral-content': daisyTheme.light['base-content'],
          'primary-content': daisyTheme.light['base-200'],

          '.home': {
            background:
              'radial-gradient( circle at -50% 5%, rgba(119, 15, 142, 1) 0%, rgba(255, 255, 255, 0.7) 55%)',
          },
        },
      },
    ],
    darkTheme: 'dark',
  },
};
export default config;
