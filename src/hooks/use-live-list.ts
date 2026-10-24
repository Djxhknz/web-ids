import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveList, type ListKind } from "@/lib/live-lists";
import type { IdItem } from "@/components/IdTable";

export function useLiveList(kind: ListKind, fallback: IdItem[]) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return useQuery({
    queryKey: ["live-id-list", kind],
    queryFn: () => fetchLiveList(kind),
    // Prerender the bundled snapshot; read public GitHub directly after hydration.
    // No server credentials, redeploy hook, or server endpoint is needed.
    enabled: mounted,
    initialData: fallback,
    initialDataUpdatedAt: 0,
    staleTime: 0,
    retry: 1,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}