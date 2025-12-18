import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParamsTable } from "@/hooks/use-params-table";
import { tasksService } from "../api/tasks-api";
import { parseAsString, useQueryState } from "nuqs";

export const useTasks = () => {
  const { page, perPage, sort } = useParamsTable();

  const [rawStatus] = useQueryState("status", parseAsString);

  const status = Array.isArray(rawStatus)
    ? rawStatus[0]
    : rawStatus ?? "";

  return useQuery({
    queryKey: ["tasks", { page, perPage, sort, status }],
    queryFn: () =>
      tasksService.fetchTasks({
        page,
        perPage,
        sort,
        status,
      }),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
