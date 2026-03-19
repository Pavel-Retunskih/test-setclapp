import {describe, it, expect} from "vitest";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {tableReducer} from "../tableReducer";
import type {TableRow} from "../types";
import {DATE_FORMAT} from "@shared/constants";

dayjs.extend(customParseFormat);

const makeRow = (overrides?: Partial<TableRow>): TableRow => ({
  id: "test-id-1",
  name: "Alice",
  date: "01-01-2024",
  value: 42,
  ...overrides,
});

const initialState: TableRow[] = [makeRow()];

describe("tableReducer", () => {
  describe("ADD_ROW", () => {
    it("Добавление новой строки в таблицу", () => {
      const result = tableReducer(initialState, {
        type: "ADD_ROW",
        payload: {name: "Bob", date: dayjs("15-06-2025", DATE_FORMAT), value: 10},
      });

      expect(result).toHaveLength(2);
      expect(result[1].name).toBe("Bob");
      expect(result[1].date).toBe("15-06-2025");
      expect(result[1].value).toBe(10);
      expect(result[1].id).toBeDefined();
    });

    it("Не изменяет исходное состояние", () => {
      const result = tableReducer(initialState, {
        type: "ADD_ROW",
        payload: {name: "Bob", date: dayjs("15-06-2025", DATE_FORMAT), value: 10},
      });

      expect(result).not.toBe(initialState);
      expect(initialState).toHaveLength(1);
    });
  });

  describe("UPDATE_ROW", () => {
    it("Обновление строки в таблице", () => {
      const result = tableReducer(initialState, {
        type: "UPDATE_ROW",
        payload: {
          id: "test-id-1",
          values: {name: "Updated", date: dayjs("20-03-2026", DATE_FORMAT), value: 99},
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Updated");
      expect(result[0].date).toBe("20-03-2026");
      expect(result[0].value).toBe(99);
      expect(result[0].id).toBe("test-id-1");
    });

    it("Не должкн изменять другие строки", () => {
      const state: TableRow[] = [makeRow(), makeRow({id: "test-id-2", name: "Bob"})];
      const result = tableReducer(state, {
        type: "UPDATE_ROW",
        payload: {
          id: "test-id-1",
          values: {name: "Updated", date: dayjs("01-01-2024", DATE_FORMAT), value: 1},
        },
      });

      expect(result[1].name).toBe("Bob");
    });

    it("Должен возвращать оригинальный стэйт если не найден id", () => {
      const result = tableReducer(initialState, {
        type: "UPDATE_ROW",
        payload: {
          id: "nonexistent-id",
          values: {name: "Ghost", date: dayjs("01-01-2024", DATE_FORMAT), value: 0},
        },
      });

      expect(result[0].name).toBe("Alice");
    });
  });

  describe("DELETE_ROW", () => {
    it("Должна удаляться строка по id", () => {
      const result = tableReducer(initialState, {
        type: "DELETE_ROW",
        payload: {id: "test-id-1"},
      });

      expect(result).toHaveLength(0);
    });

    it("Не должны удаляться другие строки", () => {
      const state: TableRow[] = [makeRow(), makeRow({id: "test-id-2", name: "Bob"})];
      const result = tableReducer(state, {
        type: "DELETE_ROW",
        payload: {id: "test-id-1"},
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("test-id-2");
    });

    it("Должен возвращать оригинальный стэйт если не найден id", () => {
      const result = tableReducer(initialState, {
        type: "DELETE_ROW",
        payload: {id: "nonexistent-id"},
      });

      expect(result).toHaveLength(1);
    });
  });
});
