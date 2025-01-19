"use client";

import { z } from "zod";
import { Student } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import {
  BooleanField,
  ComboboxField,
  DateField,
} from "@/components/FormElements";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { updateAttendance } from "@/lib/actions/attendance";

import { DetailedAttendance } from "@/lib/types";
import { attendanceUpdateSchema } from "@/lib/schemas/attendance";

interface AttendanceEditFormProps {
  attendance: DetailedAttendance;
  students: Student[];
}

const AttendanceEditForm = ({
  attendance,
  students,
}: AttendanceEditFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(updateAttendance, {
    errors: {
      id: undefined,
      date: undefined,
      present: undefined,
      studentId: undefined,
    },
    message: undefined,
  });

  const form = useForm<z.infer<typeof attendanceUpdateSchema>>({
    resolver: zodResolver(attendanceUpdateSchema),
    defaultValues: attendance,
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          form.setError(key as keyof z.infer<typeof attendanceUpdateSchema>, {
            message: value.join(", "),
          });
        }
      });
    }
  }, [state?.errors, form]);

  useEffect(() => {
    if (isPending) {
      toast.dismiss();
      toast.loading("Updating attendance");
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(state.errors).some(([_, value]) => value !== undefined)
    ) {
      toast.dismiss();
      toast.error("Failed to update attendance");
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
            if (data[typedKey] instanceof Date) {
              formData.append(key, data[typedKey].toISOString());
            } else if (typeof data[typedKey] === "boolean") {
              formData.append(key, data[typedKey].toString());
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
        <DateField
          label="Date"
          name="date"
          // @ts-expect-error - Fix this
          form={form}
        />
        <BooleanField
          label="Present"
          name="present"
          // @ts-expect-error - Fix this
          form={form}
        />
        <ComboboxField
          label="Student"
          name="studentId"
          data={students}
          // @ts-expect-error - Fix this
          form={form}
          generateName={(student) => `${student.firstName} ${student.lastName}`}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AttendanceEditForm;
