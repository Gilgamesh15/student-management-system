import { db } from "@/lib/db";
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
import TeacherForm from "./TeacherCreateForm";
import { getDetailedTeachers } from "@/lib/actions/teacher";

export default async function Page() {
  const teachers = await getDetailedTeachers();

  return (
    <div className="container mx-auto py-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Add Teacher</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Teacher</DialogTitle>
          <TeacherForm />
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={teachers} />
    </div>
  );
}
