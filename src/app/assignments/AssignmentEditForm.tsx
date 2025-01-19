"use client";

import { z } from "zod";
import { Course, Student } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";

import { assignmentCreateSchema } from "@/lib/schemas";
import { updateAssignment } from "@/lib/actions/assignments";
import { Form } from "@/components/ui/form";
import {
  ComboboxField,
  DateField,
  NumberField,
  StringField,
  TextAreaField,
} from "@/components/FormElements";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { DetailedAssignment } from "@/lib/types";

interface AssignmentEditForm {
  assignment: DetailedAssignment;
  students: Student[];
  courses: Course[];
}

const AssignmentEditForm = ({
  assignment,
  students,
  courses,
}: AssignmentEditForm) => {
  const defaultValues: z.infer<typeof assignmentCreateSchema> = assignment;

  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(updateAssignment, {
    errors: {
      id: undefined,
      title: undefined,
      description: undefined,
      dueDate: undefined,
      courseId: undefined,
      studentId: undefined,
      score: undefined,
    },
    message: undefined,
  });

  const form = useForm<z.infer<typeof assignmentCreateSchema>>({
    resolver: zodResolver(assignmentCreateSchema),
    defaultValues,
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          form.setError(key as keyof z.infer<typeof assignmentCreateSchema>, {
            message: value.join(", "),
          });
        }
      });
    }
  }, [state?.errors, form]);

  useEffect(() => {
    if (isPending) {
      toast.loading("Updating assignment");
    }
    if (!_.isEmpty(state.errors)) {
      toast.error("Failed to update assignment");
    }
    if (state.message) {
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
            if (data[typedKey] instanceof Date) {
              formData.append(key, data[typedKey].toISOString());
            } else {
              formData.append(key, data[typedKey] as string | Blob);
            }
          }
          startTransition(() => {
            formAction(formData);
          });
        })}
        className="space-y-8"
      >
        <StringField
          label="Title"
          name="title"
          // @ts-expect-error - Fix this
          form={form}
        />
        <TextAreaField
          label="Description"
          name="description"
          // @ts-expect-error - Fix this
          form={form}
        />
        <DateField
          label="Due Date"
          name="dueDate"
          // @ts-expect-error - Fix this
          form={form}
        />
        <ComboboxField
          label="Course"
          name="courseId"
          data={courses}
          // @ts-expect-error - Fix this
          form={form}
          generateName={(course) => `${course.name} - ${course.year}`}
        />
        <ComboboxField
          label="Student"
          name="studentId"
          data={students}
          // @ts-expect-error - Fix this
          form={form}
          generateName={(student) => `${student.firstName} ${student.lastName}`}
        />
        <NumberField
          label="Score"
          name="score"
          // @ts-expect-error - Fix this
          form={form}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AssignmentEditForm;
