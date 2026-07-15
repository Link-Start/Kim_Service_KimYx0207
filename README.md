# Kim Service

面向 Claude Code、Codex 等 AI 编码助手的 Hook 与 Skill 开源合集。

这个仓库把可独立安装的通用能力集中到一个有统一结构与安全门禁的 monorepo 中，减少多个小仓库带来的发现、安装和维护成本。`skills/<slug>/` 下的每个 Skill 都是一整套、自包含的公开包：核心入口是 `SKILL.md`，同一目录还带有 README、许可证以及 CHANGELOG/NOTICE 等版本与归属记录，不需要回到原独立仓库才能理解、安装或核对公开边界。已有的组件级验证命令与来源修订统一记录在 [catalog.json](catalog.json)，尚无独立验证器的组件由仓库根门禁覆盖结构与公开边界。

对外版本以 Kim Service 统一仓为准：组件目录保留自己的说明、许可、变更与归属记录；仓库级 `VERSION`、Git tag、Release 及本次发布记录由 Kim Service 统一提交和发布，记录见 [CHANGELOG.md](CHANGELOG.md)。公开版本严格使用区分大小写的两段式 `V<major>.<minor>`，tag 与 Release 标题必须和 `VERSION` 完全一致。

## 收录内容

| 类型 | 组件 | 用途 |
|---|---|---|
| Hook | [HookPrompt](hooks/hookprompt) | 把随口需求整理为可执行、可验收的专业提示词 |
| Skill | [Agent Teams Playbook](skills/agent-teams-playbook) | 多 Agent 并行编排与汇总合同 |
| Skill | [Memory 3-Layer](skills/memory-3layer) | 由通用核心与 Claude Code / Codex 适配器组成的三层记忆系统 |
| Skill | [Find Skill](skills/find-skill) | 查找和安装 Agent Skills，包含 Windows 兼容说明 |
| Skill | [GoalPro](skills/goalpro) | 生成目标明确、边界清楚、可验收的 Goal 与 Loop Prompt |
| Skill | [Kim Decision](skills/kim-decision) | 把模糊问题收敛为有证据、能执行的决策 |
| Skill | [Meta Skill Creator](skills/meta-skill-creator) | 创建、重构和验收可复用 Skill 包 |
| Skill | [Semgrep Skill](skills/semgrep-skill) | 使用 Semgrep 执行代码安全扫描 |
| Skill | [Xiaohongshu Skill](skills/xiaohongshu-skill) | 生成可直接验收的小红书图文笔记与视觉决策产物 |

当前固定为 1 个 Hook + 8 个 Skills。新增或删除组件时，必须同时更新 catalog 和仓库检查器。

## 使用

1. 打开目标组件目录。
2. Hook 先读 README；Skill 先读同目录内的 SKILL.md、README、LICENSE 和 CHANGELOG/NOTICE。
3. 按组件说明复制到项目级或个人级运行目录。
4. 若 catalog 为该组件声明了验证命令，执行它；无独立命令时至少运行仓库根门禁。

HookPrompt 自身需要保留 hooks/hookprompt/.claude 与 hooks/hookprompt/.codex，它们是产品安装内容，不是本仓库的运行时镜像。其他组件不允许携带根级 .agents、.claude 或 .codex 投影。

## 仓库结构

    Kim_Service/
    ├── hooks/
    │   └── hookprompt/
    ├── skills/
    │   ├── agent-teams-playbook/
    │   ├── memory-3layer/
    │   ├── find-skill/
    │   ├── goalpro/
    │   ├── kim-decision/
    │   ├── meta-skill-creator/
    │   ├── semgrep-skill/
    │   └── xiaohongshu-skill/
    ├── docs/images/
    ├── VERSION
    ├── CHANGELOG.md
    ├── scripts/check-components.mjs
    ├── scripts/release-contract.mjs
    ├── scripts/release-contract.test.mjs
    ├── scripts/check-repository.mjs
    └── catalog.json

## 验证

在仓库根目录运行：

    node scripts/check-repository.mjs

发布 commit 完成后、创建 tag 之前，在干净工作树运行发布就绪门禁：

    node scripts/check-repository.mjs --release

该模式额外核对 `VERSION` 的精确 `V<major>.<minor>` 格式、对应 CHANGELOG 五个非空版本段、`main` 分支、`origin` 身份、已有大写 `V*` 本地版本 tag 和工作树状态；历史小写 `v*` tag 不进入合集版本比较。远端分叉、远端 tag、GitHub Release 与远端 tag 克隆仍按发布规则单独核验。

统一组件验证入口：

    node scripts/check-components.mjs
    node scripts/release-contract.test.mjs

所有组件都使用 `catalog.json` 的同一套 `required` 与 `validation` 字段。`check-components.mjs` 数据驱动地执行已声明的组件验证；没有独立命令的组件仍由仓库根门禁覆盖，不在根 README 维护组件特例。

发布前还要确认每个 Skill 目录保持自包含；版本更新只在 Kim Service 统一仓完成提交、推送、发布记录和新版本 Release，不能只改某个导入来源后就视为已经发布。

根检查器会阻止：

- 嵌套 .git、未声明 gitlink 和残留迁移目录；
- 组件缺失、额外未声明组件和不允许的运行时投影；
- 组件完整内容与 `catalog.json` 的 `contentSha256` 漂移；
- 被 Git 忽略的公开文件与 tracked/ignored 冲突；
- .env、私钥文件、常见真实 Token 和本机专属绝对路径；
- 联系码、微信收款码、支付宝收款码缺失或哈希漂移。

## 联系与支持

### 联系码

<p align="center">
  <img src="docs/images/contact-qr.png" alt="联系码" width="720">
</p>

### 收款码

<table align="center">
  <tr>
    <th align="center">微信收款码</th>
    <th align="center">支付宝收款码</th>
  </tr>
  <tr>
    <td align="center"><img src="docs/images/wechat-pay.jpg" alt="微信收款码" width="260"></td>
    <td align="center"><img src="docs/images/alipay.jpg" alt="支付宝收款码" width="260"></td>
  </tr>
</table>

## 开源边界

仓库只收录 catalog 声明的公开组件快照，不包含制作仓内部研究、测试会话、运行记录、本机状态、客户材料或私密配置。组件来源和导入修订号以 catalog 为准。

## License

仓库级内容采用 MIT License。每个 Skill 包内的 LICENSE、NOTICE 或双许可证声明继续独立生效；Kim Service 的统一版本与 Release 不会覆盖这些组件级许可条款。
