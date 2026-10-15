import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { after, test } from 'node:test';

const repo = fileURLToPath(new URL('../', import.meta.url));
const cli = path.join(repo, 'bin', 'install.mjs');
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'gwc-tests-'));
const expectedSkills = [
  'diagnose-bug', 'implement-feature', 'optimize-performance', 'plan-feature',
  'refactor-code', 'review-architecture', 'review-code', 'review-security',
  'setup-project', 'write-tests',
];
let sequence = 0;

function fresh() {
  const directory = path.join(workspace, String(sequence++));
  fs.mkdirSync(directory);
  return directory;
}

function invoke(args, cwd, source = cli, prefix = []) {
  const result = spawnSync(process.execPath, [...prefix, source, ...args], {
    cwd, encoding: 'utf8', timeout: 60_000,
  });
  assert.ifError(result.error);
  return result;
}

function equalSource(destination, source) {
  assert.deepEqual(fs.readFileSync(destination), fs.readFileSync(path.join(repo, source)));
}

function equalProfile(destination, profileFile) {
  const core = fs.readFileSync(path.join(repo, 'template/GLOBAL_WORKING_CONTEXT.md'), 'utf8');
  const profile = fs.readFileSync(path.join(repo, 'profiles', profileFile), 'utf8');
  assert.equal(fs.readFileSync(destination, 'utf8'), `${core.trimEnd()}\n\n---\n\n# Active Agent Profile\n\n${profile.trim()}\n`);
}

after(() => {
  // Delete only the unique temporary workspace created by this test process.
  assert.equal(path.dirname(path.resolve(workspace)), path.resolve(os.tmpdir()));
  assert(path.basename(workspace).startsWith('gwc-tests-'));
  fs.rmSync(workspace, { recursive: true, force: true });
});

test('all ten skills have matching metadata and complete workflow documents', () => {
  const root = path.join(repo, 'skills');
  assert.deepEqual(fs.readdirSync(root).sort(), expectedSkills);
  for (const name of expectedSkills) {
    assert.match(name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const directory = path.join(root, name);
    const file = path.join(directory, 'SKILL.md');
    assert(fs.statSync(directory).isDirectory(), `${name}: expected skill directory`);
    assert(fs.statSync(file).isFile(), `${name}: expected SKILL.md file`);
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    // Toolkit metadata intentionally uses a two-field, plain-scalar YAML subset.
    const metadata = /^---\nname: ([a-z0-9-]+)\ndescription: ([^\n]+)\n---\n/.exec(text);
    assert(metadata, `${name}: missing name/description frontmatter`);
    assert.equal(metadata[1], name);
    assert(metadata[2].trim(), `${name}: empty description`);
    assert(!/:\s|\s#/.test(metadata[2]), `${name}: ambiguous plain YAML scalar`);
    assert(!/\bTODO\b|\[INSERT|placeholder/i.test(text), `${name}: unfinished scaffold`);
    const body = text.slice(metadata[0].length).trim();
    assert(body, `${name}: empty instructions`);
    const sections = [...body.matchAll(/^##\s+(.+)$/gm)].map(match => match[1]);
    assert(sections.some(section => /workflow|phase/i.test(section)), `${name}: missing workflow structure`);
    assert(sections.some(section => /deliverable|output|report/i.test(section)), `${name}: missing expected output`);
    assert(sections.some(section => /completion|verif/i.test(section)), `${name}: missing completion or verification`);
  }
});

test('default Global Context installation and duplicate protection preserve bytes', () => {
  const cwd = fresh();
  assert.equal(invoke([], cwd).status, 0);
  const destination = path.join(cwd, 'GLOBAL_WORKING_CONTEXT.md');
  equalSource(destination, 'template/GLOBAL_WORKING_CONTEXT.md');
  assert.equal(invoke([], cwd).status, 1);
  equalSource(destination, 'template/GLOBAL_WORKING_CONTEXT.md');
});

test('runtime profiles are explicit, normalized, complete, and refuse overwrite', () => {
  for (const [args, file] of [
    [['--profile', 'astra-luna'], 'ASTRA_LUNA.md'],
    [['--profile=astra_luna'], 'ASTRA_LUNA.md'],
    [['--profile', ' ASTRA_LUNA '], 'ASTRA_LUNA.md'],
    [['--profile', 'gemini-antigravity'], 'GEMINI_ANTIGRAVITY.md'],
    [['--profile=gemini_antigravity'], 'GEMINI_ANTIGRAVITY.md'],
    [['--profile', ' GEMINI_ANTIGRAVITY '], 'GEMINI_ANTIGRAVITY.md'],
  ]) {
    const cwd = fresh();
    const destination = path.join(cwd, 'GLOBAL_WORKING_CONTEXT.md');
    assert.equal(invoke(args, cwd).status, 0);
    equalProfile(destination, file);
    assert.equal(invoke(args, cwd).status, 1);
    equalProfile(destination, file);
  }
});

test('standalone help writes nothing', () => {
  for (const flag of ['-h', '--help']) {
    const cwd = fresh();
    const result = invoke([flag], cwd);
    assert.equal(result.status, 0);
    assert(result.stdout.includes('--profile'));
    assert(result.stdout.includes('--target codex'));
    assert.deepEqual(fs.readdirSync(cwd), []);
  }
});

test('missing packaged runtime profile fails before writing the destination', () => {
  const fixture = fresh();
  const cwd = fresh();
  fs.mkdirSync(path.join(fixture, 'bin'));
  fs.mkdirSync(path.join(fixture, 'template'));
  const source = path.join(fixture, 'bin/install.mjs');
  fs.copyFileSync(cli, source);
  fs.copyFileSync(path.join(repo, 'template/GLOBAL_WORKING_CONTEXT.md'), path.join(fixture, 'template/GLOBAL_WORKING_CONTEXT.md'));
  const result = invoke(['--profile', 'astra-luna'], cwd, source);
  assert.equal(result.status, 1);
  assert(result.stderr.startsWith('Error: Failed to install GLOBAL_WORKING_CONTEXT.md:'));
  assert(!result.stderr.includes('    at '));
  assert.deepEqual(fs.readdirSync(cwd), []);
});

for (const target of [null, 'codex']) {
  test(`each skill installs and refuses overwrite: ${target ?? 'portable'}`, () => {
    const cwd = fresh();
    for (const name of expectedSkills) {
      const args = ['--skill', name, ...(target ? ['--target', target] : [])];
      const file = path.join(cwd, ...(target ? ['.agents'] : []), 'skills', name, 'SKILL.md');
      assert.equal(invoke(args, cwd).status, 0, name);
      equalSource(file, `skills/${name}/SKILL.md`);
      assert.equal(invoke(args, cwd).status, 1, name);
      equalSource(file, `skills/${name}/SKILL.md`);
    }
    if (target) assert(!fs.existsSync(path.join(cwd, 'skills')));
    else assert(!fs.existsSync(path.join(cwd, '.agents')));
  });
}

test('explicit target works before skill option without changing default semantics', () => {
  const cwd = fresh();
  assert.equal(invoke(['--target', 'codex', '--skill', 'review-code'], cwd).status, 0);
  equalSource(path.join(cwd, '.agents/skills/review-code/SKILL.md'), 'skills/review-code/SKILL.md');
});

test('unknown skill reports actual available names without creating files', () => {
  const cwd = fresh();
  const result = invoke(['--skill', 'missing'], cwd);
  assert.equal(result.status, 1);
  for (const name of expectedSkills) assert(result.stderr.includes(name));
  assert.deepEqual(fs.readdirSync(cwd), []);
});

test('malformed arguments and traversal fail before writes', () => {
  const cases = [
    ['oops'], ['-x'], ['--output', 'x'], ['--skill'], ['--skill', ''],
    ['--skill', '--target'], ['--skill', 'diagnose-bug', 'extra'],
    ['--skill', 'diagnose-bug', '--skill', 'review-code'], ['--skill=diagnose-bug'],
    ['--skill', '../outside'], ['--skill', '..\\outside'], ['--skill', '/outside'],
    ['--skill', 'C:\\outside'], ['--skill', '.'], ['--skill', '--diagnose-bug'],
    ['--target', 'codex'], ['--target'], ['--target', ''],
    ['--skill', 'diagnose-bug', '--target', 'unknown'],
    ['--skill', 'diagnose-bug', '--target', 'codex', '--target', 'codex'],
    ['--skill', 'diagnose-bug', '--target'], ['--target=codex', '--skill', 'diagnose-bug'],
    ['--target', '../outside', '--skill', 'diagnose-bug'],
    ['--profile'], ['--profile', ''], ['--profile='], ['--profile', '   '],
    ['--profile', 'missing'], ['--profile', '../outside'], ['--profile=..\\outside'],
    ['--profile', 'astra-luna', '--profile=gemini-antigravity'],
    ['--skill', 'review-code', '--profile', 'astra-luna'],
    ['--profile=astra-luna', '--skill', 'review-code'],
    ['--profile', 'astra-luna', '--target', 'codex'],
    ['--skill', 'review-code', '--target', 'codex', '--profile=astra-luna'],
    ['--help', '--profile', 'astra-luna'], ['--profile', 'astra-luna', '--help'],
  ];
  for (const args of cases) {
    const cwd = fresh();
    assert.equal(invoke(args, cwd).status, 1, JSON.stringify(args));
    assert.deepEqual(fs.readdirSync(cwd), [], JSON.stringify(args));
  }
});

test('linked destination ancestors are rejected at every portable and Codex level', () => {
  for (const parts of [
    ['skills'], ['skills', 'review-code'], ['.agents'],
    ['.agents', 'skills'], ['.agents', 'skills', 'review-code'],
  ]) {
    const cwd = fresh();
    const outside = fresh();
    const link = path.join(cwd, ...parts);
    fs.mkdirSync(path.dirname(link), { recursive: true });
    fs.symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
    const args = ['--skill', 'review-code', ...(parts[0] === '.agents' ? ['--target', 'codex'] : [])];
    assert.equal(invoke(args, cwd).status, 1);
    assert.deepEqual(fs.readdirSync(outside), []);
  }
});

test('dangling destination links and directory conflicts cannot be overwritten', async (t) => {
  for (const mode of ['global', 'portable', 'codex', 'astra-luna', 'gemini-antigravity']) {
    await t.test(`${mode}: dangling destination link`, (linkTest) => {
      const cwd = fresh();
      const isGlobal = ['global', 'astra-luna', 'gemini-antigravity'].includes(mode);
      const file = isGlobal ? 'GLOBAL_WORKING_CONTEXT.md'
        : `${mode === 'codex' ? '.agents/' : ''}skills/review-code/SKILL.md`;
      const destination = path.join(cwd, file);
      const missing = path.join(fresh(), 'missing');
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      try {
        fs.symlinkSync(missing, destination, 'file');
      } catch (error) {
        if (error.code === 'EPERM') {
          linkTest.skip('File-symlink privilege unavailable; junction tests still run.');
          return;
        }
        throw error;
      }
      const args = mode === 'global' ? [] : isGlobal ? ['--profile', mode]
        : ['--skill', 'review-code', ...(mode === 'codex' ? ['--target', 'codex'] : [])];
      assert.equal(invoke(args, cwd).status, 1);
      assert(fs.lstatSync(destination).isSymbolicLink());
      assert(!fs.existsSync(missing));
    });
  }
  for (const target of [null, 'codex']) {
    const cwd = fresh();
    const conflict = path.join(cwd, target ? '.agents' : 'skills');
    fs.writeFileSync(conflict, 'sentinel');
    assert.equal(invoke(['--skill', 'review-code', ...(target ? ['--target', target] : [])], cwd).status, 1);
    assert.equal(fs.readFileSync(conflict, 'utf8'), 'sentinel');
  }
});

test('listing errors remain controlled and distinct from a readable empty directory', () => {
  for (const kind of ['ENOTDIR', 'EACCES', 'ENOENT', 'empty']) {
    const fixture = fresh();
    const cwd = fresh();
    fs.mkdirSync(path.join(fixture, 'bin'));
    const source = path.join(fixture, 'bin/install.mjs');
    fs.copyFileSync(cli, source);
    if (kind === 'ENOTDIR') fs.writeFileSync(path.join(fixture, 'skills'), 'sentinel');
    if (kind === 'empty' || kind === 'EACCES') fs.mkdirSync(path.join(fixture, 'skills'));
    let prefix = [];
    if (kind === 'EACCES') {
      const hook = path.join(fixture, 'deny.cjs');
      fs.writeFileSync(hook, "require('node:fs').readdirSync=()=>{const e=Error('permission denied (fixture)');e.code='EACCES';throw e;};");
      prefix = ['--require', hook];
    }
    const result = invoke(['--skill', 'missing'], cwd, source, prefix);
    assert.equal(result.status, 1);
    assert.deepEqual(fs.readdirSync(cwd), []);
    assert(!result.stderr.includes('    at '));
    if (kind === 'empty') assert(result.stderr.includes('No skills are currently available'));
    else {
      assert(result.stderr.startsWith('Error: Cannot list skills'));
      assert(!result.stderr.includes('No skills are currently available'));
    }
  }
});

test('npm artifact contains all skills and installed executable supports both destinations', () => {
  const cwd = fresh();
  const npm = process.env.npm_execpath ?? path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
  assert(fs.existsSync(npm), 'Run npm test so npm_execpath identifies the installed npm CLI.');
  const npmRun = (args, directory) => {
    const result = spawnSync(process.execPath, [npm, ...args], {
      cwd: directory, encoding: 'utf8', timeout: 60_000,
      env: { ...process.env, npm_config_cache: path.join(workspace, 'npm-cache'), npm_config_update_notifier: 'false' },
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    return result;
  };
  const packed = JSON.parse(npmRun(['pack', repo, '--pack-destination', cwd, '--json'], cwd).stdout)[0];
  assert.deepEqual(packed.files.map(file => file.path).sort(), [
    'README.md', 'bin/install.mjs', 'package.json', 'template/GLOBAL_WORKING_CONTEXT.md',
    'profiles/ASTRA_LUNA.md', 'profiles/GEMINI_ANTIGRAVITY.md',
    ...expectedSkills.map(name => `skills/${name}/SKILL.md`),
  ].sort());
  const app = fresh();
  npmRun(['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', path.join(cwd, packed.filename)], app);
  for (const name of expectedSkills) {
    equalSource(path.join(app, 'node_modules/global-working-context/skills', name, 'SKILL.md'), `skills/${name}/SKILL.md`);
  }
  for (const file of ['ASTRA_LUNA.md', 'GEMINI_ANTIGRAVITY.md']) {
    equalSource(path.join(app, 'node_modules/global-working-context/profiles', file), `profiles/${file}`);
  }
  const shim = path.join(app, 'node_modules/.bin', process.platform === 'win32' ? 'global-working-context.cmd' : 'global-working-context');
  assert(fs.existsSync(shim));
  const invokePackage = (args, directory) => process.platform === 'win32'
    ? spawnSync('cmd.exe', ['/d', '/c', shim, ...args], { cwd: directory, encoding: 'utf8' })
    : spawnSync(shim, args, { cwd: directory, encoding: 'utf8' });
  for (const [args, file, source] of [
    [[], 'GLOBAL_WORKING_CONTEXT.md', 'template/GLOBAL_WORKING_CONTEXT.md'],
    [['--skill', 'review-code'], 'skills/review-code/SKILL.md', 'skills/review-code/SKILL.md'],
    [['--skill', 'review-code', '--target', 'codex'], '.agents/skills/review-code/SKILL.md', 'skills/review-code/SKILL.md'],
  ]) {
    const destination = fresh();
    assert.equal(invokePackage(args, destination).status, 0);
    equalSource(path.join(destination, file), source);
    assert.equal(invokePackage(args, destination).status, 1);
    equalSource(path.join(destination, file), source);
  }
  for (const [args, profile] of [
    [['--profile', 'astra-luna'], 'ASTRA_LUNA.md'],
    [['--profile=gemini_antigravity'], 'GEMINI_ANTIGRAVITY.md'],
  ]) {
    const destination = fresh();
    const file = path.join(destination, 'GLOBAL_WORKING_CONTEXT.md');
    assert.equal(invokePackage(args, destination).status, 0);
    equalProfile(file, profile);
    assert.equal(invokePackage(args, destination).status, 1);
    equalProfile(file, profile);
  }
});
