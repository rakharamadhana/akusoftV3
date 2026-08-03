---
name: Luminous Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#3e3fcc'
  on-tertiary: '#ffffff'
  tertiary-container: '#585be6'
  on-tertiary-container: '#f1eeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  slate-heading: '#0F172A'
  slate-body: '#334155'
  border-light: '#E2E8F0'
  alert-coral: '#EF4444'
  pill-mint-bg: '#D1FAE5'
  pill-indigo-bg: '#E0E7FF'
  pill-amber-bg: '#FEF3C7'
  pill-rose-bg: '#FEE2E2'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  metric-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for **Akusoft v3.0**, a financial management platform that prioritizes clarity, trust, and effortless productivity. The brand personality is **authoritative yet approachable**, moving away from stodgy legacy accounting software toward a high-performance, fintech-forward aesthetic.

The chosen design style is **Airy Minimalism with a Bento Grid influence**. It utilizes a "White-Label Premium" approach characterized by:
- **High-Clarity Surfaces:** Leveraging pure white cards against soft pearl backgrounds to reduce visual noise.
- **Precision Data Viz:** Using vibrant, purposeful accents (Sapphire Blue and Mint Emerald) to guide the user's eye toward critical financial insights.
- **Bento Organization:** Grouping complex financial data into logical, rounded "cells" that feel organized and manageable.
- **Soft Functional Accents:** Utilizing pastel status pills to provide non-aggressive categorization of document states.

## Colors

The palette is built on a foundation of "Optical White" to maximize the perceived brightness of the interface. 

- **Primary (Electric Sapphire Blue):** Reserved for high-intent actions, primary navigation, and active interactive states. 
- **Secondary (Mint Emerald):** Used exclusively for "Positive Financial Health" indicators, such as profit margins and paid status.
- **Functional Neutrals:** We use a dual-tier neutral system. `#F8FAFC` serves as the canvas background, while `#FFFFFF` is used for interactive components and content cards to create a subtle layered "lift."
- **Typography:** Contrast is strictly maintained using Dark Slate tones to ensure legibility across financial tables and dense data grids.

## Typography

This design system utilizes **Plus Jakarta Sans** across all levels to maintain a contemporary, slightly geometric feel that remains professional.

- **Metrics:** A custom `metric-display` role is defined for financial totals within Bento cards, using tight letter spacing and bold weights to emphasize large currency values.
- **Headlines:** Use `slate-heading` (#0F172A) to ensure strong hierarchical separation from body content.
- **Body:** Use `slate-body` (#334155) to provide a softer reading experience for long-form data or descriptions.
- **Hierarchy:** Dramatic scale differences between metrics and labels are encouraged to allow users to scan dashboards quickly.

## Layout & Spacing

The layout is based on a **Fluid Bento Grid** system. 

- **Grid Logic:** A 12-column grid is used for desktop, reflowing to a 1-column stack for mobile. 
- **Bento Modules:** Content is grouped into distinct white cards. Spacing between these modules should consistently use the `gutter` (24px) to maintain the "Airy" feel.
- **Density:** While the overall layout is spacious, internal card padding should be tighter (16px or 20px) to keep financial data points logically grouped.
- **Mobile Reflow:** On mobile devices, the side-by-side Bento cards (e.g., Omzet vs. Laba) should transition into a vertical stack or a horizontally scrollable carousel of metrics to preserve screen real estate.

## Elevation & Depth

Hierarchy in this design system is achieved through **Tonal Layering and Micro-Shadows** rather than heavy shadows or high-contrast backgrounds.

- **Base Layer:** The background is always `#F8FAFC`.
- **Card Layer:** Interactive or data-containing surfaces are `#FFFFFF`.
- **Borders:** Every card must have a 1px solid `#E2E8F0` border. This acts as the primary "edge" definition.
- **Shadows:** Use a "Micro-Shadow" for cards: `0px 4px 6px -1px rgba(0, 0, 0, 0.05)`. This should be subtle enough that it is only noticed when compared to the flat background.
- **Interactive Depth:** On hover, cards may transition to a slightly deeper shadow (8px blur) to indicate interactivity.

## Shapes

The shape language is **Refined and Rounded**. 

- **Cards & Modules:** Use `rounded-lg` (1rem / 16px) for the main Bento grid containers to soften the technical nature of financial data.
- **Interactive Elements:** Buttons and input fields follow the `rounded-md` (0.5rem / 8px) standard for a precise, modern feel.
- **Status Pills:** Utilize full-rounded (Pill-shaped) geometry for status indicators (LUNAS, JATUH TEMPO) to distinguish them from clickable buttons.

## Components

### Buttons
- **Primary:** Background `#2563EB`, white text. No shadow, or very subtle glow.
- **Secondary:** White background, 1px border `#E2E8F0`, dark slate text.
- **Ghost:** No background, Primary color text, for low-priority actions.

### Status Pills
Status pills use a high-chroma text color on a low-saturation (pastel) background of the same hue:
- **Paid (Lunas):** Text `#059669` on Background `#D1FAE5`.
- **Overdue:** Text `#DC2626` on Background `#FEE2E2`.
- **Pending:** Text `#D97706` on Background `#FEF3C7`.

### Input Fields
- **Default State:** Pure white background, 1px `#E2E8F0` border.
- **Focus State:** 1px `#2563EB` border with a soft blue 3px outer glow (ring).
- **Labels:** Small, bolded `slate-heading` text sitting just above the input field.

### Bento Cards
- **Structure:** 1px border + Micro-shadow. Internal padding of 24px for desktop, 16px for mobile.
- **Header:** Include an icon in a soft-tinted square (e.g., Sapphire Blue icon on Indigo pastel background) in the top right or top left of the card.

### Tables
- **Header:** Light gray background (`#F1F5F9`) or transparent with a bottom border.
- **Rows:** Alternating "Zebra" stripes are discouraged; use thin 1px horizontal dividers (`#E2E8F0`) to maintain the airy aesthetic.