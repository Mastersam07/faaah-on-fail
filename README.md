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

Any test runner that executes in a terminal or task is supported out of the box, including:

Flutter, Dart, Jest, Vitest, Mocha, pytest, RSpec, Go (`go test`), Rust (`cargo test`), JUnit, Gradle, Maven, PHPUnit, dotnet test, Cypress, Jasmine, Karma, Ava, Bun, Deno, ExUnit, CTest, Maestro, and more.

Need to add your own? Use the `faaaahOnFail.extraTestCommands` setting:

```json
{
  "faaaahOnFail.extraTestCommands": ["my-custom-runner"]
}
```

> **Note:** Tests run exclusively through VS Code's Test Results panel without spawning a terminal may not be detected. This is a VS Code API limitation — the test observation API (`onDidChangeTestResults`) is not yet stable. Most test extensions do spawn terminals under the hood, so coverage is broad in practice.

## Installation

### From VSIX (local)

```bash
npm install
npm run compile

npx vsce package

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
| `faaaahOnFail.extraTestCommands` | `[]` | Additional commands to treat as test runs |

## Custom Sounds

Want to use a different sound? Set `faaaahOnFail.customSoundPath` in your settings:

```json
{
  "faaaahOnFail.customSoundPath": "/path/to/your/sad-sound.mp3"
}
```
