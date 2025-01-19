import { z } from "zod";

export const studentCreateSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email(),
  dateOfBirth: z.date(),
  enrollmentDate: z.date().optional(),
  grade: z.preprocess(
    (arg) => Number.parseInt(arg as string),
    z.number().int().positive()
  ),
});

export const studentCreateDefaultValues: z.infer<typeof studentCreateSchema> = {
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: new Date(),
  enrollmentDate: undefined,
  grade: 0,
};

export const studentUpdateSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .merge(studentCreateSchema);
