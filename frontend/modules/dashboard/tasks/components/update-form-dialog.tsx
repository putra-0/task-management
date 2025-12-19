"use client";

import * as React from "react";
import { useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectDropdown } from "@/components/form/select-dropdown";
import { useListTaskStatus } from "@/hooks/lists/use-list-task-status";
import { Task } from "../data/type";
import { UpdateTaskPayload } from "../api/tasks-api";

/* =======================
   Schema (FORM STATE)
======================= */
const schema = z.object({
  status: z.string().min(1, "Status is required"),
});

type FormSchema = z.infer<typeof schema>;

interface Props {
  open: boolean;
  currentRow?: Task | null;
  isLoadingSubmit?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    uuid: string,
    data: UpdateTaskPayload,
    setError: UseFormSetError<FormSchema>
  ) => void;
}

export function UpdateFormDialog({
  open,
  currentRow,
  isLoadingSubmit,
  onOpenChange,
  onSubmit,
}: Props) {
  const taskStatuses = useListTaskStatus();

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "",
    },
  });

  /* =======================
     Reset saat row berubah
  ======================= */
  React.useEffect(() => {
    if (currentRow) {
      form.reset({
        status:
          typeof currentRow.status === "string"
            ? currentRow.status
            : currentRow.status.code, // 🔥 mapping entity → form
      });
    }
  }, [currentRow, form]);

  const handleSubmit = (values: FormSchema) => {
    if (!currentRow) return;

    onSubmit(
      currentRow.uuid,
      { status: values.status }, // ✅ payload API
      form.setError
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Task Status</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField<FormSchema>
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={(val) =>
                        field.onChange(String(val))
                      }
                      placeholder="Select status"
                      items={taskStatuses.data?.items.map((item) => ({
                        label: item.name,
                        value: item.code, // STRING
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoadingSubmit}>
                {isLoadingSubmit ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
