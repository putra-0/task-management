import api from "@/lib/http";

export const summaryTasksApi = {
  fetchSummary: async () => {
    const { data } = await api.get("/summaries/total-tasks-by-status");

    return data;
  },
};
