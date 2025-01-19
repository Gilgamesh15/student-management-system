"use client";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CourseEnrollmentEdit from "./CourseEnrollmentEditForm";
import { Course, Student } from "@prisma/client";
import { DetailedCourseEnrollment } from "@/lib/types";
import { deleteCourseEnrollment } from "@/lib/actions/course-enrollment";

export const columns: ColumnDef<DetailedCourseEnrollment>[] = [
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.getValue("student") as Student;
      return (
        <div>
          {student.firstName} {student.lastName}
        </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      const student = row.getValue(id) as Student;
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const course = row.getValue("course") as Course;
      return <div>{course.name}</div>;
    },
  },
  { accessorKey: "grade", header: "Grade" },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const courseEnrollment = row.original;

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DialogTrigger>

              <DropdownMenuItem
                onClick={() => deleteCourseEnrollment(courseEnrollment.id)}
              >
                Delete Course Enrollment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogTitle>Course Enrollment Details</DialogTitle>

            <CourseEnrollmentEdit
              courseEnrollment={courseEnrollment}
              students={[]}
              courses={[]}
              {...table.options.meta}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
