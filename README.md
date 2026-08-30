# dsh-wsl-notify

DeepSeek Harness tool: **`win_notify`** — show a short **Windows MessageBox** when a long WSL task finishes.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

---

## Why

You leave a long agent run in the background; when it finishes, a Windows popup is easier to notice than a tab title.

**Note:** MessageBox is **blocking** until dismissed. Keep title/body short; no secrets. For non-blocking toasts you can later swap the implementation; this release prioritizes reliability without extra Windows modules.

## Tool

| Arg | Default | Meaning |
|-----|---------|---------|
| `title` | `DSH` | Window title (`maxLen`) |
| `body` | `Task finished.` | Message body |

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-notify
```

## Config

```yaml
- id: dsh-wsl-notify
  name: dsh-wsl-notify
  config:
    timeoutMs: 30000
    maxLen: 500
```

## Test

```sh
npm test
```

## License

MIT
