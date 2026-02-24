import * as path from 'path';
import { exec } from 'child_process';
import * as os from 'os';

const BUILT_IN_SOUNDS = ['faaaah', 'fatality', 'joker'] as const;
type BuiltInSound = typeof BUILT_IN_SOUNDS[number];

export class SoundPlayer {
  private soundDir: string;

  constructor(soundDir: string) {
    this.soundDir = soundDir;
  }

  private resolve(sound: string): string {
    return path.join(this.soundDir, `${sound}.mp3`);
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

    try {
      switch (platform) {
        case 'darwin':
          exec(`afplay "${soundFile}" -v ${volume}`);
          break;

        case 'win32':
          exec(
            `powershell -c "(New-Object Media.SoundPlayer '${soundFile}').PlaySync()"`
          );
          break;

        case 'linux':
          exec(`which mpg123 && mpg123 -f ${Math.round(volume * 32768)} -q "${soundFile}" || ` +
               `which paplay && paplay "${soundFile}" || ` +
               `which aplay && aplay "${soundFile}" || ` +
               `which ffplay && ffplay -nodisp -autoexit -volume ${Math.round(volume * 100)} "${soundFile}"`);
          break;

        default:
          console.warn(`[FAAAAH] Unsupported platform: ${platform}`);
      }
    } catch (err) {
      console.error('[FAAAAH] Failed to play sound:', err);
    }
  }

  dispose(): void {
    // Nothing resource to clean up for now
  }
}
