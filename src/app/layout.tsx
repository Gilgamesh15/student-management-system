import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Card className="bg-foreground text-background w-64 h-screen fixed top-0 left-0 rounded-l-none border-none border-r">
          <CardHeader>
            <CardTitle className="text-center text-4xl mb-2">Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/subjects"
            >
              Subjects
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/assignments"
            >
              Assignments
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/attendance"
            >
              Attendance
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/courses"
            >
              Courses
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/students"
            >
              Students
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/teachers"
            >
              Teachers
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/course-enrollments"
            >
              Course Enrollments
            </Link>
          </CardContent>
        </Card>
        <main className="ml-64 p-8">{children}</main>
      </body>
    </html>
  );
}
