// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['RobotAlegreya Sans SC', 'sans-serif'],
      },
      colors: {
        green: '#D5ED9F',
        'dark-green': '#00712D',
        orange: '#FF9100',
        cream: '#FFFBE6',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
