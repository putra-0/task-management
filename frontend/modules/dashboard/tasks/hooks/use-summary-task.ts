import { useQuery } from "@tanstack/react-query";
import { summaryTasksApi } from "../api/summary-api";

export const useSummaryTasks = () => {
  const query = useQuery({
    queryKey: ["tasks-summary"],
    queryFn: () => summaryTasksApi.fetchSummary(),
    staleTime: 0,
  });

  return {
    ...query,
    summaryData: query.data,
  };
};
