import { detectWsl, runPowerShell } from "./lib/wsl-host.js";
import {
  buildNotifyScript,
  buildToastScript,
  encodeTitleBody,
  formatNotifyResult,
  normalizeMode,
} from "./lib/notify.js";

export const name = "dsh-wsl-notify";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const maxLen = positive(config.maxLen, 500);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_notify",
    order: 123,
    text: "Use win_notify to show a short Windows notification when a long WSL task finishes. mode=messagebox (default, blocking) or mode=toast (BalloonTip, non-blocking; falls back to MessageBox). Keep title/body brief; no secrets.",
  });

  ctx.tools.register({
    name: "win_notify",
    description: "Show a Windows notification from WSL: MessageBox (default, blocking) or toast BalloonTip (non-blocking).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string", description: "Window / balloon title (default DSH)." },
        body: { type: "string", description: "Message body." },
        mode: {
          type: "string",
          enum: ["toast", "messagebox"],
          description: "toast = NotifyIcon BalloonTip (non-blocking); messagebox = blocking MessageBox (default).",
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean" },
          title: { type: "string" },
          mode: { type: "string" },
          error: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatNotifyResult(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const title = String(args?.title ?? "DSH").slice(0, maxLen);
      const body = String(args?.body ?? "Task finished.").slice(0, maxLen);
      const mode = normalizeMode(args?.mode);
      const { titleB64, bodyB64 } = encodeTitleBody(title, body);
      try {
        if (mode === "toast") {
          try {
            await runPowerShell(buildToastScript(titleB64, bodyB64), { timeoutMs });
            return { ok: true, title, mode: "toast" };
          } catch {
            await runPowerShell(buildNotifyScript(titleB64, bodyB64), { timeoutMs });
            return { ok: true, title, mode: "messagebox" };
          }
        }
        await runPowerShell(buildNotifyScript(titleB64, bodyB64), { timeoutMs });
        return { ok: true, title, mode: "messagebox" };
      } catch (err) {
        return { ok: false, title, mode, error: err instanceof Error ? err.message : String(err) };
      }
    },
    presentCall: () => ({ card: "generic", title: "Windows notify" }),
    presentResult: (_args, result) => (
      result.isError
        ? { card: "generic", title: "Windows notify failed", content: result.content }
        : { card: "generic", title: "Windows notify", content: result.content }
    ),
  });
}

function positive(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
