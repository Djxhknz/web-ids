import { createFileRoute, Link } from "@tanstack/react-router";
import EMOTES from "@/lib/emotes.json";
import { IdTable } from "@/components/IdTable";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/emotes")({
  head: () => ({
    meta: [
      { title: "Emotes — Highrise Emote IDs" },
      {
        name: "description",
        content:
          "Up-to-date Highrise emote ID list for highrise-bot-sdk bots, with name and duration, as a single JSON download.",
      },
      { property: "og:title", content: "Emotes — Highrise Emote IDs" },
      {
        property: "og:description",
        content: "Up-to-date Highrise emote ID list for highrise-bot-sdk bots.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Emotes,
});

function Emotes() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/" className="text-sm text-muted-foreground hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Highrise Emote IDs</h1>
      <p className="mt-2 text-muted-foreground">
        Click any ID to copy it — total: {EMOTES.length}
      </p>

      <IdTable
        items={EMOTES}
        jsonName="emotes.json"
        pyName="emote_map.py"
        txtName="emotes.txt"
        pyVarName="EMOTE_MAP"
        downloads={["json"]}
      />
      <SiteFooter />
    </main>
  );
}
