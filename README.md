# Yozakura

Ghostty 视觉配置一键安装工具，包含 Yozakura (dark) + Sakura (light) 主题及排版、毛玻璃、CJK 字体等视觉配置。

## 安装

```bash
npx github:imdafne/yozakura
```

交互选择要安装的配置组，直接回车全部安装。

跳过交互，全部安装：

```bash
npx github:imdafne/yozakura --all
```

## 配置组

| # | 分组 | 说明 |
|---|------|------|
| 1 | 主题 | Yozakura (dark) + Sakura (light) 自动切换 |
| 2 | 毛玻璃 | 背景透明 + 模糊效果 |
| 3 | 排版 | 字号 15, 加粗, 行高 +20% |
| 4 | CJK 字体 | 中文用苹方 (PingFang SC) |
| 5 | 窗口 | tabs 标题栏, 内边距 16 |
| 6 | 光标 | 竖条样式, 不闪烁 |

## 工作原理

- 自动备份已有 `~/.config/ghostty/config`
- 智能合并：只修改选中的配置项，保留你的快捷键、shell 等个人设置
- 管理区块标记 `# --- yozakura (managed) ---`，重复运行安全更新
- 零依赖，仅用 Node.js 内置模块

## 前提

- macOS + [Ghostty](https://ghostty.org/) 已安装
- Node.js >= 16
