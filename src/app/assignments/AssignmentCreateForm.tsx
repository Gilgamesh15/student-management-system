"use client";

import { z } from "zod";
import { Course, Student } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  assignmentCreateDefaultValues,
  assignmentCreateSchema,
} from "@/lib/schemas";
import { createAssignment } from "@/lib/actions/assignments";
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

interface AssignmentCreateFormProps {
  students: Student[];
  courses: Course[];
}

const AssignmentCreateForm = ({
  students,
  courses,
}: AssignmentCreateFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createAssignment, {
    errors: {
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
    defaultValues: assignmentCreateDefaultValues,
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
      toast.loading("Creating assignment");
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(state.errors).some(([_, value]) => value !== undefined)
    ) {
      toast.error("Failed to create assignment");
    } else if (state.message) {
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

export default AssignmentCreateForm;
