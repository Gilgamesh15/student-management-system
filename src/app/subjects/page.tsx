import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SubjectForm from "./SubjectCreateForm";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getDetailedSubjects } from "@/lib/actions/subject";

export default async function SubjectPage() {
  const subjects = await getDetailedSubjects();

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
          <SubjectForm />
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={subjects} />
    </div>
  );
}
