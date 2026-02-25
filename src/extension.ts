import * as vscode from 'vscode';
import * as path from 'path';
import { SoundPlayer } from './sound-player';
import { TestFailureDetector, FailureKind } from './test-failure-detector';

let soundPlayer: SoundPlayer;
let detector: TestFailureDetector;

const TEST_FAILURE_MESSAGES = [
  'FAAAAH! 🎺 Test failed!',
  'FAAAAH! 💀 Another one bites the dust...',
  'FAAAAH! 🫠 That test didn\'t make it...',
  'FAAAAH! 😭 F in the chat...',
  'FAAAAH! 🪦 RIP that test...',
  'FAAAAH! 🔥 This is fine...',
  'FAAAAH! 🤡 Looks like a clown wrote that test... oh wait.',
  'FAAAAH! 💔 Expectations? Shattered.',
];

const BUILD_FAILURE_MESSAGES = [
  'FAAAAH! 🔨 Build failed!',
  'FAAAAH! 🧱 It didn\'t compile...',
  'FAAAAH! 💥 Build go boom.',
  'FAAAAH! 🫠 Syntax error somewhere, good luck.',
  'FAAAAH! 🪦 RIP that build...',
  'FAAAAH! 🔥 The compiler is not impressed.',
  'FAAAAH! 🤡 Semicolons are hard.',
  'FAAAAH! 💔 Build broken. Again.',
];

const RUNTIME_FAILURE_MESSAGES = [
  'FAAAAH! 💥 Runtime error!',
  'FAAAAH! 🫠 Your app just crashed...',
  'FAAAAH! 🪦 Process exited with tears.',
  'FAAAAH! 🔥 Unhandled exception. Classic.',
  'FAAAAH! 🤡 It worked on my machine...',
  'FAAAAH! 💀 Segfault? In this economy?',
  'FAAAAH! 😭 Runtime said no.',
  'FAAAAH! 💔 Stack overflow. The bad kind.',
];

const ANY_FAILURE_MESSAGES = [
  'FAAAAH! 🎺 Something failed!',
  'FAAAAH! 💀 Non-zero exit. Yikes.',
  'FAAAAH! 🫠 That didn\'t work...',
  'FAAAAH! 🔥 Error. Just... error.',
  'FAAAAH! 💔 Exit code says no.',
];

const MESSAGES: Record<FailureKind, string[]> = {
  test: TEST_FAILURE_MESSAGES,
  build: BUILD_FAILURE_MESSAGES,
  runtime: RUNTIME_FAILURE_MESSAGES,
  any: ANY_FAILURE_MESSAGES,
};

function getRandomMessage(kind: FailureKind): string {
  const messages = MESSAGES[kind];
  return messages[Math.floor(Math.random() * messages.length)];
}

const SETTING_MAP: Record<FailureKind, string> = {
  test: 'onTestFailure',
  build: 'onBuildFailure',
  runtime: 'onRuntimeFailure',
  any: 'onAnyFailure',
};

export function activate(context: vscode.ExtensionContext) {
  console.log('🎺 FAAAAH on Fail is now active!');

  const soundDir = path.join(context.extensionPath, 'sounds');
  soundPlayer = new SoundPlayer(soundDir);

  detector = new TestFailureDetector((kind) => {
    if (!isEnabled()) { return; }

    const config = vscode.workspace.getConfiguration('faaaahOnFail');

    if (config.get<boolean>('onAnyFailure', false)) {
      playFaaaah(kind);
      return;
    }

    const settingKey = SETTING_MAP[kind];
    const defaultValue = kind === 'test';
    if (config.get<boolean>(settingKey, defaultValue)) {
      playFaaaah(kind);
    }
  });
  detector.activate();

  context.subscriptions.push(
    vscode.commands.registerCommand('faaaahOnFail.enable', () => {
      const config = vscode.workspace.getConfiguration('faaaahOnFail');
      config.update('enabled', true, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage('🎺 FAAAAH on Fail: ENABLED. Brace yourself.');
    }),

    vscode.commands.registerCommand('faaaahOnFail.disable', () => {
      const config = vscode.workspace.getConfiguration('faaaahOnFail');
      config.update('enabled', false, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage('🔇 FAAAAH on Fail: Disabled. Coward.');
    }),

    vscode.commands.registerCommand('faaaahOnFail.testSound', () => {
      playFaaaah('test');
    }),
  );

  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.text = '$(megaphone) FAAAAH';
  statusBar.tooltip = 'Click to test the FAAAAH sound';
  statusBar.command = 'faaaahOnFail.testSound';
  statusBar.show();

  context.subscriptions.push(
    statusBar,
    detector,
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('faaaahOnFail.enabled')) {
        statusBar.text = isEnabled() ? '$(megaphone) FAAAAH' : '$(mute) FAAAAH';
      }
    }),
  );
}

function isEnabled(): boolean {
  return vscode.workspace.getConfiguration('faaaahOnFail').get<boolean>('enabled', true);
}

function playFaaaah(kind: FailureKind): void {
  const config = vscode.workspace.getConfiguration('faaaahOnFail');
  const volume = config.get<number>('volume', 0.7);
  const sound = config.get<string>('sound', 'faaaah');
  const customPath = config.get<string>('customSoundPath', '');
  const showNotification = config.get<boolean>('showNotification', true);

  soundPlayer.play(volume, sound as 'faaaah' | 'fatality' | 'joker' | 'random', customPath || undefined);

  if (showNotification) {
    vscode.window.showWarningMessage(getRandomMessage(kind));
  }
}

export function deactivate() {
  soundPlayer?.dispose();
  detector?.dispose();
}
