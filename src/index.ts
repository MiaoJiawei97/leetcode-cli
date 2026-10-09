#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

import { loginCommand, logoutCommand, whoamiCommand } from './commands/login.js';
import { listCommand } from './commands/list.js';
import { showCommand } from './commands/show.js';
import { hintCommand } from './commands/hint.js';
import { pickCommand, batchPickCommand } from './commands/pick.js';
import { contestCommand } from './commands/contest.js';
import { testCommand } from './commands/test.js';
import { submitCommand } from './commands/submit.js';
import { resetCommand } from './commands/reset.js';
import { statCommand } from './commands/stat.js';
import { dailyCommand } from './commands/daily.js';
import { randomCommand } from './commands/random.js';
import { submissionsCommand } from './commands/submissions.js';
import { configCommand, configInteractiveCommand } from './commands/config.js';
import { bookmarkCommand } from './commands/bookmark.js';
import { notesCommand } from './commands/notes.js';
import { todayCommand } from './commands/today.js';
import { syncCommand } from './commands/sync.js';
import { timerCommand } from './commands/timer.js';
import {
  collabHostCommand,
  collabJoinCommand,
  collabSyncCommand,
  collabCompareCommand,
  collabLeaveCommand,
  collabStatusCommand,
} from './commands/collab.js';
import {
  snapshotSaveCommand,
  snapshotListCommand,
  snapshotRestoreCommand,
  snapshotDiffCommand,
  snapshotDeleteCommand,
} from './commands/snapshot.js';
import { diffCommand } from './commands/diff.js';
import {
  workspaceCurrentCommand,
  workspaceListCommand,
  workspaceCreateCommand,
  workspaceUseCommand,
  workspaceDeleteCommand,
} from './commands/workspace.js';
import { updateCommand, checkForUpdatesOnStartup } from './commands/update.js';
import { changelogCommand } from './commands/changelog.js';
import { starCommand } from './commands/star.js';
import { completionCommand } from './commands/completion.js';
import { getSupportedLanguagesLabel } from './utils/languages.js';

import { launchTUI as launchNewTUI } from './tui/index.js';

const program = new Command();

program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => {
    const name = cmd.name();
    const alias = cmd.alias();
    const term = alias ? `${name}|${alias}` : name;
    return chalk.cyan(term.padEnd(16));
  },
  subcommandDescription: (cmd) => chalk.white(cmd.description()),
  optionTerm: (option) => chalk.yellow(option.flags),
  optionDescription: (option) => chalk.white(option.description),
});

program
  .name('lc')
  .usage('[command] [options]')
  .description(chalk.bold.cyan('🔥 lc: LeetCode in your terminal'))
  .version('3.5.2', '-v, --version', 'Output the version number')
  .helpOption('-h, --help', 'Display help for command')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc login')}             Login to LeetCode
  ${chalk.cyan('$ lc list -d easy')}      List easy problems
  ${chalk.cyan('$ lc random -d medium')}   Get random medium problem
  ${chalk.cyan('$ lc pick 1')}            Start solving "Two Sum"
  ${chalk.cyan('$ lc test 1')}            Test your solution
  ${chalk.cyan('$ lc reset 1')}           Reset solution to original stub
  ${chalk.cyan('$ lc submit 1')}          Submit your solution
`
  );

program
  .command('login')
  .description('Login to LeetCode with browser cookies')
  .addHelpText(
    'after',
    `
${chalk.yellow('How to login:')}
  1. Run ${chalk.cyan('lc login')} and choose site (${chalk.cyan('leetcode.com')} or ${chalk.cyan('leetcode.cn')})
  2. Login to your account
  3. Open Developer Tools (F12) → Application → Cookies
  4. Copy values of ${chalk.green('LEETCODE_SESSION')} and ${chalk.green('csrftoken')}
  5. Paste when prompted by this command

${chalk.yellow('Storage Options:')}
  ${chalk.cyan('1. System Keychain (Default):')} Securely stores credentials in your OS keychain.
  ${chalk.cyan('2. Encrypted File:')} Export ${chalk.green('LEETCODECLI_CREDENTIAL_BACKEND=file')} (AES-256).
  ${chalk.cyan('3. Environment Variables:')} Export ${chalk.green('LEETCODE_SESSION')} & ${chalk.green('LEETCODE_CSRF_TOKEN')}.
`
  )
  .action(loginCommand);

program.command('logout').description('Clear stored credentials').action(logoutCommand);

program.command('whoami').description('Check current login status').action(whoamiCommand);

program
  .command('list')
  .alias('l')
  .description('List LeetCode problems')
  .option('-d, --difficulty <level>', 'Filter by difficulty (easy/medium/hard)')
  .option('-s, --status <status>', 'Filter by status (todo/solved/attempted)')
  .option('-t, --tag <tags...>', 'Filter by topic tags')
  .option('-q, --search <keywords>', 'Search by keywords')
  .option('-n, --limit <number>', 'Number of problems to show', '20')
  .option('-p, --page <number>', 'Page number', '1')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc list')}                    List first 20 problems
  ${chalk.cyan('$ lc list -d easy')}            List easy problems only
  ${chalk.cyan('$ lc list -s solved')}          List your solved problems
  ${chalk.cyan('$ lc list -t array -t string')} Filter by multiple tags
  ${chalk.cyan('$ lc list -q "two sum"')}       Search by keywords
  ${chalk.cyan('$ lc list -n 50 -p 2')}         Show 50 problems, page 2
`
  )
  .action(listCommand);

program
  .command('show <id>')
  .alias('s')
  .description('Show problem description')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc show 1')}                  Show by problem ID
  ${chalk.cyan('$ lc show two-sum')}            Show by problem slug
  ${chalk.cyan('$ lc s 412')}                   Short alias
`
  )
  .action(showCommand);

program
  .command('hint <id>')
  .alias('h')
  .description('Show hints for a problem')
  .option('-a, --all', 'Show all hints at once')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc hint 1')}                  Show hints for problem 1
  ${chalk.cyan('$ lc hint two-sum')}            Show hints by slug
  ${chalk.cyan('$ lc hint 1 --all')}            Show all hints at once
  ${chalk.cyan('$ lc h 412')}                   Short alias

${chalk.gray('Hints are revealed one at a time. Press Enter to see more.')}
`
  )
  .action(hintCommand);

program
  .command('daily')
  .alias('d')
  .description("Show today's daily challenge")
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc daily')}                   Show today's challenge
  ${chalk.cyan('$ lc d')}                       Short alias
`
  )
  .action(dailyCommand);

program
  .command('random')
  .alias('r')
  .description('Get a random problem')
  .option('-d, --difficulty <level>', 'Filter by difficulty (easy/medium/hard)')
  .option('-t, --tag <tag>', 'Filter by topic tag')
  .option('--pick', 'Auto-generate solution file')
  .option('--open', 'Open file in editor after picking', false)
  .option('--no-open', 'Do not open file in editor (default)')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc random')}                  Get any random problem
  ${chalk.cyan('$ lc random -d medium')}        Random medium problem
  ${chalk.cyan('$ lc random -t array')}         Random array problem
  ${chalk.cyan('$ lc random --pick')}           Random + create file
  ${chalk.cyan('$ lc r -d easy --pick')}        Random easy + file
`
  )
  .action(randomCommand);

program
  .command('pick <id>')
  .alias('p')
  .description('Generate solution file for a problem')
  .option('-l, --lang <language>', 'Programming language for the solution')
  .option('--open', 'Open file in editor after picking', false)
  .option('--no-open', 'Do not open file in editor (default)')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc pick 1')}                  Pick by problem ID
  ${chalk.cyan('$ lc pick two-sum')}            Pick by problem slug
  ${chalk.cyan('$ lc pick 1 -l python3')}       Pick with specific language
  ${chalk.cyan('$ lc pick 1 --open')}           Create file and open in editor
  ${chalk.cyan('$ lc p 412')}                   Short alias

${chalk.gray('Files are organized by: workDir/Difficulty/Category/')}
`
  )
  .action(async (id, options) => {
    await pickCommand(id, options);
  });

program
  .command('pick-batch <ids...>')
  .description('Generate solution files for multiple problems')
  .option('-l, --lang <language>', 'Programming language for the solutions')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc pick-batch 1 2 3')}        Pick problems 1, 2, and 3
  ${chalk.cyan('$ lc pick-batch 1 2 3 -l py')}  Pick with Python
`
  )
  .action(batchPickCommand);

program
  .command('contest [slug]')
  .alias('c')
  .description('Browse contests and generate a solution for a contest problem')
  .option('-l, --lang <language>', 'Programming language for the solution')
  .option('--open', 'Open file in editor after picking', false)
  .option('--no-open', 'Do not open file in editor (default)')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc contest')}                    Browse available contests
  ${chalk.cyan('$ lc contest weekly-contest-1')}  Open a contest by slug
  ${chalk.cyan('$ lc contest -l python3')}         Pick with specific language
  ${chalk.cyan('$ lc contest --open')}             Create file and open in editor
`
  )
  .action((slug, options) => contestCommand(slug, options));

program
  .command('test <file>')
  .alias('t')
  .description('Test solution against sample test cases')
  .option('-c, --testcase <testcase>', 'Custom test case')
  .option('-V, --visualize', 'Visual output for data structures (arrays, trees, etc.)')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc test 1')}                  Test by problem ID
  ${chalk.cyan('$ lc test two-sum')}            Test by problem slug
  ${chalk.cyan('$ lc test ./path/to/file.py')} Test by file path
  ${chalk.cyan('$ lc test 1 -c "[1,2]\\n3"')}   Test with custom case
  ${chalk.cyan('$ lc test 1 --visualize')}     Visual mode for debugging
  ${chalk.cyan('$ lc t 412')}                   Short alias

${chalk.gray('Testcases use \\n to separate multiple inputs.')}
`
  )
  .action(testCommand);

program
  .command('reset <id>')
  .description('Reset solution file to the original LeetCode stub')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc reset 1')}                 Reset problem 1 solution
  ${chalk.cyan('$ lc reset two-sum')}           Reset by problem slug

${chalk.gray('Overwrites the existing local solution file immediately.')}
`
  )
  .action(async (id) => {
    await resetCommand(id);
  });

program
  .command('submit <file>')
  .alias('x')
  .description('Submit solution to LeetCode')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc submit 1')}                Submit by problem ID
  ${chalk.cyan('$ lc submit two-sum')}          Submit by problem slug
  ${chalk.cyan('$ lc submit ./path/to/file.py')} Submit by file path
  ${chalk.cyan('$ lc x 412')}                   Short alias
`
  )
  .action(submitCommand);

program
  .command('diff <id>')
  .description('Compare solution with past submissions')
  .option('-s, --submission <id>', 'Compare with specific submission ID')
  .option('-f, --file <path>', 'Compare with a local file')
  .option('-u, --unified', 'Show unified diff (line-by-line changes)')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc diff 1')}                  Compare with last accepted
  ${chalk.cyan('$ lc diff 1 -u')}               Show unified diff
  ${chalk.cyan('$ lc diff 1 -s 12345')}         Compare with specific submission
  ${chalk.cyan('$ lc diff 1 -f other.py')}      Compare with local file
`
  )
  .action(diffCommand);

program
  .command('submissions <id>')
  .description('View past submissions')
  .option('-n, --limit <number>', 'Number of submissions to show', '20')
  .option('--last', 'Show details of the last accepted submission')
  .option('--download', 'Download the last accepted submission code')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc submissions 1')}           View submissions for problem
  ${chalk.cyan('$ lc submissions 1 -n 5')}      Show last 5 submissions
  ${chalk.cyan('$ lc submissions 1 --last')}    Show last accepted submission
  ${chalk.cyan('$ lc submissions 1 --download')} Download last accepted code
`
  )
  .action(submissionsCommand);

program
  .command('stat [username]')
  .description('Show user statistics and analytics')
  .option('-c, --calendar', 'Weekly activity summary (submissions & active days for last 12 weeks)')
  .option('-s, --skills', 'Skill breakdown (problems solved grouped by topic tags)')
  .option('-t, --trend', 'Daily trend chart (bar graph of submissions for last 7 days)')
  .addHelpText(
    'after',
    `
${chalk.yellow('Options Explained:')}
  ${chalk.cyan('-c, --calendar')}  Shows a table of your weekly submissions and active days
                    for the past 12 weeks. Useful for tracking consistency.
  
  ${chalk.cyan('-s, --skills')}    Shows how many problems you solved per topic tag,
                    grouped by difficulty (Fundamental/Intermediate/Advanced).
                    Helps identify your strong and weak areas.
  
  ${chalk.cyan('-t, --trend')}     Shows a bar chart of daily submissions for the past week.
                    Visualizes your recent coding activity day by day.

${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc stat')}                    Show basic stats (solved count, rank)
  ${chalk.cyan('$ lc stat lee215')}             Show another user's stats
  ${chalk.cyan('$ lc stat -c')}                 Weekly activity table
  ${chalk.cyan('$ lc stat -s')}                 Topic-wise breakdown
  ${chalk.cyan('$ lc stat -t')}                 7-day trend chart
`
  )
  .action((username, options) => statCommand(username, options));

program
  .command('today')
  .description("Show today's progress summary")
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc today')}                   Show streak, solved, and daily challenge
`
  )
  .action(todayCommand);

program
  .command('bookmark <action> [id]')
  .description('Manage problem bookmarks')
  .addHelpText(
    'after',
    `
${chalk.yellow('Actions:')}
  ${chalk.cyan('add <id>')}      Bookmark a problem
  ${chalk.cyan('remove <id>')}   Remove a bookmark
  ${chalk.cyan('list')}          List all bookmarks
  ${chalk.cyan('clear')}         Clear all bookmarks

${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc bookmark add 1')}          Bookmark problem 1
  ${chalk.cyan('$ lc bookmark remove 1')}       Remove bookmark
  ${chalk.cyan('$ lc bookmark list')}           List all bookmarks
`
  )
  .action(bookmarkCommand);

program
  .command('note <id> [action]')
  .description('View or edit notes for a problem')
  .addHelpText(
    'after',
    `
${chalk.yellow('Actions:')}
  ${chalk.cyan('edit')}   Open notes in editor (default)
  ${chalk.cyan('view')}   Display notes in terminal

${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc note 1')}                  Edit notes for problem 1
  ${chalk.cyan('$ lc note 1 edit')}             Edit notes (explicit)
  ${chalk.cyan('$ lc note 1 view')}             View notes in terminal
`
  )
  .action(notesCommand);

program
  .command('sync')
  .description('Sync solutions to Git repository')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc sync')}                    Sync all solutions to remote
`
  )
  .action(syncCommand);

program
  .command('config')
  .description('View or set configuration')
  .option('-l, --lang <language>', 'Set default programming language')
  .option('-s, --site <site>', 'Set LeetCode site (leetcode.com or leetcode.cn)')
  .option('-e, --editor <editor>', 'Set editor command')
  .option('-w, --workdir <path>', 'Set working directory for solutions')
  .option('-r, --repo [url]', 'Set Git repository URL (omit value to clear)')
  .option('--theme <theme>', 'Set color theme (dark, light, auto)')
  .option('-i, --interactive', 'Interactive configuration')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc config')}                  View current config
  ${chalk.cyan('$ lc config -l python3')}       Set language to Python
  ${chalk.cyan('$ lc config -s leetcode.cn')}   Use LeetCode China site
  ${chalk.cyan('$ lc config -e "code"')}        Set editor to VS Code
  ${chalk.cyan('$ lc config -w ~/leetcode')}    Set solutions folder
  ${chalk.cyan('$ lc config -r https://...')}   Set git repository
  ${chalk.cyan('$ lc config --repo')}            Clear git repository
  ${chalk.cyan('$ lc config --theme light')}    Use light color theme
  ${chalk.cyan('$ lc config -i')}               Interactive setup

${chalk.gray(`Supported languages: ${getSupportedLanguagesLabel()}`)}
`
  )
  .action(async (options) => {
    if (options.interactive) {
      await configInteractiveCommand();
    } else {
      await configCommand(options);
    }
  });

program
  .command('timer [id]')
  .description('Start interview mode with timer')
  .option('-m, --minutes <minutes>', 'Custom time limit in minutes')
  .option('--stats', 'Show solve time statistics')
  .option('--stop', 'Stop active timer')
  .addHelpText(
    'after',
    `
${chalk.yellow('How it works:')}
  Start a problem with a countdown timer to simulate interview conditions.
  Default time limits: Easy (20 min), Medium (40 min), Hard (60 min).
  Your solve times are recorded when you submit successfully.

${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc timer 1')}                  Start problem 1 with default time
  ${chalk.cyan('$ lc timer 1 -m 30')}            Start with 30 minute limit
  ${chalk.cyan('$ lc timer --stats')}            Show your solve time statistics
  ${chalk.cyan('$ lc timer --stop')}             Stop active timer
`
  )
  .action((id, options) => timerCommand(id, options));

// Workspace Management
const workspaceCmd = program
  .command('workspace')
  .description('Manage workspaces for different contexts');

workspaceCmd
  .command('current')
  .description('Show current workspace')
  .action(workspaceCurrentCommand);

workspaceCmd.command('list').description('List all workspaces').action(workspaceListCommand);

workspaceCmd
  .command('create <name>')
  .description('Create a new workspace')
  .option('-w, --workdir <path>', 'Set working directory for this workspace')
  .action(workspaceCreateCommand);

workspaceCmd.command('use <name>').description('Switch to a workspace').action(workspaceUseCommand);

workspaceCmd
  .command('delete <name>')
  .description('Delete a workspace')
  .action(workspaceDeleteCommand);

// Collaborative Coding
const collabCmd = program
  .command('collab')
  .description('Collaborative coding with a partner')
  .addHelpText(
    'after',
    `
${chalk.yellow('Subcommands:')}
  ${chalk.cyan('host <id>')}      Create a room and get a code to share
  ${chalk.cyan('join <code>')}    Join a room with the shared code
  ${chalk.cyan('sync')}           Upload your solution to the room
  ${chalk.cyan('compare')}        View both solutions side by side
  ${chalk.cyan('status')}         Check room and sync status
  ${chalk.cyan('leave')}          End the collaboration session

${chalk.yellow('Examples:')}
  ${chalk.gray('$ lc collab host 1')}       Start a session for Two Sum
  ${chalk.gray('$ lc collab join ABC123')} Join your partner's session
  ${chalk.gray('$ lc collab sync')}        Upload your code after solving
  ${chalk.gray('$ lc collab compare')}     Compare solutions
`
  );

collabCmd
  .command('host <problemId>')
  .description('Host a collaboration session')
  .action(collabHostCommand);

collabCmd
  .command('join <roomCode>')
  .description('Join a collaboration session')
  .action(collabJoinCommand);

collabCmd.command('sync').description('Sync your code with partner').action(collabSyncCommand);

collabCmd
  .command('compare')
  .description('Compare your solution with partner')
  .action(collabCompareCommand);

collabCmd
  .command('leave')
  .description('Leave the collaboration session')
  .action(collabLeaveCommand);

collabCmd.command('status').description('Show collaboration status').action(collabStatusCommand);

// Snapshot command
const snapshotCmd = program
  .command('snapshot')
  .description('Save and restore solution versions')
  .addHelpText(
    'after',
    `
${chalk.yellow('Subcommands:')}
  ${chalk.cyan('save <id> [name]')}           Save current solution as a snapshot
  ${chalk.cyan('list <id>')}                  List all snapshots for a problem
  ${chalk.cyan('restore <id> <snapshot>')}   Restore a snapshot
  ${chalk.cyan('diff <id> <s1> <s2>')}        Compare two snapshots
  ${chalk.cyan('delete <id> <snapshot>')}    Delete a snapshot

${chalk.yellow('Examples:')}
  ${chalk.gray('$ lc snapshot save 1 "brute-force"')}     Save current solution
  ${chalk.gray('$ lc snapshot list 1')}                   List snapshots
  ${chalk.gray('$ lc snapshot restore 1 2')}              Restore snapshot #2
  ${chalk.gray('$ lc snapshot diff 1 1 2')}               Compare snapshots
`
  );

snapshotCmd
  .command('save <id> [name]')
  .description('Save current solution as a snapshot')
  .action(snapshotSaveCommand);

snapshotCmd
  .command('list <id>')
  .description('List all snapshots for a problem')
  .action(snapshotListCommand);

snapshotCmd
  .command('restore <id> <snapshot>')
  .description('Restore a snapshot')
  .action(snapshotRestoreCommand);

snapshotCmd
  .command('diff <id> <snap1> <snap2>')
  .description('Compare two snapshots')
  .action(snapshotDiffCommand);

snapshotCmd
  .command('delete <id> <snapshot>')
  .description('Delete a snapshot')
  .action(snapshotDeleteCommand);

// Update & Changelog
program
  .command('update')
  .description('Check for CLI updates')
  .option('--check-only', 'Only check for updates, do not show update instructions')
  .option('-f, --force', 'Force check even if recently checked')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc update')}                   Check for updates
  ${chalk.cyan('$ lc update --force')}           Force re-check npm registry
  ${chalk.cyan('$ lc update --check-only')}      Just check, minimal output
`
  )
  .action(updateCommand);

program
  .command('changelog [version]')
  .description('View release notes and changelog')
  .option('--latest', 'Show only the latest version')
  .option('--breaking', 'Show only versions with breaking changes')
  .option('-a, --all', 'Show all versions (default: only newer than installed)')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ lc changelog')}                Show what's new since your version
  ${chalk.cyan('$ lc changelog --all')}          View full changelog
  ${chalk.cyan('$ lc changelog 2.0.0')}          Show specific version
  ${chalk.cyan('$ lc changelog --latest')}       Show latest version only
  ${chalk.cyan('$ lc changelog --breaking')}     Filter to breaking changes
`
  )
  .action((version, options) => changelogCommand(version, options));

program
  .command('star')
  .description('Open the GitHub repo to star the project')
  .addHelpText(
    'after',
    `
${chalk.yellow('Why star?')}
  Stars help other developers discover leetcode-cli and encourage contributions.
`
  )
  .action(starCommand);

program
  .command('completion <shell>')
  .description('Generate shell autocompletion script')
  .addHelpText(
    'after',
    `
Supported shells:
  - bash
  - zsh
  - fish

Examples:
  $ lc completion zsh > ~/.zsh/_leetcode
`
  )
  .action(completionCommand);

program.showHelpAfterError('(add --help for additional information)');

// Check for updates on startup (non-blocking)
const shouldCheckUpdates =
  process.argv.length > 2 &&
  process.stdout.isTTY &&
  !['update', 'changelog', '--version', '-v', '--help', '-h'].includes(process.argv[2]);

if (shouldCheckUpdates) {
  checkForUpdatesOnStartup().catch(() => {}); // Silent fail
}

// Main entry point - detect TUI vs CLI mode
const args = process.argv.slice(2);

if (args.length === 0 && process.stdout.isTTY) {
  // No args + interactive terminal → launch TUI
  launchNewTUI({ username: '' }).catch((err) => {
    console.error('Failed to launch TUI:', err.message);
    process.exit(1);
  });
} else if (args.length === 0) {
  // No args + non-TTY (piped) → show help
  console.log();
  console.log(chalk.bold.cyan('  🔥 lc'));
  console.log(chalk.gray('  A modern command-line interface for LeetCode'));
  console.log();
  program.outputHelp();
} else {
  // Has args → normal CLI mode
  program.parse();
}
