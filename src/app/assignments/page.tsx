import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AssignmentForm from "./AssignmentCreateForm";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getDetailedAssignments } from "@/lib/actions/assignments";
import { getStudents } from "@/lib/actions/student";
import { getCourses } from "@/lib/actions/course";

export default async function Page() {
  const assignments = await getDetailedAssignments();

  const [students, courses] = await Promise.all([getStudents(), getCourses()]);

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full">
            <Plus />
            <span>Add Assignment</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Assignment</DialogTitle>
          <AssignmentForm students={students} courses={courses} />
        </DialogContent>
      </Dialog>
      <DataTable
        columns={columns}
        data={assignments}
        students={students}
        courses={courses}
      />
    </div>
  );
}
