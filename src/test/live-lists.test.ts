import { afterEach, describe, expect, it, vi } from "vitest";
import EMOTES from "@/lib/emotes.json";
import ITEMS from "@/lib/items.json";
import { fetchLiveList } from "@/lib/live-lists";

afterEach(() => vi.unstubAllGlobals());

describe("Live GitHub lists", () => {
  it.each([
    ["emotes", "emotes.json", EMOTES],
    ["items", "untradable_items_new.json", ITEMS],
  ] as const)("reads %s directly from Ids-highrise main without a redeploy", async (kind, filename, data) => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => data });
    vi.stubGlobal("fetch", mockFetch);
    expect(await fetchLiveList(kind)).toEqual(data);
    const call = mockFetch.mock.calls[0];
    if (!call) throw new Error("Expected a GitHub request");
    const [url, options] = call;
    expect(url.pathname).toBe(`/djxhknz/Ids-highrise/main/${filename}`);
    expect(url.hostname).toBe("raw.githubusercontent.com");
    expect(options.cache).toBe("no-store");
    expect(url.searchParams.has("updated")).toBe(true);
  });

  it("reads changed repository contents on the next request", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => EMOTES })
      .mockResolvedValueOnce({ ok: true, json: async () => EMOTES.slice(1) }));
    expect(await fetchLiveList("emotes")).toEqual(EMOTES);
    expect(await fetchLiveList("emotes")).toEqual(EMOTES.slice(1));
  });

  it("rejects malformed rows rather than displaying false data", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [{ name: "missing ID" }] }));
    await expect(fetchLiveList("items")).rejects.toThrow();
  });

  it("reports failed GitHub responses for fallback handling", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(fetchLiveList("emotes")).rejects.toThrow("404");
  });
});