import * as vscode from 'vscode';

const TEST_PATTERNS = [
  /\btest\b/i,
  /\bspec\b/i,
  /\bcheck\b/i,
  /\bpytest\b/i,
  /\bjest\b/i,
  /\bvitest\b/i,
  /\bmocha\b/i,
  /\brspec\b/i,
  /\bcargo\s+test\b/i,
  /\bgo\s+test\b/i,
  /\bflutter\s+test\b/i,
  /\bdart\s+test\b/i,
  /\bphpunit\b/i,
  /\bgradle\s+test\b/i,
  /\bmvn\s+test\b/i,
  /\bdotnet\s+test\b/i,
  /\bnx\s+test\b/i,
  /\bexunit\b/i,
  /\bbun\s+test\b/i,
  /\bdeno\s+test\b/i,
  /\bcypress\s+run\b/i,
  /\bjasmine\b/i,
  /\bkarma\b/i,
  /\bava\b/i,
  /\btox\b/i,
  /\bnox\b/i,
  /\bctest\b/i,
  /\bmaestro\b/i,
];

const BUILD_PATTERNS = [
  /\btsc\b/,
  /\bnpm\s+run\s+build\b/i,
  /\byarn\s+build\b/i,
  /\bpnpm\s+build\b/i,
  /\bbun\s+build\b/i,
  /\bnpm\s+run\s+compile\b/i,
  /\bgcc\b/,
  /\bg\+\+\b/,
  /\bclang\b/,
  /\bclang\+\+\b/,
  /\bmake\b/,
  /\bcmake\b/,
  /\bninja\b/,
  /\bmsbuild\b/i,
  /\bcargo\s+build\b/i,
  /\bgo\s+build\b/i,
  /\bjavac\b/,
  /\bgradle\s+build\b/i,
  /\bmvn\s+compile\b/i,
  /\bmvn\s+package\b/i,
  /\bdotnet\s+build\b/i,
  /\bswiftc\b/,
  /\bswift\s+build\b/i,
  /\bflutter\s+build\b/i,
  /\bdart\s+compile\b/i,
  /\bwebpack\b/i,
  /\bvite\s+build\b/i,
  /\besbuild\b/i,
  /\brollup\b/i,
  /\bparcel\s+build\b/i,
  /\bnx\s+build\b/i,
  /\bturbo\s+build\b/i,
];

export type FailureKind = 'test' | 'build';

const DEBOUNCE_MS = 2000;

export class TestFailureDetector {
  private disposables: vscode.Disposable[] = [];
  private lastTriggerTime = 0;
  private onFailure: (kind: FailureKind) => void;

  constructor(onFailure: (kind: FailureKind) => void) {
    this.onFailure = onFailure;
  }

  activate(): void {
    if (vscode.window.onDidEndTerminalShellExecution) {
      this.disposables.push(
        vscode.window.onDidEndTerminalShellExecution((e) => {
          if (e.exitCode !== undefined && e.exitCode !== 0) {
            const cmd = e.execution.commandLine?.value ?? '';
            const kind = this.classifyCommand(cmd);
            if (kind) {
              this.trigger(kind);
            }
          }
        })
      );
    }

    this.disposables.push(
      vscode.tasks.onDidEndTaskProcess((e) => {
        if (e.exitCode !== undefined && e.exitCode !== 0) {
          const task = e.execution.task;
          const kind = this.classifyTask(task);
          if (kind) {
            this.trigger(kind);
          }
        }
      })
    );

    // TODO(mastersam): Find alternative on working with test explorer as `onDidChangeTestResults` on the test API is proposal based.
  }

  private getExtraPatterns(): RegExp[] {
    const extras = vscode.workspace
      .getConfiguration('faaaahOnFail')
      .get<string[]>('extraTestCommands', []);
    return extras.map((ec) => {
      const escaped = ec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i');
    });
  }

  private isTestCommand(cmd: string): boolean {
    if (TEST_PATTERNS.some((p) => p.test(cmd))) {
      return true;
    }
    return this.getExtraPatterns().some((p) => p.test(cmd));
  }

  private isBuildCommand(cmd: string): boolean {
    return BUILD_PATTERNS.some((p) => p.test(cmd));
  }

  private classifyCommand(cmd: string): FailureKind | null {
    if (this.isTestCommand(cmd)) { return 'test'; }
    if (this.isBuildCommand(cmd)) { return 'build'; }
    return null;
  }

  private classifyTask(task: vscode.Task): FailureKind | null {
    if (task.group === vscode.TaskGroup.Test) { return 'test'; }
    if (task.group === vscode.TaskGroup.Build) { return 'build'; }

    const cmd = this.extractTaskCommand(task);
    return this.classifyCommand(cmd);
  }

  private extractTaskCommand(task: vscode.Task): string {
    const name = task.name;
    const execution = task.execution;

    if (execution instanceof vscode.ShellExecution) {
      return this.extractCommand(execution) || name;
    }
    if (execution instanceof vscode.ProcessExecution) {
      return `${execution.process} ${execution.args.join(' ')}`;
    }

    return name;
  }

  private extractCommand(execution: vscode.ShellExecution): string {
    if (typeof execution.commandLine === 'string') {
      return execution.commandLine;
    }
    if (execution.command) {
      const cmd = typeof execution.command === 'string'
        ? execution.command
        : execution.command.value;
      const args = (execution.args || [])
        .map((a: string | vscode.ShellQuotedString) =>
          typeof a === 'string' ? a : a.value
        )
        .join(' ');
      return `${cmd} ${args}`;
    }
    return '';
  }

  private trigger(kind: FailureKind): void {
    const now = Date.now();
    if (now - this.lastTriggerTime < DEBOUNCE_MS) {
      return;
    }
    this.lastTriggerTime = now;
    this.onFailure(kind);
  }

  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
