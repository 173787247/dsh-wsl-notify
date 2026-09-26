import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildNotifyScript,
  buildToastScript,
  encodeTitleBody,
  formatNotifyResult,
  normalizeMode,
} from "../lib/notify.js";

describe("win_notify", () => {
  it("encodes utf8", () => {
    const { titleB64, bodyB64 } = encodeTitleBody("完成", "ok");
    assert.equal(Buffer.from(titleB64, "base64").toString("utf8"), "完成");
    assert.match(buildNotifyScript(titleB64, bodyB64), /MessageBox/);
  });

  it("builds toast BalloonTip script", () => {
    const { titleB64, bodyB64 } = encodeTitleBody("T", "B");
    assert.match(buildToastScript(titleB64, bodyB64), /ShowBalloonTip/);
    assert.match(buildToastScript(titleB64, bodyB64), /NotifyIcon/);
  });

  it("normalizes mode", () => {
    assert.equal(normalizeMode("toast"), "toast");
    assert.equal(normalizeMode("messagebox"), "messagebox");
    assert.equal(normalizeMode(undefined), "messagebox");
  });

  it("formats", () => {
    assert.match(formatNotifyResult({ ok: true, title: "T", mode: "toast" }), /notified: T mode=toast/);
  });
});
