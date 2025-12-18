# 🔥 Street Evangelist Companion

> **A mobile-first Obsidian plugin for street ministry education and tracking**

*Version 1.1.0 | Developed by [Greater Life Ministry](https://www.billaking.com) for the Church of Our Lord Jesus Christ (COOLJC)*

---

## 📖 Overview

Street Evangelist Companion is a comprehensive tool designed to equip believers for effective street evangelism. Whether you're a seasoned minister or just beginning your journey in outreach, this plugin provides everything you need to grow in knowledge, track your ministry, and stay grounded in Apostolic doctrine.

### ✨ Key Features

- **📜 Evangelism Timeline** - Journey through 2000+ years of Gospel history
- **🛠️ Ministry Toolkit** - Track encounters, log outcomes, view statistics
- **📚 Doctrine Reference** - COOLJC beliefs, Oneness theology, apologetics
- **📝 Ministry Journal** - Write entries, prayer requests, testimonies
- **📖 Scripture Memory** - Build your arsenal of evangelism verses

---

## 🚀 Quick Start

### Installation

1. Copy the `street-evangelist-companion` folder to your Obsidian plugins directory:
   ```
   YourVault/.obsidian/plugins/street-evangelist-companion/
   ```

2. Open Obsidian Settings → Community Plugins

3. Enable "Street Evangelist Companion"

4. Click the 🔥 icon in the left ribbon or use the command palette

### First Steps

1. **Open the plugin** - Click the flame icon in the ribbon
2. **Explore the Timeline** - Learn the history of evangelism
3. **Log your first encounter** - Use the Toolkit to track ministry
4. **Study doctrine** - Review Oneness beliefs and apologetics
5. **Start journaling** - Document your spiritual journey

---

## 📱 Mobile-First Design

This plugin is designed for **mobile ministry**. Take it with you on the streets:

- **Touch-optimized** navigation and buttons
- **Offline capable** - No internet required
- **Quick actions** - Fast encounter logging
- **Large tap targets** - Easy to use outdoors

---

## 🗂️ The Five Tabs

### 1. 🏠 Home
Your ministry dashboard showing:
- Personalized greeting
- Quick access to key features
- Ministry statistics at a glance
- Encouraging scripture

### 2. 📜 Timeline
Interactive history of Christian evangelism:
- **7 Major Eras** from Apostolic Age to Modern Day
- **25+ Historical Events** with scripture references
- **Filter by Category**: All, Apostolic Focus, COOLJC
- Expandable sections with detailed information

### 3. 🛠️ Toolkit
Your street ministry command center:
- **Log Encounters** - Record ministry interactions
- **View History** - See all past encounters
- **Statistics** - Track your ministry growth
- **Outcome Tracking** - Prayer, Tracts, Conversations, Salvations

### 4. 📚 Doctrine
Complete COOLJC doctrinal reference:
- **Overview** - Who we are and what we believe
- **Oneness** - Oneness theology explained
- **Salvation** - Acts 2:38 plan of salvation
- **Holiness** - Standards of holy living
- **Apologetics** - Answers to common objections

### 5. 📝 Journal
Your spiritual ministry diary:
- **Write Entries** - Daily ministry reflections
- **Prayer Requests** - Track prayer needs and answers
- **Testimonies** - Record God's faithfulness
- **Scripture Memory** - Memorize key verses

---

## 📝 Note Integration

The plugin can create actual Obsidian notes for your journal entries:

### Enable Note Creation
1. Go to Settings → Street Evangelist Companion
2. Enable "Create Notes for Journal Entries"
3. Configure folder paths for each type:
   - Journal entries: `Ministry/Journal`
   - Prayer requests: `Ministry/Prayers`
   - Testimonies: `Ministry/Testimonies`

### Note Format
Notes are created with YAML frontmatter for easy searching:

```yaml
---
type: journal-entry
plugin: street-evangelist-companion
date: 2024-12-17
mood: joyful
tags:
  - ministry
  - journal
---

Today's ministry was powerful...
```

### Two-Way Sync
- Edit notes in the plugin OR in Obsidian's editor
- Use "Sync Ministry Notes" command to update
- Notes respect your edits outside the plugin

---

## ⚙️ Settings

Access settings via the ⚙️ icon in the header or Settings → Street Evangelist Companion

| Setting | Description | Default |
|---------|-------------|---------|
| Minister Name | Your name for personalized greetings | "Minister" |
| Ministry Name | Your church/ministry name | "Greater Life Ministry" |
| Create Notes | Save journal entries as Obsidian notes | Enabled |
| Journal Folder | Path for journal notes | `Ministry/Journal` |
| Prayer Folder | Path for prayer notes | `Ministry/Prayers` |
| Testimony Folder | Path for testimony notes | `Ministry/Testimonies` |

---

## 🎯 Commands

Access via Command Palette (Ctrl/Cmd + P):

| Command | Description |
|---------|-------------|
| Open Street Evangelist | Opens the main plugin view |
| Sync Ministry Notes | Syncs notes from folders back to plugin |

---

## 📊 Tracking Your Ministry

### Encounter Types
- 👋 **Initial Contact** - First meeting
- 🙏 **Prayer** - Prayed with someone
- 📄 **Tract** - Shared literature
- 💬 **Conversation** - Extended discussion
- ✨ **Salvation** - Led someone to Christ!

### Statistics Tracked
- Total encounters
- Souls saved
- Prayers offered
- Tracts distributed
- Conversations had

---

## 🙏 Scripture Arsenal

Built-in verses for memorization and sharing:

| Reference | Topic |
|-----------|-------|
| Romans 3:23 | All have sinned |
| Acts 2:38 | Salvation plan |
| John 3:5 | Born of water and Spirit |
| 1 Timothy 3:16 | Godliness mystery |
| Colossians 2:9 | Fullness of Godhead |
| Isaiah 43:11 | No Savior but God |

---

## 🔧 For Developers

### Technical Architecture

This plugin uses **JavaScript-controlled layout** to avoid Obsidian CSS conflicts:
- All heights calculated via `ResizeObserver` in pixels
- No dependency on Obsidian's `.workspace-*` CSS classes
- CSS handles styling only, not layout
- Works reliably on desktop and mobile

### Building from Source

```bash
# Install dependencies
npm install

# Development build
npm run dev

# Production build
npm run build
```

### Project Structure
```
street-evangelist-companion/
├── main.ts          # Main plugin code (includes ResizeObserver layout)
├── styles.css       # Mobile-first styles (no Obsidian dependencies)
├── manifest.json    # Plugin manifest
├── package.json     # Dependencies
└── esbuild.config.mjs
```

---

## 📜 License

MIT License - Free to use and modify for ministry purposes.

---

## 🤝 Support

- **Website**: [billaking.com](https://www.billaking.com)
- **Issues**: Report bugs or request features
- **Prayer**: We covet your prayers for this ministry tool

---

## 🙌 Credits

**Developed by**: Greater Life Ministry  
**Author**: William King  
**Purpose**: Equipping saints for the work of ministry (Ephesians 4:12)

---

*"Go ye into all the world, and preach the gospel to every creature."* — Mark 16:15

🔥 **Go forth and be a witness!** 🔥
