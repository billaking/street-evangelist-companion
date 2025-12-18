# 🛠️ Street Evangelist Companion - Developer Guide

> **Technical documentation for plugin development and customization**

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    STREET EVANGELIST COMPANION              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Plugin    │  │    View     │  │    Settings Tab     │ │
│  │   (main)    │──│  (ItemView) │──│  (PluginSettingTab) │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│         │                │                    │             │
│         ▼                ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    DATA LAYER                           ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              ││
│  │  │ Settings │  │Encounters│  │ Journal  │              ││
│  │  │data.json │  │ entries  │  │ entries  │              ││
│  │  └──────────┘  └──────────┘  └──────────┘              ││
│  └─────────────────────────────────────────────────────────┘│
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   NOTE STORAGE                          ││
│  │  Ministry/Journal/*.md  Ministry/Prayers/*.md  etc.    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Critical Design Principle: No Obsidian CSS Dependencies

**This plugin uses JavaScript-calculated pixel heights to completely bypass Obsidian's CSS.**

### Why?
Obsidian's internal CSS (`app.css`) sets `height: 100%` on various elements, which creates conflicts when plugins try to use percentage-based heights. This causes:
- White space appearing below content
- Scrolling not working properly
- Footer being pushed off-screen

### Solution: JavaScript Layout System

```typescript
// In StreetEvangelistView class
private resizeObserver: ResizeObserver | null = null;

private setupLayout(): void {
    const updateLayout = () => {
        const containerHeight = this.container.clientHeight;
        const wrapper = this.container.querySelector('.sec-container') as HTMLElement;
        const header = this.container.querySelector('.sec-header') as HTMLElement;
        const nav = this.container.querySelector('.sec-nav') as HTMLElement;
        const content = this.container.querySelector('.sec-content') as HTMLElement;
        const footer = this.container.querySelector('.sec-footer') as HTMLElement;

        if (wrapper && header && nav && content && footer) {
            // Set wrapper to exact pixel height
            wrapper.style.height = `${containerHeight}px`;
            
            // Calculate content height = total - header - nav - footer
            const headerHeight = header.offsetHeight;
            const navHeight = nav.offsetHeight;
            const footerHeight = footer.offsetHeight;
            const contentHeight = containerHeight - headerHeight - navHeight - footerHeight;
            
            content.style.height = `${contentHeight}px`;
            content.style.overflow = 'auto';
        }
    };

    setTimeout(updateLayout, 0);
    this.resizeObserver = new ResizeObserver(updateLayout);
    this.resizeObserver.observe(this.container);
}
```

### CSS Rules
- **DO NOT** use `height: 100%` anywhere
- **DO NOT** reference any `.workspace-*` Obsidian classes
- **DO** use simple styling without layout dependencies
- **DO** let JavaScript handle all height calculations

---

## 🗂️ File Structure

```
street-evangelist-companion/
│
├── main.ts                 # Main plugin source (TypeScript)
│   ├── Plugin class        # StreetEvangelistPlugin
│   ├── View class          # StreetEvangelistView (with ResizeObserver)
│   └── Settings class      # StreetEvangelistSettingTab
│
├── styles.css              # All CSS (mobile-first, NO layout)
│   ├── CSS Variables       # Design tokens
│   ├── Base styles         # Colors, typography
│   ├── Component styles    # Cards, buttons, forms
│   └── Responsive          # Media queries
│
├── manifest.json           # Plugin metadata
├── package.json            # npm dependencies
├── tsconfig.json           # TypeScript configuration
├── esbuild.config.mjs      # Build configuration
│
├── README.md               # Main documentation
├── CHANGELOG.md            # Version history
├── USERGUIDE.md            # User documentation
├── INSTRUCTIONS.md         # Installation guide
├── DEVELOPER.md            # This file
└── DESIGN_GUIDE.md         # Design system docs
```

---

## 🔧 Development Setup

### Prerequisites

```bash
# Required
node --version  # v16.0.0 or higher
npm --version   # v7.0.0 or higher

# Recommended
# VS Code with TypeScript extension
```

### Initial Setup

```bash
# Navigate to plugin folder
cd /path/to/vault/.obsidian/plugins/street-evangelist-companion

# Install dependencies
npm install

# Start development mode
npm run dev
```

### Build Commands

```bash
# Development (watch mode)
npm run dev

# Production build
npm run build

# Type checking only
npx tsc --noEmit
```

---

## 📊 Data Models

### Settings Interface

```typescript
interface StreetEvangelistSettings {
    // User info
    ministerName: string;           // Default: "Minister"
    ministryName: string;           // Default: "Greater Life Ministry"
    
    // Note settings
    createNotes: boolean;           // Default: true
    journalFolder: string;          // Default: "Ministry/Journal"
    prayerFolder: string;           // Default: "Ministry/Prayers"
    testimonyFolder: string;        // Default: "Ministry/Testimonies"
    encounterFolder: string;        // Default: "Ministry/Encounters"
    
    // Data storage
    encounters: Encounter[];
    journalEntries: JournalEntry[];
    prayerRequests: PrayerRequest[];
    testimonies: Testimony[];
    memoryVerses: MemoryVerse[];
}
```

### Encounter Interface

```typescript
interface Encounter {
    id: string;              // UUID
    date: string;            // ISO date string
    location: string;
    notes: string;
    outcome: EncounterOutcome;  // 'prayer' | 'tract' | 'conversation' | 'salvation' | 'other'
    feeling: EncounterFeeling;  // 'joyful' | 'hopeful' | 'challenged' | 'peaceful'
}
```

### Journal Entry Interface

```typescript
interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    mood: Mood;              // 'joyful' | 'grateful' | 'reflective' | 'challenged' | 'hopeful'
    tags: string[];
}
```

### Prayer Request Interface

```typescript
interface PrayerRequest {
    id: string;
    date: string;
    subject: string;
    details: string;
    answered: boolean;
    answeredDate?: string;
    answeredNote?: string;
}
```

### Memory Verse Interface

```typescript
interface MemoryVerse {
    id: string;
    reference: string;       // e.g., "Acts 2:38"
    text: string;
    status: VerseStatus;     // 'new' | 'learning' | 'memorized'
    dateAdded: string;
    lastReviewed?: string;
}
```

---

## 🎨 CSS Architecture

### Design Tokens (CSS Variables)

```css
:root {
    /* Primary Colors */
    --sec-gold: #f59e0b;
    --sec-gold-dark: #d97706;
    --sec-spirit: #8b5cf6;
    --sec-fire: #ef4444;
    --sec-hope: #22c55e;
    --sec-water: #3b82f6;
    
    /* Background */
    --sec-bg: #0f172a;
    --sec-bg-soft: #1e293b;
    --sec-bg-muted: #334155;
    
    /* Text */
    --sec-text: #f8fafc;
    --sec-text-muted: #94a3b8;
    
    /* Spacing */
    --sec-space-xs: 0.25rem;
    --sec-space-sm: 0.5rem;
    --sec-space-md: 1rem;
    --sec-space-lg: 1.5rem;
    --sec-space-xl: 2rem;
    
    /* Border Radius */
    --sec-radius-sm: 0.375rem;
    --sec-radius: 0.5rem;
    --sec-radius-lg: 0.75rem;
}
```

### BEM-like Naming Convention

```css
/* Block */
.sec-card { }

/* Element */
.sec-card-header { }
.sec-card-body { }
.sec-card-footer { }

/* Modifier */
.sec-card.highlighted { }
.sec-btn.sec-btn-primary { }
```

### Mobile-First Approach

```css
/* Base styles (mobile) */
.sec-content {
    padding: var(--sec-space-md);
}

/* Desktop enhancement */
@media (min-width: 481px) {
    .sec-content {
        padding: var(--sec-space-lg);
    }
}
```

---

## 🔌 Plugin Lifecycle

### Initialization

```typescript
class StreetEvangelistPlugin extends Plugin {
    async onload() {
        // 1. Load settings from data.json
        await this.loadSettings();
        
        // 2. Register the custom view
        this.registerView(
            VIEW_TYPE,
            (leaf) => new StreetEvangelistView(leaf, this)
        );
        
        // 3. Add ribbon icon
        this.addRibbonIcon('flame', 'Street Evangelist', () => {
            this.activateView();
        });
        
        // 4. Add commands
        this.addCommand({
            id: 'open-street-evangelist',
            name: 'Open Street Evangelist',
            callback: () => this.activateView()
        });
        
        // 5. Add settings tab
        this.addSettingTab(new StreetEvangelistSettingTab(this.app, this));
    }
    
    async onunload() {
        // Cleanup when plugin is disabled
    }
}
```

### View Rendering

```typescript
class StreetEvangelistView extends ItemView {
    async onOpen() {
        this.container = this.containerEl.children[1];
        this.render();
    }
    
    private render() {
        this.container.empty();
        
        const wrapper = this.container.createDiv({ cls: 'sec-container' });
        
        this.renderHeader(wrapper);
        this.renderNavigation(wrapper);
        
        const content = wrapper.createDiv({ cls: 'sec-content' });
        this.renderTabContent(content);
        
        this.renderFooter(wrapper);
    }
}
```

---

## 📝 Note Generation

### YAML Frontmatter

```typescript
function generateFrontmatter(data: FrontmatterData): string {
    let frontmatter = '---\n';
    frontmatter += `type: ${data.type}\n`;
    frontmatter += `plugin: street-evangelist-companion\n`;
    frontmatter += `date: ${data.date}\n`;
    
    if (data.mood) frontmatter += `mood: ${data.mood}\n`;
    if (data.tags?.length) {
        frontmatter += `tags:\n`;
        data.tags.forEach(tag => {
            frontmatter += `  - ${tag}\n`;
        });
    }
    
    frontmatter += '---\n\n';
    return frontmatter;
}
```

### File Creation

```typescript
async createJournalNote(entry: JournalEntry): Promise<void> {
    const folder = this.settings.journalFolder;
    await this.ensureFolderExists(folder);
    
    const filename = `${formatDateForFilename(entry.date)}-${sanitizeFilename(entry.title)}.md`;
    const path = normalizePath(`${folder}/${filename}`);
    
    const frontmatter = generateFrontmatter({
        type: 'journal-entry',
        date: entry.date,
        mood: entry.mood,
        tags: ['ministry', 'journal']
    });
    
    const content = frontmatter + `# ${entry.title}\n\n${entry.content}`;
    
    await this.app.vault.create(path, content);
}
```

### Note Syncing

```typescript
async syncJournalNotes(): Promise<void> {
    const folder = this.app.vault.getAbstractFileByPath(this.settings.journalFolder);
    if (!folder || !(folder instanceof TFolder)) return;
    
    for (const file of folder.children) {
        if (file instanceof TFile && file.extension === 'md') {
            const content = await this.app.vault.read(file);
            const { frontmatter, body } = parseFrontmatter(content);
            
            if (frontmatter.plugin === 'street-evangelist-companion') {
                // Update or create entry from note
                this.updateEntryFromNote(frontmatter, body);
            }
        }
    }
}
```

---

## 🧪 Testing

### Manual Testing Checklist

```
□ Plugin loads without errors
□ All tabs render correctly
□ Encounters save and display
□ Journal entries create notes
□ Prayer requests toggle answered
□ Timeline expands/collapses
□ Scripture memory updates status
□ Settings persist across reload
□ Mobile touch scrolling works
□ Footer visible on all tabs
```

### Debug Mode

```typescript
// Add to main.ts for debugging
const DEBUG = true;

function debug(...args: any[]) {
    if (DEBUG) console.log('[SEC]', ...args);
}

// Usage
debug('Encounter saved:', encounter);
```

---

## 🚀 Deployment

### Pre-release Checklist

```
□ All TypeScript compiles without errors
□ No console errors in production build
□ manifest.json version updated
□ CHANGELOG.md updated
□ README.md accurate
□ Tested on desktop (Windows/Mac/Linux)
□ Tested on mobile (iOS/Android)
```

### Build for Release

```bash
# Clean build
rm -rf node_modules
npm install
npm run build

# Files to distribute:
# - main.js
# - manifest.json
# - styles.css
```

---

## 🔄 Contributing

### Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Mobile-first CSS
- Comment complex logic
- Keep functions focused

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Update documentation
5. Submit PR with description

---

## 📚 Resources

### Obsidian API

- [Obsidian API Docs](https://docs.obsidian.md/)
- [Plugin Developer Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### CSS

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

---

*Happy coding! May your contributions bless many ministers.* 🔥
