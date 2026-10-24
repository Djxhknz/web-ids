# Highrise IDs

Up-to-date ID lists for Highrise bots built with [highrise-bot-sdk](https://pypi.org/project/highrise-bot-sdk/): **emotes** (name, ID, duration) and **items** (name, ID, rarity, category).

The site lets you search, copy any ID with one click, and download the whole list.
Both lists download as a single JSON file.

## Lists

| List  | Data file              |
| ----- | ---------------------- |
| Emotes | `Ids-highrise/emotes.json` |
| Items  | `Ids-highrise/untradable_items_new.json` |

To update a list, edit its JSON file on the `main` branch of
[Ids-highrise](https://github.com/djxhknz/Ids-highrise). Visitors read the latest
public files directly from GitHub when they open or refresh the site, with no
Vercel redeploy needed for data changes. An already open page refreshes when
the visitor returns to its browser tab; there is no background polling.

The bundled `src/lib/emotes.json` and `src/lib/items.json` are fallback snapshots
for prerendering and GitHub/network failures. On failure, the site keeps the last
available list and displays a notice. Search, filters, copying, and JSON downloads
all use the list currently displayed. The data repository must remain public.

Use an array of objects:

```json
[
  { "name": "Emote Name", "id": "emote-id", "duration": 5 },
  { "name": "Item Name", "id": "item-id", "rarity": "common", "category": "hat" }
]
```

`duration` is optional (emotes only). `rarity` and `category` are optional (items only) —
when they are present the page shows them as columns and adds filter dropdowns for them.

## Development

```sh
npm i
npm run dev
```

## Deploy on Vercel

Import this repository into Vercel and keep the default build command
(`npm run build`). The build writes `.vercel/output`, which Vercel deploys
automatically — no extra settings are needed.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
