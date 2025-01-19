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
import CourseEnrollmentForm from "./CourseEnrollmentCreateForm";
import { getDetailedCourseEnrollments } from "@/lib/actions/course-enrollment";
import { getStudents } from "@/lib/actions/student";
import { getCourses } from "@/lib/actions/course";

export default async function Page() {
  const courseEnrollments = await getDetailedCourseEnrollments();

  const [students, courses] = await Promise.all([getStudents(), getCourses()]);

  return (
    <div className="container mx-auto py-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <span>Add Course Enrollment</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Course Enrollment</DialogTitle>
          <CourseEnrollmentForm students={students} courses={courses} />
        </DialogContent>
      </Dialog>
      <DataTable
        columns={columns}
        data={courseEnrollments}
        students={students}
        courses={courses}
      />
    </div>
  );
}
