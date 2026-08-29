# dsh-wsl-notify

DeepSeek Harness tool: **`win_notify`** — show a short **Windows MessageBox** when a long WSL task finishes.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 ↓](#中文)

---

## English

### Why

You leave a long agent run in the background; when it finishes, a Windows popup is easier to notice than a tab title.

**Note:** MessageBox is **blocking** until dismissed. Keep title/body short; no secrets. For non-blocking toasts you can later swap the implementation; this release prioritizes reliability without extra Windows modules.

### Tool

| Arg | Default | Meaning |
|-----|---------|---------|
| `title` | `DSH` | Window title (`maxLen`) |
| `body` | `Task finished.` | Message body |

### Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-notify
```

### Config

```yaml
- id: dsh-wsl-notify
  name: dsh-wsl-notify
  config:
    timeoutMs: 30000
    maxLen: 500
```

### Test

```sh
npm test
```

### License

MIT

---

## 中文

### 为什么需要

长任务在 WSL 跑完时，弹出 Windows 提示框比盯浏览器标签更醒目。

注意：当前实现是 **MessageBox（需点确定）**，文案保持简短且勿含密钥。嫌打扰可不装或少用。

### 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-notify
```

### 许可

MIT
