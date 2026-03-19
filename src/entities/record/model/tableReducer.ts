import dayjs from "dayjs";
import { DATE_FORMAT } from "@shared/constants";
import type { TableRow } from "./types";
import type { TableItemFormValues } from "./tableItemSchema";

export type TableAction =
  | { type: "ADD_ROW"; payload: TableItemFormValues }
  | { type: "UPDATE_ROW"; payload: { id: string; values: TableItemFormValues } }
  | { type: "DELETE_ROW"; payload: { id: string } };

export function tableReducer(state: TableRow[], action: TableAction): TableRow[] {
  switch (action.type) {
    case "ADD_ROW": {
      const newRow: TableRow = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        date: dayjs(action.payload.date).format(DATE_FORMAT),
        value: action.payload.value,
      };
      return [...state, newRow];
    }
    case "UPDATE_ROW": {
      return state.map((row) =>
        row.id === action.payload.id
          ? {
              ...row,
              name: action.payload.values.name,
              date: dayjs(action.payload.values.date).format(DATE_FORMAT),
              value: action.payload.values.value,
            }
          : row
      );
    }
    case "DELETE_ROW": {
      return state.filter((row) => row.id !== action.payload.id);
    }
    default: {
      return state;
    }
  }
}
