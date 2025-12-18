import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";
import { ResponseApi } from "@/types/api-types";
import { tasksService } from "../api/tasks-api";
import { handleApiValidation } from "@/lib/handle-api-validation";

type AddTaskPayload = {
  title: string;
  description: string;
  status: string;
  deadline: string;
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (
    payload: AddTaskPayload,
    setError: UseFormSetError<any>
  ) => {
    setIsLoading(true);
    try {
      await tasksService.addTask(payload);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDialog(false);
    } catch (error) {
      handleApiValidation(error as AxiosError<ResponseApi>, setError);
      console.error("Failed to add task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dialog,
    isLoading,
    setDialog,
    onSubmit,
  };
};
