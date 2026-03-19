import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from "react";
import { tableReducer, type TableAction } from "./tableReducer";
import type { TableRow } from "./types";
import { initialData } from "./initialData";

type TableStateContextValue = TableRow[];
type TableDispatchContextValue = Dispatch<TableAction>;

const TableStateContext = createContext<TableStateContextValue | null>(null);
const TableDispatchContext = createContext<TableDispatchContextValue | null>(null);

interface TableProviderProps {
  children: ReactNode;
}

export function TableProvider({ children }: TableProviderProps) {
  const [rows, dispatch] = useReducer(tableReducer, initialData);

  return (
    <TableStateContext value={rows}>
      <TableDispatchContext value={dispatch}>
        {children}
      </TableDispatchContext>
    </TableStateContext>
  );
}

export function useTableState(): TableStateContextValue {
  const ctx = useContext(TableStateContext);
  if (!ctx) throw new Error("useTableState must be used within TableProvider");
  return ctx;
}

export function useTableDispatch(): TableDispatchContextValue {
  const ctx = useContext(TableDispatchContext);
  if (!ctx) throw new Error("useTableDispatch must be used within TableProvider");
  return ctx;
}
