# Kim Service 维护说明

本文件面向仓库维护者，公开 README 不承载 catalog、内容哈希、门禁和发布协议等内部维护细节。

## 权威文件

- `catalog.json`：组件清单、来源修订、必需文件、验证命令、内容哈希和公共图片布局。
- `VERSION`：合集公开版本。
- `CHANGELOG.md`：合集版本记录与 Release 正文来源。
- `scripts/check-repository.mjs`：仓库结构、公开边界、内容哈希、敏感信息和图片布局门禁。
- `scripts/check-components.mjs`：执行 catalog 声明的组件验证命令。
- `scripts/release-contract.mjs`：校验版本与变更记录合同。

## 本地验证

    node scripts/check-repository.mjs
    node scripts/check-components.mjs
    node scripts/release-contract.test.mjs

发布 commit 完成后、创建 tag 之前，在干净的 `main` 工作树运行：

    node scripts/check-repository.mjs --release

该门禁只证明本地发布就绪。远端 branch、tag、GitHub Release 和远端 tag 全新克隆必须在推送后分别复核。

## 组件与公开边界

- `hooks/<slug>/` 与 `skills/<slug>/` 中的组件必须自包含，公开所需说明、许可、归属和运行文件不能依赖旧独立仓库。
- 新增、删除或更新组件时，同步更新 `catalog.json`；内容必须与 `contentSha256` 一致。
- HookPrompt 的 `.claude` 与 `.codex` 是产品安装内容。其他组件不得携带根级运行时投影。
- 禁止嵌套 `.git`、未声明 gitlink、真实密钥、本机专属绝对路径、缓存、运行输出和私密材料。
- 联系图与两张收款码的路径、哈希、宽度和居中布局由 catalog 统一约束。

## 发布

- 公开版本使用 `V<major>.<minor>`；`VERSION`、annotated tag、GitHub Release tag 与 Release 标题保持一致。
- 发布顺序：确认远端未分叉，审查 diff，提交，运行干净树发布门禁，创建 annotated tag，推送 branch 与 tag，创建 GitHub Release。
- 发布后核对远端 branch、tag 和 Release，再从远端 tag 全新克隆并重复根门禁与组件验证。
- 已发布的 tag 和历史不得移动或改写；后续问题通过新版本修复。
