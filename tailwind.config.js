const { typographyTheme } = require('./theme.js');

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: typographyTheme.fontFamily?.display || ['"Playfair Display"', 'serif'],
      },
      fontSize: typographyTheme.fontSize || {},
    },
  },
  plugins: [],
};
