"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { subjectCreateSchema } from "../schemas";
import { subjectUpdateSchema } from "../schemas/subject";

export async function getDetailedSubjects() {
  return await db.subject.findMany({
    include: {
      courses: true,
      teachers: true,
    },
  });
}

export async function getSubjects() {
  return await db.subject.findMany();
}

export interface SubjectCreateState {
  errors: Partial<{
    name: string[];
    description: string[];
  }>;
  message: string | undefined;
}

export async function createSubject(
  prevState: SubjectCreateState,
  formData: FormData
): Promise<SubjectCreateState> {
  const parseResult = subjectCreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof subjectCreateSchema> = parseResult.data;

  try {
    await db.subject.create({
      data,
    });

    revalidatePath("/subjects");

    return {
      errors: {},
      message: "Subject created successfully.",
    };
  } catch (error) {
    console.error("Error creating Subject:", error);
    return {
      errors: {},
      message:
        "An error occurred while creating the subject. Please try again.",
    };
  }
}

export interface UpdateSubjectState {
  errors: Partial<{
    id: string[];
    name: string[];
    description: string[];
  }>;
  message: string | undefined;
}

export async function updateSubject(
  prevState: UpdateSubjectState,
  formData: FormData
): Promise<UpdateSubjectState> {
  const parseResult = subjectUpdateSchema.safeParse({
    id: Number(formData.get("id")),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof subjectUpdateSchema> = parseResult.data;

  const { id, ...rest } = data;
  try {
    await db.subject.update({
      where: {
        id: id,
      },
      data: rest,
    });

    revalidatePath("/subjects");

    return {
      errors: {},
      message: "Subject updated successfully.",
    };
  } catch (error) {
    console.error("Error updating subject:", error);
    return {
      errors: {},
      message:
        "An error occurred while updating the subject. Please try again.",
    };
  }
}

export async function deleteSubject(id: number) {
  await db.subject.delete({
    where: {
      id,
    },
  });

  revalidatePath("/subjects");
}
