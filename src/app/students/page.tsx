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
import StudentForm from "./StudentCreateForm";
import { getDetailedStudents } from "@/lib/actions/student";

export default async function Page() {
  const students = await getDetailedStudents();

  return (
    <div className="container mx-auto py-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Add Student</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Student</DialogTitle>
          <StudentForm />
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={students} />
    </div>
  );
}
