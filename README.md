# Tokyo Night Day Counter Wallpaper

A minimalist, automatically updating day counter wallpaper for Fedora GNOME, built with **TypeScript, Node.js, and Sharp**.

Displays `DAY 001`, `DAY 002`, `DAY 003`, etc., based on a configurable starting date.

## Features

- Tokyo Night-inspired dark theme
- Automatically increments the day counter
- Displays the current date
- Generates wallpapers using TypeScript and Sharp
- Automatically updates daily using a systemd user timer
- Supports GNOME light and dark wallpaper settings

## Requirements

- Fedora Linux with GNOME
- Node.js 22+
- npm
- systemd user services

## Installation

Clone the repository:

```bash
git clone https://github.com/Prashant-Khadka-Magar/day-counter.git
cd day-counter
```

Install dependencies and build:

```bash
npm install
npm run build
```

## Configuration

Edit `src/wallpaper.ts` to set your starting date:

```typescript
const START_YEAR = 2026;
const START_MONTH = 10;
const START_DAY = 16;
```

You can also customize the wallpaper colors, text, and resolution.

After making changes, rebuild:

```bash
npm run build
```

## Usage

Generate and apply the wallpaper:

```bash
npm start
```

The generated PNG is saved to:

```text
~/Pictures/DayCounter/
```

## Automatic Daily Updates

Create `~/.config/systemd/user/day-counter.service`:

```ini
[Unit]
Description=Tokyo Night Day Counter

[Service]
Type=oneshot
ExecStart=/usr/bin/node %h/Projects/day-counter/dist/wallpaper.js
```

Replace the `ExecStart` path with the actual location of your compiled script. Check the Node.js path using `command -v node`.

Create `~/.config/systemd/user/day-counter.timer`:

```ini
[Unit]
Description=Daily Wallpaper Update

[Timer]
OnCalendar=daily
OnStartupSec=30s
Persistent=true
Unit=day-counter.service

[Install]
WantedBy=timers.target
```

Enable the timer:

```bash
systemctl --user daemon-reload
systemctl --user enable --now day-counter.timer
systemctl --user start day-counter.service
```

Verify:

```bash
systemctl --user list-timers --all day-counter.timer
```

The wallpaper updates daily while the user systemd manager is active.

## Built With

- TypeScript
- Node.js
- Sharp
- GNOME GSettings
- systemd

Built as a personal TypeScript learning project.