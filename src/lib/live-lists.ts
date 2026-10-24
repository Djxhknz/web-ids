import { z } from "zod";
import type { IdItem } from "@/components/IdTable";

export type ListKind = "emotes" | "items";

const files: Record<ListKind, string> = {
  emotes: "emotes.json",
  items: "untradable_items_new.json",
};

const listSchema = z.array(
  z.object({
    name: z.string().min(1).max(1000),
    id: z.string().min(1).max(1000),
    duration: z.number().finite().nonnegative().optional(),
    rarity: z.string().max(100).optional(),
    category: z.string().max(100).optional(),
  }).passthrough(),
).max(100000);

export async function fetchLiveList(kind: ListKind): Promise<IdItem[]> {
  const url = new URL(`https://raw.githubusercontent.com/djxhknz/Ids-highrise/main/${files[kind]}`);
  // Unique URLs bypass GitHub's CDN cache when a visitor reopens the site.
  url.searchParams.set("updated", String(Date.now()));
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GitHub list request failed (${response.status})`);
  const rows = listSchema.parse(await response.json());
  return rows.map(({ duration, rarity, category, ...row }) => ({
    ...row,
    ...(duration === undefined ? {} : { duration }),
    ...(rarity === undefined ? {} : { rarity }),
    ...(category === undefined ? {} : { category }),
  }));
}