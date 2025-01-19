"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import {
  assignmentCreateSchema,
  assignmentUpdateSchema,
} from "../schemas/assignment";
import { db } from "../db";
import { ISOStringFormat } from "date-fns";

export async function getDetailedAssignments() {
  return db.assignment.findMany({
    include: {
      course: true,
      student: true,
    },
  });
}

export async function getAssignments() {
  return db.assignment.findMany();
}

export interface CreateAssignmentState {
  errors: Partial<{
    title: string[];
    description: string[];
    dueDate: string[];
    courseId: string[];
    studentId: string[];
    score: string[];
  }>;
  message: string | undefined;
}

export async function createAssignment(
  prevState: CreateAssignmentState,
  formData: FormData
): Promise<CreateAssignmentState> {
  const parseResult = assignmentCreateSchema.safeParse({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    dueDate: new Date(formData.get("dueDate") as ISOStringFormat),
    courseId: formData.get("courseId"),
    studentId: formData.get("studentId"),
    score: formData.get("score"),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof assignmentCreateSchema> = parseResult.data;

  try {
    await db.assignment.create({ data });

    revalidatePath("/assignments");

    return {
      errors: {},
      message: "Assignment created successfully.",
    };
  } catch (error) {
    console.error("Error creating assignment:", error);
    return {
      errors: {},
      message:
        "An error occurred while creating the assignment. Please try again.",
    };
  }
}

export interface UpdateAssignmentState {
  errors: Partial<{
    id: string[];
    title: string[];
    description: string[];
    dueDate: string[];
    courseId: string[];
    studentId: string[];
    score: string[];
  }>;
  message: string | undefined;
}

export async function updateAssignment(
  prevState: UpdateAssignmentState,
  formData: FormData
): Promise<UpdateAssignmentState> {
  const parseResult = assignmentUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    dueDate: new Date(formData.get("dueDate") as ISOStringFormat),
    courseId: formData.get("courseId"),
    studentId: formData.get("studentId"),
    score: formData.get("score"),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof assignmentUpdateSchema> = parseResult.data;

  const { id, ...rest } = data;
  try {
    await db.assignment.update({
      where: {
        id: id,
      },
      data: rest,
    });

    revalidatePath("/assignments");

    return {
      errors: {},
      message: "Assignment updated successfully.",
    };
  } catch (error) {
    console.error("Error updating assignment:", error);
    return {
      errors: {},
      message:
        "An error occurred while updating the assignment. Please try again.",
    };
  }
}

export async function deleteAssignment(id: number) {
  await db.assignment.delete({
    where: {
      id,
    },
  });

  revalidatePath("/assignments");
}
