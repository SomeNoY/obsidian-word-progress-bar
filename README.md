# Word Progress Bar for Obsidian

Track your writing progress with a miniature progress bar in the status bar.

Set a word count goal and watch the bar fill up as you write. When you hit your goal, it turns green.

![demo](images/demo.gif)

## Usage

### For all files (default goal)

Toggle on **Use default word goal for all files** in settings and set a **Default word goal**. The progress bar will appear on every note using that goal.

### For specific files (property)

Add a `word-goal` property *(default)* to a note's frontmatter:
```yaml
---
word-goal: 500
---
```
The progress bar will show only on notes that have this property. You can rename the property key in settings (**Frontmatter key for per-file goal**).

## Installation

Go to Community Plugins and search for **Word Progress Bar**

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/SomeNoY/obsidian-word-progress-bar/releases/latest)
2. Copy them to `<Vault>/.obsidian/plugins/word-progress-bar/`
3. Reload Obsidian and enable the plugin in Settings → Community plugins
