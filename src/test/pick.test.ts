import { describe, expect, it } from "vitest";
import { buildMessage, buildReturnUrl, parsePickRequest } from "@/lib/pick";

const ALLOWED = "https://panel.example.com";
const base = (o: Record<string, string> = {}) =>
  "?" +
  new URLSearchParams({
    pick: "emote",
    return: "https://panel.example.com/bots",
    state: "abcdef123456",
    ...o,
  });

describe("parsePickRequest", () => {
  it("accepts a valid request from an allowed origin", () => {
    const r = parsePickRequest(base({ mode: "popup" }), "emote", ALLOWED);
    expect(r).toMatchObject({
      kind: "emote",
      origin: ALLOWED,
      state: "abcdef123456",
      mode: "popup",
    });
  });
  it("defaults to redirect mode", () => {
    expect(parsePickRequest(base(), "emote", ALLOWED)?.mode).toBe("redirect");
  });
  it("ignores origins that are not allowed (no open redirect)", () => {
    expect(
      parsePickRequest(base({ return: "https://evil.example.org/x" }), "emote", ALLOWED),
    ).toBeNull();
    expect(
      parsePickRequest(base({ return: "https://panel.example.com.evil.org/x" }), "emote", ALLOWED),
    ).toBeNull();
  });
  it("rejects when no origins are configured", () => {
    expect(parsePickRequest(base(), "emote", "")).toBeNull();
  });
  it("rejects wrong kind, bad state, non-https and junk urls", () => {
    expect(parsePickRequest(base(), "item", ALLOWED)).toBeNull();
    expect(parsePickRequest(base({ state: "short" }), "emote", ALLOWED)).toBeNull();
    expect(parsePickRequest(base({ state: "bad state!!" }), "emote", ALLOWED)).toBeNull();
    expect(
      parsePickRequest(base({ return: "http://panel.example.com/x" }), "emote", ALLOWED),
    ).toBeNull();
    expect(parsePickRequest(base({ return: "javascript:alert(1)" }), "emote", ALLOWED)).toBeNull();
    expect(parsePickRequest(base({ return: "not a url" }), "emote", ALLOWED)).toBeNull();
    expect(parsePickRequest("", "emote", ALLOWED)).toBeNull();
  });
  it("allows http only for localhost", () => {
    const r = parsePickRequest(
      base({ return: "http://localhost:5000/bots" }),
      "emote",
      "http://localhost:5000",
    );
    expect(r?.origin).toBe("http://localhost:5000");
  });
});

describe("pick responses", () => {
  const req = parsePickRequest(base(), "emote", ALLOWED)!;
  const item = { id: "dance-tiktok8", name: "Tiktok 8", duration: 11.5 };
  it("builds a return url keeping existing params and adding the pick", () => {
    const u = new URL(
      buildReturnUrl({ ...req, returnUrl: "https://panel.example.com/bots?bot=7" }, item),
    );
    expect(u.origin + u.pathname).toBe("https://panel.example.com/bots");
    expect(u.searchParams.get("bot")).toBe("7");
    expect(u.searchParams.get("picked_id")).toBe("dance-tiktok8");
    expect(u.searchParams.get("picked_duration")).toBe("11.5");
    expect(u.searchParams.get("picked_kind")).toBe("emote");
    expect(u.searchParams.get("state")).toBe("abcdef123456");
  });
  it("builds a postMessage payload", () => {
    expect(buildMessage(req, item)).toEqual({
      type: "highrise-ids:pick",
      kind: "emote",
      id: "dance-tiktok8",
      name: "Tiktok 8",
      duration: 11.5,
      state: "abcdef123456",
    });
    expect(buildMessage(req, { id: "x", name: "y" })).not.toHaveProperty("duration");
  });
});

describe("default allowed origins", () => {
  it("accepts the Botsys panel without any env variable", () => {
    const search =
      "?" +
      new URLSearchParams({
        pick: "emote",
        return: "https://vector000.pythonanywhere.com/bots",
        state: "abcdef123456",
      });
    expect(parsePickRequest(search, "emote")?.origin).toBe("https://vector000.pythonanywhere.com");
    expect(parsePickRequest(search.replace("vector000", "other000"), "emote")).toBeNull();
  });
});
