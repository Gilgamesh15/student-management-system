"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Course, Teacher } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createSubject } from "@/lib/actions";
import { MultiCombobox, StringField } from "@/components/FormElements";

export const formSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nullable(),
  teachers: z.array(
    z.preprocess((args) => Number.parseInt(args as string), z.number().int())
  ),
  courses: z.array(
    z.preprocess((args) => Number.parseInt(args as string), z.number().int())
  ),
});

const defaultValues: z.infer<typeof formSchema> = {
  name: "",
  description: "",
  teachers: [],
  courses: [],
};

interface SubjectFormProps {
  teachers: Teacher[];
  courses: Course[];
}

const SubjectForm = ({ teachers, courses }: SubjectFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createSubject(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <StringField
          label="Name"
          name="name"
          // @ts-expect-error - Fix this
          form={form}
        />
        <StringField
          label="Description"
          name="description"
          // @ts-expect-error - Fix this
          form={form}
        />
        <MultiCombobox
          label="Teachers"
          name="teachers"
          data={teachers}
          generateName={(teacher) => `${teacher.firstName} ${teacher.lastName}`}
          // @ts-expect-error - Fix this
          form={form}
        />
        <MultiCombobox
          label="Courses"
          name="courses"
          // @ts-expect-error - Fix this
          form={form}
          generateName={(course) => `${course.name} - ${course.year}`}
          data={courses}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SubjectForm;
