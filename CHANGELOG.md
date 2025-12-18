# Changelog

All notable changes to Street Evangelist Companion will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2024-12-18

### 🔧 Major Layout Refactor

Complete rewrite of layout system to avoid Obsidian CSS conflicts.

### Changed
- **JavaScript-controlled layout** - All heights now calculated via JavaScript using ResizeObserver
- **No Obsidian CSS dependencies** - Plugin no longer uses any `.workspace-*` selectors
- **Pixel-based sizing** - Replaced percentage heights with explicit pixel calculations
- **Automatic resize handling** - Layout updates automatically when window resizes

### Fixed
- ✅ Scrolling now works properly on both desktop and mobile
- ✅ Footer stays visible at bottom of screen
- ✅ No more white space issues from Obsidian CSS conflicts
- ✅ Content area properly contained within available space

### Technical Details
- Added `ResizeObserver` to recalculate content height on resize
- Layout calculates: `contentHeight = containerHeight - headerHeight - navHeight - footerHeight`
- Removed all `height: 100%` CSS rules that depended on parent chain
- Simplified CSS to pure styling (no layout dependencies)

---

## [1.0.1] - 2024-12-18

### Added
- ✅ Donation/support settings with multiple payment methods (PayPal, CashApp, Venmo, Zelle, etc.)
- ✅ Configurable donation URLs in plugin settings
- ✅ Accordion scroll position preservation

### Fixed
- ✅ Form field heights increased to 44px minimum for better touch targets
- ✅ Dropdown text now readable (15px font size)
- ✅ Settings dropdown no longer causes page jump
- ✅ Ministry sub-navigation height corrected (60px min-height, 44px buttons)

---

## [1.0.0] - 2024-12-17

### 🎉 Initial Release

First public release of Street Evangelist Companion - a comprehensive tool for COOLJC street ministry.

### Added

#### Phase 1: Core Plugin Foundation
- ✅ 5-tab navigation system (Home, Timeline, Toolkit, Doctrine, Journal)
- ✅ Mobile-first responsive design
- ✅ Custom design system with CSS variables
- ✅ Plugin settings panel
- ✅ Ribbon icon for quick access
- ✅ Command palette integration

#### Phase 2: Interactive Evangelism Timeline
- ✅ 7 historical eras from Apostolic Age to Modern Day
- ✅ 25+ significant events with scripture references
- ✅ Expandable/collapsible era sections
- ✅ Category filtering (All, Apostolic Focus, COOLJC)
- ✅ Beautiful timeline visualization with gradient line
- ✅ Event significance levels (foundational, major, significant)

#### Phase 3: Street Ministry Toolkit
- ✅ Quick encounter logging with form
- ✅ Outcome tracking (Prayer, Tract, Conversation, Salvation)
- ✅ Mood/feeling selection for encounters
- ✅ Encounter history with search
- ✅ Ministry statistics dashboard
- ✅ Export capabilities

#### Phase 4: Doctrine Reference
- ✅ COOLJC identity and beliefs overview
- ✅ Oneness theology explanation with scripture
- ✅ Acts 2:38 salvation plan (Repent, Baptize, Receive)
- ✅ Holiness standards (modesty, uncut hair, no jewelry)
- ✅ Apologetics section with 8 common objections
- ✅ Comparison chart (Oneness vs Trinity)
- ✅ Key scripture references throughout

#### Phase 5: Ministry Journal
- ✅ Journal entry creation with mood tracking
- ✅ Prayer request management (active/answered)
- ✅ Testimony recording
- ✅ Scripture memory system with progress tracking
- ✅ Note-based storage with YAML frontmatter
- ✅ Two-way sync between notes and plugin
- ✅ Configurable folder paths

### Technical
- ✅ TypeScript implementation
- ✅ esbuild for fast compilation
- ✅ Mobile-optimized touch scrolling
- ✅ CSS custom properties for theming
- ✅ Obsidian API integration
- ✅ Data persistence via plugin settings

---

## [Unreleased]

### Planned Features
- 🔲 Dark/Light theme toggle
- 🔲 Export ministry data to CSV
- 🔲 Encounter location tracking (with permission)
- 🔲 Ministry partner collaboration
- 🔲 Push notification reminders
- 🔲 Audio testimony recording
- 🔲 Verse of the day widget
- 🔲 Ministry goal setting
- 🔲 Weekly/monthly reports
- 🔲 Cloud sync support

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.1.0 | 2024-12-18 | JavaScript layout system, no Obsidian CSS conflicts |
| 1.0.1 | 2024-12-18 | Donation settings, UI fixes |
| 1.0.0 | 2024-12-17 | Initial release with all 5 phases |

---

*Greater Life Ministry - Equipping saints for street evangelism*

🔥 **Go forth and be a witness!** 🔥
