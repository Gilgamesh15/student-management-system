"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { courseCreateSchema } from "../schemas";
import { db } from "../db";
import { courseUpdateSchema } from "../schemas/course";

export async function getDetailedCourses() {
  return db.course.findMany({
    include: {
      subject: true,
      teacher: true,
      enrollments: true,
      assignments: true,
    },
  });
}

export async function getCourses() {
  return db.course.findMany();
}

export interface CreateCourseState {
  errors: Partial<{
    name: string[];
    subjectId: string[];
    teacherId: string[];
    semester: string[];
    year: string[];
    enrollments: string[];
    assignments: string[];
  }>;
  message: string | undefined;
}

export async function createCourse(
  prevState: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const parseResult = courseCreateSchema.safeParse({
    name: formData.get("name"),
    subjectId: formData.get("subjectId"),
    teacherId: formData.get("teacherId"),
    semester: formData.get("semester"),
    year: formData.get("year"),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof courseCreateSchema> = parseResult.data;

  try {
    await db.course.create({
      data,
    });

    revalidatePath("/courses");

    return {
      errors: {},
      message: "Course created successfully.",
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      errors: {},
      message: "An error occurred while creating the course. Please try again.",
    };
  }
}

export interface UpdateCourseState {
  errors: Partial<{
    id: string[];
    name: string[];
    subjectId: string[];
    teacherId: string[];
    semester: string[];
    year: string[];
    enrollments: string[];
    assignments: string[];
  }>;
  message: string | undefined;
}

export async function updateCourse(
  prevState: UpdateCourseState,
  formData: FormData
): Promise<UpdateCourseState> {
  const parseResult = courseUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    subjectId: formData.get("subjectId"),
    teacherId: formData.get("teacherId"),
    semester: formData.get("semester"),
    year: formData.get("year"),
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof courseUpdateSchema> = parseResult.data;

  const { id, ...rest } = data;
  try {
    await db.course.update({
      where: {
        id: id,
      },
      data: rest,
    });

    revalidatePath("/courses");

    return {
      errors: {},
      message: "Course created successfully.",
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      errors: {},
      message: "An error occurred while creating the course. Please try again.",
    };
  }
}

export async function deleteCourse(id: number) {
  await db.course.delete({
    where: {
      id,
    },
  });

  revalidatePath("/courses");
}
