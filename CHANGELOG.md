# Changelog

## 0.3.0

- Switched built-in sounds from `.mp3` to `.wav` for better cross-platform compatibility
- Improved Windows audio playback using `System.Media.SoundPlayer`
- Added `mpg123` to Linux audio player fallback chain
- Improved Linux fallback: `mpg123` → `aplay` → `paplay` → `ffplay`
- Fixed async error handling with `execFile` across all platforms

## 0.2.0

- Added multiple built-in sounds: **FAAAAH**, **Fatality**, and **Joker**
- New `faaaahOnFail.sound` setting to pick a sound or set to `random`
- Fixed `.vscodeignore` to exclude dev-only files from the published extension

## 0.1.0 — Initial Release 🎺

- Sound on test failure via shell integration and task exit codes
- Support for Flutter, Jest, Vitest, pytest, RSpec, Go, Rust, JUnit, PHPUnit, and 20+ more
- Custom sound file support
- Volume control
- Random failure messages
- Cross-platform audio playback (macOS, Windows, Linux)
- Status bar indicator
