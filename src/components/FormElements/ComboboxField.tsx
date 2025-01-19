"use client";

import { UseFormReturn } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import { PrismaModel } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ComboboxProps<T extends PrismaModel> {
  form: UseFormReturn;
  name: string;
  label: string;
  data: T[];
  generateName: (item: T) => string;
}

const Combobox = <T extends PrismaModel>({
  form,
  name,
  data,
  label,
  generateName,
}: ComboboxProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? generateName(
                        data.find((item) => item.id === field.value)!
                      )
                    : "Select..."}
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
                          form.setValue(name, item.id);
                        }}
                      >
                        {generateName(item)}
                        <Check
                          className={cn(
                            "ml-auto",
                            item.id === field.value
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
};

export default Combobox;
