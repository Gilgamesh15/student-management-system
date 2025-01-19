"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteAssignment } from "@/lib/actions/assignments";
import { DetailedAssignment } from "@/lib/types";
import { Course, Student } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import AssignmentEditForm from "./AssignmentEditForm";

export const columns: ColumnDef<DetailedAssignment>[] = [
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;

      if (description) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="line-clamp-2 w-40 text-left">{description}</p>
              </TooltipTrigger>
              <TooltipContent className="w-64">
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else {
        return <div className="text-gray-400">No description</div>;
      }
    },
  },
  { accessorKey: "score", header: "Score" },
  {
    accessorKey: "dueDate",
    header: "Due Date",

    cell: ({ row }) => {
      const amount = row.getValue("dueDate") as Date;
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
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
  },
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const course = row.getValue("course") as Course;

      return (
        <div>
          {course.name} - {course.year}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const assignment = row.original;

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Edit />
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>

              <DropdownMenuItem onClick={() => deleteAssignment(assignment.id)}>
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogTitle>Assignment Details</DialogTitle>
            <AssignmentEditForm
              students={[]}
              courses={[]}
              assignment={assignment}
              {...table.options.meta}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
