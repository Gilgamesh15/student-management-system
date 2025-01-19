"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { studentCreateSchema } from "../schemas";
import { ISOStringFormat } from "date-fns";
import { studentUpdateSchema } from "../schemas/student";

export async function getDetailedStudents() {
  return db.student.findMany({
    include: {
      enrollments: true,
      attendance: true,
      assignments: true,
    },
  });
}

export async function getStudents() {
  return db.student.findMany();
}

export interface StudentCreateState {
  errors: Partial<{
    firstName: string[];
    lastName: string[];
    email: string[];
    dateOfBirth: string[];
    enrollmentDate: string[];
    grade: string[];
  }>;
  message: string | undefined;
}

export async function createStudent(
  prevState: StudentCreateState,
  formData: FormData
): Promise<StudentCreateState> {
  const parseResult = studentCreateSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    dateOfBirth: new Date(formData.get("dateOfBirth") as ISOStringFormat),
    grade: formData.get("grade"),
    enrollmentDate: new Date(formData.get("enrollmentDate") as ISOStringFormat),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof studentCreateSchema> = parseResult.data;

  try {
    await db.student.create({
      data,
    });

    revalidatePath("/students");

    return {
      errors: {},
      message: "Student created successfully.",
    };
  } catch (error) {
    console.error("Error creating student:", error);
    return {
      errors: {},
      message:
        "An error occurred while creating the student. Please try again.",
    };
  }
}

export interface UpdateStudentState {
  errors: Partial<{
    id: string[];
    firstName: string[];
    lastName: string[];
    email: string[];
    dateOfBirth: string[];
    enrollmentDate: string[];
    grade: string[];
  }>;
  message: string | undefined;
}

export async function updateStudent(
  prevState: UpdateStudentState,
  formData: FormData
): Promise<UpdateStudentState> {
  const parseResult = studentUpdateSchema.safeParse({
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    dateOfBirth: new Date(formData.get("dateOfBirth") as ISOStringFormat),
    grade: formData.get("grade"),
    enrollmentDate: new Date(formData.get("enrollmentDate") as ISOStringFormat),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof studentUpdateSchema> = parseResult.data;

  const { id, ...rest } = data;
  try {
    await db.student.update({
      where: {
        id: id,
      },
      data: rest,
    });

    revalidatePath("/students");

    return {
      errors: {},
      message: "Student created successfully.",
    };
  } catch (error) {
    console.error("Error creating student:", error);
    return {
      errors: {},
      message:
        "An error occurred while creating the student. Please try again.",
    };
  }
}

export async function deleteStudent(id: number) {
  await db.student.delete({
    where: {
      id,
    },
  });

  revalidatePath("/students");
}
