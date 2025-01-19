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
import { deleteTeacher } from "@/lib/actions/teacher";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TeacherEdit from "./TeacherEditForm";
import { Course, Subject } from "@prisma/client";
import { DetailedTeacher } from "@/lib/types";

export const columns: ColumnDef<DetailedTeacher>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => row.firstName + " " + row.lastName,
    header: "Name",
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "subjects",
    header: "Subjects",
    cell: ({ row }) => {
      const subjects = row.getValue("subjects") as Subject[];
      return <div>{subjects.map((subject) => subject.name).join(", ")}</div>;
    },
  },
  {
    accessorKey: "courses",
    header: "Courses",
    cell: ({ row }) => {
      const courses = row.getValue("courses") as Course[];
      return <div>{courses.map((course) => course.name).join(", ")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const teacher = row.original;

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

              <DropdownMenuItem onClick={() => deleteTeacher(teacher.id)}>
                Delete Teacher
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogTitle>Teacher Details</DialogTitle>

            <TeacherEdit
              subjects={[]}
              courses={[]}
              teacher={teacher}
              {...table.options.meta}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
