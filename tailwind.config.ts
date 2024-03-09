import type { Config } from 'tailwindcss';
import daisyTheme from 'daisyui/src/theming/themes';
const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
          'base-content': '#dddddd',
          'primary-content': '#dddddd',
        },
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#8A13A4',
          error: '#aa0b56',

          'accent-content': '#000000',

          'primary-content': daisyTheme.dark['base-content'],
        },
      },
    ],
    darkTheme: 'dark',
  },
};
export default config;
