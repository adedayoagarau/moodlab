# Agent skills for MoodLab

Cursor agent skills are installed **globally** on this machine (`~/.agents/skills`, symlinked to `~/.cursor/skills`). They are **not** committed to this repository (see `.gitignore`).

## Superpowers (workflow)

```bash
npx skills add obra/superpowers --skill using-superpowers -g -y --agent cursor
```

| Skill | Purpose |
|-------|---------|
| `using-superpowers` | Invoke relevant skills before acting; process vs implementation skill priority |

Source: [obra/superpowers](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md)

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
