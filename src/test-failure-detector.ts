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
  /\bdotnet\s+publish\b/i,
  /\bcsc\b/,
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

const RUN_PATTERNS = [
  /\bnpm\s+start\b/i,
  /\bnpm\s+run\s+dev\b/i,
  /\bnpm\s+run\s+serve\b/i,
  /\byarn\s+start\b/i,
  /\byarn\s+dev\b/i,
  /\bpnpm\s+start\b/i,
  /\bpnpm\s+dev\b/i,
  /\bnode\b/,
  /\bnodemon\b/i,
  /\bts-node\b/i,
  /\btsx\b/,
  /\bpython\b/,
  /\bpython3\b/,
  /\bruby\b/,
  /\bjava\s+-/,
  /\bjava\s+\w/,
  /\bgo\s+run\b/i,
  /\bcargo\s+run\b/i,
  /\bflutter\s+run\b/i,
  /\bdart\s+run\b/i,
  /\bdotnet\s+run\b/i,
  /\bswift\s+run\b/i,
  /\buvicorn\b/i,
  /\bgunicorn\b/i,
  /\bflask\s+run\b/i,
  /\bdjango.*runserver\b/i,
  /\brails\s+server\b/i,
  /\brails\s+s\b/i,
  /\bphp\s+-S\b/,
  /\bphp\s+artisan\s+serve\b/i,
  /\bdeno\s+run\b/i,
  /\bbun\s+run\b/i,
  /\bnx\s+serve\b/i,
  /\bturbo\s+dev\b/i,
];

export type FailureKind = 'test' | 'build' | 'runtime' | 'any';

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
            this.trigger(kind);
          }
        })
      );
    }

    this.disposables.push(
      vscode.tasks.onDidEndTaskProcess((e) => {
        if (e.exitCode !== undefined && e.exitCode !== 0) {
          const task = e.execution.task;
          const kind = this.classifyTask(task);
          this.trigger(kind);
        }
      })
    );

    this.disposables.push(
      vscode.debug.registerDebugAdapterTrackerFactory('*', {
        createDebugAdapterTracker: () => ({
          onDidSendMessage: (message: { type?: string; event?: string; body?: Record<string, unknown> }) => {
            // Standard DAP exited event (e.g. Node, Go, C++)
            if (
              message.type === 'event' &&
              message.event === 'exited' &&
              typeof message.body?.exitCode === 'number' &&
              message.body.exitCode !== 0
            ) {
              this.trigger('runtime');
            }

            // Some debug adapters (e.g. Dart) embed exit code in output text
            if (
              message.type === 'event' &&
              message.event === 'output' &&
              typeof message.body?.output === 'string'
            ) {
              const code = this.parseExitCode(message.body.output as string);
              if (code !== undefined && code !== 0) {
                this.trigger('runtime');
              }
            }
          },
        }),
      })
    );

    // TODO(mastersam): Find alternative on working with test explorer as `onDidChangeTestResults` on the test API is proposal based.
  }

  private toRegexPatterns(commands: string[]): RegExp[] {
    return commands.map((ec) => {
      const escaped = ec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i');
    });
  }

  private getExtraTestPatterns(): RegExp[] {
    const extras = vscode.workspace
      .getConfiguration('faaaahOnFail')
      .get<string[]>('extraTestCommands', []);
    return this.toRegexPatterns(extras);
  }

  private getExtraBuildPatterns(): RegExp[] {
    const extras = vscode.workspace
      .getConfiguration('faaaahOnFail')
      .get<string[]>('extraBuildCommands', []);
    return this.toRegexPatterns(extras);
  }

  private getExtraRunPatterns(): RegExp[] {
    const extras = vscode.workspace
      .getConfiguration('faaaahOnFail')
      .get<string[]>('extraRunCommands', []);
    return this.toRegexPatterns(extras);
  }

  private isTestCommand(cmd: string): boolean {
    if (TEST_PATTERNS.some((p) => p.test(cmd))) { return true; }
    return this.getExtraTestPatterns().some((p) => p.test(cmd));
  }

  private isBuildCommand(cmd: string): boolean {
    if (BUILD_PATTERNS.some((p) => p.test(cmd))) { return true; }
    return this.getExtraBuildPatterns().some((p) => p.test(cmd));
  }

  private isRunCommand(cmd: string): boolean {
    if (RUN_PATTERNS.some((p) => p.test(cmd))) { return true; }
    return this.getExtraRunPatterns().some((p) => p.test(cmd));
  }

  private classifyCommand(cmd: string): FailureKind {
    if (this.isTestCommand(cmd)) { return 'test'; }
    if (this.isBuildCommand(cmd)) { return 'build'; }
    if (this.isRunCommand(cmd)) { return 'runtime'; }
    return 'any';
  }

  private classifyTask(task: vscode.Task): FailureKind {
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

  private parseExitCode(output: string): number | undefined {
    const patterns = [
      /[Ee]xited\s*\((\d+)\)/,                   // Dart: "Exited (255)."
      /exit\s+code[:\s]+(\d+)/i,                  // "exit code: 1", "exit code 1"
      /[Pp]rocess\s+exited\s+with\s+code\s+(\d+)/,// "Process exited with code 1"
      /exited\s+with\s+code\s+(\d+)/i,            // "exited with code 1"
      /returned?\s+exit\s+code\s+(\d+)/i,         // "return exit code 1"
      /exit\s+status\s+(\d+)/i,                   // "exit status 1"
    ];
    for (const p of patterns) {
      const m = output.match(p);
      if (m) {
        return parseInt(m[1], 10);
      }
    }
    return undefined;
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
