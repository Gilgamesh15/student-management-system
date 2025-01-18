import {
  Student,
  Teacher,
  Subject,
  Course,
  CourseEnrollment,
  Assignment,
  Attendance,
} from "@prisma/client";

export type PrismaModel =
  | Student
  | Teacher
  | Subject
  | Course
  | CourseEnrollment
  | Assignment
  | Attendance;
