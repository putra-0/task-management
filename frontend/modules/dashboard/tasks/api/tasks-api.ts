import api from "@/lib/http";
import { TableParams, TableResponseApi } from "@/types/api-types";
import { Task } from "../data/type";

export const tasksService = {
  fetchTasks: async (params: TableParams) => {
    const { data } = await api.get<TableResponseApi<Task>>("/tasks", { params });
    return data;
  },
};
