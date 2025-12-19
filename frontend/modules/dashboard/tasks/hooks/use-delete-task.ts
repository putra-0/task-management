import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorApi } from "@/types/api-types";

import { tasksService } from "../api/tasks-api";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteSubmit = async (uuid: string, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await tasksService.deleteTask(uuid);

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      onSuccess?.();
    } catch (error: AxiosError<ErrorApi> | any) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onDeleteSubmit,
  };
};
