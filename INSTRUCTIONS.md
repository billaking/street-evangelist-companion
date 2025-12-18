# 🔧 Street Evangelist Companion - Installation & Setup Instructions

> **Step-by-step guide to installing and configuring the plugin**

---

## 📋 Prerequisites

Before installing, ensure you have:

- ✅ [Obsidian](https://obsidian.md) installed (v1.0.0 or higher)
- ✅ An Obsidian vault created
- ✅ Community plugins enabled

---

## 📥 Installation Methods

### Method 1: Manual Installation (Recommended)

**Step 1: Download the Plugin**
```
Download these files:
├── main.js
├── manifest.json
└── styles.css
```

**Step 2: Locate Your Plugins Folder**

| Platform | Path |
|----------|------|
| Windows | `C:\Users\YOU\Documents\Obsidian Vault\.obsidian\plugins\` |
| macOS | `/Users/YOU/Documents/Obsidian Vault/.obsidian/plugins/` |
| Linux | `/home/YOU/Documents/Obsidian Vault/.obsidian/plugins/` |
| Android | `/storage/emulated/0/Documents/Obsidian/.obsidian/plugins/` |
| iOS | Via Files app in Obsidian vault |

**Step 3: Create Plugin Folder**
```bash
# Create the folder
mkdir street-evangelist-companion

# Your structure should look like:
.obsidian/
└── plugins/
    └── street-evangelist-companion/
        ├── main.js
        ├── manifest.json
        └── styles.css
```

**Step 4: Enable the Plugin**
1. Open Obsidian
2. Go to **Settings** (gear icon)
3. Select **Community plugins**
4. Click **Turn on community plugins** (if first time)
5. Find "Street Evangelist Companion"
6. Toggle it **ON**

---

### Method 2: Build from Source

**Step 1: Clone/Download Source**
```bash
# Navigate to your plugins folder
cd /path/to/vault/.obsidian/plugins

# Create and enter the folder
mkdir street-evangelist-companion
cd street-evangelist-companion
```

**Step 2: Add Source Files**
Copy these files to the folder:
- `main.ts`
- `styles.css`
- `manifest.json`
- `package.json`
- `tsconfig.json`
- `esbuild.config.mjs`

**Step 3: Install Dependencies**
```bash
npm install
```

**Step 4: Build the Plugin**
```bash
# Production build
npm run build

# OR development mode (auto-rebuild on changes)
npm run dev
```

**Step 5: Enable in Obsidian**
1. Restart Obsidian (or reload plugins)
2. Settings → Community plugins
3. Enable "Street Evangelist Companion"

---

## ⚙️ Initial Configuration

### Step 1: Open Plugin Settings

1. Click the ⚙️ gear icon in the plugin header
   
   OR
   
2. Go to Settings → Community plugins → Street Evangelist Companion → Options

### Step 2: Configure Basic Settings

```
┌─────────────────────────────────────────────────────┐
│ STREET EVANGELIST COMPANION SETTINGS                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Minister Name                                       │
│ ┌─────────────────────────────────────────────────┐│
│ │ [Your Name Here                               ] ││
│ └─────────────────────────────────────────────────┘│
│ Your name for personalized greetings               │
│                                                     │
│ Ministry Name                                       │
│ ┌─────────────────────────────────────────────────┐│
│ │ [Greater Life Ministry                        ] ││
│ └─────────────────────────────────────────────────┘│
│ Your church or ministry name                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Step 3: Configure Note Storage (Optional)

```
┌─────────────────────────────────────────────────────┐
│ NOTE STORAGE OPTIONS                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Create Notes for Journal Entries                    │
│ [✓] Enabled                                         │
│ Save entries as Obsidian notes with YAML frontmatter│
│                                                     │
│ Journal Folder                                      │
│ ┌─────────────────────────────────────────────────┐│
│ │ Ministry/Journal                               │ │
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Prayer Folder                                       │
│ ┌─────────────────────────────────────────────────┐│
│ │ Ministry/Prayers                               │ │
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Testimony Folder                                    │
│ ┌─────────────────────────────────────────────────┐│
│ │ Ministry/Testimonies                           │ │
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ [🔄 Sync Notes Now]                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📱 Mobile Setup

### Android

1. **Install Obsidian** from Google Play Store
2. **Create/Open** your vault
3. **Copy plugin files** to:
   ```
   /storage/emulated/0/Documents/YourVault/.obsidian/plugins/street-evangelist-companion/
   ```
4. **Enable** in Obsidian settings

**Tip**: Use a file manager like "Files by Google" or "Solid Explorer"

### iOS/iPadOS

1. **Install Obsidian** from App Store
2. **Open** your vault
3. **Use Files app** to navigate to:
   ```
   On My iPhone/iPad > Obsidian > YourVault > .obsidian > plugins
   ```
4. **Create folder** `street-evangelist-companion`
5. **Copy** main.js, manifest.json, styles.css
6. **Enable** in Obsidian settings

**Tip**: Use iCloud Drive or AirDrop to transfer files

---

## 🔄 Syncing Across Devices

### Option 1: Obsidian Sync (Paid)
- Official sync service
- Includes plugin settings
- End-to-end encrypted

### Option 2: iCloud (Apple devices)
- Store vault in iCloud Drive
- Plugins sync automatically
- Works across Mac/iPhone/iPad

### Option 3: Syncthing (Free)
- Open-source sync
- Works on all platforms
- Peer-to-peer (no cloud)

### Option 4: Git
- For developers
- Version control included
- Manual sync required

**Important**: Always sync the entire `.obsidian/plugins/street-evangelist-companion/` folder including `data.json` for your settings.

---

## ✅ Verification Checklist

After installation, verify everything works:

- [ ] Plugin appears in Community plugins list
- [ ] 🔥 Flame icon appears in left ribbon
- [ ] Clicking flame opens the plugin
- [ ] All 5 tabs are visible (Home, Timeline, Toolkit, Doctrine, Journal)
- [ ] Settings page loads correctly
- [ ] Can log a test encounter
- [ ] Can create a test journal entry
- [ ] Timeline expands/collapses
- [ ] Footer visible on all tabs
- [ ] Scrolling works on all content

---

## 🔧 Development Setup

For developers wanting to modify the plugin:

### Requirements
- Node.js 16+ 
- npm or yarn
- TypeScript knowledge helpful

### Commands

```bash
# Install dependencies
npm install

# Development build (watches for changes)
npm run dev

# Production build
npm run build

# Type checking
npx tsc --noEmit
```

### File Structure
```
street-evangelist-companion/
├── main.ts              # Main plugin TypeScript
├── styles.css           # All CSS styles
├── manifest.json        # Plugin metadata
├── package.json         # npm configuration
├── tsconfig.json        # TypeScript config
├── esbuild.config.mjs   # Build configuration
├── README.md            # Documentation
├── CHANGELOG.md         # Version history
├── USERGUIDE.md         # User documentation
├── INSTRUCTIONS.md      # This file
└── data.json            # User data (auto-created)
```

### Making Changes

1. Edit `main.ts` for functionality
2. Edit `styles.css` for styling
3. Run `npm run build` to compile
4. Reload Obsidian to see changes

---

## 🆘 Getting Help

### Common Issues

**"Plugin not found"**
- Ensure folder name is exactly `street-evangelist-companion`
- Check all 3 files are present (main.js, manifest.json, styles.css)

**"Failed to load plugin"**
- Check Developer Console for errors (`Ctrl+Shift+I`)
- Ensure main.js is not corrupted

**"Settings not saving"**
- Check vault folder permissions
- Try creating data.json manually (empty: `{}`)

### Support Channels

- 📧 **Email**: Contact via [billaking.com](https://www.billaking.com)
- 🐛 **Bug Reports**: Include device, OS, Obsidian version
- 💡 **Feature Requests**: We welcome ministry-focused ideas

---

## 📜 License

MIT License - Free to use, modify, and distribute for ministry purposes.

---

*"Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."* — 2 Timothy 2:15

🔥 **Greater Life Ministry** 🔥

*Equipping saints for street evangelism*
