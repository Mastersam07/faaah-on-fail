# 🎺 FAAAAH on Fail

> *Because test failures should be dramatic.*

![FAAAAH](images/banner.png)

**FAAAAH on Fail** plays an unmistakable sound whenever your tests fail — so you never silently scroll past a broken build again.

## Features

- 🌍 **Multi-framework support** — Jest, Vitest, pytest, RSpec, Flutter, Go, Rust, JUnit, PHPUnit, and 20+ more
- 🔊 **Custom sounds** — swap the default FAAAAH with your own `.wav` or `.mp3`
- 🎚️ **Volume control** — from subtle shame to full office broadcast
- 💬 **Random failure messages** — comedic commentary to soften the blow
- 🖥️ **Cross-platform** — macOS, Windows, and Linux
- ⚙️ **Extensible** — add your own test commands via settings

## How It Works

FAAAAH on Fail listens for test failures using two detection layers:

1. **Shell Integration** — monitors terminal commands. When a recognized test command (`npm test`, `pytest`, `cargo test`, etc.) exits with a non-zero code, FAAAAH fires.
2. **Task Exit Codes** — listens for VS Code tasks in the Test group or matching test command patterns.

> **Note:** Tests run exclusively through VS Code's Test Results panel without spawning a terminal may not be detected yet. This is a [VS Code API limitation](https://github.com/microsoft/vscode/issues/107467) — the test observation API is not yet stable. Most test extensions spawn terminals under the hood, so coverage is broad in practice.

## Supported Frameworks

Works out of the box with any test runner that executes in a terminal or task:

Jest | Vitest | Mocha | Jasmine | Karma | Ava | Cypress | Bun | Deno | pytest | tox | nox | RSpec | ExUnit | Flutter | Dart | Go | Rust | JUnit | Gradle | Maven | PHPUnit | dotnet test | CTest | Maestro | *and more...*

Don't see yours? Add it:

```json
{
  "faaaahOnFail.extraTestCommands": ["my-custom-runner"]
}
```

## Installation

Search for **"FAAAAH on Fail"** in the VS Code Extensions panel, or:

```
ext install Mastersam.faaaah-on-fail
```

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
| `faaaahOnFail.customSoundPath` | `""` | Path to a custom `.wav` or `.mp3` file |
| `faaaahOnFail.showNotification` | `true` | Show a notification message on failure |
| `faaaahOnFail.extraTestCommands` | `[]` | Additional commands to treat as test runs |

## Custom Sounds

```json
{
  "faaaahOnFail.customSoundPath": "/path/to/your/sad-sound.mp3"
}
```

## License

MIT
