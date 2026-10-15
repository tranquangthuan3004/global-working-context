#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GLOBAL_CONTEXT_FILE = 'GLOBAL_WORKING_CONTEXT.md';
const SKILLS_DIR = 'skills';

// --- Argument parsing ---
const args = process.argv.slice(2);

const usage = 'Usage: global-working-context [--skill <name> [--target codex]] | --help';
if (args.some(arg => arg === '--profile' || arg.startsWith('--profile='))) {
  console.error('Error: --profile has been removed. Run without it for the neutral Global Context; choose workers through the active host/session.');
  process.exit(1);
}
if (args.length === 1 && ['-h', '--help'].includes(args[0])) {
  console.log(usage);
  console.log('No arguments: neutral Global Context. Skills: --skill <name>, optionally --target codex.');
  process.exit(0);
}
const options = new Map();
for (let i = 0; i < args.length; i += 2) {
  const option = args[i];
  const value = args[i + 1];
  if (!['--skill', '--target'].includes(option) || options.has(option) || !value || value.startsWith('-')) {
    console.error(`Error: Invalid or repeated option, or missing value near "${option}".`);
    console.error(usage);
    process.exit(1);
  }
  options.set(option, value);
}
const skillName = options.get('--skill') ?? null;
const target = options.get('--target') ?? null;
if (target && (!skillName || target !== 'codex')) {
  console.error('Error: --target requires --skill and currently supports only "codex".');
  console.error(usage);
  process.exit(1);
}

// --- Dispatch ---
if (skillName) {
  installSkill(skillName, target);
} else {
  installGlobalContext();
}

// --- Global Context installation ---
function installGlobalContext() {
  const sourcePath = path.resolve(__dirname, '..', 'template', GLOBAL_CONTEXT_FILE);
  const destinationPath = path.resolve(process.cwd(), GLOBAL_CONTEXT_FILE);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Packaged source file not found at: ${sourcePath}`);
    process.exit(1);
  }

  if (destinationExists(destinationPath)) {
    console.error(`Error: "${destinationPath}" already exists. Will not overwrite.`);
    process.exit(1);
  }

  try {
    fs.copyFileSync(sourcePath, destinationPath, fs.constants.COPYFILE_EXCL);
    console.log(`Successfully installed ${GLOBAL_CONTEXT_FILE}`);
    console.log(`Destination: ${destinationPath}`);
  } catch (err) {
    console.error(`Error: Failed to install ${GLOBAL_CONTEXT_FILE}: ${err.message}`);
    process.exit(1);
  }
}

// --- Skill installation ---
function installSkill(name, target) {
  // Validate skill name: only word characters and hyphens; no path separators or dots
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    console.error(`Error: Invalid skill name "${name}". Skill names may only contain letters, digits, hyphens, and underscores.`);
    process.exit(1);
  }

  const skillSourceDir = path.resolve(__dirname, '..', SKILLS_DIR, name);
  const skillSourceFile = path.join(skillSourceDir, 'SKILL.md');

  // Confirm source is within the package skills directory (defense in depth)
  const skillsRoot = path.resolve(__dirname, '..', SKILLS_DIR);
  if (!skillSourceDir.startsWith(skillsRoot + path.sep)) {
    console.error(`Error: Skill path traversal detected for "${name}".`);
    process.exit(1);
  }

  if (!fs.existsSync(skillSourceFile)) {
    const available = listAvailableSkills();
    console.error(`Error: Skill "${name}" not found.`);
    if (available.length > 0) {
      console.error(`Available skills: ${available.join(', ')}`);
    } else {
      console.error('No skills are currently available in this package.');
    }
    process.exit(1);
  }

  // Keep the portable default; agent-specific placement requires an explicit target.
  const destinationParts = target === 'codex' ? ['.agents', SKILLS_DIR, name] : [SKILLS_DIR, name];
  const destDir = path.resolve(process.cwd(), ...destinationParts);
  const destFile = path.join(destDir, 'SKILL.md');

  if (destinationExists(destFile)) {
    console.error(`Error: "${destFile}" already exists. Will not overwrite.`);
    process.exit(1);
  }

  try {
    // Reject linked destination directories to avoid writing outside this project.
    for (let i = 1; i <= destinationParts.length; i++) {
      const directory = path.resolve(process.cwd(), ...destinationParts.slice(0, i));
      try {
        const stat = fs.lstatSync(directory);
        if (stat.isSymbolicLink() || !stat.isDirectory()) {
          throw new Error(`Destination directory must be a regular directory: ${directory}`);
        }
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }
    }
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(skillSourceFile, destFile, fs.constants.COPYFILE_EXCL);
    console.log(`Successfully installed skill: ${name}`);
    console.log(`Destination: ${destFile}`);
  } catch (err) {
    console.error(`Error: Failed to install skill "${name}": ${err.message}`);
    process.exit(1);
  }
}

// --- List available skills ---
function listAvailableSkills() {
  const skillsRoot = path.resolve(__dirname, '..', SKILLS_DIR);
  try {
    return fs.readdirSync(skillsRoot, { withFileTypes: true })
      .filter(d => d.isDirectory() && fs.existsSync(path.join(skillsRoot, d.name, 'SKILL.md')))
      .map(d => d.name);
  } catch (err) {
    console.error(`Error: Cannot list skills at "${skillsRoot}": ${err.message}. Check that the packaged skills directory exists and is readable, or reinstall the package.`);
    process.exit(1);
  }
}

// lstat also detects dangling symlinks, which existsSync would miss.
function destinationExists(destination) {
  try {
    fs.lstatSync(destination);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    console.error(`Error: Cannot inspect destination "${destination}": ${err.message}`);
    process.exit(1);
  }
}
