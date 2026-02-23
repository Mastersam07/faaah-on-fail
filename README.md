# 🎺 FAAAAH on Fail

> *Because test failures should be dramatic.*

A VS Code extension that plays the iconic **FAAAAH** sound whenever your tests fail. Never silently ignore a failing test again.

![FAAAAH](images/banner.png)

## Features

- 🌍 **Multi-framework support** — works with Flutter, Jest, Vitest, pytest, RSpec, Go, Rust, JUnit, PHPUnit, and more
- 🔊 **Custom sounds** — swap the default FAAAAH with your own `.wav` or `.mp3` file
- 🎚️ **Volume control** — from subtle shame to full office broadcast
- 💬 **Random failure messages** — adds a little comedic commentary to your pain
- 🖥️ **Cross-platform** — works on macOS, Windows, and Linux

## Supported Test Frameworks

| Framework | Detection Method |
|-----------|-----------------|
| Flutter / Dart | Terminal + Test Controller |
| Jest / Vitest | Terminal + Test Controller |
| pytest | Terminal |
| RSpec | Terminal |
| Go (`go test`) | Terminal |
| Rust (`cargo test`) | Terminal |
| JUnit / Gradle / Maven | Terminal |
| PHPUnit | Terminal |

## Installation

### From VSIX (local)

```bash
# 1. Install dependencies & compile
npm install
npm run compile

# 2. Generate the FAAAAH sound
npm run generate-sound

# 3. Package
npx vsce package

# 4. Install
code --install-extension faaaah-on-fail-0.1.0.vsix
```

### From Marketplace *(coming soon)*

Search for **"FAAAAH on Fail"** in the VS Code Extensions panel.

## Commands

| Command | Description |
|---------|-------------|
| `FAAAAH: Enable Sound on Test Failure` | Turn it on |
| `FAAAAH: Disable Sound on Test Failure` | Turn it off (coward) |
| `FAAAAH: Test the Sound 🎺` | Preview the sound |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `faaaahOnFail.enabled` | `true` | Enable/disable the sound |
| `faaaahOnFail.volume` | `0.7` | Volume (0.1 – 1.0) |
| `faaaahOnFail.customSoundPath` | `""` | Path to custom sound file |
| `faaaahOnFail.showNotification` | `true` | Show notification message |

## Custom Sounds

Want to use a different sound? Set `faaaahOnFail.customSoundPath` in your settings:

```json
{
  "faaaahOnFail.customSoundPath": "/path/to/your/sad-sound.mp3"
}
```


