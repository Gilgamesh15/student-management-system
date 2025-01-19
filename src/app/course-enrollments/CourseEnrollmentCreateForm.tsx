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

import { createCourseEnrollment } from "@/lib/actions/course-enrollment";
import {
  courseEnrollmentCreateDefaultValues,
  courseEnrollmentCreateSchema,
} from "@/lib/schemas";

interface CourseEnrollmentCreateFormProps {
  students: Student[];
  courses: Course[];
}

const CourseEnrollmentCreateForm = ({
  students,
  courses,
}: CourseEnrollmentCreateFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createCourseEnrollment, {
    errors: {
      studentId: undefined,
      courseId: undefined,
      grade: undefined,
    },
    message: undefined,
  });

  const form = useForm<z.infer<typeof courseEnrollmentCreateSchema>>({
    resolver: zodResolver(courseEnrollmentCreateSchema),
    defaultValues: courseEnrollmentCreateDefaultValues,
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          form.setError(
            key as keyof z.infer<typeof courseEnrollmentCreateSchema>,
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
      toast.loading("Creating course enrollment");
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(state.errors).some(([_, value]) => value !== undefined)
    ) {
      toast.dismiss();
      toast.error("Failed to create course enrollment");
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

export default CourseEnrollmentCreateForm;
