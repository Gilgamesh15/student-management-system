"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { teacherCreateSchema } from "../schemas";
import { teacherUpdateSchema } from "../schemas/teacher";

export async function getDetailedTeachers() {
  return await db.teacher.findMany({
    include: {
      subjects: true,
      courses: true,
    },
  });
}

export async function getTeachers() {
  return await db.teacher.findMany();
}

export interface TeacherCreateState {
  errors: Partial<{
    firstName: string[];
    lastName: string[];
    email: string[];
  }>;
  message: string | undefined;
}

export async function createTeacher(
  prevState: TeacherCreateState,
  formData: FormData
): Promise<TeacherCreateState> {
  const parseResult = teacherCreateSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof teacherCreateSchema> = parseResult.data;

  try {
    await db.teacher.create({
      data,
    });

    revalidatePath("/teachers");

    return {
      errors: {},
      message: "Teacher created successfully.",
    };
  } catch (error) {
    console.error("Error creating Teacher:", error);
    return {
      errors: {},
      message:
        "An error occurred while creating the teacher. Please try again.",
    };
  }
}

export interface UpdateTeacherState {
  errors: Partial<{
    id: string[];
    firstName: string[];
    lastName: string[];
    email: string[];
  }>;
  message: string | undefined;
}

export async function updateTeacher(
  prevState: UpdateTeacherState,
  formData: FormData
): Promise<UpdateTeacherState> {
  const parseResult = teacherUpdateSchema.safeParse({
    id: Number(formData.get("id")),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof teacherUpdateSchema> = parseResult.data;

  const { id, ...rest } = data;
  try {
    await db.teacher.update({
      where: {
        id: id,
      },
      data: rest,
    });

    revalidatePath("/teachers");

    return {
      errors: {},
      message: "Teacher updated successfully.",
    };
  } catch (error) {
    console.error("Error updating teachers:", error);
    return {
      errors: {},
      message:
        "An error occurred while updating the teacher. Please try again.",
    };
  }
}

export async function deleteTeacher(id: number) {
  await db.teacher.delete({
    where: {
      id,
    },
  });

  revalidatePath("/teachers");
}
