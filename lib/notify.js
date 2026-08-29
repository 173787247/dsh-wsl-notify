export function encodeTitleBody(title, body) {
  return {
    titleB64: Buffer.from(String(title ?? "DSH"), "utf8").toString("base64"),
    bodyB64: Buffer.from(String(body ?? ""), "utf8").toString("base64"),
  };
}

export function buildNotifyScript(titleB64, bodyB64) {
  const t = String(titleB64).replace(/'/g, "''");
  const b = String(bodyB64).replace(/'/g, "''");
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    `$title = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${t}'))`,
    `$body = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${b}'))`,
    "[Windows.Forms.MessageBox]::Show($body, $title, 'OK', 'Information') | Out-Null",
    "'ok'",
  ].join("; ");
}

/** Prefer toast via BurntToast if present; MessageBox is the reliable fallback we ship. */
export function formatNotifyResult(value) {
  if (!value.ok) return `win_notify failed: ${value.error}`;
  return `notified: ${value.title}`;
}
