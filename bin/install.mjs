#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_NAME = 'GLOBAL_WORKING_CONTEXT.md';
const sourcePath = path.resolve(__dirname, '..', FILE_NAME);
const destinationPath = path.resolve(process.cwd(), FILE_NAME);

if (!fs.existsSync(sourcePath)) {
  console.error(`Error: Packaged source file not found at: ${sourcePath}`);
  process.exit(1);
}

if (fs.existsSync(destinationPath)) {
  console.error(`Error: "${destinationPath}" already exists. Will not overwrite.`);
  process.exit(1);
}

try {
  fs.copyFileSync(sourcePath, destinationPath, fs.constants.COPYFILE_EXCL);
  console.log(`Successfully installed ${FILE_NAME}`);
  console.log(`Destination: ${destinationPath}`);
} catch (err) {
  console.error(`Error: Failed to copy ${FILE_NAME}: ${err.message}`);
  process.exit(1);
}
