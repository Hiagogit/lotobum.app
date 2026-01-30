import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        card: '#1C1C1E',
        'luck-green': '#30D158',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}
export default config
