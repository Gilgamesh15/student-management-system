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
import AttendanceForm from "./AttendanceCreateForm";
import { getStudents } from "@/lib/actions/student";
import { getDetailedAttendances } from "@/lib/actions/attendance";

export default async function Page() {
  const attandances = await getDetailedAttendances();

  const [students] = await Promise.all([getStudents()]);

  return (
    <div className="container mx-auto py-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Add Attendance</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Attendance</DialogTitle>
          <AttendanceForm students={students} />
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={attandances} students={students} />
    </div>
  );
}
