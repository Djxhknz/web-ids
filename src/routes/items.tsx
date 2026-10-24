import { createFileRoute, Link } from "@tanstack/react-router";
import ITEMS from "@/lib/items.json";
import { IdTable } from "@/components/IdTable";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/items")({
  head: () => ({
    meta: [
      { title: "Items — Highrise Item IDs" },
      {
        name: "description",
        content:
          "Highrise item ID list for highrise-bot-sdk bots, with name, ID, rarity and category, plus a JSON download.",
      },
      { property: "og:title", content: "Items — Highrise Item IDs" },
      {
        property: "og:description",
        content:
          "Highrise item ID list for highrise-bot-sdk bots, with rarity and category filters.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Items,
});

function Items() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/" className="text-sm text-muted-foreground hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Highrise Item IDs</h1>
      <p className="mt-2 text-muted-foreground">
        Click any ID to copy it — total: {ITEMS.length}
      </p>

      <IdTable
        items={ITEMS}
        jsonName="items.json"
        pyName="item_map.py"
        txtName="items.txt"
        pyVarName="ITEM_MAP"
        downloads={["json"]}
      />
      <SiteFooter />
    </main>
  );
}
