"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import {
  attendanceCreateSchema,
  attendanceUpdateSchema,
} from "../schemas/attendance";
import { db } from "../db";
import { ISOStringFormat } from "date-fns";

export async function getDetailedAttendances() {
  return db.attendance.findMany({
    include: {
      student: true,
    },
  });
}

export async function getAttendances() {
  return db.attendance.findMany();
}

export interface CreateAttendanceState {
  errors: Partial<{
    studentId: string[];
    date: string[];
    present?: string[];
  }>;
  message: string | undefined;
}

export async function createAttendance(
  prevState: CreateAttendanceState,
  formData: FormData
): Promise<CreateAttendanceState> {
  const parseResult = attendanceCreateSchema.safeParse({
    date: new Date(formData.get("date") as ISOStringFormat),
    studentId: formData.get("studentId"),
    present: formData.get("present") === "true" ? true : false,
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof attendanceCreateSchema> = parseResult.data;

  try {
    await db.attendance.create({ data });

    revalidatePath("/attendances");

    return {
      errors: {},
      message: "Attendance created successfully.",
    };
  } catch (error) {
    console.error("Error creating attendance:", error);
    return {
      errors: {},
      message:
        "An error occurred while creating the attendance. Please try again.",
    };
  }
}

export interface UpdateAttendanceState {
  errors: Partial<{
    id: string[];
    date: string[];
    studentId: string[];
    present?: string[];
  }>;
  message: string | undefined;
}

export async function updateAttendance(
  prevState: UpdateAttendanceState,
  formData: FormData
): Promise<UpdateAttendanceState> {
  const parseResult = attendanceUpdateSchema.safeParse({
    id: formData.get("id"),
    date: new Date(formData.get("date") as ISOStringFormat),
    studentId: formData.get("studentId"),
    present: formData.get("present") === "true" ? true : false,
  });

  if (!parseResult.success) {
    return {
      errors: parseResult.error.flatten().fieldErrors,
      message: undefined,
    };
  }

  const data: z.infer<typeof attendanceUpdateSchema> = parseResult.data;

  const { id, ...rest } = data;
  try {
    await db.attendance.update({
      where: {
        id: id,
      },
      data: rest,
    });

    revalidatePath("/assignments");

    return {
      errors: {},
      message: "Attendance updated successfully.",
    };
  } catch (error) {
    console.error("Error updating attendance:", error);
    return {
      errors: {},
      message:
        "An error occurred while updating the attendance. Please try again.",
    };
  }
}

export async function deleteAttendance(id: number) {
  await db.attendance.delete({
    where: {
      id,
    },
  });

  revalidatePath("/attendances");
}
