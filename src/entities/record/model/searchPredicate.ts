import type { TableRow } from "./types";

export const searchPredicate = (row: TableRow, q: string): boolean =>
  row.name.toLowerCase().includes(q) ||
  row.date.toLowerCase().includes(q) ||
  String(row.value).includes(q);
