"use client";

import { UseFormReturn } from "react-hook-form";
import { PrismaModel } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

import { Input } from "./ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface StringFieldProps {
  form: UseFormReturn;
  name: string;
  label: string;
}

export function StringField({ form, name, label }: StringFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
interface MultiComboboxProps<T extends PrismaModel> {
  form: UseFormReturn;
  name: string;
  data: T[];
  label: string;
  generateName: (item: T) => string;
}

export function MultiCombobox({
  form,
  name,
  data,
  label,
  generateName,
}: MultiComboboxProps<T>) {
  const selectedValues = form.watch(name) || [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedValues.map(
              (
                // @ts-expect-error - Fix this
                value
              ) => {
                const item = data.find((d) => d.id === value);
                return (
                  <div
                    key={value}
                    className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                  >
                    <span className="text-sm">{generateName(item)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue(
                          name,
                          selectedValues.filter(
                            (
                              // @ts-expect-error - Fix this
                              v
                            ) => v !== value
                          )
                        );
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              }
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value?.length && "text-muted-foreground"
                  )}
                >
                  {!field.value?.length
                    ? "Select"
                    : `${field.value.length} selected`}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search..." className="h-9" />
                <CommandList>
                  <CommandEmpty>Not found.</CommandEmpty>
                  <CommandGroup>
                    {data.map((item) => (
                      <CommandItem
                        value={item.id.toString()}
                        key={item.id}
                        onSelect={() => {
                          const values = field.value || [];
                          const newValues = values.includes(item.id)
                            ? values.filter(
                                (
                                  // @ts-expect-error - Fix this
                                  v
                                ) => v !== item.id
                              )
                            : [...values, item.id];
                          form.setValue(name, newValues);
                        }}
                      >
                        {generateName(item)}
                        <Check
                          className={cn(
                            "ml-auto",
                            field.value?.includes(item.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

