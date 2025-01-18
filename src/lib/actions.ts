"use server";
//subjects
import { formSchema as createSubjectFormSchema } from "@/app/subjects/SubjectForm";

export async function createSubject(
  data: z.infer<typeof createSubjectFormSchema>
) {
  const { teachers, courses, ...rest } = data;
  await db.subject.create({
    data: {
      ...rest,
      teachers: {
        connect: teachers.map((id) => ({ id })),
      },
      courses: {
        connect: courses.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/subjects");
}

export async function updateSubject(
  id: number,
  data: z.infer<typeof createSubjectFormSchema>
) {
  const { teachers, courses, ...rest } = data;
  await db.subject.update({
    where: { id },
    data: {
      ...rest,
      teachers: {
        set: teachers.map((id) => ({ id })),
      },
      courses: {
        set: courses.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/subjects");
}

export async function deleteSubject(id: number) {
  await db.subject.delete({ where: { id } });

  revalidatePath("/subjects");
}
