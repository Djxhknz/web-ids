# Highrise IDs

Up-to-date ID lists for Highrise bots built with [highrise-bot-sdk](https://pypi.org/project/highrise-bot-sdk/): **emotes** (name, ID, duration) and **items** (name, ID, rarity, category).

The site lets you search, copy any ID with one click, and download the whole list.
Both lists download as a single JSON file.

## Lists

| List  | Data file              |
| ----- | ---------------------- |
| Emotes | `src/lib/emotes.json`  |
| Items  | `src/lib/items.json`   |

To update a list, replace the matching JSON file with an array of objects:

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
