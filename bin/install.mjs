#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_NAME = 'GLOBAL_WORKING_CONTEXT.md';
const CANONICAL_PROFILES = ['astra-luna', 'gemini-antigravity'];

const PROFILE_MAP = {
  'astra-luna': 'ASTRA_LUNA.md',
  'astra_luna': 'ASTRA_LUNA.md',
  'gemini-antigravity': 'GEMINI_ANTIGRAVITY.md',
  'gemini_antigravity': 'GEMINI_ANTIGRAVITY.md',
};

function printUsage() {
  console.log(`Usage:
  npx global-working-context [--profile <name>]
  npx github:tranquangthuan3004/global-working-context [--profile <name>]

Options:
  --profile <name>  Agent profile to install (default: astra-luna)
                    Supported profiles: ${CANONICAL_PROFILES.join(', ')}
  -h, --help        Show this help message
`);
}

const args = process.argv.slice(2);
let selectedProfile = 'astra-luna';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '-h' || arg === '--help') {
    printUsage();
    process.exit(0);
  } else if (arg === '--profile') {
    if (i + 1 >= args.length) {
      console.error('Error: Missing value for --profile argument.\n');
      printUsage();
      process.exit(1);
    }
    selectedProfile = args[++i];
  } else if (arg.startsWith('--profile=')) {
    selectedProfile = arg.slice('--profile='.length);
  } else {
    console.error(`Error: Unknown argument "${arg}".\n`);
    printUsage();
    process.exit(1);
  }
}

const normalizedKey = selectedProfile.toLowerCase().trim();
const profileFileName = PROFILE_MAP[normalizedKey];

if (!profileFileName) {
  console.error(`Error: Invalid profile "${selectedProfile}".`);
  console.error(`Valid profile names: ${CANONICAL_PROFILES.join(', ')}\n`);
  printUsage();
  process.exit(1);
}

// Canonical display name
const canonicalName = normalizedKey.replace('_', '-');

const coreSourcePath = path.resolve(__dirname, '..', 'template', FILE_NAME);
const profileSourcePath = path.resolve(__dirname, '..', 'profiles', profileFileName);
const destinationPath = path.resolve(process.cwd(), FILE_NAME);

if (!fs.existsSync(coreSourcePath)) {
  console.error(`Error: Packaged core template not found at: ${coreSourcePath}`);
  process.exit(1);
}

if (!fs.existsSync(profileSourcePath)) {
  console.error(`Error: Packaged profile file not found at: ${profileSourcePath}`);
  process.exit(1);
}

if (fs.existsSync(destinationPath)) {
  console.error(`Error: "${destinationPath}" already exists. Will not overwrite.`);
  process.exit(1);
}

try {
  const coreContent = fs.readFileSync(coreSourcePath, 'utf8');
  const profileContent = fs.readFileSync(profileSourcePath, 'utf8');

  const combined = `${coreContent.trimEnd()}\n\n---\n\n# Active Agent Profile\n\n${profileContent.trim()}\n`;

  fs.writeFileSync(destinationPath, combined, { flag: 'wx' });
  console.log(`Successfully installed ${FILE_NAME} (profile: ${canonicalName})`);
  console.log(`Destination: ${destinationPath}`);
} catch (err) {
  console.error(`Error: Failed to install ${FILE_NAME}: ${err.message}`);
  process.exit(1);
}