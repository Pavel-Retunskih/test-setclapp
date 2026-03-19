import { useCallback, useMemo, useState } from "react";
import { Button, Input } from "antd";
import { useTableState, useTableDispatch } from "@entities/record";
import type { TableItemFormValues } from "@entities/record";
import { useSearch } from "@shared/hooks";
import { searchPredicate } from "@entities/record/model/searchPredicate";
import { ItemsTable } from "./ItemsTable";
import { TableItemForm } from "@entities/record";

export const ItemsTableWidget = () => {
  const rows = useTableState();
  const dispatch = useTableDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { query, setQuery, filteredData } = useSearch(rows, searchPredicate);

  const editingRecord = useMemo(
    () => rows.find((row) => row.id === editingId) ?? null,
    [rows, editingId]
  );

  const openAdd = useCallback(() => { setEditingId(null); setIsOpen(true); }, []);
  const openEdit = useCallback((id: string) => { setEditingId(id); setIsOpen(true); }, []);
  const close = useCallback(() => { setEditingId(null); setIsOpen(false); }, []);

  const handleDelete = useCallback(
    (id: string) => dispatch({ type: "DELETE_ROW", payload: { id } }),
    [dispatch]
  );

  const handleSave = useCallback(
    (values: TableItemFormValues) => {
      if (editingId) {
        dispatch({ type: "UPDATE_ROW", payload: { id: editingId, values } });
      } else {
        dispatch({ type: "ADD_ROW", payload: values });
      }
    },
    [dispatch, editingId]
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Button type="primary" onClick={openAdd} style={{ flexShrink: 0 }}>
          Добавить
        </Button>
        <Input
          placeholder="Поиск по имени"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
      </div>
      <ItemsTable data={filteredData} onEdit={openEdit} onDelete={handleDelete} />
      <TableItemForm isOpen={isOpen} editingRecord={editingRecord} onSave={handleSave} onClose={close} />
    </div>
  );
};
