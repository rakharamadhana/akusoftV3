import type { Config } from 'tailwindcss';

/**
 * Akusoft v2.0 — "Luminous Precision" design system.
 * Tokens mirror the compiled reference config in references/<screen>/code.html verbatim
 * so reference markup stays reusable across every screen (CLAUDE.md §2, §8).
 *
 * Radius decision (CLAUDE.md §2 discrepancy): all reference screens compile
 * rounded-lg -> 0.5rem and use rounded-xl (0.75rem) for bento cards. We follow
 * the references for cross-screen consistency; cards = rounded-xl, controls = rounded-lg.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Canonical Luminous Precision tokens (from DESIGN.md / reference configs)
        background: '#f7f9fb',
        surface: '#f7f9fb',
        'surface-bright': '#f7f9fb',
        'surface-dim': '#d8dadc',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-highest': '#e0e3e5',
        'surface-variant': '#e0e3e5',
        'on-surface': '#191c1e',
        'on-surface-variant': '#434655',
        'on-background': '#191c1e',
        'inverse-surface': '#2d3133',
        'inverse-on-surface': '#eff1f3',
        outline: '#737686',
        'outline-variant': '#c3c6d7',
        'surface-tint': '#0053db',

        primary: '#004ac6',
        'on-primary': '#ffffff',
        'primary-container': '#2563eb',
        'on-primary-container': '#eeefff',
        'inverse-primary': '#b4c5ff',
        'primary-fixed': '#dbe1ff',
        'primary-fixed-dim': '#b4c5ff',
        'on-primary-fixed': '#00174b',
        'on-primary-fixed-variant': '#003ea8',

        secondary: '#006c49',
        'on-secondary': '#ffffff',
        'secondary-container': '#6cf8bb',
        'on-secondary-container': '#00714d',
        'secondary-fixed': '#6ffbbe',
        'secondary-fixed-dim': '#4edea3',
        'on-secondary-fixed': '#002113',
        'on-secondary-fixed-variant': '#005236',

        tertiary: '#3e3fcc',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#585be6',
        'on-tertiary-container': '#f1eeff',
        'tertiary-fixed': '#e1e0ff',
        'tertiary-fixed-dim': '#c0c1ff',
        'on-tertiary-fixed': '#07006c',
        'on-tertiary-fixed-variant': '#2f2ebe',

        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // Bright-mode semantic accents
        'slate-heading': '#0F172A',
        'slate-body': '#334155',
        'border-light': '#E2E8F0',
        'alert-coral': '#EF4444',
        'pill-mint-bg': '#D1FAE5',
        'pill-indigo-bg': '#E0E7FF',
        'pill-amber-bg': '#FEF3C7',
        'pill-rose-bg': '#FEE2E2',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.5rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      spacing: {
        gutter: '24px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        'margin-mobile': '16px',
      },
      maxWidth: {
        'container-max': '1280px',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        'headline-lg': ['var(--font-jakarta)'],
        'headline-lg-mobile': ['var(--font-jakarta)'],
        'headline-md': ['var(--font-jakarta)'],
        'headline-sm': ['var(--font-jakarta)'],
        'body-lg': ['var(--font-jakarta)'],
        'body-md': ['var(--font-jakarta)'],
        'body-sm': ['var(--font-jakarta)'],
        'label-md': ['var(--font-jakarta)'],
        'metric-display': ['var(--font-jakarta)'],
      },
      fontSize: {
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
        'metric-display': ['28px', { lineHeight: '36px', letterSpacing: '-0.03em', fontWeight: '700' }],
      },
      boxShadow: {
        micro: '0px 4px 6px -1px rgba(0, 0, 0, 0.05)',
        'micro-hover': '0px 10px 15px -3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
