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
import { deleteAttendance } from "@/lib/actions/attendance";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Student } from "@prisma/client";
import { DetailedAttendance } from "@/lib/types";
import AttendanceEditForm from "./AttendanceEditForm";

export const columns: ColumnDef<DetailedAttendance>[] = [
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
    accessorKey: "date",
    header: "Date",

    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(date);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "present",
    header: "Present",
    cell: ({ row }) => {
      const present = row.getValue("present") as boolean;
      return <div>{present ? "Yes" : "No"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const attendance = row.original;

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

              <DropdownMenuItem onClick={() => deleteAttendance(attendance.id)}>
                Delete Attendance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogTitle>Attendance Details</DialogTitle>

            <AttendanceEditForm
              students={[]}
              attendance={attendance}
              {...table.options.meta}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
