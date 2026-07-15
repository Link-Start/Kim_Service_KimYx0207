# Kim Service

An open-source collection of reusable Hooks and Skills for AI coding assistants such as Claude Code and Codex.

This monorepo reduces discovery, installation, and maintenance overhead while applying one repository-level structure and public-safety gate. Every `skills/<slug>/` directory is a complete, self-contained public package: `SKILL.md` is the entry point, while the same directory also carries its README, license, and CHANGELOG/NOTICE records for version history and attribution. A user does not need to return to the former standalone repository to understand, install, or audit the package. Existing component-level validation commands and source revisions are recorded in [catalog.json](catalog.json); components without a standalone validator are still covered by the repository gate for structure and publication boundaries.

Kim Service is the publication authority for the aggregated packages. Component directories retain their own documentation, licensing, change history, and attribution, while the repository `VERSION`, Git tags, Releases, and [release notes](CHANGELOG.md) are committed and published from Kim Service. Public versions use the exact, case-sensitive two-part form `V<major>.<minor>`; the tag and GitHub Release title must equal `VERSION` byte for byte.

## Components

| Type | Component | Purpose |
|---|---|---|
| Hook | [HookPrompt](hooks/hookprompt) | Turns casual requests into executable and verifiable prompts |
| Skill | [Agent Teams Playbook](skills/agent-teams-playbook) | Multi-agent orchestration and synthesis contracts |
| Skill | [Memory 3-Layer](skills/memory-3layer) | A three-layer memory system with a neutral core and Claude Code/Codex adapters |
| Skill | [Find Skill](skills/find-skill) | Finds and installs Agent Skills with Windows guidance |
| Skill | [GoalPro](skills/goalpro) | Produces clear, bounded, verifiable Goal and Loop Prompts |
| Skill | [Kim Decision](skills/kim-decision) | Turns fuzzy questions into evidence-backed next actions |
| Skill | [Meta Skill Creator](skills/meta-skill-creator) | Creates, refactors, and validates reusable Skill packages |
| Skill | [Semgrep Skill](skills/semgrep-skill) | Runs code security scans with Semgrep |
| Skill | [Xiaohongshu Skill](skills/xiaohongshu-skill) | Produces reviewable Rednote copy and visual decisions |

The inventory is fixed at one Hook and eight Skills. Any inventory change must update both the catalog and repository checker.

## Usage

1. Open the component directory you need.
2. For a Hook, start with its README. For a Skill, read the colocated SKILL.md, README, LICENSE, and CHANGELOG/NOTICE.
3. Follow the component-specific project or user-level installation steps.
4. Run the component validation commands when the catalog declares them; otherwise run at least the repository gate.

HookPrompt intentionally retains hooks/hookprompt/.claude and hooks/hookprompt/.codex as installable product content. Other components must not carry root-level .agents, .claude, or .codex runtime projections.

## Verification

From the repository root:

    node scripts/check-repository.mjs

After creating the release commit and before creating its tag, run the release-readiness gate on the clean worktree:

    node scripts/check-repository.mjs --release

This mode additionally checks the exact `V<major>.<minor>` VERSION form, five non-empty CHANGELOG sections, the `main` branch, `origin` identity, existing uppercase `V*` release tags, and worktree state. Historical lowercase `v*` tags are outside the collection version namespace. Remote divergence, remote tags, GitHub Release metadata, and the temporary clone at the remote tag remain separate post-push release checks.

    node scripts/check-components.mjs
    node scripts/release-contract.test.mjs

Every component uses the same `required` and `validation` fields in `catalog.json`. `check-components.mjs` executes declared component checks data-first; components without an independent command remain covered by the repository gate. The root README carries no component-specific exception.

Before release, verify that every Skill directory remains self-contained. Version updates are complete only after Kim Service records the change, commits it, pushes it, and publishes a new repository Release; updating an import source alone is not a publication.

The repository checker rejects nested Git repositories, undeclared gitlinks, ignored public files, environment files, private keys, common real-token formats, machine-specific absolute paths, missing components, component `contentSha256` drift from the catalog, and protected QR asset drift.

## Contact and support

<p align="center">
  <img src="docs/images/contact-qr.png" alt="Contact QR code" width="720">
</p>

<table align="center">
  <tr>
    <th align="center">WeChat Pay</th>
    <th align="center">Alipay</th>
  </tr>
  <tr>
    <td align="center"><img src="docs/images/wechat-pay.jpg" alt="WeChat Pay QR code" width="260"></td>
    <td align="center"><img src="docs/images/alipay.jpg" alt="Alipay QR code" width="260"></td>
  </tr>
</table>

## Public boundary

Only catalog-declared public component snapshots belong here. Internal research, test sessions, runtime records, machine state, customer material, and private configuration are excluded.

## License

Repository-level material is licensed under MIT. Component-specific LICENSE, NOTICE, and dual-license files remain authoritative inside each component directory; Kim Service versions and Releases do not replace those terms.
