import { z } from "zod";

export const teacherCreateSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email(),
});

export const teacherCreateDefaultValues: z.infer<typeof teacherCreateSchema> = {
  firstName: "",
  lastName: "",
  email: "",
};

export const teacherUpdateSchema = z
  .object({
    id: z.number().int().positive(),
  })
  .merge(teacherCreateSchema);
