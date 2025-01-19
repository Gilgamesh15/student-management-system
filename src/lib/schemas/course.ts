import { z } from "zod";

export const courseCreateSchema = z.object({
  name: z.string().nonempty(),
  subjectId: z.preprocess(
    (arg) => Number.parseInt(arg as string),
    z.number().int().positive()
  ),
  teacherId: z.preprocess(
    (arg) => Number.parseInt(arg as string),
    z.number().int().positive()
  ),
  semester: z.string().nonempty(),
  year: z.preprocess(
    (arg) => Number.parseInt(arg as string),
    z.number().int().positive()
  ),
});

export const courseCreateDefaultValues: z.infer<typeof courseCreateSchema> = {
  name: "",
  subjectId: 0,
  teacherId: 0,
  semester: "",
  year: new Date().getFullYear(),
};

export const courseUpdateSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .merge(courseCreateSchema);
