# Design.md

## StatVidya — Visual Design System & UI Specifications

| Field | Value |
|---|---|
| Companion docs | PRD.md, Architecture.md, rules.md, Phases.md, memory.md |
| Purpose | Define the color palette (OKLCH), typography, spacing, shadcn/ui component styling, and visual language for StatVidya |
| Status | **Active v2.0 — Tailwind CSS v4 & shadcn/ui Design System** |

> **Design Direction**: Modern, institutional, and approachable — not sterile-government. StatVidya balances the dignity and authority required by MoSPI and Mission Karmayogi leadership with the ergonomic clarity and tactile usability needed by a Field Investigator holding an Android tablet in rural Bihar under harsh sunlight.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System (OKLCH & Tailwind v4)](#2-color-system-oklch--tailwind-v4)
3. [Typography (Bilingual English/Hindi)](#3-typography-bilingual-englishhindi)
4. [Spacing & 4px Layout Grid](#4-spacing--4px-layout-grid)
5. [Component Design Tokens (shadcn/ui)](#5-component-design-tokens-shadcnui)
6. [Iconography](#6-iconography)
7. [Motion & Micro-Interactions](#7-motion--micro-interactions)
8. [Dark Mode Architecture](#8-dark-mode-architecture)
9. [Provenance Badges (Visual Trust Spec)](#9-provenance-badges-visual-trust-spec)
10. [Field-First Responsive Breakpoints](#10-field-first-responsive-breakpoints)
11. [Accessibility & WCAG 2.1 AA Compliance](#11-accessibility--wcag-21-aa-compliance)
12. [Tailwind CSS v4 Configuration (`app/globals.css`)](#12-tailwind-css-v4-configuration-appglobalscss)

---

## 1. Design Principles

1. **Clarity Over Decoration**:
   - Every visual element must serve comprehension of competencies, assessment progression, or regulatory data. Superfluous ornamental graphics are strictly avoided.
2. **Trust Through Transparency**:
   - Provenance badges, simulation disclaimers, and data sourcing watermarks are prominent, first-class UI citizens.
3. **Field-First Ergonomics**:
   - Sizing, touch targets (minimum 48px), and high contrast are designed primarily for outdoor readability on mid-range Android tablets. Desktop adapts upward from this baseline.
4. **Bilingual Parity**:
   - Hindi (Devanagari) typography expands 20–40% compared to Latin English. Every card, container, and button dynamically accommodates this expansion without truncation or awkward overflow.

---

## 2. Color System (OKLCH & Tailwind v4)

StatVidya employs the **OKLCH** color space in Tailwind CSS v4, delivering uniform perceptual lightness across light and dark themes. The palette is inspired by India's national tricolor, calibrated for modern institutional software.

### 2.1 Primary & Accent Palette

| Token | Light Mode (OKLCH) | Dark Mode (OKLCH) | Hex Approx | Semantic Usage |
|---|---|---|---|---|
| `--color-primary` | `oklch(0.45 0.12 220)` | `oklch(0.75 0.12 220)` | `#1B5E7B` / `#4FC3F7` | Brand anchor, primary CTAs, active navigation |
| `--color-primary-hover` | `oklch(0.38 0.12 220)` | `oklch(0.82 0.10 220)` | `#14475E` / `#81D4FA` | Hover state on primary elements |
| `--color-primary-light` | `oklch(0.94 0.03 220)` | `oklch(0.25 0.05 220)` | `#E0F2F8` / `#0D2B3E` | Primary tint background, active selection fills |
| `--color-secondary` | `oklch(0.62 0.16 55)` | `oklch(0.78 0.14 55)` | `#E67E22` / `#FFB74D` | Saffron-inspired accent, alert callouts, focus highlights |
| `--color-secondary-hover` | `oklch(0.52 0.16 55)` | `oklch(0.85 0.12 55)` | `#D35400` / `#FFCC80` | Hover on accent elements |
| `--color-secondary-light` | `oklch(0.96 0.04 55)` | `oklch(0.28 0.06 55)` | `#FEF3E2` / `#3E2200` | Saffron tint backgrounds |
| `--color-tertiary` | `oklch(0.52 0.14 145)` | `oklch(0.74 0.12 145)` | `#2E7D32` / `#66BB6A` | Green-inspired success, verified badges, target achievement |
| `--color-tertiary-light` | `oklch(0.95 0.03 145)` | `oklch(0.24 0.05 145)` | `#E8F5E9` / `#1B3B1E` | Success tint backgrounds |

### 2.2 Functional & Severity Colors

| Severity Level | Light Mode (OKLCH) | Dark Mode (OKLCH) | UI Meaning |
|---|---|---|---|
| **High Gap ($\ge 6$)** | `oklch(0.42 0.18 25)` | `oklch(0.70 0.18 25)` | Critical gap requiring immediate training intervention |
| **Moderate Gap ($3-5$)** | `oklch(0.65 0.17 75)` | `oklch(0.80 0.15 75)` | Growth area requiring scheduled coursework |
| **Proficient ($\le 2$)** | `oklch(0.52 0.14 145)` | `oklch(0.74 0.12 145)` | Meets or exceeds FRAC role requirements |

### 2.3 Neutral Palette

| Token | Light Mode (OKLCH) | Dark Mode (OKLCH) | Usage |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Main application viewport |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary body text |
| `--card` | `oklch(1 0 0)` | `oklch(0.178 0 0)` | Elevated surfaces and containers |
| `--card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Text inside cards |
| `--muted` | `oklch(0.965 0 0)` | `oklch(0.269 0 0)` | Disabled states, subtle section backgrounds |
| `--muted-foreground`| `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | Secondary labels, captions, metadata |
| `--border` | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` | Dividers, card borders, subtle gridlines |

---

## 3. Typography (Bilingual English/Hindi)

### 3.1 Font Stack

- **Latin / English**: `Inter` (geometric, legible at micro-sizes).
- **Devanagari / Hindi**: `Noto Sans Devanagari` (harmonized optical heights with Inter).
- **Monospace / Numerical**: `JetBrains Mono` (tabular numbers for scores, percentages, and IDs).

```css
--font-sans: 'Inter', 'Noto Sans Devanagari', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 3.2 Type Scale

| Scale Token | Size (rem / px) | Weight | Line Height | Usage |
|---|---|---|---|---|
| `text-display` | `2.25rem` (36px) | 700 (Bold) | 1.2 | Hero title (Landing page only) |
| `text-h1` | `1.875rem` (30px) | 700 (Bold) | 1.3 | Page headers (`Dashboard`, `Skill Gap`) |
| `text-h2` | `1.5rem` (24px) | 600 (Semibold) | 1.35 | Section headers |
| `text-h3` | `1.25rem` (20px) | 600 (Semibold) | 1.4 | Card headers |
| `text-body` | `1.0rem` (16px) | 400 (Regular) | 1.6 | Primary body copy, assessment questions |
| `text-sm` | `0.875rem` (14px) | 500 (Medium) | 1.5 | Subtext, table cells, form labels |
| `text-xs` | `0.75rem` (12px) | 600 (Semibold) | 1.4 | Provenance badges, status indicators |

### 3.3 Devanagari Specifics
- Minimum font size for Devanagari text is **14px** (`text-sm`) to preserve ligature readability.
- Text containers containing Hindi content use `line-height: 1.65` to prevent diacritic clipping.

---

## 4. Spacing & 4px Layout Grid

The interface is constructed strictly on a 4px layout rhythm:

| Spacing Token | Pixels | Application |
|---|---|---|
| `--spacing-1` | 4px | Tight internal badge padding |
| `--spacing-2` | 8px | Button inline gap, icon-to-text spacing |
| `--spacing-3` | 12px | Compact input field padding |
| `--spacing-4` | 16px | Standard card interior padding, mobile container margins |
| `--spacing-5` | 20px | Section gap on tablet |
| `--spacing-6` | 24px | Desktop card padding, grid gaps |
| `--spacing-8` | 32px | Major section breaks |
| `--spacing-12`| 48px | Minimum touch target height for buttons |

---

## 5. Component Design Tokens (shadcn/ui)

StatVidya uses [shadcn/ui](https://ui.shadcn.com/) primitives styled via Tailwind CSS v4 variables:

### 5.1 Card Specifications
- **Border Radius**: `--radius-card: 12px;`
- **Border**: `1px solid var(--border)`
- **Shadow**: `0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)`
- **Interactive Hover**: `0 4px 12px rgba(0, 0, 0, 0.08)` with a `-1px` transform lift.

### 5.2 Button Specifications
- **Height (Standard)**: `40px` (Desktop)
- **Height (Field / Tablet)**: `48px` (Ensures WCAG touch compliance for field enumerators)
- **Border Radius**: `--radius-btn: 8px;`
- **Font Weight**: `600 (Semibold)`

### 5.3 Input & Form Elements
- **Height**: `44px`
- **Border Radius**: `--radius-input: 8px;`
- **Focus Ring**: `2px solid var(--color-primary)` with `2px offset`.

---

## 6. Iconography

- **Library**: `lucide-react`.
- **Sizes**:
  - Small / Inline: `16px`
  - Standard / Button: `20px`
  - Navigation / Hero: `24px`
- Icons inherit text color dynamically (`currentColor`).

---

## 7. Motion & Micro-Interactions

Used purposefully to communicate state changes without causing cognitive fatigue:

| Interaction | Duration | Easing | Context |
|---|---|---|---|
| **Page Transition** | 180ms | `ease-out` | View changes |
| **Assessment Card Progression** | 220ms | `ease-in-out` | Next question load |
| **Progress Ring Fill** | 700ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Dashboard readiness gauge |
| **Sync Pulse** | 1500ms | `infinite` | 🟠 Offline queue syncing banner |

> **Strict Rule**: No animations are permitted during active assessment taking to ensure zero distraction. All motion respects `prefers-reduced-motion: reduce`.

---

## 8. Dark Mode Architecture

- Implemented via the `dark` class on `<html>` using Next.js `next-themes`.
- Persisted to browser `localStorage` and synchronized with user profile in Supabase.
- Charts (Radar, Scatter, Progress Rings) read theme CSS variables dynamically.

---

## 9. Provenance Badges (Visual Trust Spec)

Every domain object rendered in the UI carries an authoritative, non-collapsible badge:

```
┌────────────────────────────────────────────────────────────────────────┐
│  [✅ VERIFIED_OFFICIAL]    Green Border | #2E7D32 | Government Source │
│  [⚠️ PROPOSED_FRAMEWORK]   Amber Border | #F57F17 | Proposed by Team  │
│  [🟡 SYNTHETIC_DEMO_DATA]  Yellow Border| #F9A825 | Simulated for SIH │
└────────────────────────────────────────────────────────────────────────┘
```

- **Font Size**: `0.75rem` (12px), Semibold.
- **Border**: `1.5px solid <Color>`.
- **Interactive State**: Hover reveals an explanatory tooltip defining the exact data origin and verification methodology.

---

## 10. Field-First Responsive Breakpoints

| Breakpoint | Minimum Width | Target Environment | Navigation Pattern |
|---|---|---|---|
| `sm` | 640px | Mobile phones | Bottom sheet / Hamburger menu |
| `md` | 768px | Small tablets | Collapsed icon rail |
| `lg` | 1024px | **NSSO Field Tablets (Primary)** | Full sidebar, 48px touch targets |
| `xl` | 1280px | Headquarters desktop | Two-column analytics grid |
| `2xl` | 1536px | Large command center monitors | Three-column comprehensive dashboard |

---

## 11. Accessibility & WCAG 2.1 AA Compliance

1. **Color Contrast**:
   - Normal text maintains $\ge 4.5:1$ contrast against card and page backgrounds.
   - Large text ($\ge 18$px) maintains $\ge 3:1$ contrast.
2. **Keyboard Navigation**:
   - Every interactive control has an unambiguous `:focus-visible` outline (`2px solid var(--color-primary)`).
3. **Screen Reader Live Regions**:
   - The offline status banner uses `aria-live="assertive"` so field investigators are immediately notified of connectivity transitions.

---

## 12. Tailwind CSS v4 Configuration (`app/globals.css`)

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  /* Primary Institutional Palette */
  --color-primary: oklch(0.45 0.12 220);
  --color-primary-hover: oklch(0.38 0.12 220);
  --color-primary-light: oklch(0.94 0.03 220);
  
  /* Saffron Accent */
  --color-secondary: oklch(0.62 0.16 55);
  --color-secondary-hover: oklch(0.52 0.16 55);
  --color-secondary-light: oklch(0.96 0.04 55);
  
  /* Green Success */
  --color-tertiary: oklch(0.52 0.14 145);
  --color-tertiary-light: oklch(0.95 0.03 145);

  /* Functional Semantics */
  --color-success: oklch(0.52 0.14 145);
  --color-warning: oklch(0.65 0.17 75);
  --color-error: oklch(0.42 0.18 25);
  --color-info: oklch(0.45 0.14 250);

  /* Severity Tokens */
  --color-severity-high: var(--color-error);
  --color-severity-moderate: var(--color-warning);
  --color-severity-proficient: var(--color-success);

  /* Typography */
  --font-sans: 'Inter', 'Noto Sans Devanagari', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Component Radii */
  --radius-card: 12px;
  --radius-btn: 8px;
  --radius-badge: 6px;
  --radius-input: 8px;
}

@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --muted: oklch(0.965 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --border: oklch(0.922 0 0);
  }

  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.178 0 0);
    --card-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --border: oklch(0.269 0 0);
  }
}
```

---

*End of Design.md. Companion document: Architecture.md.*
