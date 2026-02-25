# 🎺 FAAAAH on Fail

> *Because failures should be dramatic.*

![FAAAAH](images/banner.png)

**FAAAAH on Fail** plays the popular _FAAAA_ sound whenever your tests, builds, or programs fail.

## Features

- 🌍 **Multi-framework support** — Jest, Vitest, pytest, RSpec, Flutter, Go, Rust, JUnit, PHPUnit, and 20+ more
- 🎺 **Multiple built-in sounds** — FAAAAH, Fatality, Joker, or random
- 🔊 **Custom sounds** — swap the defaults with your own `.wav` file
- 🎚️ **Volume control** — from subtle shame to full office broadcast
- 💬 **Random failure messages** — comedic commentary to soften the blow
- 🖥️ **Cross-platform** — macOS, Windows, and Linux
- 🔨 **Build failure detection** — optionally trigger on compile errors
- 💥 **Runtime failure detection** — optionally trigger when your app crashes
- 🌪️ **Any failure mode** — nuclear option: trigger on ANY non-zero exit
- ⚙️ **Extensible** — add your own test, build, and run commands via settings

## How It Works

FAAAAH on Fail monitors your terminal and tasks for failures:

1. **Shell Integration** — monitors terminal commands. When a recognized test, build, or run command exits with a non-zero code, FAAAAH fires.
2. **Task Exit Codes** — listens for VS Code tasks in the Test/Build group or matching command patterns.

> **Note:** Tests run exclusively through VS Code's Test Results panel without spawning a terminal may not be detected yet. This is a [VS Code API limitation](https://github.com/microsoft/vscode/issues/107467) — the test observation API is not yet stable. Most test extensions spawn terminals under the hood, so coverage is broad in practice.

## Supported Frameworks

Works out of the box with any test runner that executes in a terminal or task:

Jest | Vitest | Mocha | Jasmine | Karma | Ava | Cypress | Bun | Deno | pytest | tox | nox | RSpec | ExUnit | Flutter | Dart | Go | Rust | JUnit | Gradle | Maven | PHPUnit | dotnet test | CTest | Maestro | *and more...*

Don't see yours? Add it:

```json
{
  "faaaahOnFail.extraTestCommands": ["my-custom-runner"],
  "faaaahOnFail.extraBuildCommands": ["my-build-tool"],
  "faaaahOnFail.extraRunCommands": ["my-server"]
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

### Triggers

| Setting | Default | Description |
|---------|---------|-------------|
| `faaaahOnFail.enabled` | `true` | Master switch — enable/disable all sounds |
| `faaaahOnFail.onTestFailure` | `true` | Play sound on test failure |
| `faaaahOnFail.onBuildFailure` | `false` | Play sound on build/compile failure |
| `faaaahOnFail.onRuntimeFailure` | `false` | Play sound on runtime failure |
| `faaaahOnFail.onAnyFailure` | `false` | Play sound on ANY non-zero exit (can be noisy!) |

### Sound

| Setting | Default | Description |
|---------|---------|-------------|
| `faaaahOnFail.sound` | `"faaaah"` | Built-in sound: `faaaah`, `fatality`, `joker`, or `random` |
| `faaaahOnFail.volume` | `0.7` | Volume (0.1 – 1.0) |
| `faaaahOnFail.customSoundPath` | `""` | Path to a custom `.wav` file (overrides built-in) |
| `faaaahOnFail.showNotification` | `true` | Show a notification message on failure |

### Custom Commands

| Setting | Default | Description |
|---------|---------|-------------|
| `faaaahOnFail.extraTestCommands` | `[]` | Additional commands to treat as test runs |
| `faaaahOnFail.extraBuildCommands` | `[]` | Additional commands to treat as build/compile runs |
| `faaaahOnFail.extraRunCommands` | `[]` | Additional commands to treat as runtime runs |

## Custom Sounds

```json
{
  "faaaahOnFail.customSoundPath": "/path/to/your/sad-sound.wav"
}
```

## License

MIT
