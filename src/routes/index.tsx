import { createFileRoute, Link } from "@tanstack/react-router";
import EMOTES from "@/lib/emotes.json";
import ITEMS from "@/lib/items.json";
import { SiteFooter } from "@/components/SiteFooter";
import { useLiveList } from "@/hooks/use-live-list";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Highrise IDs — Emote & Item ID Lists" },
      {
        name: "description",
        content:
          "Up-to-date emote and item ID lists for Highrise bots built with highrise-bot-sdk — search, one-click copy, and JSON downloads.",
      },
      { property: "og:title", content: "Highrise IDs" },
      {
        property: "og:description",
        content:
          "Up-to-date emote and item ID lists for Highrise bots built with highrise-bot-sdk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const emotes = useLiveList("emotes", EMOTES);
  const items = useLiveList("items", ITEMS);
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-12">
      <p className="text-sm font-medium tracking-wide text-muted-foreground">
        BANKI VENILAND
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        ID Lists for Highrise Bots
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Pick a section. Each one has search, one-click copy for every ID, and
        download buttons for the full list.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          to="/emotes"
          className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary hover:bg-accent"
        >
          <span className="text-3xl">💃</span>
          <h2 className="mt-4 text-xl font-semibold">Emotes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {emotes.data.length} emotes — name, ID and duration.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-primary">
            Open emote list →
          </span>
        </Link>

        <Link
          to="/items"
          className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary hover:bg-accent"
        >
          <span className="text-3xl">🛍️</span>
          <h2 className="mt-4 text-xl font-semibold">Items</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {items.data.length === 0
              ? "Coming soon — the list is empty for now."
              : `${items.data.length} items — name, ID, rarity and category.`}
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-primary">
            Open item list →
          </span>
        </Link>
      </div>
      {(emotes.isError || items.isError) && <p role="status" className="mt-4 text-sm text-muted-foreground">Latest lists unavailable. Showing the last available copies.</p>}

      <SiteFooter />
    </main>
  );
}
