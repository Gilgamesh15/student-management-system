"use client";

import { z } from "zod";
import { Course, Student } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { ComboboxField, NumberField } from "@/components/FormElements";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

import { updateCourseEnrollment } from "@/lib/actions/course-enrollment";

import { DetailedCourseEnrollment } from "@/lib/types";
import { courseEnrollmentUpdateSchema } from "@/lib/schemas/course-enrollment";

interface CourseEnrollmentEditForm {
  courseEnrollment: DetailedCourseEnrollment;
  students: Student[];
  courses: Course[];
}

const CourseEnrollmentEditForm = ({
  courseEnrollment,
  students,
  courses,
}: CourseEnrollmentEditForm) => {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(updateCourseEnrollment, {
    errors: {
      id: undefined,
      studentId: undefined,
      courseId: undefined,
      grade: undefined,
    },
    message: undefined,
  });

  const form = useForm<z.infer<typeof courseEnrollmentUpdateSchema>>({
    resolver: zodResolver(courseEnrollmentUpdateSchema),
    defaultValues: courseEnrollment,
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          form.setError(
            key as keyof z.infer<typeof courseEnrollmentUpdateSchema>,
            {
              message: value.join(", "),
            }
          );
        }
      });
    }
  }, [state?.errors, form]);

  useEffect(() => {
    if (isPending) {
      toast.dismiss();
      toast.loading("Updating course enrollment");
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(state.errors).some(([_, value]) => value !== undefined)
    ) {
      toast.dismiss();
      toast.error("Failed to update course enrollment");
    } else if (state.message) {
      toast.dismiss();
      toast.success(state.message);
    }
  }, [isPending, state.message, state.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          const formData = new FormData();
          for (const key in data) {
            const typedKey = key as keyof typeof data;
            formData.append(key, data[typedKey] as unknown as string | Blob);
          }
          startTransition(() => {
            formAction(formData);
          });
        })}
        className="space-y-8"
      >
        <ComboboxField
          label="Student"
          name="studentId"
          data={students}
          // @ts-expect-error - Fix this
          form={form}
          generateName={(student) => `${student.firstName} ${student.lastName}`}
        />
        <ComboboxField
          label="Course"
          name="courseId"
          data={courses}
          // @ts-expect-error - Fix this
          form={form}
          generateName={(course) => course.name}
        />
        <NumberField
          label="Grade"
          name="grade"
          // @ts-expect-error - Fix this
          form={form}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CourseEnrollmentEditForm;
