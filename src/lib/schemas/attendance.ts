import { z } from "zod";

export const attendanceCreateSchema = z.object({
  date: z.date().max(new Date()),
  present: z.boolean().optional(),
  studentId: z.preprocess(
    (arg) => Number.parseInt(arg as string),
    z.number().int().positive()
  ),
});

export const attendanceCreateDefaultValues: z.infer<
  typeof attendanceCreateSchema
> = {
  date: new Date(),
  present: false,
  studentId: 0,
};

export const attendanceUpdateSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .merge(attendanceCreateSchema);
