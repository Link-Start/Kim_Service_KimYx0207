const VERSION_PATTERN = /^V(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export const REQUIRED_RELEASE_HEADINGS = [
  'Affected components',
  'User-visible changes',
  'Breaking changes and migration',
  'Verification',
  'Source revisions'
];

export function parsePublicVersion(value) {
  const match = String(value).match(VERSION_PATTERN);
  if (!match) return null;
  return { major: match[1], minor: match[2] };
}

function compareNumericIdentifier(left, right) {
  if (left.length !== right.length) return left.length - right.length;
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

export function comparePublicVersion(left, right) {
  for (const key of ['major', 'minor']) {
    const comparison = compareNumericIdentifier(left[key], right[key]);
    if (comparison !== 0) return comparison;
  }
  return 0;
}

export function isPublicReleaseTag(value) {
  return parsePublicVersion(value) !== null;
}

export function findBlockingReleaseTag(tags, proposedVersion) {
  const parsedVersion = parsePublicVersion(proposedVersion);
  if (!parsedVersion) return null;

  const candidates = tags
    .map((tag) => ({ tag, version: parsePublicVersion(tag) }))
    .filter((item) => item.version)
    .sort((left, right) => comparePublicVersion(right.version, left.version));

  return candidates.find(
    (item) => comparePublicVersion(parsedVersion, item.version) <= 0
  )?.tag ?? null;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function inspectReleaseChangelog(changelog, version) {
  const errors = [];
  if (!parsePublicVersion(version)) {
    return { errors: ['Invalid public version: ' + version], section: null };
  }

  const headingPattern = new RegExp(
    '^##\\s+' + escapeRegex(version) + '\\s+-\\s+\\d{4}-\\d{2}-\\d{2}\\s*$',
    'm'
  );
  const headingMatch = headingPattern.exec(changelog);
  if (!headingMatch) {
    return {
      errors: ['CHANGELOG.md lacks an exact dated section for VERSION ' + version],
      section: null
    };
  }

  const afterHeading = changelog.slice(headingMatch.index + headingMatch[0].length);
  const nextReleaseHeading = afterHeading.search(/^##\s+/m);
  const section = nextReleaseHeading === -1
    ? afterHeading
    : afterHeading.slice(0, nextReleaseHeading);

  let previousIndex = -1;
  for (const heading of REQUIRED_RELEASE_HEADINGS) {
    const pattern = new RegExp(
      '^###\\s+' + escapeRegex(heading) + '\\s*$',
      'mi'
    );
    const match = pattern.exec(section);
    if (!match) {
      errors.push('CHANGELOG ' + version + ' section lacks heading: ' + heading);
      continue;
    }
    if (match.index < previousIndex) {
      errors.push('CHANGELOG ' + version + ' headings are out of order: ' + heading);
    }
    previousIndex = match.index;

    const afterSubheading = section.slice(match.index + match[0].length);
    const nextSubheading = afterSubheading.search(/^###\s+/m);
    const body = nextSubheading === -1
      ? afterSubheading
      : afterSubheading.slice(0, nextSubheading);
    if (!body.trim()) {
      errors.push('CHANGELOG ' + version + ' heading is empty: ' + heading);
    }
  }

  return { errors, section };
}
