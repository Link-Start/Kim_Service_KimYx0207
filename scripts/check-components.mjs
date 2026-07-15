#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));

if (!Array.isArray(catalog.components)) {
  throw new Error('catalog.json components must be an array');
}

let commandCount = 0;
let rootCoveredCount = 0;

for (const component of catalog.components) {
  if (!component.id || !component.path || !Array.isArray(component.validation)) {
    throw new Error('Every component must declare id, path, and validation[]');
  }

  const componentRoot = path.resolve(root, component.path);
  const relative = path.relative(root, componentRoot);
  if (
    !relative
    || relative === '..'
    || relative.startsWith('..' + path.sep)
    || path.isAbsolute(relative)
    || !fs.statSync(componentRoot).isDirectory()
  ) {
    throw new Error('Component path escapes or is missing: ' + component.path);
  }

  if (component.validation.length === 0) {
    rootCoveredCount += 1;
    console.log('[root-covered] ' + component.id);
    continue;
  }

  for (const command of component.validation) {
    if (typeof command !== 'string' || !command.trim()) {
      throw new Error('Validation command must be a non-empty string: ' + component.id);
    }
    console.log('[run] ' + component.id + ': ' + command);
    const result = spawnSync(command, {
      cwd: componentRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        PYTHONDONTWRITEBYTECODE: '1'
      },
      shell: true,
      stdio: 'inherit'
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(
        'Component validation failed (' + String(result.status) + '): ' + component.id + ': ' + command
      );
    }
    commandCount += 1;
  }
}

console.log(
  'Catalog component validation passed: ' +
  String(catalog.components.length) + ' components, ' +
  String(commandCount) + ' declared commands, ' +
  String(rootCoveredCount) + ' root-covered components.'
);
