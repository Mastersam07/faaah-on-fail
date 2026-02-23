import * as path from 'path';
import { exec } from 'child_process';
import * as os from 'os';

export class SoundPlayer {
  private defaultSound: string;

  constructor(soundDir: string) {
    this.defaultSound = path.join(soundDir, 'faaaah.mp3');
  }

  play(volume: number = 0.7, customSoundPath?: string): void {
    const soundFile = customSoundPath || this.defaultSound;
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
