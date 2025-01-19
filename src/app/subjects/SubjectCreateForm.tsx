"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { StringField, TextAreaField } from "@/components/FormElements";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

import { subjectCreateSchema } from "@/lib/schemas";
import { createSubject } from "@/lib/actions/subject";
import {
  subjectCreateDefaultValues,
  subjectUpdateSchema,
} from "@/lib/schemas/subject";

const SubjectCreateForm = () => {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createSubject, {
    errors: {
      name: undefined,
      description: undefined,
    },
    message: undefined,
  });

  const form = useForm<z.infer<typeof subjectCreateSchema>>({
    resolver: zodResolver(subjectCreateSchema),
    defaultValues: subjectCreateDefaultValues,
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          form.setError(key as keyof z.infer<typeof subjectCreateSchema>, {
            message: value.join(", "),
          });
        }
      });
    }
  }, [state?.errors, form]);

  useEffect(() => {
    if (isPending) {
      toast.dismiss();
      toast.loading("Creating subject");
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(state.errors).some(([_, value]) => value !== undefined)
    ) {
      toast.dismiss();
      toast.error("Failed to create subject");
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
          name="name"
          label="Name"
          // @ts-expect-error - Fix this
          form={form}
        />
        <TextAreaField
          label="Description"
          name="description"
          // @ts-expect-error - Fix this
          form={form}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SubjectCreateForm;
