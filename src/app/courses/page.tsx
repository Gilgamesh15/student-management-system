import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseForm from "./CourseCreateForm";
import { getDetailedCourses } from "@/lib/actions/course";
import { getSubjects } from "@/lib/actions/subject";
import { getTeachers } from "@/lib/actions/teacher";

export default async function Page() {
  const courses = await getDetailedCourses();

  const [subjects, teachers] = await Promise.all([
    getSubjects(),
    getTeachers(),
  ]);

  return (
    <div className="container mx-auto py-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Add Courset</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Course</DialogTitle>
          <CourseForm subjects={subjects} teachers={teachers} />
        </DialogContent>
      </Dialog>
      <DataTable
        columns={columns}
        data={courses}
        subjects={subjects}
        teachers={teachers}
      />
    </div>
  );
}
