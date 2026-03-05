#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// ── Config groups ──

const GROUPS = [
  {
    name: '主题',
    desc: 'Yozakura (dark) + Sakura (light) 自动切换',
    lines: ['theme = dark:Yozakura,light:Sakura'],
    requiresThemes: true,
  },
  {
    name: '毛玻璃',
    desc: '背景透明 + 模糊效果',
    lines: ['background-opacity = 0.88', 'background-blur-radius = 20'],
  },
  {
    name: '排版',
    desc: '字号 15, 加粗, 行高 +20%',
    lines: ['font-size = 15', 'font-thicken = true', 'adjust-cell-height = 20%'],
  },
  {
    name: 'CJK字体',
    desc: '中文用苹方 (PingFang SC)',
    lines: [
      'font-codepoint-map = U+4E00-U+9FFF=PingFang SC',
      'font-codepoint-map = U+3400-U+4DBF=PingFang SC',
      'font-codepoint-map = U+3000-U+303F=PingFang SC',
      'font-codepoint-map = U+FF00-U+FFEF=PingFang SC',
    ],
  },
  {
    name: '窗口',
    desc: 'tabs 标题栏, 内边距 16',
    lines: [
      'window-padding-x = 16',
      'window-padding-y = 16',
      'window-decoration = true',
      'macos-titlebar-style = tabs',
    ],
  },
  {
    name: '光标',
    desc: '竖条样式, 不闪烁',
    lines: ['cursor-style = bar', 'cursor-style-blink = false', 'minimum-contrast = 1.0'],
  },
];

const MARKER_START = '# --- yozakura (managed) ---';
const MARKER_END = '# --- end yozakura ---';

// ── Paths ──

const ghosttyDir = path.join(os.homedir(), '.config', 'ghostty');
const themesDir = path.join(ghosttyDir, 'themes');
const configPath = path.join(ghosttyDir, 'config');
const pkgRoot = path.resolve(__dirname, '..');

// ── Helpers ──

function parseKey(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  const eq = trimmed.indexOf('=');
  if (eq === -1) return null;
  return trimmed.slice(0, eq).trim();
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ── Main ──

async function main() {
  const allFlag = process.argv.includes('--all');

  console.log('\n✨ Yozakura Theme Installer\n');
  console.log('可选配置组：');
  GROUPS.forEach((g, i) => {
    console.log(`  [${i + 1}] ${g.name.padEnd(8)} ${g.desc}`);
  });
  console.log();

  // Determine which groups to install
  let skipSet = new Set();

  if (!allFlag) {
    const answer = await ask('全部安装请直接回车，或输入要跳过的编号（如 2,6）：');
    if (answer) {
      for (const s of answer.split(',')) {
        const n = parseInt(s.trim(), 10);
        if (n >= 1 && n <= GROUPS.length) skipSet.add(n - 1);
      }
    }
  }

  const selected = GROUPS.filter((_, i) => !skipSet.has(i));
  const skipped = GROUPS.filter((_, i) => skipSet.has(i));

  if (selected.length === 0) {
    console.log('未选择任何配置组，退出。');
    return;
  }

  // Ensure directories exist
  fs.mkdirSync(themesDir, { recursive: true });

  // Backup existing config
  if (fs.existsSync(configPath)) {
    const ts = Math.floor(Date.now() / 1000);
    const backupPath = `${configPath}.backup.${ts}`;
    fs.copyFileSync(configPath, backupPath);
    console.log(`✔ 备份已有配置 → config.backup.${ts}`);
  }

  // Install theme files if "主题" group is selected
  const needsThemes = selected.some((g) => g.requiresThemes);
  if (needsThemes) {
    for (const name of ['Yozakura', 'Sakura']) {
      const src = path.join(pkgRoot, 'themes', name);
      const dst = path.join(themesDir, name);
      fs.copyFileSync(src, dst);
    }
    console.log('✔ 安装主题: Yozakura + Sakura');
  }

  // Build selected keys and lines
  const selectedKeys = new Set();
  const newLines = [];

  for (const g of selected) {
    for (const line of g.lines) {
      const key = parseKey(line);
      if (key) selectedKeys.add(key);
      newLines.push(line);
    }
  }

  // Read existing config
  let existingLines = [];
  if (fs.existsSync(configPath)) {
    existingLines = fs.readFileSync(configPath, 'utf-8').split('\n');
  }

  // Remove old managed block and scattered selected keys
  const cleaned = [];
  let inManagedBlock = false;

  for (const line of existingLines) {
    if (line.trim() === MARKER_START) {
      inManagedBlock = true;
      continue;
    }
    if (line.trim() === MARKER_END) {
      inManagedBlock = false;
      continue;
    }
    if (inManagedBlock) continue;

    const key = parseKey(line);
    if (key && selectedKeys.has(key)) continue;

    cleaned.push(line);
  }

  // Remove trailing blank lines
  while (cleaned.length > 0 && cleaned[cleaned.length - 1].trim() === '') {
    cleaned.pop();
  }

  // Append managed block
  cleaned.push('');
  cleaned.push(MARKER_START);
  for (const line of newLines) {
    cleaned.push(line);
  }
  cleaned.push(MARKER_END);
  cleaned.push('');

  fs.writeFileSync(configPath, cleaned.join('\n'), 'utf-8');

  // Summary
  const totalLines = newLines.length;
  const skipNames = skipped.map((g) => g.name).join(', ');
  const skipMsg = skipNames ? `（跳过: ${skipNames}）` : '';
  console.log(`✔ 合并 ${selected.length} 组共 ${totalLines} 项视觉配置${skipMsg}`);
  console.log('\n✅ Done! 重启 Ghostty 即可生效\n');
}

main().catch((err) => {
  console.error('安装失败:', err.message);
  process.exit(1);
});
