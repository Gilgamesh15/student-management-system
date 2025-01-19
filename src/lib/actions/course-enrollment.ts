"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import {
  courseEnrollmentCreateSchema,
  courseEnrollmentUpdateSchema,
} from "../schemas/course-enrollment";
import { db } from "../db";

export async function getDetailedCourseEnrollments() {
  return db.courseEnrollment.findMany({
    include: {
      student: true,
      course: true,
    },
  });
}

export async function getCourseEnrollments() {
  return db.courseEnrollment.findMany();
}

export interface CreateCourseEnrollmentState {
  errors: Partial<{
    studentId: string[];
    courseId: string[];
    grade: string[];
  }>;
  message: string | undefined;
}

export async function createCourseEnrollment(
  prevState: CreateCourseEnrollmentState,
  formData: FormData
): Promise<CreateCourseEnrollmentState> {
  const parseResult = courseEnrollmentCreateSchema.safeParse({
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
    grade: formData.get("grade"),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof courseEnrollmentCreateSchema> = parseResult.data;

  try {
    await db.courseEnrollment.create({ data });

    revalidatePath("/course-enrollments");

    return {
      errors: {},
      message: "Course enrollment created successfully.",
    };
  } catch (error) {
    console.error("Error creating course enrollment:", error);
    return {
      errors: {},
      message:
        "An error occurred while creating the course enrollment. Please try again.",
    };
  }
}

export interface UpdateCourseEnrollmentState {
  errors: Partial<{
    id: string[];
    studentId: string[];
    courseId: string[];
    grade: string[];
  }>;
  message: string | undefined;
}

export async function updateCourseEnrollment(
  prevState: UpdateCourseEnrollmentState,
  formData: FormData
): Promise<UpdateCourseEnrollmentState> {
  const parseResult = courseEnrollmentUpdateSchema.safeParse({
    id: formData.get("id"),
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
    grade: formData.get("grade"),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof courseEnrollmentUpdateSchema> = parseResult.data;

  const { id, ...rest } = data;
  try {
    await db.courseEnrollment.update({
      where: {
        id: id,
      },
      data: rest,
    });

    revalidatePath("/course-enrollments");

    return {
      errors: {},
      message: "Course enrollment updated successfully.",
    };
  } catch (error) {
    console.error("Error updating course enrollment:", error);
    return {
      errors: {},
      message:
        "An error occurred while updating the course enrollment. Please try again.",
    };
  }
}

export async function deleteCourseEnrollment(id: number) {
  await db.courseEnrollment.delete({
    where: {
      id,
    },
  });

  revalidatePath("/course-enrollments");
}
