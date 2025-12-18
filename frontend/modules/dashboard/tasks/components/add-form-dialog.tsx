"use client";

import { useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useListTaskStatus } from "@/hooks/lists/use-list-task-status";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { SelectDropdown } from "@/components/form/select-dropdown";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import z from "zod";

/* =======================
   Schema
======================= */
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required"),

  deadlineDate: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: "Deadline date is required",
    }),

  deadlineTime: z.string().min(1, "Time is required"),
});

export type TaskFormSchema = z.infer<typeof taskFormSchema>;

interface Props {
  open: boolean;
  isLoadingSubmit?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    payload: {
      title: string;
      description?: string | null;
      status: string;
      deadline: string; // Y-m-d H:i:s
    },
    setError: UseFormSetError<TaskFormSchema>
  ) => void;
}

export function AddFormDialog({
  open,
  isLoadingSubmit,
  onOpenChange,
  onSubmit,
}: Props) {
  const taskStatuses = useListTaskStatus();
  const now = new Date();

  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      deadlineDate: null,
      deadlineTime: format(now, "HH:mm:ss"),
    },
  });

  /* =======================
     Submit Handler
  ======================= */
  const handleSubmit = (values: TaskFormSchema) => {
    const deadline = `${format(
      values.deadlineDate!,
      "yyyy-MM-dd"
    )} ${values.deadlineTime}`;

    if (new Date(deadline).getTime() <= Date.now()) {
      form.setError("deadlineDate", {
        message: "Deadline must be in the future",
      });
      return;
    }

    onSubmit(
      {
        title: values.title,
        description: values.description,
        status: values.status,
        deadline,
      },
      form.setError
    );
  };

  const selectedDate = form.watch("deadlineDate");
  const isToday =
    selectedDate &&
    format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task by filling the form below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="task-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Optional"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select status"
                    items={taskStatuses.data?.items.map((item) => ({
                      label: item.name,
                      value: item.code,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deadline */}
            <div className="flex gap-4">
              {/* Date */}
              <FormField
                control={form.control}
                name="deadlineDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-32 justify-between font-normal"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          captionLayout="dropdown"
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time */}
              <FormField
                control={form.control}
                name="deadlineTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="1"
                        {...field}
                        min={isToday ? format(now, "HH:mm:ss") : undefined}
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="submit"
            form="task-form"
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit ? "Saving..." : "Save Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
