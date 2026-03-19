import { useMemo, useState } from "react";
import { useDebounce } from "@shared/hooks/useDebounce";

export function useSearch<T>(data: T[], predicate: (item: T, query: string) => boolean) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filteredData = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => predicate(item, q));
  }, [data, debouncedQuery, predicate]);

  return { query, setQuery, filteredData };
}
