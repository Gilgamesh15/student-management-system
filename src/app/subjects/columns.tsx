"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Course, Teacher } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { deleteSubject } from "@/lib/actions";
import SubjectEdit from "./SubjectEdit";
import { Badge } from "@/components/ui/badge";
import { Subject } from "./page";

export const columns: ColumnDef<Subject>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return (
        <div className="line-clamp-3">
          {description ? description : "No description available"}
        </div>
      );
    },
  },
  {
    accessorKey: "teachers",
    header: "Teachers",
    cell: ({ row }) => {
      const teachers = row.getValue("teachers") as Teacher[];

      return (
        <div className="flex flex-wrap gap-2">
          {teachers.map((teacher, i) => (
            <Badge
              key={teacher.id}
              variant={
                ["default", "secondary", "destructive", "outline"][
                  (i * 3) % 4
                ] as "default" | "secondary" | "destructive" | "outline"
              }
            >
              {teacher.firstName} {teacher.lastName}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "courses",
    header: "Courses",
    cell: ({ row }) => {
      const courses = row.getValue("courses") as Course[];

      return (
        <div className="flex flex-wrap gap-2">
          {courses.map((course, i) => (
            <Badge
              key={course.id}
              variant={
                ["default", "", "destructive", "outline"][(i * 3) % 4] as
                  | "default"
                  | "secondary"
                  | "destructive"
                  | "outline"
              }
            >
              {course.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const subject = row.original;

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
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DialogTrigger>

              <DropdownMenuItem onClick={() => deleteSubject(subject.id)}>
                Delete Subject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogTitle>Subject Details</DialogTitle>

            <SubjectEdit
              teachers={[]}
              courses={[]}
              subject={subject}
              {...table.options.meta}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
