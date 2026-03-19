import z from "zod";
import { ERROR_MESSAGES } from "@shared/constants";
import dayjs, { Dayjs } from "dayjs";

export const tableItemSchema = z.object({
  name: z.string().min(3, { message: ERROR_MESSAGES.NAME_MIN }).max(15, { message: ERROR_MESSAGES.NAME_MAX }),
  date: z.custom<Dayjs>((val) => dayjs.isDayjs(val as Dayjs) && (val as Dayjs).isValid(), {
    message: ERROR_MESSAGES.DATE_REQUIRED,
  }),
  value: z.number({ error: ERROR_MESSAGES.VALUE_INVALID }),
});

export type TableItemFormValues = z.infer<typeof tableItemSchema>;
