import { useEffect, type CSSProperties } from "react";
import datePickerRuRU from "antd/es/date-picker/locale/ru_RU";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Form, Grid, Input, InputNumber, Modal } from "antd";
import dayjs from "dayjs";
import { tableItemSchema, type TableItemFormValues } from "@entities/record/model/tableItemSchema";
import { DATE_FORMAT } from "@shared/constants";
import type { TableRow } from "@entities/record/model/types";

const { useBreakpoint } = Grid;

const FULLSCREEN_STYLE: CSSProperties = { top: 0, padding: 0, margin: 0, maxWidth: "100vw" };
const FULLSCREEN_BODY_STYLE: CSSProperties = { maxHeight: "calc(100vh - 110px)", overflowY: "auto" };

interface Props {
  isOpen: boolean;
  editingRecord: TableRow | null;
  onSave: (values: TableItemFormValues) => void;
  onClose: () => void;
}

export const TableItemForm = ({ isOpen, editingRecord, onSave, onClose }: Props) => {
  const screens = useBreakpoint();

  const fullScreen = !screens.sm;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TableItemFormValues>({
    resolver: zodResolver(tableItemSchema),
    defaultValues: { name: "", date: undefined, value: undefined },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        editingRecord
          ? {
            name: editingRecord.name,
            date: dayjs(editingRecord.date, DATE_FORMAT),
            value: editingRecord.value,
          }
          : { name: "", date: undefined, value: undefined }
      );
    }
  }, [isOpen, editingRecord, reset]);

  const handleSave = (values: TableItemFormValues) => {
    onSave(values);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      title={editingRecord ? "Редактировать запись" : "Добавить запись"}
      okText="Сохранить"
      cancelText="Отмена"
      onOk={handleSubmit(handleSave)}
      onCancel={onClose}
      width={fullScreen ? "100vw" : undefined}
      style={fullScreen ? FULLSCREEN_STYLE : undefined}
      styles={fullScreen ? { body: FULLSCREEN_BODY_STYLE } : undefined}
    >
      <Form layout="vertical">
        <Form.Item
          label="Имя"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Введите имя" />}
          />
        </Form.Item>

        <Form.Item
          label="Дата"
          validateStatus={errors.date ? "error" : ""}
          help={errors.date?.message}
        >
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                style={{ width: "100%" }}
                format={DATE_FORMAT}
                value={field.value ?? null}
                onChange={(date) => field.onChange(date)}
                placeholder="Выберите дату"
                locale={datePickerRuRU}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Числовое значение"
          validateStatus={errors.value ? "error" : ""}
          help={errors.value?.message}
        >
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Введите число"
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
