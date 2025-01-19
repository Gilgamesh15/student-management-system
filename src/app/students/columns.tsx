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
import { deleteStudent } from "@/lib/actions/student";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StudentEdit from "./StudentEditForm";
import { DetailedStudent } from "@/lib/types";

export const columns: ColumnDef<DetailedStudent>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => row.firstName + " " + row.lastName,
    header: "Name",
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "dateOfBirth",
    header: "Date Of Birth",

    cell: ({ row }) => {
      const amount = row.getValue("dateOfBirth") as Date;
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "enrollmentDate",
    header: "Enrollment Date",
    cell: ({ row }) => {
      const amount = row.getValue("dateOfBirth") as Date;
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  { accessorKey: "grade", header: "Grade" },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const student = row.original;

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

              <DropdownMenuItem onClick={() => deleteStudent(student.id)}>
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogTitle>Student Details</DialogTitle>
            <StudentEdit student={student} {...table.options.meta} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
