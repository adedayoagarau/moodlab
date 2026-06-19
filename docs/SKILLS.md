# Agent skills for MoodLab

Cursor agent skills are installed **globally** on this machine (`~/.agents/skills`, symlinked to `~/.cursor/skills`). They are **not** committed to this repository (see `.gitignore`).

## Superpowers (workflow)

Install the full pack (14 skills):

```bash
npx skills add obra/superpowers -g -y --agent cursor
```

Or a single skill:

```bash
npx skills add obra/superpowers --skill using-superpowers -g -y --agent cursor
```

| Skill | Purpose |
|-------|---------|
| `using-superpowers` | Invoke relevant skills before acting; skill priority rules |
| `brainstorming` | Explore intent and design before implementation |
| `writing-plans` | Multi-step implementation plans |
| `executing-plans` | Execute plans in batches with checkpoints |
| `subagent-driven-development` | Dispatch subagents for plan steps |
| `dispatching-parallel-agents` | Parallel subagent workflows |
| `test-driven-development` | RED-GREEN-REFACTOR discipline |
| `systematic-debugging` | Structured root-cause debugging |
| `verification-before-completion` | Verify before claiming done |
| `requesting-code-review` | Pre-review checklist before asking for review |
| `receiving-code-review` | How to handle review feedback |
| `using-git-worktrees` | Isolated branches/worktrees for features |
| `finishing-a-development-branch` | Merge/PR/cleanup when feature is done |
| `writing-skills` | Author new agent skills |

Source: [obra/superpowers](https://github.com/obra/superpowers)

## Restore mobile-focused skills

From repo root, install curated packages:

```bash
# Core mobile + Expo + Flutter
npx skills add spencerpauly/awesome-cursor-skills -g -y --agent cursor
npx skills add chunkytofustudios/flutter-skills -g -y --agent cursor
npx skills add expo/skills -g -y --agent cursor
npx skills add flutter/skills -g -y --agent cursor
npx skills add callstackincubator/agent-skills -g -y --agent cursor
npx skills add new-silvermoon/awesome-android-agent-skills -g -y --agent cursor
npx skills add buivietphi/skill-mobile-mt -g -y --agent cursor

# iOS / Swift
npx skills add avdlee/swiftui-agent-skill -g -y --agent cursor
npx skills add twostraws/swiftui-agent-skill -g -y --agent cursor

# Design & testing (MCP Market sources)
npx skills add caphtech/claude-marketplace --skill mobile-app-designer -g -y --agent cursor
npx skills add iskenkenya/1panel-client --skill mobile-app-testing -g -y --agent cursor
```

List installed skills:

```bash
npx skills list -g
```

## Project rules (committed)

- `.cursor/rules/moodlab-fullstack.mdc` — monorepo conventions
- `.cursor/rules/mobile-development.mdc` — React Native, Flutter, Expo patterns
