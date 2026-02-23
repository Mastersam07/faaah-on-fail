import * as vscode from 'vscode';
import * as path from 'path';
import { SoundPlayer } from './sound-player';
import { TestFailureDetector } from './test-failure-detector';

let soundPlayer: SoundPlayer;
let detector: TestFailureDetector;

const FAILURE_MESSAGES = [
  'FAAAAH! 🎺 Test failed!',
  'FAAAAH! 💀 Another one bites the dust...',
  'FAAAAH! 🫠 That test didn\'t make it...',
  'FAAAAH! 😭 F in the chat...',
  'FAAAAH! 🪦 RIP that test...',
  'FAAAAH! 🔥 This is fine...',
  'FAAAAH! 🤡 Looks like a clown wrote that test... oh wait.',
  'FAAAAH! 💔 Expectations? Shattered.',
];

function getRandomMessage(): string {
  return FAILURE_MESSAGES[Math.floor(Math.random() * FAILURE_MESSAGES.length)];
}

export function activate(context: vscode.ExtensionContext) {
  console.log('🎺 FAAAAH on Fail is now active!');

  const soundDir = path.join(context.extensionPath, 'sounds');
  soundPlayer = new SoundPlayer(soundDir);

  detector = new TestFailureDetector(() => {
    if (isEnabled()) {
      playFaaaah();
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
      playFaaaah();
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

function playFaaaah(): void {
  const config = vscode.workspace.getConfiguration('faaaahOnFail');
  const volume = config.get<number>('volume', 0.7);
  const customPath = config.get<string>('customSoundPath', '');
  const showNotification = config.get<boolean>('showNotification', true);

  soundPlayer.play(volume, customPath || undefined);

  if (showNotification) {
    vscode.window.showWarningMessage(getRandomMessage());
  }
}

export function deactivate() {
  soundPlayer?.dispose();
  detector?.dispose();
}
