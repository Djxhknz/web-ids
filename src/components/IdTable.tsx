import { useMemo, useState } from "react";

export type IdItem = {
  name: string;
  id: string;
  duration?: number;
  rarity?: string;
  category?: string;
};

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function toPython(items: IdItem[], varName: string) {
  const lines = items.map((e) => {
    const parts = [`"id": "${e.id}"`];
    if (e.duration !== undefined) parts.push(`"duration": ${e.duration}`);
    if (e.rarity !== undefined) parts.push(`"rarity": "${e.rarity}"`);
    if (e.category !== undefined) parts.push(`"category": "${e.category}"`);
    return `    "${e.name}": {${parts.join(", ")}},`;
  });
  return `${varName} = {\n${lines.join("\n")}\n}\n`;
}

function pretty(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}

export function IdTable({
  items,
  jsonName,
  pyName,
  txtName,
  pyVarName,
  emptyNote,
  downloads = ["json", "python", "txt"],
}: {
  items: IdItem[];
  jsonName: string;
  pyName: string;
  txtName: string;
  pyVarName: string;
  emptyNote?: string;
  /** Which download buttons to show, in this order. */
  downloads?: ("json" | "python" | "txt")[];
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [rarity, setRarity] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const hasDuration = items.some((e) => e.duration !== undefined);
  const hasRarity = items.some((e) => e.rarity !== undefined);
  const hasCategory = items.some((e) => e.category !== undefined);

  // Counts in each dropdown reflect the OTHER active filter, so only
  // combinations that actually exist in the data are shown.
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .filter((e) => rarity === "" || e.rarity === rarity)
            .map((e) => e.category)
            .filter(Boolean),
        ),
      ).sort() as string[],
    [items, rarity],
  );
  const rarities = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .filter((e) => category === "" || e.category === category)
            .map((e) => e.rarity)
            .filter(Boolean),
        ),
      ).sort() as string[],
    [items, category],
  );

  const s = q.trim().toLowerCase();
  const list = items.filter(
    (e) =>
      (e.id.toLowerCase().includes(s) || e.name.toLowerCase().includes(s)) &&
      (category === "" || e.category === category) &&
      (rarity === "" || e.rarity === rarity),
  );

  const copy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  const btn =
    "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90";
  const select =
    "rounded-md border border-input bg-background px-3 py-2 text-sm";

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {emptyNote ?? "This list is empty right now."}
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {downloads.includes("json") && (
          <button
            className={btn}
            onClick={() =>
              download(jsonName, JSON.stringify(items, null, 2), "application/json")
            }
          >
            Download JSON
          </button>
        )}
        {downloads.includes("python") && (
          <button
            className={btn}
            onClick={() => download(pyName, toPython(items, pyVarName), "text/x-python")}
          >
            Download Python
          </button>
        )}
        {downloads.includes("txt") && (
          <button
            className={btn}
            onClick={() =>
              download(
                txtName,
                items.map((e) => e.id).join("\n"),
                "text/plain",
              )
            }
          >
            Download IDs only
          </button>
        )}
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or ID..."
        className="mt-6 w-full rounded-md border border-input bg-background px-3 py-2"
      />

      {(hasCategory || hasRarity) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {hasCategory && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={select}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {pretty(c)} (
                  {
                    items.filter(
                      (e) => e.category === c && (rarity === "" || e.rarity === rarity),
                    ).length
                  }
                  )
                </option>
              ))}
            </select>
          )}
          {hasRarity && (
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className={select}
            >
              <option value="">All rarities</option>
              {rarities.map((r) => (
                <option key={r} value={r}>
                  {pretty(r)} (
                  {
                    items.filter(
                      (e) => e.rarity === r && (category === "" || e.category === category),
                    ).length
                  }
                  )
                </option>
              ))}
            </select>
          )}
          {(category !== "" || rarity !== "") && (
            <button
              onClick={() => {
                setCategory("");
                setRarity("");
              }}
              className="text-sm text-muted-foreground hover:underline"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto text-sm text-muted-foreground">
            {list.length} shown
          </span>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-md border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">ID</th>
              {hasCategory && <th className="hidden px-3 py-2 sm:table-cell">Category</th>}
              {hasRarity && <th className="hidden px-3 py-2 sm:table-cell">Rarity</th>}
              {hasDuration && <th className="px-3 py-2">Duration</th>}
            </tr>
          </thead>
          <tbody>
            {list.map((e, i) => (
              <tr key={`${e.id}-${i}`} className="border-t">
                <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                <td className="px-3 py-2 break-words">{e.name}</td>
                <td className="px-3 py-2">
                  <button onClick={() => copy(e.id)} className="font-mono break-all text-left hover:underline">
                    {e.id}
                  </button>
                  {copied === e.id && (
                    <span className="ml-2 text-xs text-muted-foreground">✓ copied</span>
                  )}
                </td>
                {hasCategory && (
                  <td className="hidden px-3 py-2 text-muted-foreground sm:table-cell">
                    {e.category === undefined ? "-" : pretty(e.category)}
                  </td>
                )}
                {hasRarity && (
                  <td className="hidden px-3 py-2 text-muted-foreground sm:table-cell">
                    {e.rarity === undefined ? "-" : pretty(e.rarity)}
                  </td>
                )}
                {hasDuration && (
                  <td className="px-3 py-2">
                    {e.duration === undefined ? "-" : `${e.duration}s`}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <p className="mt-6 text-muted-foreground">No results</p>}
    </>
  );
}
