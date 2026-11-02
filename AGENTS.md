<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- Item thumbnails are an opt-in presentation in the shared ID table; resolve IDs through `itemImageUrl`, lazy-load official catalog CDN images, and show an unavailable state on failure without altering list or download data.

- Every ID list section renders through `src/components/IdTable.tsx` and uses `useLiveList` to read validated public GitHub JSON after hydration, with a bundled JSON snapshot for prerendering and failures, so counts, search, copy, filters and JSON downloads use identical data; add sections as a route, source mapping and fallback JSON rather than another table implementation.
- `vite.config.ts` keeps `tanstackStart.pages` + `prerender.enabled` and `nitro: { preset: "vercel" }` so an external build writes every page to disk and emits `.vercel/output`; when a new route is added it must be listed in `pages` too, and the preset stays because the Lovable sandbox build ignores it while Vercel needs it.
