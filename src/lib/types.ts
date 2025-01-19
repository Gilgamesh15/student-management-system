import {
  Student,
  Teacher,
  Subject,
  Course,
  CourseEnrollment,
  Assignment,
  Attendance,
} from "@prisma/client";
import { getDetailedCourseEnrollments } from "./actions/course-enrollment";
import { getDetailedCourses } from "./actions/course";
import { getDetailedStudents } from "./actions/student";
import { getDetailedTeachers } from "./actions/teacher";
import { getDetailedSubjects } from "./actions/subject";
import { getDetailedAssignments } from "./actions/assignments";
import { getDetailedAttendances } from "./actions/attendance";

export type PrismaModel =
  | Student
  | Teacher
  | Subject
  | Course
  | CourseEnrollment
  | Assignment
  | Attendance;

export type DetailedAssignment = Awaited<
  ReturnType<typeof getDetailedAssignments>
>[number];

export type DetailedAttendance = Awaited<
  ReturnType<typeof getDetailedAttendances>
>[number];

export type DetailedStudent = Awaited<
  ReturnType<typeof getDetailedStudents>
>[number];

export type DetailedTeacher = Awaited<
  ReturnType<typeof getDetailedTeachers>
>[number];

export type DetailedSubject = Awaited<
  ReturnType<typeof getDetailedSubjects>
>[number];

export type DetailedCourse = Awaited<
  ReturnType<typeof getDetailedCourses>
>[number];

export type DetailedCourseEnrollment = Awaited<
  ReturnType<typeof getDetailedCourseEnrollments>
>[number];
