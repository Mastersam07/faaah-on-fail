import * as path from 'path';
import { execFile } from 'child_process';
import * as os from 'os';

const BUILT_IN_SOUNDS = ['faaaah', 'fatality', 'joker'] as const;
type BuiltInSound = typeof BUILT_IN_SOUNDS[number];

export class SoundPlayer {
  private soundDir: string;

  constructor(soundDir: string) {
    this.soundDir = soundDir;
  }

  private resolve(sound: string): string {
    return path.join(this.soundDir, `${sound}.wav`);
  }

  private pickSound(sound: string): string {
    if (sound === 'random') {
      const pick = BUILT_IN_SOUNDS[Math.floor(Math.random() * BUILT_IN_SOUNDS.length)];
      return this.resolve(pick);
    }
    return this.resolve(sound);
  }

  play(volume: number = 0.7, sound: BuiltInSound | 'random' = 'faaaah', customSoundPath?: string): void {
    const soundFile = customSoundPath || this.pickSound(sound);
    const platform = os.platform();

    switch (platform) {
      case 'darwin':
        this.run('afplay', [soundFile, '-v', String(volume)]);
        break;

      case 'win32':
        this.playWindows(soundFile);
        break;

      case 'linux':
        this.playLinux(soundFile, volume);
        break;

      default:
        console.warn(`[FAAAAH] Unsupported platform: ${platform}`);
    }
  }

  private playWindows(soundFile: string): void {
    // Use -File with a script block to avoid string interpolation injection.
    // The sound file path is passed as a separate -SoundFile argument,
    // never interpolated into a command string.
    const script = `
param([string]$SoundFile)
(New-Object System.Media.SoundPlayer $SoundFile).PlaySync()
`;
    this.run('powershell', [
      '-NoProfile', '-NonInteractive', '-Command', script, '-SoundFile', soundFile
    ]);
  }

  private playLinux(soundFile: string, volume: number): void {
    const players = [
      { cmd: 'aplay', args: [soundFile] },
      { cmd: 'paplay', args: [soundFile] },
      { cmd: 'mpg123', args: ['-q', '--scale', String(Math.round(volume * 32768)), soundFile] },
      { cmd: 'ffplay', args: ['-nodisp', '-autoexit', '-volume', String(Math.round(volume * 100)), soundFile] },
    ];

    const tryNext = (index: number): void => {
      if (index >= players.length) {
        console.error('[FAAAAH] No audio player found. Install aplay, paplay, mpg123, or ffplay.');
        return;
      }
      const { cmd, args } = players[index];
      execFile(cmd, args, (err) => {
        if (err) {
          tryNext(index + 1);
        }
      });
    };

    tryNext(0);
  }

  private run(cmd: string, args: string[]): void {
    execFile(cmd, args, (err) => {
      if (err) {
        console.error(`[FAAAAH] Failed to play sound with ${cmd}:`, err.message);
      }
    });
  }

  dispose(): void {
    // Nothing to clean up for now
  }
}
