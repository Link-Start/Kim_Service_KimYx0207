#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
  comparePublicVersion,
  findBlockingReleaseTag,
  inspectReleaseChangelog,
  isPublicReleaseTag,
  parsePublicVersion
} from './release-contract.mjs';

assert.deepEqual(parsePublicVersion('V1.0'), { major: '1', minor: '0' });
for (const invalid of ['1.0', 'v1.0', 'V1.0.0', 'V01.0', 'V1.00']) {
  assert.equal(parsePublicVersion(invalid), null, invalid + ' must be rejected');
}
assert.ok(
  comparePublicVersion(parsePublicVersion('V1.10'), parsePublicVersion('V1.9')) > 0,
  'V1.10 must be greater than V1.9'
);
assert.equal(isPublicReleaseTag('v4.8.0'), false);
assert.equal(findBlockingReleaseTag(['v4.8.0'], 'V1.0'), null);
assert.equal(findBlockingReleaseTag(['v4.8.0', 'V1.0'], 'V1.0'), 'V1.0');

const complete = `# Changelog

## V1.0 - 2026-07-14

### Affected components

- All components.

### User-visible changes

- First collection release.

### Breaking changes and migration

- Historical tags remain unchanged.

### Verification

- Repository gate passed.

### Source revisions

- Revisions are recorded in catalog.json.
`;
assert.deepEqual(inspectReleaseChangelog(complete, 'V1.0').errors, []);

const emptyVerification = complete.replace(
  '### Verification\n\n- Repository gate passed.',
  '### Verification\n'
);
assert.match(
  inspectReleaseChangelog(emptyVerification, 'V1.0').errors.join('\n'),
  /heading is empty: Verification/
);

const bracketed = complete.replace('## V1.0 -', '## [V1.0] -');
assert.match(
  inspectReleaseChangelog(bracketed, 'V1.0').errors.join('\n'),
  /lacks an exact dated section/
);

console.log('Release contract tests passed: exact V1.0 namespace, tag progression, and non-empty CHANGELOG sections.');
