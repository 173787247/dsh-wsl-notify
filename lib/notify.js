export function encodeTitleBody(title, body) {
  return {
    titleB64: Buffer.from(String(title ?? "DSH"), "utf8").toString("base64"),
    bodyB64: Buffer.from(String(body ?? ""), "utf8").toString("base64"),
  };
}

function decodeVars(titleB64, bodyB64) {
  const t = String(titleB64).replace(/'/g, "''");
  const b = String(bodyB64).replace(/'/g, "''");
  return [
    `$title = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${t}'))`,
    `$body = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${b}'))`,
  ];
}

/** Blocking MessageBox (reliable fallback). */
export function buildNotifyScript(titleB64, bodyB64) {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    ...decodeVars(titleB64, bodyB64),
    "[Windows.Forms.MessageBox]::Show($body, $title, 'OK', 'Information') | Out-Null",
    "'ok'",
  ].join("; ");
}

/**
 * Non-blocking tray BalloonTip via NotifyIcon.
 * Keeps the icon alive briefly so the balloon can show, then disposes.
 * On failure the caller should fall back to MessageBox.
 */
export function buildToastScript(titleB64, bodyB64) {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    "Add-Type -AssemblyName System.Drawing",
    ...decodeVars(titleB64, bodyB64),
    "$ni = New-Object System.Windows.Forms.NotifyIcon",
    "$ni.Icon = [System.Drawing.SystemIcons]::Information",
    "$ni.Visible = $true",
    "$ni.BalloonTipTitle = $title",
    "$ni.BalloonTipText = $(if ([string]::IsNullOrEmpty($body)) { ' ' } else { $body })",
    "$ni.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info",
    "$ni.ShowBalloonTip(4000)",
    "Start-Sleep -Milliseconds 4500",
    "$ni.Visible = $false",
    "$ni.Dispose()",
    "'ok'",
  ].join("; ");
}

/** Prefer toast via BurntToast if present; MessageBox is the reliable fallback we ship. */
export function formatNotifyResult(value) {
  if (!value.ok) return `win_notify failed: ${value.error}`;
  const mode = value.mode ? ` mode=${value.mode}` : "";
  return `notified: ${value.title}${mode}`;
}

export function normalizeMode(mode) {
  const m = String(mode ?? "messagebox").trim().toLowerCase();
  return m === "toast" ? "toast" : "messagebox";
}
