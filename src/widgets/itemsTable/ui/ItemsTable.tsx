import { memo, useMemo } from "react";
import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { TableRow } from "@entities/record";
import { DATE_FORMAT, MIN_PAGINATION } from "@shared/constants";

interface Props {
  data: TableRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ItemsTable = memo(({ data, onEdit, onDelete }: Props) => {
  const columns = useMemo<ColumnsType<TableRow>>(
    () => [
      {
        key: "name",
        title: "Имя",
        dataIndex: "name",
        width: 120,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        key: "date",
        title: "Дата",
        dataIndex: "date",
        width: 120,
        sorter: (a, b) =>
          dayjs(a.date, DATE_FORMAT).unix() - dayjs(b.date, DATE_FORMAT).unix(),
      },
      {
        key: "value",
        title: "Числовое значение",
        dataIndex: "value",
        width: 160,
        sorter: (a, b) => a.value - b.value,
      },
      {
        key: "actions",
        title: "Действия",
        width: 180,
        render: (_, record) => (
          <Space>
            <Button type="link" onClick={() => onEdit(record.id)}>
              Редактировать
            </Button>
            <Popconfirm
              title="Удалить запись?"
              onConfirm={() => onDelete(record.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button type="link" danger>
                Удалить
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      bordered
      locale={{
        emptyText: "Нет данных",
        triggerDesc: "Сортировать по убыванию",
        triggerAsc: "Сортировать по возрастанию",
        cancelSort: "Отменить сортировку",
      }}
      pagination={data.length < MIN_PAGINATION ? false : undefined}
      scroll={{ x: "max-content" }}
    />
  );
});
