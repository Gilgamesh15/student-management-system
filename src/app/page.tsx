import {
  UsersIcon,
  BookOpenIcon,
  UserCheckIcon,
  GraduationCapIcon,
  ClipboardListIcon,
  CalendarIcon,
  BookmarkIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

async function getStudentsCnt() {
  return db.student.count();
}
async function getAssignmentsCnt() {
  return db.assignment.count();
}
async function getAttendanceCnt() {
  return db.attendance.count();
}
async function getCourseEnrollmentsCnt() {
  return db.courseEnrollment.count();
}
async function getCoursesCnt() {
  return db.course.count();
}
async function getSubjectsCnt() {
  return db.subject.count();
}
async function getTeachersCnt() {
  return db.teacher.count();
}

const DashboardPage = async () => {
  const [
    studentsCnt,
    assignmentsCnt,
    attendanceCnt,
    courseEnrollmentsCnt,
    coursesCnt,
    subjectsCnt,
    teachersCnt,
  ] = await Promise.all([
    getStudentsCnt(),
    getAssignmentsCnt(),
    getAttendanceCnt(),
    getCourseEnrollmentsCnt(),
    getCoursesCnt(),
    getSubjectsCnt(),
    getTeachersCnt(),
  ]);

  const stats = [
    {
      title: "Total Students",
      value: studentsCnt,
      description: "Active students in the system",
      icon: UsersIcon,
    },
    {
      title: "Teachers",
      value: teachersCnt,
      description: "Current teaching staff",
      icon: GraduationCapIcon,
    },
    {
      title: "Courses",
      value: coursesCnt,
      description: `Across ${subjectsCnt} subjects`,
      icon: BookOpenIcon,
    },
    {
      title: "Enrollments",
      value: courseEnrollmentsCnt,
      description: "Total course registrations",
      icon: UserCheckIcon,
    },
    {
      title: "Assignments",
      value: assignmentsCnt,
      description: "Tasks and homework",
      icon: ClipboardListIcon,
    },
    {
      title: "Attendance Records",
      value: attendanceCnt,
      description: "Total attendance entries",
      icon: CalendarIcon,
    },
    {
      title: "Subjects",
      value: subjectsCnt,
      description: "Available subject areas",
      icon: BookmarkIcon,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-4xl text-center font-bold tracking-tight">
        Dashboard
      </h2>

      <div className="grid gap-4 grid-cols-4">
        {stats.map(({ title, icon: Icon, value, description }) => (
          <Card key={title} className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
