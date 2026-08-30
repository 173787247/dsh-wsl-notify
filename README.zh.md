# dsh-wsl-notify

DeepSeek Harness 工具：**`win_notify`** — 长 WSL 任务结束时弹出简短的 **Windows MessageBox**。

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**。

[English → README.md](./README.md)

---

## 为什么需要

长任务在后台跑完时，Windows 弹窗比盯浏览器标签更醒目。

**注意：** 当前实现是 **MessageBox（需点确定后才返回）**。标题和正文保持简短，勿含密钥。非阻塞 toast 以后可以换实现；本版本优先可靠、不额外依赖 Windows 模块。嫌打扰可不装或少用。

## 工具

| 参数 | 默认 | 含义 |
|------|------|------|
| `title` | `DSH` | 窗口标题（受 `maxLen` 限制） |
| `body` | `Task finished.` | 正文 |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-notify
```

## 配置

```yaml
- id: dsh-wsl-notify
  name: dsh-wsl-notify
  config:
    timeoutMs: 30000
    maxLen: 500
```

## 测试

```sh
npm test
```

## 许可

MIT
