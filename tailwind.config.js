module.exports = (async () => {
  const mod = await import('./theme.js');
  const typographyTheme = mod.typographyTheme || mod.default || {};

  return {
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
})();
