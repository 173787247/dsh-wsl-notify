import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildNotifyScript, encodeTitleBody, formatNotifyResult } from "../lib/notify.js";

describe("win_notify", () => {
  it("encodes utf8", () => {
    const { titleB64, bodyB64 } = encodeTitleBody("完成", "ok");
    assert.equal(Buffer.from(titleB64, "base64").toString("utf8"), "完成");
    assert.match(buildNotifyScript(titleB64, bodyB64), /MessageBox/);
  });

  it("formats", () => {
    assert.match(formatNotifyResult({ ok: true, title: "T" }), /notified: T/);
  });
});
