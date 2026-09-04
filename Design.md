# Design.md

## StatVidya — Visual Design System

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Companion docs     | PRD.md, ARCHITECTURE.md, rules.md, Phases.md, memory.md      |
| Purpose            | Define the color palette, typography, spacing, component styling, and visual language for StatVidya |
| Status             | Draft v1.0                                                   |

> **Design direction**: Modern and approachable, not sterile-government. The product must feel credible and professional enough for MoSPI leadership, while being warm and intuitive enough for a field investigator on a tablet. Think: a well-designed gov-tech product like India's UPI apps or DigiLocker — institutional identity with modern execution.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Design Tokens](#5-component-design-tokens)
6. [Iconography](#6-iconography)
7. [Motion & Animation](#7-motion--animation)
8. [Dark Mode](#8-dark-mode)
9. [Provenance Badges](#9-provenance-badges)
10. [Responsive Breakpoints](#10-responsive-breakpoints)
11. [Accessibility](#11-accessibility)

---

## 1. Design Principles

1. **Clarity over decoration.** Every visual element must serve comprehension. If it doesn't help the user understand their data, remove it.
2. **Trust through transparency.** Provenance badges, labeled simulated data, and honest language are the visual system's highest-priority elements — not an afterthought.
3. **Field-first sizing.** Touch targets, font sizes, and spacing are designed for a mid-range Android tablet held in daylight, not a 27" monitor. Desktop adapts upward from this baseline.
4. **Bilingual from the start.** Hindi text can be 20–40% longer than English. Every layout must accommodate this without breaking.
5. **Consistent, not rigid.** Use the token system consistently, but adapt for context — the admin analytics page has different density needs than the assessment-taking page.

---

## 2. Color System

### 2.1 Primary Palette

Inspired by India's national identity (saffron–white–green tricolor) reinterpreted with modern, accessible tones. Not a literal flag palette — sophisticated, muted variations that feel institutional without feeling dated.

| Token                    | Light Mode           | Dark Mode            | Usage                                      |
| ------------------------ | -------------------- | -------------------- | ------------------------------------------ |
| `--color-primary`        | `#1B5E7B`            | `#4FC3F7`            | Primary actions, nav highlights, links      |
| `--color-primary-hover`  | `#14475E`            | `#81D4FA`            | Hover state on primary elements             |
| `--color-primary-light`  | `#E0F2F8`            | `#0D2B3E`            | Primary tint backgrounds                    |
| `--color-secondary`      | `#E67E22`            | `#FFB74D`            | Accent, badges, attention calls (saffron-inspired) |
| `--color-secondary-hover`| `#D35400`            | `#FFCC80`            | Hover on accent elements                    |
| `--color-secondary-light`| `#FEF3E2`            | `#3E2200`            | Accent tint backgrounds                     |
| `--color-tertiary`       | `#2E7D32`            | `#66BB6A`            | Success, positive indicators (green-inspired) |
| `--color-tertiary-light` | `#E8F5E9`            | `#1B3B1E`            | Success tint backgrounds                    |

### 2.2 Semantic Colors

| Token                    | Light Mode           | Dark Mode            | Usage                                      |
| ------------------------ | -------------------- | -------------------- | ------------------------------------------ |
| `--color-success`        | `#2E7D32`            | `#66BB6A`            | Proficient ✅, passed, synced              |
| `--color-warning`        | `#F57F17`            | `#FFC107`            | Moderate gap ⚠️, pending                  |
| `--color-error`          | `#C62828`            | `#EF5350`            | High gap 🔴, failed, error state           |
| `--color-info`           | `#1565C0`            | `#42A5F5`            | Informational badges, hints                |

### 2.3 Neutral Palette

| Token                    | Light Mode           | Dark Mode            | Usage                                      |
| ------------------------ | -------------------- | -------------------- | ------------------------------------------ |
| `--color-bg-primary`     | `#FFFFFF`            | `#0F172A`            | Page background                            |
| `--color-bg-secondary`   | `#F8FAFC`            | `#1E293B`            | Card/section background                    |
| `--color-bg-tertiary`    | `#F1F5F9`            | `#334155`            | Sidebar, input backgrounds                 |
| `--color-surface`        | `#FFFFFF`            | `#1E293B`            | Elevated card surface                      |
| `--color-surface-hover`  | `#F1F5F9`            | `#334155`            | Card hover state                           |
| `--color-border`         | `#E2E8F0`            | `#334155`            | Borders, dividers                          |
| `--color-border-strong`  | `#CBD5E1`            | `#475569`            | Emphasized borders (active inputs)         |
| `--color-text-primary`   | `#0F172A`            | `#F1F5F9`            | Headings, body text                        |
| `--color-text-secondary` | `#475569`            | `#94A3B8`            | Subtext, labels, captions                  |
| `--color-text-muted`     | `#94A3B8`            | `#64748B`            | Placeholder, disabled text                 |

### 2.4 Gap Severity Colors (PRD FR-COMP-2)

| Severity     | Badge Color              | Background Tint         |
| ------------ | ------------------------ | ----------------------- |
| HIGH 🔴      | `--color-error`          | `#FEF2F2` / `#2D1B1B`  |
| MODERATE ⚠️  | `--color-warning`        | `#FFFBEB` / `#2D2600`  |
| PROFICIENT ✅ | `--color-success`        | `#F0FDF4` / `#1B3B1E`  |

---

## 3. Typography

### 3.1 Font Stack

```css
/* Primary — works for both English and Hindi (Devanagari support) */
--font-primary: 'Inter', 'Noto Sans Devanagari', system-ui, -apple-system, sans-serif;

/* Monospace — for code, scores, formulas */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Why Inter**: Excellent readability at small sizes, wide weight range, free. Pairs well with Noto Sans Devanagari for Hindi text — both are clean, geometric, and designed for screen readability.

**Google Fonts import**:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 3.2 Type Scale

| Token            | Size    | Weight | Line Height | Usage                                  |
| ---------------- | ------- | ------ | ----------- | -------------------------------------- |
| `--text-display` | 2.25rem | 700    | 1.2         | Hero headings (landing page only)      |
| `--text-h1`      | 1.875rem| 700    | 1.3         | Page titles                            |
| `--text-h2`      | 1.5rem  | 600    | 1.35        | Section headings                       |
| `--text-h3`      | 1.25rem | 600    | 1.4         | Card titles, subsection headings       |
| `--text-h4`      | 1.125rem| 600    | 1.4         | Sub-card headings                      |
| `--text-body`    | 1rem    | 400    | 1.6         | Default body text                      |
| `--text-body-md` | 0.9375rem| 400   | 1.5         | Dense body text (admin tables)         |
| `--text-sm`      | 0.875rem| 400    | 1.5         | Labels, captions, badges               |
| `--text-xs`      | 0.75rem | 500    | 1.4         | Fine print, provenance badges, timestamps |

### 3.3 Hindi Typography Notes

- Hindi text uses **Noto Sans Devanagari** — matched weights with Inter.
- Hindi strings can be 20–40% longer. Test every UI element with Hindi content.
- **Don't truncate Hindi mid-word** — use `word-break: keep-all` for Devanagari text.
- Minimum font size for Hindi on mobile/tablet: **14px** (smaller becomes hard to read with Devanagari complex ligatures).

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Based on a 4px grid:

| Token       | Value   | Usage                               |
| ----------- | ------- | ----------------------------------- |
| `--space-1` | 4px     | Tight internal padding              |
| `--space-2` | 8px     | Icon-to-label gap, compact padding  |
| `--space-3` | 12px    | Standard inner padding              |
| `--space-4` | 16px    | Card padding, list item gap         |
| `--space-5` | 20px    | Section padding                     |
| `--space-6` | 24px    | Between sections                    |
| `--space-8` | 32px    | Page-level margins                  |
| `--space-10`| 40px    | Large section breaks                |
| `--space-12`| 48px    | Hero spacing                        |
| `--space-16`| 64px    | Page-level vertical spacing         |

### 4.2 Layout Structure

```
┌──────────────────────────────────────────────────┐
│ Topbar (h: 64px)                                  │
│   Logo | Breadcrumb/Title | Lang Toggle | Profile │
├──────────┬───────────────────────────────────────┤
│ Sidebar  │ Main Content Area                      │
│ (w: 260px│   max-width: 1200px                    │
│  desktop,│   padding: --space-6                   │
│  hidden  │                                        │
│  mobile) │                                        │
│          │                                        │
└──────────┴───────────────────────────────────────┘
```

- **Sidebar**: collapsible on desktop, drawer on tablet/mobile.
- **Content area**: centered with `max-width: 1200px` for readability.
- **Assessment page**: full-width, no sidebar — immersive focus mode.

---

## 5. Component Design Tokens

### 5.1 Cards

```css
--card-radius: 12px;
--card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
--card-shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--card-padding: var(--space-5);
--card-gap: var(--space-4);
```

### 5.2 Buttons

| Variant    | Background                | Text                     | Border                | Usage                        |
| ---------- | ------------------------- | ------------------------ | --------------------- | ---------------------------- |
| Primary    | `--color-primary`         | `#FFFFFF`                | none                  | Main CTAs                    |
| Secondary  | transparent               | `--color-primary`        | `--color-primary`     | Secondary actions             |
| Ghost      | transparent               | `--color-text-secondary` | none                  | Tertiary, icon-only actions   |
| Danger     | `--color-error`           | `#FFFFFF`                | none                  | Destructive actions           |
| Success    | `--color-success`         | `#FFFFFF`                | none                  | Confirm/approve               |

```css
--btn-radius: 8px;
--btn-height-sm: 32px;
--btn-height-md: 40px;
--btn-height-lg: 48px;     /* Use for tablet/field UI — larger touch target */
--btn-padding-x: var(--space-4);
--btn-font-weight: 600;
--btn-transition: all 150ms ease;
```

### 5.3 Inputs

```css
--input-radius: 8px;
--input-height: 44px;      /* 44px minimum for touch targets (WCAG) */
--input-padding: var(--space-3);
--input-border: 1px solid var(--color-border);
--input-border-focus: 2px solid var(--color-primary);
--input-bg: var(--color-bg-primary);
```

### 5.4 Badges

```css
--badge-radius: 6px;
--badge-padding: 2px 8px;
--badge-font-size: var(--text-xs);
--badge-font-weight: 600;
```

Badge variants:
- **Severity**: HIGH (red bg), MODERATE (amber bg), PROFICIENT (green bg)
- **Provenance**: Verified (green outline), Proposed (amber outline), Synthetic (yellow outline)
- **Evidence**: 🛡️ Assessment-verified (blue), ✍️ Self-assessed (gray)
- **Status**: Pending (gray), Approved (green), Rejected (red), Syncing (blue pulse animation)

---

## 6. Iconography

- **Icon library**: [Lucide Icons](https://lucide.dev/) — clean, consistent, MIT-licensed.
- **Icon size**: 20px default, 16px in tight spaces, 24px in nav/header.
- **Icon color**: inherits from text color — don't hardcode icon colors.
- **Usage rules**:
  - Every nav item has an icon.
  - Buttons with text use icon + label, never icon-only without a tooltip/aria-label.
  - Severity/provenance badges use emoji (🔴 ⚠️ ✅ 🛡️ ✍️) not custom icons — they're more universally readable and require no asset loading.

---

## 7. Motion & Animation

Using Framer Motion, sparingly:

| Animation                  | Duration | Easing                          | Where                                        |
| -------------------------- | -------- | ------------------------------- | -------------------------------------------- |
| Page transition            | 200ms    | `ease-out`                      | Route changes                                |
| Card enter                 | 150ms    | `ease-out`                      | Dashboard cards, gap cards loading            |
| Button press               | 100ms    | `ease-in-out`                   | Scale down 0.97 → 1.0                        |
| Toast/notification enter   | 250ms    | `spring(damping: 25)`           | Slide in from top-right                      |
| Progress ring fill         | 800ms    | `ease-in-out`                   | Readiness index animation on dashboard load  |
| Radar chart draw           | 600ms    | `ease-out`                      | Competency radar on profile/dashboard        |
| Offline status pulse       | 1500ms   | `infinite pulse`                | 🟠 indicator when pending sync               |
| Skeleton loading           | 1500ms   | `infinite shimmer`              | Content loading placeholders                 |

### 7.1 Animation Rules

- **Never animate during an assessment.** The assessment-taking UI must not have any distracting animations.
- **Respect `prefers-reduced-motion`.** Wrap all Framer Motion variants with a media query check.
- **No animation on first meaningful paint.** Page content should appear immediately; animations enhance, not gate, content visibility.
- **Offline indicator pulse is the only infinite animation** allowed in the main UI.

---

## 8. Dark Mode

- **Implementation**: CSS custom properties toggled via a `[data-theme="dark"]` attribute on `<html>`.
- **Default**: follow system preference via `prefers-color-scheme`.
- **User override**: stored in `localStorage` and the user's Firestore profile (`themePreference: 'light' | 'dark' | 'system'`).
- **All colors** have light/dark variants defined in §2 above.
- **Charts**: custom SVG charts must respond to theme — use CSS variables for fills and strokes, not hardcoded hex.

---

## 9. Provenance Badges (Visual Spec)

These are the single most important visual element for trust (PRD §9.3):

| Label                    | Badge Style                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| ✅ `VERIFIED_OFFICIAL`   | Green-outlined pill: `border: 1.5px solid #2E7D32`, `color: #2E7D32`, `bg: #F0FDF4` |
| ⚠️ `PROPOSED_FRAMEWORK` / `PROPOSED_METHODOLOGY` | Amber-outlined pill: `border: 1.5px solid #F57F17`, `color: #F57F17`, `bg: #FFFBEB` |
| 🟡 `SYNTHETIC_DEMO_DATA`| Yellow-outlined pill: `border: 1.5px solid #F9A825`, `color: #F9A825`, `bg: #FFFDE7` |

- Badge text uses `--text-xs` (0.75rem), font-weight 600.
- Always includes the emoji prefix for instant visual scanning.
- On hover: tooltip explains what the label means (e.g., "This data matches a real government structure").
- **Never hide these badges.** They appear on every surface showing competency, role, activity, or course data — no exceptions.

---

## 10. Responsive Breakpoints

| Breakpoint   | Value    | Target Device                              |
| ------------ | -------- | ------------------------------------------ |
| `sm`         | 640px    | Small phones                               |
| `md`         | 768px    | Large phones, small tablets                 |
| `lg`         | 1024px   | Tablets (primary target for FI persona)    |
| `xl`         | 1280px   | Laptops, desktops                          |
| `2xl`        | 1536px   | Large monitors                             |

### Layout Behavior

| Viewport     | Sidebar           | Content Width      | Font Scale | Touch Targets |
| ------------ | ----------------- | ------------------ | ---------- | ------------- |
| < 768px      | Hidden (hamburger)| Full width         | Base       | 48px min      |
| 768–1024px   | Collapsed (icons) | Full - sidebar     | Base       | 44px min      |
| > 1024px     | Expanded          | max 1200px centered| Base       | 40px min      |

### Tablet-First Design Rule

Since the Field Investigator persona uses a tablet (PRD §6.1):
- Design for **1024px width** as the primary target, then adapt down and up.
- Buttons in assessment mode use `--btn-height-lg` (48px).
- Gap cards, recommendation cards use full-width on tablet, 2-column grid on desktop.

---

## 11. Accessibility

Following WCAG 2.1 AA minimum (PRD §12):

### 11.1 Color Contrast

- All text on background: minimum **4.5:1** contrast ratio.
- Large text (18px+ or 14px bold): minimum **3:1** contrast ratio.
- UI components and graphical objects: minimum **3:1** contrast ratio.
- **Test every color pairing** in both light and dark mode before shipping.

### 11.2 Focus States

```css
/* Global focus-visible style */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- Every interactive element must have a visible `:focus-visible` state.
- Tab order follows visual order — no `tabindex` gymnastics.
- Skip-to-content link on every page.

### 11.3 Screen Reader Support

- All images have descriptive `alt` text.
- Charts provide a text alternative (data table or `aria-label` summarizing the key insight).
- Loading states use `aria-live="polite"` for screen reader announcements.
- The offline status indicator uses `aria-live="assertive"` — a connectivity change is important enough to announce.

---

## Tailwind CSS Configuration

The design tokens above map to Tailwind's `theme.extend` in `tailwind.config.ts`:

```typescript
// tailwind.config.ts — key excerpt
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B5E7B',
          hover: '#14475E',
          light: '#E0F2F8',
        },
        secondary: {
          DEFAULT: '#E67E22',
          hover: '#D35400',
          light: '#FEF3E2',
        },
        tertiary: {
          DEFAULT: '#2E7D32',
          light: '#E8F5E9',
        },
        surface: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
        severity: {
          high: '#C62828',
          moderate: '#F57F17',
          proficient: '#2E7D32',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        badge: '6px',
        input: '8px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
      },
    },
  },
};
```

---

*End of document. See rules.md for coding constraints, Phases.md for build plan.*
