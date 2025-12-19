import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";
import { ErrorApi } from "@/types/api-types";
import { tasksService, UpdateTaskPayload } from "../api/tasks-api";
import { handleApiValidation } from "@/lib/handle-api-validation";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onUpdateSubmit = async (
    uuid: string,
    payload: UpdateTaskPayload,
    setError: UseFormSetError<any>,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    try {
      await tasksService.updateTask(uuid, payload);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccess?.();
    } catch (error: AxiosError<ErrorApi> | any) {
      handleApiValidation(error, setError);
      console.error("Failed to update task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onUpdateSubmit,
  };
};
