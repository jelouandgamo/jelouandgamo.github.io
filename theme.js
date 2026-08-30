export const typographyTheme = {
  fontFamily: {
    // Playfair Display carries the Display + Headline tiers (the large,
    // expressive type). Noto Sans carries everything smaller - Title, Body,
    // Label - where a serif reads as fussy at small sizes.
    display: ['"Playfair Display"', 'Georgia', 'serif'],
    sans: ['"Noto Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
  },
  fontSize: {
    'display-lg': ['3.563rem', { lineHeight: '4rem', letterSpacing: '0', fontWeight: '300' }],
    'display-md': ['2.813rem', { lineHeight: '3.25rem', letterSpacing: '0', fontWeight: '300' }],
    'display-sm': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '0', fontWeight: '400' }],
    'headline-lg': ['2rem', { lineHeight: '2.5rem', letterSpacing: '0', fontWeight: '400' }],
    'headline-md': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '0', fontWeight: '400' }],
    'headline-sm': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0', fontWeight: '600' }],
    'title-lg': ['1.375rem', { lineHeight: '1.75rem', letterSpacing: '0', fontWeight: '700' }],
    'title-md': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.75rem', fontWeight: '700' }],
    'title-sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0', fontWeight: '600' }],
    'body-lg': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0', fontWeight: '400' }],
    'body-md': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0', fontWeight: '400' }],
    'body-sm': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.075rem', fontWeight: '400' }],
    'label-lg': ['0.875rem', { lineHeight: '0.3rem', letterSpacing: '1rem', fontWeight: '500' }],
    'label-md': ['0.875rem', { lineHeight: '1rem', letterSpacing: '0.7px', fontWeight: '700' }],
    'label-sm': ['0.625rem', { lineHeight: '1rem', letterSpacing: '1.25rem', fontWeight: '400' }],
  },
};