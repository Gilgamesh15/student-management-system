import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import SubjectForm from "./SubjectForm";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export type Subject = Awaited<ReturnType<typeof getSubjects>>[number];

async function getSubjects() {
  return db.subject.findMany({
    include: {
      teachers: true,
      courses: true,
    },
  });
}

async function getTeachers() {
  return db.teacher.findMany();
}

async function getCourses() {
  return db.course.findMany();
}

export default async function SubjectPage() {
  const subjects = await getSubjects();

  const [teachers, courses] = await Promise.all([getTeachers(), getCourses()]);

  return (
    <div className="container mx-auto py-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Add Subject</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Subject</DialogTitle>
          <SubjectForm teachers={teachers} courses={courses} />
        </DialogContent>
      </Dialog>
      <DataTable
        columns={columns}
        data={subjects}
        teachers={teachers}
        courses={courses}
      />
    </div>
  );
}
