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
import { deleteCourse } from "@/lib/actions/course";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CourseEnrollmentEdit from "./CourseEditForm";
import { Subject, Teacher } from "@prisma/client";
import { DetailedCourse } from "@/lib/types";

export const columns: ColumnDef<DetailedCourse>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "semester", header: "Semester" },
  { accessorKey: "year", header: "Year" },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      const subject = row.getValue("subject") as Subject;
      return <div>{subject.name}</div>;
    },
  },
  {
    accessorKey: "teacher",
    header: "Teacher",
    cell: ({ row }) => {
      const teacher = row.getValue("teacher") as Teacher;
      return (
        <div>
          {teacher.firstName} {teacher.lastName}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const course = row.original;

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

              <DropdownMenuItem onClick={() => deleteCourse(course.id)}>
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogTitle>CourseDetails</DialogTitle>

            <CourseEnrollmentEdit
              subjects={[]}
              teachers={[]}
              course={course}
              {...table.options.meta}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
