import { z } from "zod";

export const subjectCreateSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
});

export const subjectCreateDefaultValues: z.infer<typeof subjectCreateSchema> = {
  name: "",
  description: "",
};

export const subjectUpdateSchema = z
  .object({
    id: z.number().int().positive(),
  })
  .merge(subjectCreateSchema);
