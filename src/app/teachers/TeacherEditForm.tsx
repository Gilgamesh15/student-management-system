"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { EmailField, StringField } from "@/components/FormElements";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

import { updateTeacher } from "@/lib/actions/teacher";
import { DetailedTeacher } from "@/lib/types";
import { teacherUpdateSchema } from "@/lib/schemas/teacher";

interface TeacherCreateFormProps {
  teacher: DetailedTeacher;
}

const TeacherCreateForm = ({ teacher }: TeacherCreateFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(updateTeacher, {
    errors: {
      id: undefined,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
    },
    message: undefined,
  });

  const form = useForm<z.infer<typeof teacherUpdateSchema>>({
    resolver: zodResolver(teacherUpdateSchema),
    defaultValues: teacher,
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          form.setError(key as keyof z.infer<typeof teacherUpdateSchema>, {
            message: value.join(", "),
          });
        }
      });
    }
  }, [state?.errors, form]);

  useEffect(() => {
    if (isPending) {
      toast.dismiss();
      toast.loading("Updating teacher");
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(state.errors).some(([_, value]) => value !== undefined)
    ) {
      toast.dismiss();
      toast.error("Failed to update teacher");
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
          label="First Name"
          name="firstName"
          // @ts-expect-error - Fix this
          form={form}
        />
        <StringField
          label="Last Name"
          name="lastName"
          // @ts-expect-error - Fix this
          form={form}
        />
        <EmailField
          label="Email"
          name="email"
          // @ts-expect-error - Fix this
          form={form}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default TeacherCreateForm;
