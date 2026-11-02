/** The avatar thumbnail source used by the official Highrise catalog. */
export function itemImageUrl(id: string) {
  return `https://cdn.highrisegame.com/avatar/${encodeURIComponent(id)}.png`;
}