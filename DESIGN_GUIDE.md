# Street Evangelist Companion - Design Guide

## 🎨 Design Philosophy

This plugin follows a **mobile-first, ministry-focused** design approach:
- Touch-friendly targets (minimum 44px)
- High contrast for outdoor visibility
- Warm, inviting colors reflecting faith and hope
- Smooth animations for modern UX
- **CRITICAL: No dependency on Obsidian's CSS classes**
- **JavaScript-controlled layout** (heights calculated in pixels)
- Use explicit pixel values for component sizing (not rem/em)

---

## ⚠️ Layout Architecture

### Why JavaScript Controls Layout

Obsidian's internal CSS (`app.css`) sets height rules that conflict with plugin CSS. To avoid these conflicts:

1. **All heights are calculated in JavaScript** using `ResizeObserver`
2. **No `height: 100%` in CSS** - this depends on parent chain
3. **No `.workspace-*` selectors** - don't reference Obsidian's classes
4. **CSS is for styling only** - colors, spacing, typography

### The Layout Formula

```javascript
contentHeight = containerHeight - headerHeight - navHeight - footerHeight
```

This is calculated on:
- Initial render
- Window resize (via ResizeObserver)
- Tab changes

---

## 🎯 Color Palette

### Primary Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--sec-gold` | `#f59e0b` | Primary accent, highlights, CTAs |
| `--sec-gold-dark` | `#d97706` | Hover states, emphasis |
| `--sec-gold-light` | `#fbbf24` | Subtle highlights |

### Spiritual Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--sec-spirit` | `#8b5cf6` | Spirit/prayer elements |
| `--sec-spirit-dark` | `#7c3aed` | Spirit hover states |
| `--sec-fire` | `#ef4444` | Revival, urgency, alerts |
| `--sec-hope` | `#22c55e` | Success, growth, hope |
| `--sec-water` | `#3b82f6` | Baptism, peace, info |

### Neutral Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--sec-bg` | `#0f172a` | Main background (dark theme) |
| `--sec-bg-soft` | `#1e293b` | Card backgrounds |
| `--sec-bg-muted` | `#334155` | Subtle backgrounds |
| `--sec-text` | `#f8fafc` | Primary text |
| `--sec-text-muted` | `#94a3b8` | Secondary text |
| `--sec-text-dim` | `#64748b` | Tertiary text |
| `--sec-border` | `#475569` | Borders, dividers |

---

## 📐 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `--sec-space-xs` | `4px` | Tight spacing |
| `--sec-space-sm` | `8px` | Small gaps |
| `--sec-space-md` | `16px` | Standard spacing |
| `--sec-space-lg` | `24px` | Section padding |
| `--sec-space-xl` | `32px` | Large gaps |
| `--sec-space-2xl` | `48px` | Major sections |

---

## 📏 Component Sizing Standards

**CRITICAL: Always use explicit pixel values for interactive components to ensure consistent rendering across devices.**

### Navigation Tabs
| Property | Desktop | Mobile (< 480px) |
|----------|---------|------------------|
| Nav min-height | `60px` | `54px` |
| Tab min-height | `44px` | `40px` |
| Tab padding | `8px 4px` | `6px 2px` |
| Icon font-size | `20px` | `18px` |
| Label font-size | `11px` | `9px` |
| Gap between icon/label | `4px` | `4px` |

### Action Buttons (Quick Actions Grid)
| Property | Desktop | Mobile (< 480px) |
|----------|---------|------------------|
| Button min-height | `70px` | `64px` |
| Button padding | `12px 8px` | `10px 6px` |
| Icon font-size | `24px` | `20px` |
| Label font-size | `12px` | `11px` |
| Grid gap | `8px` | `8px` |

### Standard Buttons
| Property | Default | Small | Large |
|----------|---------|-------|-------|
| Min-height | `44px` | `36px` | `52px` |
| Padding | `12px 20px` | `8px 16px` | `16px 32px` |
| Font-size | `14px` | `13px` | `16px` |
| Border-radius | `8px` | `6px` | `10px` |

### Cards
| Property | Value |
|----------|-------|
| Padding | `16px` |
| Border-radius | `12px` |
| Border | `1px solid var(--sec-border)` |

### Icons & Labels Pattern
```css
/* Always use this pattern for icon + label components */
.component-icon {
    font-size: 20px;      /* Explicit pixel size */
    line-height: 1;       /* Tight line-height */
    display: block;       /* Block display */
}

.component-label {
    font-size: 11px;      /* Explicit pixel size */
    line-height: 1;       /* Tight line-height */
    display: block;       /* Block display */
    white-space: nowrap;  /* Prevent wrapping */
}
```

---

## 🔲 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--sec-radius-sm` | `6px` | Small elements |
| `--sec-radius` | `8px` | Buttons, inputs |
| `--sec-radius-lg` | `12px` | Cards |
| `--sec-radius-xl` | `16px` | Modals |
| `--sec-radius-full` | `9999px` | Pills, avatars |

---

## 🌊 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--sec-shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle depth |
| `--sec-shadow` | `0 4px 6px -1px rgba(0,0,0,0.4)` | Standard elevation |
| `--sec-shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.5)` | Elevated elements |
| `--sec-shadow-glow` | `0 0 20px rgba(245,158,11,0.3)` | Golden glow effect |

---

## ✨ Animation Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--sec-transition` | `all 0.2s ease` | Standard transitions |
| `--sec-transition-slow` | `all 0.3s ease` | Deliberate animations |
| `--sec-transition-spring` | `all 0.4s cubic-bezier(0.34,1.56,0.64,1)` | Bouncy effects |

---

## 📱 Breakpoints

| Name | Value | Usage |
|------|-------|-------|
| Mobile | `< 480px` | Phone portrait |
| Tablet | `480px - 768px` | Phone landscape, small tablets |
| Desktop | `> 768px` | Large tablets, desktop |

---

## 🏗️ Component Structure

### Navigation Tabs
- 5 main tabs with icons + labels
- Structure: `<button>` → `<span class="icon">` + `<span class="label">`
- Active state: golden underline + scale
- Min-height: 44px (40px mobile)
- Icon: 20px (18px mobile)
- Label: 11px (9px mobile)

### Cards
- Background: `--sec-bg-soft`
- Border: 1px `--sec-border`
- Radius: 12px
- Shadow: `--sec-shadow`
- Padding: 16px

### Buttons
- Primary: Golden gradient
- Secondary: Outlined
- Min-height: 44px (touch target)
- Font-size: 14px

### Icon + Label Components
**Standard pattern for all icon+label buttons:**
```html
<button class="sec-component">
    <span class="sec-component-icon">🏠</span>
    <span class="sec-component-label">Home</span>
</button>
```
```css
.sec-component {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 44px;
}
.sec-component-icon {
    font-size: 20px;
    line-height: 1;
    display: block;
}
.sec-component-label {
    font-size: 11px;
    line-height: 1;
    display: block;
}
```

---

## 🌙 Theme Support

The design uses dark colors by default for:
- Better outdoor visibility
- Reduced eye strain during evening ministry
- Modern, professional appearance

Light theme variables are available via `.sec-light` class.

---

## 📖 Icon System

Using emoji icons for universal compatibility:
- 🏠 Home/Overview
- 📜 Timeline/History
- 🎯 Street Ministry
- ✝️ Doctrine
- 📝 Journal
- 🙏 Prayer
- 📖 Scripture

---

## 🔧 CSS Class Naming

All classes prefixed with `sec-` (Street Evangelist Companion):
- `sec-container` - Main wrapper
- `sec-nav` - Navigation bar
- `sec-nav-tab` - Navigation tab button
- `sec-nav-icon` - Tab icon
- `sec-nav-label` - Tab label
- `sec-card` - Card component
- `sec-btn` - Button component
- `sec-action-btn` - Quick action button
- `sec-action-icon` - Action button icon
- `sec-action-label` - Action button label

---

## ⚠️ Critical Rules

1. **Never use rem/em for component heights** - Use explicit px values
2. **Always set min-height on interactive elements** - 44px minimum for touch
3. **Use display: block + line-height: 1** for icons and labels
4. **Test on mobile viewport** before finalizing any component
5. **Keep icon + label gap small** - 4px standard

This prevents conflicts with Obsidian's styles.
