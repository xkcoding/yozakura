# Yozakura

Ghostty 视觉配置 + Claude Code Statusline 一键安装工具。

## 安装

```bash
npx yozakura
```

交互选择要安装的配置组，直接回车全部安装。

跳过交互，全部安装：

```bash
npx yozakura --all
```

## 配置组

| # | 分组 | 说明 |
|---|------|------|
| 1 | 主题 | Yozakura (dark) + Sakura (light) 自动切换 |
| 2 | 窗口 | 毛玻璃 + 内边距 + tabs 标题栏 |
| 3 | 排版 | 字号、加粗、行高、CJK 字体、光标 |
| 4 | Claude Code | Tab 重命名快捷键 + Statusline |

## Statusline

选择第 4 组后可自选 statusline 显示字段，双行输出：

```
Opus 4.6 │ ████░░░░░░ 38% (76k/200k) │ cache:82% │ ⎇ main*
⏱ 10m │ $0.57 │ ~/code/my-project
```

| # | 字段 | 说明 |
|---|------|------|
| 1 | Model | 自动美化模型名 (claude-opus-4-6-xxx → Opus 4.6) |
| 2 | 进度条 | 10 格进度条 + 百分比 + token 数，绿(<40%)/黄(40-60%)/红(>60%) |
| 3 | 缓存命中率 | cache_read / total，反映上下文复用效率 |
| 4 | Git 分支 | 分支名 + `*` 脏标记 |
| 5 | 会话时长 | 从 JSON 获取，fallback 为本地时间戳追踪 |
| 6 | 累计费用 | 会话累计费用 (USD) |
| 7 | 工作目录 | 当前路径，$HOME 自动缩写为 ~ |

## 工作原理

- 自动备份已有 `~/.config/ghostty/config`
- 智能合并：只修改选中的配置项，保留你的快捷键、shell 等个人设置
- 管理区块标记 `# --- yozakura (managed) ---`，重复运行安全更新
- 零依赖，仅用 Node.js 内置模块

## 前提

- macOS + [Ghostty](https://ghostty.org/) 已安装
- Node.js >= 16
- `jq`（Claude Code statusline 需要）：`brew install jq`
