import { z } from "zod";

export const courseEnrollmentCreateSchema = z.object({
  studentId: z.preprocess(
    (arg) => Number.parseInt(arg as string),
    z.number().int().positive()
  ),
  courseId: z.preprocess(
    (arg) => Number.parseInt(arg as string),
    z.number().int().positive()
  ),
  grade: z.preprocess(
    (arg) => Number.parseFloat(arg as string),
    z.number().nullable()
  ),
});

export const courseEnrollmentCreateDefaultValues: z.infer<
  typeof courseEnrollmentCreateSchema
> = {
  studentId: 0,
  courseId: 0,
  grade: 0,
};

export const courseEnrollmentUpdateSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .merge(courseEnrollmentCreateSchema);
