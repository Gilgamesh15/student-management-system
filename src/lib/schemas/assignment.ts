import { z } from "zod";

export const assignmentCreateSchema = z.object({
  title: z.string().max(100).nonempty(),
  description: z.string().max(1000).nullable(),
  dueDate: z.date(),
  courseId: z.coerce.number().int().positive(),
  studentId: z.coerce.number().int().positive(),
  score: z.coerce.number().min(0).max(100).nullable(),
});

export const assignmentCreateDefaultValues: z.infer<
  typeof assignmentCreateSchema
> = {
  title: "",
  description: "",
  dueDate: new Date(),
  courseId: 0,
  studentId: 0,
  score: 0,
};

export const assignmentUpdateSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .merge(assignmentCreateSchema);
