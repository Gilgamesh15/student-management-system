"use client";

import { z } from "zod";
import { Subject, Teacher } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import {
  ComboboxField,
  NumberField,
  StringField,
} from "@/components/FormElements";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

import { courseCreateSchema, courseCreateDefaultValues } from "@/lib/schemas";
import { createCourse } from "@/lib/actions/course";

interface CourseCreateFormProps {
  subjects: Subject[];
  teachers: Teacher[];
}

const CourseCreateForm = ({ subjects, teachers }: CourseCreateFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createCourse, {
    errors: {
      name: undefined,
      subjectId: undefined,
      teacherId: undefined,
      semester: undefined,
      year: undefined,
    },
    message: undefined,
  });

  const form = useForm<z.infer<typeof courseCreateSchema>>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: courseCreateDefaultValues,
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          form.setError(key as keyof z.infer<typeof courseCreateSchema>, {
            message: value.join(", "),
          });
        }
      });
    }
  }, [state?.errors, form]);

  useEffect(() => {
    if (isPending) {
      toast.dismiss();
      toast.loading("Creating course");
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(state.errors).some(([_, value]) => value !== undefined)
    ) {
      toast.dismiss();
      toast.error("Failed to create course");
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
        <StringField
          label="Name"
          name="name"
          //@ts-expect-error - Fix this
          form={form}
        />
        <ComboboxField
          label="Subject"
          name="subjectId"
          data={subjects}
          //@ts-expect-error - Fix this
          form={form}
          generateName={(subject) => subject.name}
        />
        <ComboboxField
          label="Teacher"
          name="teacherId"
          data={teachers}
          //@ts-expect-error - Fix this
          form={form}
          generateName={(teacher) => `${teacher.firstName} ${teacher.lastName}`}
        />
        <NumberField
          label="Semester"
          name="semester"
          //@ts-expect-error - Fix this
          form={form}
        />
        <NumberField
          label="Year"
          name="year"
          //@ts-expect-error - Fix this
          form={form}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CourseCreateForm;
