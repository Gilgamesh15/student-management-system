"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import {
  DateField,
  EmailField,
  NumberField,
  StringField,
} from "@/components/FormElements";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

import { updateStudent } from "@/lib/actions/student";
import { studentUpdateSchema } from "@/lib/schemas/student";
import { DetailedStudent } from "@/lib/types";

interface StudentEditFormProps {
  student: DetailedStudent;
}

const StudentEditForm = ({ student }: StudentEditFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(updateStudent, {
    errors: {
      id: undefined,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      dateOfBirth: undefined,
      enrollmentDate: undefined,
      grade: undefined,
    },
    message: undefined,
  });

  const form = useForm<z.infer<typeof studentUpdateSchema>>({
    resolver: zodResolver(studentUpdateSchema),
    defaultValues: student,
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          form.setError(key as keyof z.infer<typeof studentUpdateSchema>, {
            message: value.join(", "),
          });
        }
      });
    }
  }, [state?.errors, form]);

  useEffect(() => {
    if (isPending) {
      toast.dismiss();
      toast.loading("Updating student");
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(state.errors).some(([_, value]) => value !== undefined)
    ) {
      toast.dismiss();
      toast.error("Failed to update student");
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
            if (typedKey === "dateOfBirth" || typedKey === "enrollmentDate") {
              formData.append(key, new Date(data[typedKey]).toISOString());
            } else {
              formData.append(key, data[typedKey] as unknown as string | Blob);
            }
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
        <NumberField
          label="Grade"
          name="grade"
          // @ts-expect-error - Fix this
          form={form}
        />
        <DateField
          label="Enrollment Date"
          name="enrollmentDate"
          // @ts-expect-error - Fix this
          form={form}
        />
        <DateField
          label="Date of Birth"
          name="dateOfBirth"
          // @ts-expect-error - Fix this
          form={form}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default StudentEditForm;
